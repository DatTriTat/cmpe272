import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getCareerResults } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

interface CareerPath {
  id?: number;
  title: string;
  description: string;
  matchScore: number;
  salaryRange: string;
  growthRate: string;
  requiredSkills: string[];
  recommendedSkills: string[];
  userSkills: string[];
  certifications: {
    name: string;
    provider: string;
    difficulty: string;
    duration: string;
    url: string;
  }[];
  courses?: {
    name: string;
    provider: string;
    duration: string;
    url: string;
  }[];
  category: string;
  fitReasons: {
    title: string;
    description: string;
    icon: string;
  }[];
}

const getScoreColor = (score: number) => {
  if (score >= 85) return "success";
  if (score >= 70) return "warning";
  return "danger";
};
const getSkillMatchColor = (
  userSkillsLength: number,
  requiredSkillsLength: number
) => {
  const matchPercentage = (userSkillsLength / requiredSkillsLength) * 100;
  if (matchPercentage >= 70) return "success";
  if (matchPercentage >= 40) return "warning";
  return "danger";
};

const getDifficultyColor = (difficulty: string) => {
  if (difficulty === "Beginner") return "success";
  if (difficulty === "Intermediate") return "warning";
  return "danger";
};
const growthRank = {
  Low: 1,
  Medium: 2,
  High: 3,
};
const SavedCareerPathsPage: React.FC = () => {
  const [savedPaths, setSavedPaths] = useState<CareerPath[]>([]);
  const [selected, setSelected] = useState("best-match");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        if (!user?.token) return;
        const res = await getCareerResults(user.token);
        const cleaned = res.map((r: any) => ({
          ...r,
          id: r._id?.toString() || r.id,
        }));
        const uniqueCategories = Array.from(
          new Set(cleaned.map((r: CareerPath) => r.category))
        ).sort();
        setCategoryList(["All Categories", ...(uniqueCategories as string[])]);
        setSavedPaths(cleaned || []);
        localStorage.setItem("careerResultsBackup", JSON.stringify(cleaned));
      } catch (err) {
        console.error("Failed to load saved paths:", err);
        setSavedPaths([]);
        setCategoryList([]);
      }
    }
    loadData();
  }, []);

  const filteredPaths = savedPaths.filter((path) => {
    return (
      selectedCategory === "All Categories" ||
      path.category === selectedCategory
    );
  });

  const sortedPaths = [...filteredPaths].sort((a, b) => {
    if (selected === "best-match") return b.matchScore - a.matchScore;
    if (selected === "salary") {
      const getMinSalary = (range: string): number => {
        const match = range.match(/\d[\d,.]*/);
        if (!match) return 0;
        return parseInt(match[0].replace(/[,.]/g, "")) || 0;
      };
      return getMinSalary(b.salaryRange) - getMinSalary(a.salaryRange);
    }
    const aGrowth = growthRank[a.growthRate as keyof typeof growthRank] || 0;
    const bGrowth = growthRank[b.growthRate as keyof typeof growthRank] || 0;
    return bGrowth - aGrowth;
  });
  const normalize = (s: string) => s.toLowerCase().trim();

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Career Paths</h1>
      </div>

      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Tabs selectedKey={selected} onSelectionChange={setSelected as any}>
              <Tab key="best-match" title="Best Match" />
              <Tab key="salary" title="Highest Salary" />
              <Tab key="growth" title="Fastest Growing" />
            </Tabs>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  endContent={<Icon icon="lucide:chevron-down" />}
                  aria-label="Select category"
                >
                  {selectedCategory}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={[selectedCategory]}
                selectionMode="single"
                onAction={(key) => setSelectedCategory(key as string)}
              >
                {categoryList.map((cat) => (
                  <DropdownItem key={cat}>{cat}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>

      <div className="space-y-6">
        {sortedPaths.map((path, index) => {
          const courses = path.courses || [];

          return (
            <Card
              key={index}
              className="hover:border-primary transition-colors"
            >
              <CardHeader className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{path.title}</h2>
                  <p className="text-default-500">{path.category}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <Chip
                      color={getScoreColor(path.matchScore) as any}
                      variant="flat"
                      className="text-sm"
                    >
                      {path.matchScore}% Match
                    </Chip>
                    <span className="text-sm text-default-500">match</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip size="sm" variant="flat" color="success">
                      {path.growthRate}
                    </Chip>
                    <Chip size="sm" variant="flat">
                      {path.salaryRange}
                    </Chip>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="gap-6">
                <p className="text-default-600 mb-4">{path.description}</p>

                {Array.isArray(path.fitReasons) &&
                  path.fitReasons.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Icon
                          icon="lucide:check-circle"
                          className="text-success"
                        />
                        <span>Why You're a Good Fit</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        {path.fitReasons.map((reason, idx) => (
                          <div key={idx} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Icon
                                  icon={`lucide:${reason.icon}`}
                                  className="text-primary"
                                />
                              </div>
                              <h4 className="font-medium">{reason.title}</h4>
                            </div>
                            <p className="text-sm text-default-600">
                              {reason.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Skills Assessment</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-default-500">
                      {
                        path.requiredSkills.filter((req) =>
                          path.userSkills.some(
                            (user) => normalize(user) === normalize(req)
                          )
                        ).length
                      }{" "}
                      of {path.requiredSkills.length} required skills
                    </span>
                  </div>
                  <Progress
                    value={
                      (path.requiredSkills.filter((req) =>
                        path.userSkills.some(
                          (user) => normalize(user) === normalize(req)
                        )
                      ).length /
                        path.requiredSkills.length) *
                      100
                    }
                    color={
                      getSkillMatchColor(
                        path.requiredSkills.filter((req) =>
                          path.userSkills.some(
                            (user) => normalize(user) === normalize(req)
                          )
                        ).length,
                        path.requiredSkills.length
                      ) as any
                    }
                    className="mb-3"
                    aria-label="Skills match progress"
                  />

                  <div className="flex flex-wrap gap-2 mb-3">
                    {path.requiredSkills.map((skill) => {
                      const isMatched = path.userSkills.some(
                        (user) => normalize(user) === normalize(skill)
                      );
                      return (
                        <Chip
                          key={skill}
                          color={isMatched ? "success" : "default"}
                          variant="flat"
                          size="sm"
                        >
                          <div className="flex items-center">
                            {skill}
                            {isMatched && (
                              <Icon
                                icon="lucide:check"
                                className="ml-1"
                                width={12}
                                height={12}
                              />
                            )}
                          </div>
                        </Chip>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-default-500 mb-2">
                      Recommended additional skills:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {path.recommendedSkills.map((skill) => (
                        <Chip
                          key={skill}
                          color="primary"
                          variant="flat"
                          size="sm"
                        >
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-medium mb-3">
                      Recommended Certifications
                    </h3>
                    <div className="space-y-3">
                      {path.certifications.map((cert, idx) => (
                        <div key={idx} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{cert.name}</h4>
                            <Chip
                              size="sm"
                              color={getDifficultyColor(cert.difficulty)}
                              variant="flat"
                            >
                              {cert.difficulty}
                            </Chip>
                          </div>
                          <p className="text-xs text-default-500 mt-1">
                            {cert.provider} • {cert.duration}
                          </p>
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="mt-2"
                            endContent={
                              <Icon
                                icon="lucide:external-link"
                                width={14}
                                height={14}
                              />
                            }
                            as="a"
                            href={cert.url}
                            target="_blank"
                          >
                            Learn More
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Recommended Courses</h3>
                    <div className="space-y-3">
                      {courses.map((course, idx) => (
                        <div key={idx} className="border rounded-lg p-3">
                          <h4 className="font-medium text-sm">{course.name}</h4>
                          <p className="text-xs text-default-500 mt-1">
                            {course.provider} • {course.duration}
                          </p>
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="mt-2"
                            endContent={
                              <Icon
                                icon="lucide:external-link"
                                width={14}
                                height={14}
                              />
                            }
                            as="a"
                            href={course.url}
                            target="_blank"
                          >
                            View Course
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    color="primary"
                    startContent={<Icon icon="lucide:map" />}
                    as={Link}
                    to={`/career-paths/${path.id}`}
                  >
                    View Career Roadmap
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SavedCareerPathsPage;

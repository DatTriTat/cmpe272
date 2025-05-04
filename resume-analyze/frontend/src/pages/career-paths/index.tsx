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
import { useAuth } from "../../context/AuthContext";
import { saveCareerResults } from "../../utils/api";

interface CareerPath {
  id: number;
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
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    duration: string;
    url: string;
  }[];
  suggestedCourses: {
    [skill: string]: {
      name: string;
      provider: string;
      duration: string;
      url: string;
    }[];
  };
  category: string;
  fitReasons: {
    title: string;
    description: string;
    icon: string;
  }[];
}

const CareerPathsPage: React.FC = () => {
  const [selected, setSelected] = useState("best-match");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedSuggestions = localStorage.getItem("careerSuggestions");
      const storedBookmarks = localStorage.getItem("savedCareerPaths");

      const parsedSuggestions: CareerPath[] = storedSuggestions
        ? JSON.parse(storedSuggestions)
        : [];
      const parsedBookmarks: CareerPath[] = storedBookmarks
        ? JSON.parse(storedBookmarks)
        : [];

      const bookmarkedIds = parsedBookmarks.map((p) => p.id);

      const enrichedSuggestions = parsedSuggestions.map((item) => ({
        ...item,
        saved: bookmarkedIds.includes(item.id),
      }));

      setCareerPaths(enrichedSuggestions);
      setSavedIds(bookmarkedIds);

      const dynamicCategories = enrichedSuggestions
        .map((item) => item.category)
        .filter(Boolean);

      const uniqueCategories = Array.from(new Set(dynamicCategories)).sort();
      setCategoryList(["All Categories", ...uniqueCategories]);
    } catch (err) {
      console.error("Failed to parse localStorage data:", err);
      setCareerPaths([]);
      setSavedIds([]);
      setCategoryList([]);
    }
  }, []);

  const getSkillMatchColor = (
    userSkillsLength: number,
    requiredSkillsLength: number
  ) => {
    const matchPercentage = (userSkillsLength / requiredSkillsLength) * 100;
    if (matchPercentage >= 70) return "success";
    if (matchPercentage >= 40) return "warning";
    return "danger";
  };
  const getScoreColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };
  const growthRank = {
    Low: 1,
    Medium: 2,
    High: 3,
  };
  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "Beginner") return "success";
    if (difficulty === "Intermediate") return "warning";
    return "danger";
  };

  const filteredPaths = careerPaths.filter((path) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      path.category === selectedCategory;

    return matchesCategory;
  });

  const sortedPaths = [...filteredPaths].sort((a, b) => {
    if (selected === "best-match") return b.matchScore - a.matchScore;
    if (selected === "salary") {
      const getMinSalary = (range: string) =>
        parseInt(range.replace(/[^0-9]/g, "").slice(0, 5)) || 0;
      return getMinSalary(b.salaryRange) - getMinSalary(a.salaryRange);
    }
    // Growth rate
    const aGrowth = growthRank[a.growthRate as keyof typeof growthRank] || 0;
    const bGrowth = growthRank[b.growthRate as keyof typeof growthRank] || 0;
    return bGrowth - aGrowth;
  });

  const handleSavePath = async (path: CareerPath) => {
    try {
      if (!user?.token) throw new Error("No token found");

      const stored = localStorage.getItem("savedCareerPaths");
      const saved = stored ? JSON.parse(stored) : [];

      const exists = saved.some((p: CareerPath) => p.id === path.id);
      if (exists) {
        console.log("Already saved in localStorage → skipping backend call");
        return;
      }
      const flattenedCourses = Object.values(
        path.suggestedCourses || {}
      ).flat();
      const pathToSave = {
        ...path,
        courses: flattenedCourses,
      };
      delete pathToSave.suggestedCourses;
      await saveCareerResults(user.token, [pathToSave]);
      const updated = [...saved, pathToSave];
      localStorage.setItem("savedCareerPaths", JSON.stringify(updated));
      setSavedIds((prev) => [...prev, path.id]);
    } catch (err: any) {
      console.error("Failed to save career path:", err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Career Path Suggestions</h1>
          <div className="flex gap-2">
            <Button
              as={Link}
              to="/profile"
              variant="flat"
              startContent={<Icon icon="lucide:user" />}
            >
              Update Skills
            </Button>
            <Button
              color="primary"
              as={Link}
              to="/interview/chat"
              startContent={<Icon icon="lucide:message-circle" />}
            >
              Interview
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Tabs
                  aria-label="Career path sorting options"
                  selectedKey={selected}
                  onSelectionChange={setSelected as any}
                >
                  <Tab key="best-match" title="Best Match" />
                  <Tab key="salary" title="Highest Salary" />
                  <Tab key="growth" title="Fastest Growing" />
                </Tabs>
              </div>

              <div className="flex flex-wrap gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      endContent={
                        <Icon
                          icon="lucide:chevron-down"
                          width={16}
                          height={16}
                        />
                      }
                    >
                      {selectedCategory}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Category filter"
                    onAction={(key) => setSelectedCategory(key as string)}
                    selectedKeys={[selectedCategory]}
                    selectionMode="single"
                  >
                    {categoryList.map((category) => (
                      <DropdownItem key={category}>{category}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Career Path Suggestions */}
        <div className="space-y-6">
          {sortedPaths.length > 0 ? (
            sortedPaths.map((path) => (
              <Card
                key={path.id}
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
                  <p className="text-default-600">{path.description}</p>

                  {/* Why You're a Good Fit Section */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Icon
                        icon="lucide:check-circle"
                        className="text-success"
                      />
                      <span>Why You're a Good Fit</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {Array.isArray(path.fitReasons) &&
                        path.fitReasons.map((reason, index) => (
                          <div key={index} className="border rounded-lg p-4">
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

                  {/* Skills Section */}
                  <div>
                    <h3 className="font-medium mb-3">Skills Assessment</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Skills Match</span>
                      <span className="text-sm text-default-500">
                        {path.userSkills.length} of {path.requiredSkills.length}{" "}
                        required skills
                      </span>
                    </div>
                    <Progress
                      value={
                        (path.userSkills.length / path.requiredSkills.length) *
                        100
                      }
                      color={
                        getSkillMatchColor(
                          path.userSkills.length,
                          path.requiredSkills.length
                        ) as any
                      }
                      className="mb-3"
                    />
                    <div className="flex flex-wrap gap-2 mb-3">
                      {path.requiredSkills.map((skill) => (
                        <Chip
                          key={skill}
                          color={
                            path.userSkills.includes(skill)
                              ? "success"
                              : "default"
                          }
                          variant="flat"
                          size="sm"
                        >
                          <div className="flex items-center">
                            {skill}
                            {path.userSkills.includes(skill) && (
                              <Icon
                                icon="lucide:check"
                                className="ml-1"
                                width={12}
                                height={12}
                              />
                            )}{" "}
                          </div>
                        </Chip>
                      ))}
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

                  {/* Certifications and Courses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-3">
                        Recommended Certifications
                      </h3>
                      <div className="space-y-3">
                        {Array.isArray(path.certifications) &&
                          path.certifications.map((cert, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">
                                  {cert.name}
                                </h4>
                                <Chip
                                  size="sm"
                                  color={
                                    getDifficultyColor(cert.difficulty) as any
                                  }
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
                        {path.suggestedCourses &&
                          Object.values(path.suggestedCourses)
                            .flat()
                            .map((course, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-3"
                              >
                                <h4 className="font-medium text-sm">
                                  {course.name}
                                </h4>
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

                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="flat"
                      color={savedIds.includes(path.id) ? "success" : "default"}
                      startContent={<Icon icon="lucide:bookmark" />}
                      onPress={() => handleSavePath(path)}
                    >
                      {savedIds.includes(path.id) ? "Saved" : "Save Path"}
                    </Button>

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
            ))
          ) : (
            <Card>
              <CardBody>
                <div className="text-center py-8">
                  <Icon
                    icon="lucide:search-x"
                    className="mx-auto mb-4 text-default-400"
                    width={48}
                    height={48}
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    No career paths found
                  </h3>
                  <p className="text-default-500 mb-6">
                    Try adjusting your filters or updating your skills profile.
                  </p>
                  <Button
                    color="primary"
                    onPress={() => {
                      setSelectedCategory("All Categories");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerPathsPage;

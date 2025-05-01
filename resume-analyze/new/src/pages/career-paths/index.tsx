import React from "react";
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
import { useNavigate } from "react-router-dom";

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
  const [selected, setSelected] = React.useState("best-match");
  const [selectedCategory, setSelectedCategory] =
    React.useState("All Categories");
  const [selectedLevel, setSelectedLevel] = React.useState("All Levels");
  const navigate = useNavigate();
  const [careerPaths, setCareerPaths] = React.useState<CareerPath[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("careerSuggestions");
      
      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setCareerPaths(parsed);
        } else {
          setCareerPaths([]);
        }
      }
    } catch (err) {
      console.error("Failed to parse careerSuggestions:", err);
      setCareerPaths([]);
    }
  }, []);

  const categories = [
    "All Categories",
    "Web Development",
    "Data Science",
    "Design",
    "DevOps",
    "Product",
    "Marketing",
    "Mobile Development",
  ];
  const levels = ["All Levels", "Entry Level", "Mid Level", "Senior Level"];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "danger";
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
    const matchesLevel =
      selectedLevel === "All Levels" ||
      (selectedLevel === "Entry Level" && path.matchScore >= 80) ||
      (selectedLevel === "Mid Level" &&
        path.matchScore >= 70 &&
        path.matchScore < 80) ||
      (selectedLevel === "Senior Level" && path.matchScore < 70);

    return matchesCategory && matchesLevel;
  });

  const sortedPaths = [...filteredPaths].sort((a, b) => {
    if (selected === "best-match") return b.matchScore - a.matchScore;
    if (selected === "salary") {
      const getMinSalary = (range: string) =>
        parseInt(range.replace(/[^0-9]/g, "").slice(0, 5)) || 0;
      return getMinSalary(b.salaryRange) - getMinSalary(a.salaryRange);
    }
    // Growth rate
    const aGrowth = parseInt(a.growthRate.replace(/[^0-9]/g, "")) || 0;
    const bGrowth = parseInt(b.growthRate.replace(/[^0-9]/g, "")) || 0;
    return bGrowth - aGrowth;
  });

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
              startContent={<Icon icon="lucide:compass" />}
            >
              Career Assessment
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
                      endContent={<Icon icon="lucide:chevron-down" width={16} height={16} />}
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
                    {categories.map((category) => (
                      <DropdownItem key={category}>{category}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      endContent={<Icon icon="lucide:chevron-down" width={16} height={16} />}
                    >
                      {selectedLevel}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Level filter"
                    onAction={(key) => setSelectedLevel(key as string)}
                    selectedKeys={[selectedLevel]}
                    selectionMode="single"
                  >
                    {levels.map((level) => (
                      <DropdownItem key={level}>{level}</DropdownItem>
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
                      <span
                        className={`font-bold text-${getScoreColor(
                          path.matchScore
                        )}`}
                      >
                        {path.matchScore}%
                      </span>
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
                      color={getScoreColor(path.matchScore) as any}
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
                          {skill}
                          {path.userSkills.includes(skill) && (
                            <Icon
                              icon="lucide:check"
                              className="ml-1"
                              width={12}
                              height={12}
                            />
                          )}
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
                                  <Icon icon="lucide:external-link" width={14} height={14} />
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
                      startContent={<Icon icon="lucide:bookmark" />}
                    >
                      Save Path
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
                      setSelectedLevel("All Levels");
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

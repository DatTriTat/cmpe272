import React from 'react';
import {
  Card, CardBody, CardHeader, Button, Chip, Progress,
  Tabs, Tab, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from '@heroui/react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

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

const CareerPathsPage: React.FC = () => {
  const [selected, setSelected] = React.useState("best-match");
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");
  const [selectedLevel, setSelectedLevel] = React.useState("All Levels");
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
      console.error("❌ Failed to parse careerSuggestions:", err);
      setCareerPaths([]);
    }
  }, []);

  const categories = ["All Categories", "Web Development", "Data Science", "Design", "DevOps", "Product", "Marketing", "Mobile Development", "Software Engineering"];
  const levels = ["All Levels", "Entry Level", "Mid Level", "Senior Level"];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty.toLowerCase().includes("beginner")) return "success";
    if (difficulty.toLowerCase().includes("intermediate") || difficulty.toLowerCase().includes("medium")) return "warning";
    return "danger";
  };

  const filteredPaths = careerPaths.filter(path => {
    const matchesCategory = selectedCategory === "All Categories" || path.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "All Levels" ||
      (selectedLevel === "Entry Level" && path.matchScore >= 80) ||
      (selectedLevel === "Mid Level" && path.matchScore >= 70 && path.matchScore < 80) ||
      (selectedLevel === "Senior Level" && path.matchScore < 70);
    return matchesCategory && matchesLevel;
  });

  const sortedPaths = [...filteredPaths].sort((a, b) => {
    if (selected === "best-match") return b.matchScore - a.matchScore;
    if (selected === "salary") {
      const getMinSalary = (range: string) => parseInt(range.replace(/[^0-9]/g, '').slice(0, 5)) || 0;
      return getMinSalary(b.salaryRange) - getMinSalary(a.salaryRange);
    }
    // Growth rate
    const aGrowth = parseInt(a.growthRate.replace(/[^0-9]/g, '')) || 0;
    const bGrowth = parseInt(b.growthRate.replace(/[^0-9]/g, '')) || 0;
    return bGrowth - aGrowth;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Career Path Suggestions</h1>
          <div className="flex gap-2">
            <Button as={Link} to="/profile" variant="flat" startContent={<Icon icon="lucide:user" />}>Update Skills</Button>
            <Button color="primary" startContent={<Icon icon="lucide:compass" />}>Career Assessment</Button>
          </div>
        </div>

        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <Tabs selectedKey={selected} onSelectionChange={setSelected as any}>
                <Tab key="best-match" title="Best Match" />
                <Tab key="salary" title="Highest Salary" />
                <Tab key="growth" title="Fastest Growing" />
              </Tabs>

              <div className="flex flex-wrap gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" endContent={<Icon icon="lucide:chevron-down" size={16} />}>
                      {selectedCategory}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    onAction={(key) => setSelectedCategory(key as string)}
                    selectedKeys={[selectedCategory]}
                    selectionMode="single"
                  >
                    {categories.map((c) => <DropdownItem key={c}>{c}</DropdownItem>)}
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" endContent={<Icon icon="lucide:chevron-down" size={16} />}>
                      {selectedLevel}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    onAction={(key) => setSelectedLevel(key as string)}
                    selectedKeys={[selectedLevel]}
                    selectionMode="single"
                  >
                    {levels.map((l) => <DropdownItem key={l}>{l}</DropdownItem>)}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>

        {sortedPaths.length > 0 ? (
          <div className="space-y-6">
            {sortedPaths.map((path) => (
              <Card key={path.id}>
                <CardHeader className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{path.title}</h2>
                    <p className="text-default-500">{path.category}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold text-${getScoreColor(path.matchScore)}`}>{path.matchScore}%</span>
                      <span className="text-sm text-default-500">match</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip size="sm" variant="flat" color="success">{path.growthRate}</Chip>
                      <Chip size="sm" variant="flat">{path.salaryRange}</Chip>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="gap-6">
                  <p className="text-default-600">{path.description}</p>

                  {/* Skills Match */}
                  <div>
                    <h3 className="font-medium mb-2">Skills Match</h3>
                    <Progress
                      value={(path.userSkills.length / path.requiredSkills.length) * 100}
                      color={getScoreColor(path.matchScore) as any}
                      className="mb-2"
                    />
                    <div className="flex flex-wrap gap-2">
                      {path.requiredSkills.map((skill) => (
                        <Chip
                          key={skill}
                          color={path.userSkills.includes(skill) ? "success" : "default"}
                          variant="flat"
                          size="sm"
                        >
                          {skill}
                          {path.userSkills.includes(skill) && (
                            <Icon icon="lucide:check" className="ml-1" size={12} />
                          )}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-10">
              <Icon icon="lucide:search-x" width={48} className="mx-auto mb-4 text-default-400" />
              <h3 className="text-xl font-semibold">No career paths found</h3>
              <p className="text-default-500 mb-4">Try adjusting your filters or completing a career assessment.</p>
              <Button
                color="primary"
                onPress={() => {
                  setSelectedCategory("All Categories");
                  setSelectedLevel("All Levels");
                }}
              >
                Reset Filters
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CareerPathsPage;

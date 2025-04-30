import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Progress, Tabs, Tab, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface JobSuggestion {
  id: number;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  salary: string;
  isNew: boolean;
  skills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
  postedDate: string;
  industry: string;
}

const JobSuggestionPage: React.FC = () => {
  const [selected, setSelected] = React.useState("best-matches");
  const [selectedIndustry, setSelectedIndustry] = React.useState("All Industries");
  const [selectedExperience, setSelectedExperience] = React.useState("All Levels");
  
  const jobSuggestions: JobSuggestion[] = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      matchScore: 92,
      salary: "$120K - $150K",
      isNew: true,
      skills: ["React", "TypeScript", "Redux", "Node.js", "GraphQL", "AWS"],
      matchedSkills: ["React", "TypeScript", "Redux", "Node.js"],
      missingSkills: ["GraphQL", "AWS"],
      description: "Looking for a senior developer to lead our frontend team and architect scalable React applications.",
      postedDate: "2 days ago",
      industry: "Technology"
    },
    {
      id: 2,
      title: "Frontend Team Lead",
      company: "Global Solutions",
      location: "Remote",
      matchScore: 87,
      salary: "$130K - $160K",
      isNew: true,
      skills: ["React", "Team Leadership", "CSS/SCSS", "Performance Optimization", "Mentoring"],
      matchedSkills: ["React", "CSS/SCSS", "Performance Optimization"],
      missingSkills: ["Team Leadership", "Mentoring"],
      description: "Lead our frontend development team in creating responsive and performant web applications.",
      postedDate: "1 day ago",
      industry: "Software"
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "Startup Ventures",
      location: "New York, NY",
      matchScore: 78,
      salary: "$110K - $140K",
      isNew: false,
      skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
      matchedSkills: ["React", "Node.js"],
      missingSkills: ["MongoDB", "AWS", "Docker"],
      description: "Join our growing startup as a Full Stack Engineer working on both frontend and backend.",
      postedDate: "1 week ago",
      industry: "Startup"
    },
    {
      id: 4,
      title: "UI/UX Developer",
      company: "Creative Digital",
      location: "Chicago, IL",
      matchScore: 85,
      salary: "$90K - $120K",
      isNew: true,
      skills: ["React", "UI/UX Design", "Figma", "CSS Animation", "Accessibility"],
      matchedSkills: ["React", "CSS Animation", "Accessibility"],
      missingSkills: ["UI/UX Design", "Figma"],
      description: "Create beautiful and accessible user interfaces for our digital products.",
      postedDate: "3 days ago",
      industry: "Design"
    },
    {
      id: 5,
      title: "React Native Developer",
      company: "Mobile Innovations",
      location: "Austin, TX",
      matchScore: 75,
      salary: "$100K - $130K",
      isNew: false,
      skills: ["React Native", "JavaScript", "iOS", "Android", "API Integration"],
      matchedSkills: ["JavaScript", "API Integration"],
      missingSkills: ["React Native", "iOS", "Android"],
      description: "Develop cross-platform mobile applications using React Native.",
      postedDate: "2 weeks ago",
      industry: "Mobile"
    }
  ];

  const upskillingSuggestions = [
    {
      skill: "GraphQL",
      relevance: "High",
      jobCount: 124,
      resources: [
        { name: "GraphQL Fundamentals", type: "Course", url: "#" },
        { name: "Building APIs with GraphQL", type: "Tutorial", url: "#" }
      ]
    },
    {
      skill: "AWS",
      relevance: "High",
      jobCount: 215,
      resources: [
        { name: "AWS Certified Developer", type: "Certification", url: "#" },
        { name: "Serverless with AWS Lambda", type: "Course", url: "#" }
      ]
    },
    {
      skill: "Docker",
      relevance: "Medium",
      jobCount: 98,
      resources: [
        { name: "Docker for Developers", type: "Course", url: "#" },
        { name: "Containerization Basics", type: "Tutorial", url: "#" }
      ]
    }
  ];

  const industries = ["All Industries", "Technology", "Software", "Startup", "Design", "Mobile", "Finance", "Healthcare"];
  const experienceLevels = ["All Levels", "Entry Level", "Mid Level", "Senior Level", "Lead", "Manager"];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };

  const filteredJobs = jobSuggestions.filter(job => {
    const matchesIndustry = selectedIndustry === "All Industries" || job.industry === selectedIndustry;
    const matchesExperience = selectedExperience === "All Levels" || 
      (selectedExperience === "Senior Level" && job.title.includes("Senior")) ||
      (selectedExperience === "Lead" && job.title.includes("Lead"));
    
    return matchesIndustry && matchesExperience;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (selected === "best-matches") {
      return b.matchScore - a.matchScore;
    } else if (selected === "newest") {
      return a.postedDate.includes("day") ? -1 : 1;
    } else {
      // Salary sorting (simple implementation)
      const aSalary = parseInt(a.salary.split('$')[1].split('K')[0]);
      const bSalary = parseInt(b.salary.split('$')[1].split('K')[0]);
      return bSalary - aSalary;
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Suggestions</h1>
          <div className="flex gap-2">
            <Button 
              as={Link}
              to="/jobs"
              variant="flat"
              startContent={<Icon icon="lucide:list" />}
            >
              All Jobs
            </Button>
            <Button 
              color="primary"
              startContent={<Icon icon="lucide:sliders" />}
            >
              Adjust Preferences
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Tabs 
                  aria-label="Job sorting options" 
                  selectedKey={selected} 
                  onSelectionChange={setSelected as any}
                >
                  <Tab key="best-matches" title="Best Matches" />
                  <Tab key="newest" title="Newest" />
                  <Tab key="salary" title="Highest Salary" />
                </Tabs>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="bordered"
                      endContent={<Icon icon="lucide:chevron-down" size={16} />}
                    >
                      {selectedIndustry}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Industry filter"
                    onAction={(key) => setSelectedIndustry(key as string)}
                    selectedKeys={[selectedIndustry]}
                    selectionMode="single"
                  >
                    {industries.map((industry) => (
                      <DropdownItem key={industry}>{industry}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="bordered"
                      endContent={<Icon icon="lucide:chevron-down" size={16} />}
                    >
                      {selectedExperience}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Experience level filter"
                    onAction={(key) => setSelectedExperience(key as string)}
                    selectedKeys={[selectedExperience]}
                    selectionMode="single"
                  >
                    {experienceLevels.map((level) => (
                      <DropdownItem key={level}>{level}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Job Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {sortedJobs.length > 0 ? (
                sortedJobs.map((job) => (
                  <Card key={job.id} className="hover:border-primary transition-colors">
                    <CardBody>
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              {job.isNew && <Chip size="sm" color="primary" variant="flat">New</Chip>}
                            </div>
                            <p className="text-default-600">{job.company} • {job.location}</p>
                            <p className="text-default-500 text-sm mt-1">
                              {job.salary} • Posted {job.postedDate}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 mb-1">
                              <span className={`font-bold text-${getScoreColor(job.matchScore)}`}>{job.matchScore}%</span>
                              <span className="text-sm text-default-500">match</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-default-600">{job.description}</p>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Skills Match</h4>
                            <span className="text-sm text-default-500">
                              {job.matchedSkills.length} of {job.skills.length} skills
                            </span>
                          </div>
                          <Progress 
                            value={(job.matchedSkills.length / job.skills.length) * 100} 
                            color={getScoreColor(job.matchScore) as any}
                            className="mb-3"
                          />
                          <div className="flex flex-wrap gap-2">
                            {job.matchedSkills.map((skill) => (
                              <Chip key={skill} color="success" variant="flat" size="sm">{skill}</Chip>
                            ))}
                            {job.missingSkills.map((skill) => (
                              <Chip key={skill} color="default" variant="flat" size="sm">{skill}</Chip>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="flat"
                            startContent={<Icon icon="lucide:bookmark" />}
                          >
                            Save
                          </Button>
                          <Button 
                            color="primary"
                            startContent={<Icon icon="lucide:send" />}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardBody>
                    <div className="text-center py-8">
                      <Icon icon="lucide:search-x" className="mx-auto mb-4 text-default-400" width={48} height={48} />
                      <h3 className="text-xl font-semibold mb-2">No job suggestions found</h3>
                      <p className="text-default-500 mb-6">
                        Try adjusting your filters or updating your skills profile.
                      </p>
                      <Button 
                        color="primary"
                        onPress={() => {
                          setSelectedIndustry('All Industries');
                          setSelectedExperience('All Levels');
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
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Summary */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Your Match Summary</h2>
              </CardHeader>
              <CardBody className="gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Overall Match Score</span>
                    <span className="text-sm font-medium text-success">85%</span>
                  </div>
                  <Progress value={85} color="success" className="mb-4" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Technical Skills</span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Experience</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Education</span>
                    <span className="text-sm font-medium">80%</span>
                  </div>
                </div>
                
                <Button 
                  as={Link}
                  to="/profile"
                  variant="flat"
                  color="primary"
                  fullWidth
                  startContent={<Icon icon="lucide:edit" />}
                >
                  Update Your Profile
                </Button>
              </CardBody>
            </Card>
            
            {/* Upskilling Suggestions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Recommended Skills</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-500 mb-4">
                  Adding these skills could increase your job matches by up to 35%
                </p>
                
                <div className="space-y-4">
                  {upskillingSuggestions.map((skill) => (
                    <div key={skill.skill} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{skill.skill}</h4>
                          <Chip size="sm" color="primary" variant="flat">{skill.relevance}</Chip>
                        </div>
                        <span className="text-sm text-default-500">{skill.jobCount} jobs</span>
                      </div>
                      
                      <div className="space-y-2">
                        {skill.resources.map((resource, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {resource.type === 'Course' ? (
                              <Icon icon="lucide:book-open" className="text-primary" size={14} />
                            ) : resource.type === 'Certification' ? (
                              <Icon icon="lucide:award" className="text-primary" size={14} />
                            ) : (
                              <Icon icon="lucide:file-text" className="text-primary" size={14} />
                            )}
                            <a href={resource.url} className="text-primary hover:underline">
                              {resource.name}
                            </a>
                            <span className="text-xs text-default-500">({resource.type})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="flat"
                  color="primary"
                  fullWidth
                  className="mt-4"
                  startContent={<Icon icon="lucide:plus" />}
                >
                  View More Skills
                </Button>
              </CardBody>
            </Card>
            
            {/* Job Market Insights */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Job Market Insights</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Icon icon="lucide:trending-up" className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">React Developer</h4>
                      <p className="text-sm text-default-500">Demand up 15% this month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-success/10 p-2 rounded-full">
                      <Icon icon="lucide:dollar-sign" className="text-success" />
                    </div>
                    <div>
                      <h4 className="font-medium">Salary Trends</h4>
                      <p className="text-sm text-default-500">Average $125K in your area</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-warning/10 p-2 rounded-full">
                      <Icon icon="lucide:map-pin" className="text-warning" />
                    </div>
                    <div>
                      <h4 className="font-medium">Top Hiring Locations</h4>
                      <p className="text-sm text-default-500">San Francisco, Remote, New York</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="light"
                  fullWidth
                  className="mt-4"
                  endContent={<Icon icon="lucide:arrow-right" />}
                >
                  View Full Report
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSuggestionPage;
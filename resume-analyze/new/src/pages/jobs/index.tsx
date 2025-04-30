import React from 'react';
import { Card, CardBody, CardHeader, Button, Input, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const JobsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLocation, setSelectedLocation] = React.useState('All Locations');
  const [selectedJobType, setSelectedJobType] = React.useState('All Types');
  const [selectedSalary, setSelectedSalary] = React.useState('All Salaries');
  
  const jobListings = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120K - $150K",
      matchScore: 92,
      isNew: true,
      postedDate: "2 days ago",
      description: "We are looking for a Senior React Developer to join our team. You will be responsible for developing and implementing user interface components using React.js concepts and workflows.",
      requirements: ["5+ years of React experience", "Experience with Redux", "TypeScript knowledge", "CI/CD experience"]
    },
    {
      id: 2,
      title: "Frontend Team Lead",
      company: "Global Solutions",
      location: "Remote",
      type: "Full-time",
      salary: "$130K - $160K",
      matchScore: 87,
      isNew: true,
      postedDate: "1 day ago",
      description: "Lead our frontend development team in creating responsive and performant web applications. You'll mentor junior developers and work closely with product and design teams.",
      requirements: ["7+ years of frontend development", "3+ years of team leadership", "Strong React knowledge", "Experience with design systems"]
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "Startup Ventures",
      location: "New York, NY",
      type: "Full-time",
      salary: "$110K - $140K",
      matchScore: 78,
      isNew: false,
      postedDate: "1 week ago",
      description: "Join our growing startup as a Full Stack Engineer. You'll work on both frontend and backend development using React and Node.js.",
      requirements: ["3+ years of full stack development", "React and Node.js experience", "MongoDB knowledge", "AWS experience"]
    },
    {
      id: 4,
      title: "React Native Developer",
      company: "Mobile Innovations",
      location: "Austin, TX",
      type: "Contract",
      salary: "$100K - $130K",
      matchScore: 75,
      isNew: false,
      postedDate: "2 weeks ago",
      description: "Develop cross-platform mobile applications using React Native. You'll work on new features and maintain existing functionality.",
      requirements: ["2+ years of React Native experience", "iOS and Android knowledge", "Experience with mobile app deployment", "Understanding of mobile UX principles"]
    },
    {
      id: 5,
      title: "Frontend Developer",
      company: "Digital Agency",
      location: "Chicago, IL",
      type: "Part-time",
      salary: "$60K - $80K",
      matchScore: 70,
      isNew: false,
      postedDate: "3 weeks ago",
      description: "Join our agency as a part-time Frontend Developer. You'll work on various client projects implementing responsive designs and interactive features.",
      requirements: ["2+ years of frontend development", "HTML, CSS, JavaScript proficiency", "React experience", "Responsive design skills"]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'All Locations' || job.location === selectedLocation;
    const matchesType = selectedJobType === 'All Types' || job.type === selectedJobType;
    
    // Simple salary filter (in a real app, this would be more sophisticated)
    const matchesSalary = selectedSalary === 'All Salaries' || 
                         (selectedSalary === '$100K+' && parseInt(job.salary.split('$')[1].split('K')[0]) >= 100) ||
                         (selectedSalary === '$130K+' && parseInt(job.salary.split('$')[1].split('K')[0]) >= 130);
    
    return matchesSearch && matchesLocation && matchesType && matchesSalary;
  });

  const locations = ['All Locations', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Chicago, IL', 'Remote'];
  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract'];
  const salaryRanges = ['All Salaries', '$100K+', '$130K+'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Matches</h1>
          <div className="flex gap-2">
            <Button 
              as={Link}
              to="/jobs/suggestions"
              variant="flat"
              startContent={<Icon icon="lucide:sparkles" />}
            >
              View Suggestions
            </Button>
            <Button 
              color="primary"
              startContent={<Icon icon="lucide:sliders" />}
            >
              Adjust Match Preferences
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search jobs or companies"
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                className="flex-1"
              />
              
              <div className="flex flex-wrap gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="bordered"
                      endContent={<Icon icon="lucide:chevron-down" size={16} />}
                    >
                      {selectedLocation}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Location filter"
                    onAction={(key) => setSelectedLocation(key as string)}
                    selectedKeys={[selectedLocation]}
                    selectionMode="single"
                  >
                    {locations.map((location) => (
                      <DropdownItem key={location}>{location}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="bordered"
                      endContent={<Icon icon="lucide:chevron-down" size={16} />}
                    >
                      {selectedJobType}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Job type filter"
                    onAction={(key) => setSelectedJobType(key as string)}
                    selectedKeys={[selectedJobType]}
                    selectionMode="single"
                  >
                    {jobTypes.map((type) => (
                      <DropdownItem key={type}>{type}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="bordered"
                      endContent={<Icon icon="lucide:chevron-down" size={16} />}
                    >
                      {selectedSalary}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Salary filter"
                    onAction={(key) => setSelectedSalary(key as string)}
                    selectedKeys={[selectedSalary]}
                    selectionMode="single"
                  >
                    {salaryRanges.map((range) => (
                      <DropdownItem key={range}>{range}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:border-primary transition-colors">
                <CardBody>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-semibold">{job.title}</h2>
                        {job.isNew && <Chip size="sm" color="primary" variant="flat">New</Chip>}
                      </div>
                      <p className="text-default-600">{job.company} • {job.location}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Chip size="sm" variant="flat">{job.type}</Chip>
                        <Chip size="sm" variant="flat">{job.salary}</Chip>
                        <Chip size="sm" variant="flat">Posted {job.postedDate}</Chip>
                      </div>
                      
                      <p className="mt-4 text-default-600">{job.description}</p>
                      
                      <div className="mt-4">
                        <p className="font-medium mb-2">Requirements:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-default-600">{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-4">
                      <div className="flex items-center gap-1">
                        <span className={`font-bold text-${getScoreColor(job.matchScore)}`}>{job.matchScore}%</span>
                        <span className="text-sm text-default-500">match</span>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          color="primary"
                          className="min-w-[120px]"
                        >
                          Apply Now
                        </Button>
                        <Button 
                          variant="flat"
                          className="min-w-[120px]"
                        >
                          Save Job
                        </Button>
                      </div>
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
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-default-500 mb-6">
                    Try adjusting your search filters to find more job matches.
                  </p>
                  <Button 
                    color="primary"
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedLocation('All Locations');
                      setSelectedJobType('All Types');
                      setSelectedSalary('All Salaries');
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

export default JobsPage;
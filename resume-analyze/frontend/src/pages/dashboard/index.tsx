import React from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip } from '@heroui/react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const DashboardPage: React.FC = () => {
  const jobMatches = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      matchScore: 92,
      isNew: true,
      salary: "$120K - $150K"
    },
    {
      id: 2,
      title: "Frontend Team Lead",
      company: "Global Solutions",
      location: "Remote",
      matchScore: 87,
      isNew: true,
      salary: "$130K - $160K"
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "Startup Ventures",
      location: "New York, NY",
      matchScore: 78,
      isNew: false,
      salary: "$110K - $140K"
    },
    {
      id: 4,
      title: "React Native Developer",
      company: "Mobile Innovations",
      location: "Austin, TX",
      matchScore: 75,
      isNew: false,
      salary: "$100K - $130K"
    }
  ];

  const upcomingInterviews = [
    {
      id: 1,
      company: "Tech Innovations Inc.",
      position: "Senior React Developer",
      date: "2023-08-15T14:00:00",
      type: "Video"
    },
    {
      id: 2,
      company: "Global Solutions",
      position: "Frontend Team Lead",
      date: "2023-08-18T10:30:00",
      type: "Phone"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button 
            as={Link}
            to="/profile"
            variant="flat"
            color="primary"
            startContent={<Icon icon="lucide:user" />}
          >
            Complete Your Profile
          </Button>
        </div>

        {/* Profile Completion */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="md:w-1/4 flex flex-col items-center">
                <div className="relative">
                  <svg className="w-28 h-28">
                    <circle
                      className="text-gray-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="56"
                      cy="56"
                    />
                    <circle
                      className="text-primary"
                      strokeWidth="8"
                      strokeDasharray={50 * 2 * Math.PI}
                      strokeDashoffset={50 * 2 * Math.PI * (1 - 75 / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="56"
                      cy="56"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">75%</span>
                  </div>
                </div>
                <p className="mt-2 font-medium">Profile Completion</p>
              </div>

              <div className="md:w-3/4 space-y-4">
                <h2 className="text-xl font-semibold">Complete your profile to get better job matches</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:check-circle" className="text-success" />
                    <span>Basic information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:check-circle" className="text-success" />
                    <span>Skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:check-circle" className="text-success" />
                    <span>Work experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:x-circle" className="text-danger" />
                    <span>Education details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:x-circle" className="text-danger" />
                    <span>Resume upload</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    as={Link}
                    to="/profile"
                    color="primary"
                    variant="flat"
                  >
                    Complete Profile
                  </Button>
                  <Button 
                    as={Link}
                    to="/resume/upload"
                    color="primary"
                    variant="flat"
                  >
                    Upload Resume
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Job Matches */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold">Your Job Matches</h2>
              <div className="flex gap-2">
                <Button 
                  as={Link}
                  to="/jobs/suggestions"
                  variant="light"
                  endContent={<Icon icon="lucide:sparkles" />}
                >
                  View Suggestions
                </Button>
                <Button 
                  as={Link}
                  to="/jobs"
                  variant="light"
                  endContent={<Icon icon="lucide:arrow-right" />}
                >
                  View All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {jobMatches.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        {job.isNew && <Chip size="sm" color="primary" variant="flat">New</Chip>}
                      </div>
                      <p className="text-default-600">{job.company} • {job.location}</p>
                      <p className="text-default-500 text-sm mt-1">Estimated salary: {job.salary}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 mb-1">
                        <span className={`font-bold text-${getScoreColor(job.matchScore)}`}>{job.matchScore}%</span>
                        <span className="text-sm text-default-500">match</span>
                      </div>
                      <Button 
                        size="sm" 
                        color="primary"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Upcoming Interviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
            </CardHeader>
            <CardBody>
              {upcomingInterviews.length > 0 ? (
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => {
                    const interviewDate = new Date(interview.date);
                    return (
                      <div key={interview.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{interview.position}</h3>
                            <p className="text-default-600">{interview.company}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-default-500">
                              <Icon icon="lucide:calendar" size={16} />
                              <span>{interviewDate.toLocaleDateString()}</span>
                              <Icon icon="lucide:clock" size={16} />
                              <span>{interviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          <Chip color="primary" variant="flat">{interview.type}</Chip>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="flat">Reschedule</Button>
                          <Button size="sm" color="primary">Prepare</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon icon="lucide:calendar" className="mx-auto mb-2 text-default-400" width={40} height={40} />
                  <p className="text-default-600">No upcoming interviews</p>
                  <Button 
                    as={Link}
                    to="/interview/practice"
                    color="primary"
                    variant="flat"
                    className="mt-4"
                  >
                    Practice for Interviews
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Practice Resources */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Interview Preparation</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon icon="lucide:message-circle" className="text-primary" width={24} height={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">AI Chat Interview</h3>
                    <p className="text-sm text-default-500">Practice with our AI interviewer in a chat format</p>
                  </div>
                  <Button 
                    as={Link}
                    to="/interview/chat"
                    color="primary"
                    variant="flat"
                  >
                    Start
                  </Button>
                </div>

                <div className="border rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon icon="lucide:video" className="text-primary" width={24} height={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Video Interview Practice</h3>
                    <p className="text-sm text-default-500">Practice with video recording and get AI feedback</p>
                  </div>
                  <Button 
                    as={Link}
                    to="/interview/practice"
                    color="primary"
                    variant="flat"
                  >
                    Start
                  </Button>
                </div>

                <div className="border rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon icon="lucide:file-text" className="text-primary" width={24} height={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Resume Analysis</h3>
                    <p className="text-sm text-default-500">Get AI feedback on your resume</p>
                  </div>
                  <Button 
                    as={Link}
                    to="/resume/upload"
                    color="primary"
                    variant="flat"
                  >
                    Analyze
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Career Paths */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold">Career Path Suggestions</h2>
              <Button 
                as={Link}
                to="/career-paths"
                variant="light"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Icon icon="lucide:code" className="text-primary" width={24} height={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">Frontend Developer</h3>
                    <span className="text-success font-medium">92% match</span>
                  </div>
                  <p className="text-sm text-default-500">3 of 4 required skills • $80K - $140K</p>
                </div>
                <Button 
                  as={Link}
                  to="/career-paths"
                  size="sm"
                  variant="flat"
                >
                  Details
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Icon icon="lucide:bar-chart" className="text-primary" width={24} height={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">Data Analyst</h3>
                    <span className="text-success font-medium">85% match</span>
                  </div>
                  <p className="text-sm text-default-500">2 of 4 required skills • $70K - $120K</p>
                </div>
                <Button 
                  as={Link}
                  to="/career-paths"
                  size="sm"
                  variant="flat"
                >
                  Details
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Icon icon="lucide:layout" className="text-primary" width={24} height={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">UX/UI Designer</h3>
                    <span className="text-warning font-medium">78% match</span>
                  </div>
                  <p className="text-sm text-default-500">1 of 4 required skills • $75K - $130K</p>
                </div>
                <Button 
                  as={Link}
                  to="/career-paths"
                  size="sm"
                  variant="flat"
                >
                  Details
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
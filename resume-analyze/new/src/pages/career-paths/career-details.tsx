import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

interface CareerDetailParams {
  id: string;
}

const CareerDetailsPage: React.FC = () => {
  const { id } = useParams();
  const careerPathId = parseInt(id as string || "1");

  const stored = localStorage.getItem("careerSuggestions");
  const allPaths = stored ? JSON.parse(stored) : [];
  const careerPath = allPaths.find((p: any) => p.id === careerPathId);
  console.log("Looking for ID:", careerPath);


  const getScoreColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              as={Link}
              to="/career-paths"
              isIconOnly
              variant="light"
              aria-label="Back"
            >
              <Icon icon="lucide:arrow-left" />
            </Button>
            <h1 className="text-2xl font-bold">
              {careerPath.title} Career Path
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Chip
              color={getScoreColor(careerPath.matchScore) as any}
              variant="flat"
            >
              {careerPath.matchScore}% Match
            </Chip>
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:bookmark" />}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Overview Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Career Overview</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <p className="text-default-600">{careerPath.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="lucide:trending-up" className="text-success" />
                  <h3 className="font-medium">Growth Rate</h3>
                </div>
                <p className="text-xl font-semibold">{careerPath.growthRate}</p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="lucide:dollar-sign" className="text-primary" />
                  <h3 className="font-medium">Salary Range</h3>
                </div>
                <p className="text-xl font-semibold">
                  {careerPath.salaryRange}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="lucide:briefcase" className="text-warning" />
                  <h3 className="font-medium">Category</h3>
                </div>
                <p className="text-xl font-semibold">{careerPath.category}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Why You're a Good Fit */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Why You're a Good Fit</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.isArray(careerPath.fitReasons) &&
                  careerPath.fitReasons.map((reason, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Icon
                            icon={`lucide:${reason.icon}`}
                            className="text-primary"
                          />
                        </div>
                        <h3 className="font-medium">{reason.title}</h3>
                      </div>
                      <p className="text-default-600">{reason.description}</p>
                    </div>
                  ))}
              </div>

              <div className="bg-content2 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Detailed Fit Analysis</h3>
                <p className="text-default-600 whitespace-pre-line">
                  {careerPath.detailedFitAnalysis}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Skills Assessment */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Skills Assessment</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <div className="flex justify-between items-center mb-2">
              <span>Skills Match</span>
              <span className="text-default-500">
                {careerPath.userSkills.length} of{" "}
                {careerPath.requiredSkills.length} required skills
              </span>
            </div>
            <Progress
              value={
                (careerPath.userSkills.length /
                  careerPath.requiredSkills.length) *
                100
              }
              color={getScoreColor(careerPath.matchScore) as any}
              className="mb-3"
            />
            <div>
              <h3 className="font-medium mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(careerPath.requiredSkills) &&
                  careerPath.requiredSkills.map((skill) => (
                    <Chip
                      key={skill}
                      color={
                        careerPath.userSkills.includes(skill)
                          ? "success"
                          : "default"
                      }
                      variant="flat"
                    >
                      {skill}
                      {careerPath.userSkills.includes(skill) && (
                        <Icon icon="lucide:check" className="ml-1" style={{ fontSize: 14 }} />
                      )}
                    </Chip>
                  ))}
              </div>

              <h3 className="font-medium mb-2">
                Recommended Additional Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(careerPath.recommendedSkills) &&
                  careerPath.recommendedSkills.map((skill) => (
                    <Chip key={skill} color="primary" variant="flat">
                      {skill}
                    </Chip>
                  ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Career Progression */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Career Progression</h2>
          </CardHeader>
          <CardBody>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-primary/20"></div>

              <div className="space-y-8 relative">
                {careerPath.careerPath.map((level, index) => (
                  <div key={index} className="ml-10 relative">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-10 top-0 w-4 h-4 rounded-full ${
                        index === 2
                          ? "bg-primary ring-4 ring-primary/20"
                          : "bg-primary/30"
                      }`}
                    ></div>

                    <div
                      className={`border rounded-lg p-4 ${
                        index === 2 ? "border-primary/30 bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{level.title}</h3>
                        <Chip size="sm" variant="flat">
                          {level.salary}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-500 mb-2">
                        {level.yearsExperience} years experience
                      </p>
                      <div className="space-y-1">
                        {level.responsibilities.map((resp, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Icon
                              icon="lucide:check"
                              className="text-primary mt-1"
                              style={{ fontSize: 14 }}
                            />
                            <span className="text-sm">{resp}</span>
                          </div>
                        ))}
                      </div>
                      {index === 2 && (
                        <div className="mt-2 pt-2 border-t border-primary/20">
                          <p className="text-sm font-medium text-primary">
                            Your current level based on experience
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Learning Resources */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Recommended Learning Resources
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Certifications</h3>
                <div className="space-y-3">
                  {Array.isArray(careerPath.certifications) &&
                    careerPath.certifications.map((cert, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium">{cert.name}</h4>
                          <Chip size="sm" variant="flat">
                            {cert.difficulty}
                          </Chip>
                        </div>
                        <p className="text-sm text-default-500 mb-3">
                          {cert.provider} • {cert.duration}
                        </p>
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          endContent={
                            <Icon icon="lucide:external-link" style={{ fontSize: 14 }} />
                          }
                        >
                          Learn More
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Courses</h3>
                <div className="space-y-3">
                  {careerPath.suggestedCourses &&
                    Object.entries(careerPath.suggestedCourses).map(
                      ([skill, courses]) =>
                        (
                          courses as {
                            name: string;
                            provider: string;
                            duration: string;
                            url: string;
                          }[]
                        ).map((course, index) => (
                          <div
                            key={`${skill}-${index}`}
                            className="border rounded-lg p-4"
                          >
                            <h4 className="font-medium mb-1">{course.name}</h4>
                            <p className="text-sm text-default-500 mb-3">
                              {course.provider} • {course.duration}
                            </p>
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              as="a"
                              href={course.url}
                              target="_blank"
                              endContent={
                                <Icon icon="lucide:external-link" style={{ fontSize: 14 }} />
                              }
                            >
                              View Course
                            </Button>
                          </div>
                        ))
                    )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="flat" startContent={<Icon icon="lucide:share-2" />}>
            Share
          </Button>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:file-text" />}
          >
            Generate Career Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerDetailsPage;

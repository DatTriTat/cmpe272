import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
  Divider,
  Tabs,
  Tab,
} from "@heroui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const ResumeAnalysisPage: React.FC = () => {
  const [selected, setSelected] = useState("overview");
  const [analysis, setAnalysis] = useState<any>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("resumeAnalysisResult");
      if (stored && stored !== "undefined" && stored !== "null") {
        const parsed = JSON.parse(stored);
        setAnalysis(parsed);
      } else {
        console.warn("No valid data found, redirecting...");
        navigate("/resume/upload");
      }
    } catch (error) {
      console.error("JSON parse error:", error);
      navigate("/resume/upload");
    } finally {
      setLoading(false);
    }
  }, []);

  const overallScore = analysis?.overallScore ?? 0;
  const sections = [
    { name: "Format & Structure", score: analysis?.formatScore },
    { name: "Content Quality", score: analysis?.contentScore },
    { name: "Skills Relevance", score: analysis?.skillsScore },
    { name: "ATS Compatibility", score: analysis?.atsScore },
    { name: "Grammar & Spelling", score: analysis?.grammarScore },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const suggestions = [
    {
      category: "Content",
      items: analysis?.improvementSuggestions?.content || [],
    },
    {
      category: "Format",
      items: analysis?.improvementSuggestions?.format || [],
    },
    {
      category: "ATS Optimization",
      items: analysis?.improvementSuggestions?.atsOptimization || [],
    },
  ];
  const strengths = analysis?.keyFindings?.strengths || [];
  const areasToImprove = analysis?.keyFindings?.areasToImprove || [];
  const criticalIssues = analysis?.keyFindings?.criticalIssues || [];

  const keywordMatches = [
    { keyword: "React", count: 5, recommended: 3 },
    { keyword: "JavaScript", count: 3, recommended: 4 },
    { keyword: "TypeScript", count: 1, recommended: 3 },
    { keyword: "Node.js", count: 2, recommended: 2 },
    { keyword: "API", count: 4, recommended: 2 },
    { keyword: "Agile", count: 0, recommended: 2 },
    { keyword: "Testing", count: 1, recommended: 3 },
  ];
  const atsIssues = analysis?.atsCompatibilityDetails?.issues || [];
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <Progress
            isIndeterminate
            color="primary"
            className="w-64"
            aria-label="Loading resume analysis"
          />
          <p className="text-default-500 text-sm">Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume Analysis</h1>
          <div className="flex gap-2">
            <Button
              color="primary"
              as={RouterLink}
              to="/resume/upload"
              startContent={<Icon icon="lucide:upload" />}
            >
              Upload New Resume
            </Button>
          </div>
        </div>
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center justify-center">
                <div className="relative">
                  <svg className="w-36 h-36">
                    <circle
                      className="text-gray-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="60"
                      cx="72"
                      cy="72"
                    />
                    <circle
                      className={`text-${getScoreColor(overallScore)}`}
                      strokeWidth="10"
                      strokeDasharray={60 * 2 * Math.PI}
                      strokeDashoffset={
                        60 * 2 * Math.PI * (1 - overallScore / 100)
                      }
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="60"
                      cx="72"
                      cy="72"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{overallScore}%</span>
                  </div>
                </div>
                <p className="mt-2 text-default-600 font-medium">
                  Overall Score
                </p>
              </div>

              <div className="md:w-2/3 space-y-4">
                <h2 className="text-xl font-semibold">Resume Health</h2>
                {sections.map((section) => (
                  <div key={section.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {section.name}
                      </span>
                      <span className="text-sm font-medium">
                        {section.score}%
                      </span>
                    </div>
                    <Progress
                      value={section.score}
                      color={getScoreColor(section.score) as any}
                      className="h-2"
                      aria-label={`${section.name} score progress`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Tabs
          aria-label="Resume analysis sections"
          selectedKey={selected}
          onSelectionChange={setSelected as any}
        >
          <Tab key="overview" title="Overview">
            <Card>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Findings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-success-50">
                      <CardBody className="p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Icon
                            icon="lucide:check-circle"
                            className="text-success"
                          />
                          <span>Strengths</span>
                        </h4>
                        <ul className="text-sm space-y-2">
                          {strengths.map((item: string, idx: number) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>

                    <Card className="bg-warning-50">
                      <CardBody className="p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Icon
                            icon="lucide:alert-triangle"
                            className="text-warning"
                          />
                          <span>Areas to Improve</span>
                        </h4>
                        <ul className="text-sm space-y-2">
                          {areasToImprove.map((item: string, idx: number) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>

                    <Card className="bg-danger-50">
                      <CardBody className="p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Icon
                            icon="lucide:x-circle"
                            className="text-danger"
                          />
                          <span>Critical Issues</span>
                        </h4>
                        <ul className="text-sm space-y-2">
                          {criticalIssues.map((item: string, idx: number) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  </div>
                </div>

                <Divider />

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Improvement Suggestions
                  </h3>
                  <div className="space-y-4">
                    {suggestions.map((category) => (
                      <div key={category.category}>
                        <h4 className="font-medium mb-2">
                          {category.category}
                        </h4>
                        <ul className="space-y-2">
                          {category.items.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Icon
                                icon="lucide:arrow-right"
                                className="text-primary mt-1"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    color="primary"
                    startContent={<Icon icon="lucide:edit-3" />}
                  >
                    Apply AI Suggestions
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Tab>

          {analysis?.keywordMatches && (
            <Tab key="keywords" title="Keyword Analysis">
              <Card>
                <CardBody className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Keyword Matches
                    </h3>
                    <p className="text-default-500 mb-4">
                      Based on job descriptions for positions, here's how your
                      resume matches up with commonly required keywords:
                    </p>
                    <div className="space-y-4">
                      {analysis.keywordMatches.map((keyword) => (
                        <div key={keyword.keyword}>
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {keyword.keyword}
                              </span>
                              <Chip
                                size="sm"
                                color={
                                  keyword.count >= keyword.recommended
                                    ? "success"
                                    : keyword.count > 0
                                    ? "warning"
                                    : "danger"
                                }
                                variant="flat"
                              >
                                {keyword.count >= keyword.recommended
                                  ? "Good"
                                  : keyword.count > 0
                                  ? "Improve"
                                  : "Missing"}
                              </Chip>
                            </div>
                            <span className="text-sm">
                              {keyword.count} / {keyword.recommended}{" "}
                              recommended
                            </span>
                          </div>
                          <Progress
                            value={(keyword.count / keyword.recommended) * 100}
                            color={
                              keyword.count >= keyword.recommended
                                ? "success"
                                : keyword.count > 0
                                ? "warning"
                                : "danger"
                            }
                            className="h-2"
                          />
                        </div>
                      ))}
                      {analysis?.suggestedKeywords?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Suggested Keywords to Add
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {analysis.suggestedKeywords.map((kw, idx) => (
                              <Chip key={idx} color="primary" variant="flat">
                                {kw}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          )}
          <Tab key="ats" title="ATS Compatibility">
            <Card>
              <CardBody className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      ATS Compatibility Score
                    </h3>
                    <Chip
                      color={
                        getScoreColor(
                          analysis?.atsCompatibilityDetails?.score ?? 0
                        ) as any
                      }
                      variant="flat"
                    >
                      {analysis?.atsCompatibilityDetails?.score ?? 0}%
                    </Chip>
                  </div>

                  <p className="text-default-500 mb-4">
                    Your resume has some issues that might prevent it from being
                    properly parsed by Applicant Tracking Systems. Here are the
                    key issues and how to fix them:
                  </p>

                  <div className="space-y-4">
                    {atsIssues.map((issue, index) => (
                      <Card key={index}>
                        <CardBody className="p-4">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Icon
                              icon="lucide:alert-circle"
                              className="text-warning"
                            />
                            <span>{issue.title}</span>
                          </h4>
                          <p className="text-sm mb-2">{issue.description}</p>
                          <div className="bg-warning-50 p-2 rounded text-sm">
                            <strong>Fix:</strong> {issue.fix}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>

                <Divider />

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    ATS-Friendly Template
                  </h3>
                  <p className="text-default-500 mb-4">
                    We can convert your resume to an ATS-friendly format while
                    preserving your content. This will significantly improve
                    your chances of getting past automated screening systems.
                  </p>

                  <div className="flex justify-center">
                    <Button
                      color="primary"
                      startContent={<Icon icon="lucide:refresh-cw" />}
                    >
                      Convert to ATS-Friendly Format
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;

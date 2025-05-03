import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Link,
  Progress,
} from "@heroui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";
import {
  uploadResumeForAnalysis,
  uploadResumeToMapProfile,
} from "../../utils/fetchResumePipeline";
const UploadResumePage: React.FC = () => {
  const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const { user, setUser } = useAuth();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [mode, setMode] = React.useState<"analyze" | "map">("analyze");

  const Navigate = useNavigate();
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);
    let progress = 10;

    const interval = setInterval(() => {
      progress += 4;
      if (progress < 90) {
        setUploadProgress(progress);
      }
    }, 300);

    try {
      let result;
      if (mode === "analyze") {
        result = await uploadResumeForAnalysis(file, user?.token);
        localStorage.setItem("resumeAnalysisResult", JSON.stringify(result));
      } else {
        result = await uploadResumeToMapProfile(file, user?.token);
        if (user) {
          setUser({
            ...user,
            profile: result.profile,
          });
        }
      }

      clearInterval(interval); 
      setUploadProgress(100); 
      setTimeout(() => {
        if (mode === "analyze") {
          Navigate("/resume/analysis");
        } else {
          Navigate("/profile");
        }
      }, 500);
    } catch (err) {
      clearInterval(interval); 
      console.error(err);
      alert("Upload failed");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Upload Your Resume</h1>
        </div>

        <Card>
          <CardBody className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Let's Analyze Your Resume
              </h2>
              <p className="text-default-500 max-w-lg mx-auto">
                Upload your resume to get AI-powered analysis and suggestions
                for improvement. We support PDF, DOCX, and TXT formats.
              </p>
            </div>

            {!file && !uploading && (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center ${
                  dragActive ? "border-primary bg-primary/10" : "border-divider"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleChange}
                />

                <Icon
                  icon="lucide:upload-cloud"
                  className={`mx-auto mb-4 ${
                    dragActive ? "text-primary" : "text-default-400"
                  }`}
                  width={64}
                  height={64}
                />

                <h3 className="text-lg font-semibold mb-2">
                  {dragActive
                    ? "Drop your file here"
                    : "Drag & drop your resume here"}
                </h3>

                <p className="text-default-500 mb-6">or</p>

                <Button
                  color="primary"
                  onPress={handleButtonClick}
                  startContent={<Icon icon="lucide:file-plus" />}
                >
                  Browse Files
                </Button>

                <p className="mt-4 text-sm text-default-400">
                  Supported formats: PDF, DOCX, TXT
                </p>
              </div>
            )}
            <div className="flex gap-4 items-center">
              <label className="font-medium">Select Mode:</label>
              <select
                className="border p-2 rounded"
                value={mode}
                onChange={(e) => setMode(e.target.value as "analyze" | "map")}
              >
                <option value="analyze">Analyze Resume</option>
                <option value="map">Map to Profile</option>
              </select>
            </div>
            {file && !uploading && (
              <div className="border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon
                        icon="lucide:file-text"
                        className="text-primary"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{file.name}</h3>
                      <p className="text-sm text-default-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={handleRemoveFile}
                  >
                    <Icon icon="lucide:trash-2" />
                  </Button>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    color="primary"
                    onPress={handleUpload}
                    startContent={<Icon icon="lucide:upload" />}
                    size="lg"
                  >
                    Upload and Analyze
                  </Button>
                </div>
              </div>
            )}

            {uploading && (
              <div className="border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon
                      icon="lucide:file-text"
                      className="text-primary"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{file?.name}</h3>
                    <Progress
                      value={uploadProgress}
                      className="mt-2"
                      color="primary"
                      showValueLabel
                      aria-label="Upload progress"
                    />
                  </div>
                </div>

                <p className="text-center text-default-500">
                  {uploadProgress < 100
                    ? "Uploading and analyzing your resume..."
                    : "Analysis complete! Redirecting..."}
                </p>
              </div>
            )}

            <div className="bg-content2 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resume Tips</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:check" className="text-success mt-1" />
                  <span>Use action verbs and quantify your achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:check" className="text-success mt-1" />
                  <span>
                    Tailor your resume to the specific job you're applying for
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:check" className="text-success mt-1" />
                  <span>
                    Keep your resume concise and focused on relevant experience
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:check" className="text-success mt-1" />
                  <span>
                    Include keywords from the job description to pass ATS
                    systems
                  </span>
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Don't have a resume yet?</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <p className="mb-4">
                  Our AI can help you create a professional resume from scratch.
                  Just answer a few questions about your experience, skills, and
                  education.
                </p>
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Icon icon="lucide:file-plus" />}
                >
                  Create Resume with AI
                </Button>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://img.heroui.chat/image/ai?w=200&h=200&u=2"
                  alt="AI Resume Creator"
                  className="rounded-lg"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default UploadResumePage;

import React, { useState } from "react";
import loadingImage from "../assets/loading.gif"; 
import StageOne from "../components/StageOne"; // Import the StageOne component
import StageTwo from "../components/StageTwo"; // Import the StageTwo component
import  FinalStage from "../components/FinalStage"; // Import the FinalStage component
import Button from "../components/Button";
import fetchResumePipeline from "../utils/fetchResumePipeline";

export default function UploadResume() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState("Frontend Developer");
  const [stage, setStage] = useState(1);
  const [data, setData] = useState(null); // State to hold the response from the pipeline
  const careers = [
    {
      title: "Frontend Developer",
      description: "Responsible for implementing visual elements that users see and interact with in a web application.",
      skills: ["React.js", "HTML/CSS", "JavaScript", "Responsive Design"]
    },
    {
      title: "Backend Developer",
      description: "Focuses on server-side logic, database management, and API integration.",
      skills: ["Node.js", "Express", "MongoDB", "REST APIs"]
    },
    {
      title: "Data Analyst",
      description: "Interprets data and turns it into information that can offer ways to improve a business.",
      skills: ["SQL", "Excel", "Python", "Data Visualization"]
    }
  ];

  const handleUpload = async () => {
    console.log ("Uploading resume...");
    setIsLoading(true);
    try {
      const resumeText = "Example resume text to send to pipeline"; 
      const data = await fetchResumePipeline(resumeText);
      setResponse(data)
      console.log("Pipeline response:", response);

      setIsUploaded(true);
    } catch (error) {
      console.error("Pipeline error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const goToStepTwo = () => setStage(2);
  const goToStepOne = () => setStage(1);
  const goToFinal = () => setStage(3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {isLoading ? (
        <div className="flex flex-col items-center">
          <img src={loadingImage} alt="Loading..." className="w-64 h-84 mb-4" />
          <p className="text-gray-600 font-medium">Analyzing your resume...</p>
        </div>
      ) : !isUploaded ? (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Upload Your Resume</h1>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <Button onClick={handleUpload} className="w-full"> 
            Upload Resume
          </Button>
          <p className="text-gray-500 text-sm mt-2">Supported formats: PDF, DOC, DOCX</p>
        </div>
      ) : stage === 1 ? (
        <StageOne
          careers={careers}
          selected={selectedCareer}
          setSelected={setSelectedCareer}
          onNext={goToStepTwo}
        />
      ) : stage === 2 ? (
        <StageTwo
          career={selectedCareer}
          onBack={goToStepOne}
          onNext={goToFinal}
        />
      ) : (
        <FinalStage />
      )}
    </div>
  );
}

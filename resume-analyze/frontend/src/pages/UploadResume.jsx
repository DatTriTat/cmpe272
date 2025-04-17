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
  const [data, setData] = useState([]); // State to hold the response from the pipeline

  const [selectedCareer, setSelectedCareer] = useState(data[0]); // Initialize with the first career from the pipeline response
  const [stage, setStage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please choose a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsLoading(true);
    try {
      const response = await fetchResumePipeline(formData);
      setData(response);
      setSelectedCareer(response[0]?.title);
      setIsUploaded(true);
    } catch (error) {
      console.error("Pipeline error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

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
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <Button onClick={handleUpload} className="w-full"> 
            Upload Resume
          </Button>
          <p className="text-gray-500 text-sm mt-2">Supported formats: PDF, DOC, DOCX</p>
        </div>
      ) : stage === 1 ? (
        <StageOne
          careers={data}
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

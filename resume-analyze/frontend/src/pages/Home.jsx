import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/agency-business-company-computer.jpg";
import { useAuth } from "../context/AuthContext";
export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate("/upload");
    } else {
      navigate("/signup");
    }
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="bg-gray-900/70 p-10 rounded-xl max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Discover Your Ideal Career</h1>
        <p className="text-lg mb-6">
          Resume Analyzer helps you analyze your resume and determine the
          best-matching domains and jobs based on your skills, experience, and
          goals.
        </p>
        <div className="w-40 mx-auto">
          <Button onClick={handleClick}>Get Started</Button>
        </div>
      </div>
    </div>
  );
}

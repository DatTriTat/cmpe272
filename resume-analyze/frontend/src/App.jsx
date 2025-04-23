import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadResume from "./pages/UploadResume";
import ProtectedRoute from "./context/ProtectedRoute";
import PublicRoute from "./context/PublicRoute";
import CareerChat from "./pages/CareerChat";
import InterviewChat from './pages/InterviewChat';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header className="bg-black text-white font-bold text-lg rounded-full px-6 py-2 mx-auto mt-4 w-fit" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          
          <Route path="/interview-chat" element={<InterviewChat />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute role="user">
                <UploadResume />
              </ProtectedRoute>
            }
          />
          <Route path="/career-chat" element={<CareerChat />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

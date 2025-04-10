import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadResume from "./pages/UploadResume";

// Giả định chưa đăng nhập (có thể thay bằng logic thực tế sau)
const isLoggedIn = false;

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header className="bg-black text-white font-bold text-lg rounded-full px-6 py-2 mx-auto mt-4 w-fit" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/upload" element={<UploadResume />}//element={isLoggedIn ? <UploadResume /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

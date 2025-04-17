import React, { useState } from "react";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  firebaseSignup,
  firebaseGoogleLogin,
} from "../utils/firebaseAuth"; 
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const token = await firebaseSignup(email, password);
      console.log("ID Token:", token);
      await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token, name  }),
      });

      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.message);
      alert("Signup failed: " + err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const token = await firebaseGoogleLogin();
      console.log("ID Token:", token);

      await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });

      alert("Google signup success!");
      navigate("/upload");
    } catch (err) {
      console.error("Google signup error:", err.message);
      alert("Google signup failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-6">Create an account</h1>
          <form onSubmit={handleSignup}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <TextField
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <TextField
              label="Repeat Password"
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="Repeat your password"
            />
            <Button>Sign Up</Button>
          </form>
          <div className="my-4 text-center text-gray-500">or</div>
          <button
            onClick={handleGoogleSignup}
            className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign up with Google
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
        <div className="flex justify-center items-center h-full w-full">
          <h2 className="text-3xl font-semibold text-center max-w-md">
            Welcome to Resume Analyzer! Let’s help you discover your ideal
            career path with AI.
          </h2>
        </div>
      </div>
    </div>
  );
}

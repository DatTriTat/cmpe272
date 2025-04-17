import React, { useState } from "react";
import { firebaseLogin, firebaseGoogleLogin } from "../utils/firebaseAuth";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const token = await firebaseLogin(email, password);
      await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      alert("Login success!");
      navigate("/upload");
    } catch (err) {
      console.error("Email login error:", err.message);
      alert("Login failed: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const token = await firebaseGoogleLogin();

      await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      alert("Google login success!");
      navigate("/upload");
    } catch (err) {
      console.error("Google login error:", err.message);
      alert("Google login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-6">Login</h1>
          <form onSubmit={handleEmailLogin}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <Button>Login</Button>
          </form>
          <div className="my-4 text-center text-gray-500">or</div>
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
        <div className="flex justify-center items-center h-full w-full">
          <h2 className="text-3xl font-semibold text-center max-w-md">
            Welcome back! Login to explore personalized career paths with AI.
          </h2>
        </div>
      </div>
    </div>
  );
}

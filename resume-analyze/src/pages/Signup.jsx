import TextField from "../components/TextField";
import Button from "../components/Button";
import { Link } from "react-router-dom"; 
export default function Signup() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-6">Create an account</h1>
          <form>
            <TextField
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <TextField
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <TextField
              label="Repeat Password"
              type="password"
              placeholder="Repeat your password"
            />
            <Button>Sign Up</Button>
          </form>
          <div className="my-4 text-center text-gray-500">or</div>
          <button className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center">
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

      {/* Right panel */}
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

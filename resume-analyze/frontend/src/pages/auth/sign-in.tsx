import React from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Link,
  Checkbox,
  Divider,
} from "@heroui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { firebaseLogin, firebaseGoogleLogin } from "../../utils/firebaseAuth";
import { verifyIdToken } from "../../utils/api";

const SignInPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await firebaseLogin(email, password);
      navigate("/profile");
    } catch (error: any) {
      console.error("Login error:", error.message);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await firebaseGoogleLogin();
      navigate("/profile");
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.log("Google sign-in popup was closed by user.");
        return; 
      } else {
        alert("Google login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardBody className="gap-4">
        <div className="flex justify-center md:hidden mb-4">
          <Link
            as={RouterLink}
            to="/"
            className="flex items-center gap-2 text-primary font-bold text-2xl"
          >
            <Icon icon="lucide:briefcase" width={32} height={32} />
            JobMatcher
          </Link>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-default-500">Sign in to continue to JobMatcher</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onValueChange={setEmail}
            startContent={
              <Icon icon="lucide:mail" className="text-default-400" />
            }
            isRequired
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onValueChange={setPassword}
            startContent={
              <Icon icon="lucide:lock" className="text-default-400" />
            }
            endContent={
              <button
                type="button"
                onClick={toggleVisibility}
                className="focus:outline-none"
              >
                {isVisible ? (
                  <Icon icon="lucide:eye-off" className="text-default-400" />
                ) : (
                  <Icon icon="lucide:eye" className="text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            isRequired
          />

          <div className="flex justify-between items-center">
            <Checkbox
              isSelected={rememberMe}
              onValueChange={setRememberMe}
              size="sm"
            >
              Remember me
            </Checkbox>
            <Link href="#" size="sm">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" color="primary" fullWidth>
            Sign In
          </Button>
        </form>

        <div className="flex items-center gap-4 my-4">
          <Divider className="flex-1" />
          <p className="text-default-500 text-sm">OR CONTINUE WITH</p>
          <Divider className="flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="bordered"
            startContent={<Icon icon="logos:google-icon" />}
            fullWidth
            onPress={handleGoogleLogin}
          >
            Google
          </Button>
          <Button
            variant="bordered"
            startContent={<Icon icon="logos:linkedin-icon" />}
            fullWidth
          >
            LinkedIn
          </Button>
        </div>

        <p className="text-center text-default-500 mt-4">
          Don't have an account?{" "}
          <Link as={RouterLink} to="/sign-up">
            Sign Up
          </Link>
        </p>
      </CardBody>
    </Card>
  );
};

export default SignInPage;

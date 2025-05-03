import React from 'react';
import { Link } from '@heroui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand/Logo */}
      <div className="hidden md:flex md:w-1/2 bg-primary flex-col justify-center items-center p-8 text-white">
        <div className="max-w-md">
          <Link as={RouterLink} to="/" className="flex items-center gap-2 text-white font-bold text-2xl mb-8">
            <Icon icon="lucide:briefcase" width={32} height={32} />
            JobMatcher
          </Link>
          <h1 className="text-4xl font-bold mb-4">Accelerate Your Career Journey</h1>
          <p className="text-xl opacity-90 mb-8">
            Use AI-powered tools to match with your dream job, practice interviews, and optimize your resume.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">93%</div>
              <div className="text-sm opacity-80">Interview success rate</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm opacity-80">Jobs matched</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">85%</div>
              <div className="text-sm opacity-80">Resume improvement</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-80">AI assistance</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth form */}
      <div className="flex-1 flex justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
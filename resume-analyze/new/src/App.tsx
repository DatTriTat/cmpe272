import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@heroui/react';

// Pages
import LandingPage from './pages/landing';
import SignUpPage from './pages/auth/sign-up';
import SignInPage from './pages/auth/sign-in';
import UserProfilePage from './pages/profile';
import AIChatInterviewPage from './pages/interview/chat-interview';
import UploadResumePage from './pages/resume/upload';
import ResumeAnalysisPage from './pages/resume/analysis';
import DashboardPage from './pages/dashboard';
import JobsPage from './pages/jobs';
import JobSuggestionPage from './pages/jobs/suggestions';
import CareerPathsPage from './pages/career-paths';
import CareerDetailsPage from './pages/career-paths/career-details';

// Layouts
import MainLayout from './layouts/main-layout';
import AuthLayout from './layouts/auth-layout';
import DashboardLayout from './layouts/dashboard-layout';

// Contexts
import ProtectedRoute from './context/ProtectedRoute';
import PublicRoute from './context/PublicRoute';

const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider placement="top-center" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <MainLayout>
            <LandingPage />
          </MainLayout>
        } />

        {/* Auth routes */}
        <Route path="/sign-up" element={
          <PublicRoute>
            <AuthLayout>
              <SignUpPage />
            </AuthLayout>
          </PublicRoute>
        } />
        <Route path="/sign-in" element={
          <PublicRoute>
            <AuthLayout>
              <SignInPage />
            </AuthLayout>
          </PublicRoute>
        } />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <DashboardLayout>
              <JobsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <UserProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/interview/chat" element={
          <ProtectedRoute>
            <DashboardLayout>
              <AIChatInterviewPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/resume/upload" element={
          <ProtectedRoute>
            <DashboardLayout>
              <UploadResumePage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/resume/analysis" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResumeAnalysisPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/jobs/suggestions" element={
          <ProtectedRoute>
            <DashboardLayout>
              <JobSuggestionPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/career-paths" element={
          <ProtectedRoute>
            <DashboardLayout>
              <CareerPathsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/career-paths/:id" element={
          <ProtectedRoute>
            <DashboardLayout>
              <CareerDetailsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;

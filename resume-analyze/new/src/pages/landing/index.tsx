import React from 'react';
import { Button, Card, CardBody, Divider } from '@heroui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import FeatureCard from '../../components/feature-card';
import TestimonialCard from '../../components/testimonial-card';

const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Dream Job with AI-Powered Matching
              </h1>
              <p className="text-xl text-default-700 mb-8">
                JobMatcher uses advanced AI to match your skills with the perfect job, prepare you for interviews, and optimize your resume.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  as={RouterLink} 
                  to="/sign-up" 
                  color="primary" 
                  size="lg"
                  startContent={<Icon icon="lucide:user-plus" />}
                >
                  Get Started
                </Button>
                <Button 
                  as={RouterLink} 
                  to="#how-it-works" 
                  variant="flat" 
                  size="lg"
                  startContent={<Icon icon="lucide:play" />}
                >
                  How It Works
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://img.heroui.chat/image/dashboard?w=600&h=400&u=1" 
                alt="JobMatcher Dashboard" 
                className="rounded-xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              Our AI-powered platform helps you at every step of your job search journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="lucide:target"
              title="Smart Job Matching"
              description="Our AI analyzes your skills, experience, and preferences to find the perfect job matches for you."
            />
            <FeatureCard 
              icon="lucide:message-circle"
              title="AI Interview Practice"
              description="Practice with our AI interviewer that simulates real interview scenarios and provides feedback."
            />
            <FeatureCard 
              icon="lucide:file-text"
              title="Resume Optimization"
              description="Get personalized suggestions to improve your resume and increase your chances of getting noticed."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-content2">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              A simple process to boost your career opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
              <p className="text-default-600">Sign up and create your professional profile with your skills and experience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
              <p className="text-default-600">Upload your resume and get AI-powered analysis and optimization suggestions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Practice Interviews</h3>
              <p className="text-default-600">Practice with our AI interviewer to improve your interview skills.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-default-600">Receive personalized job matches based on your profile and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              See how JobMatcher has helped professionals land their dream jobs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah Johnson"
              role="Software Engineer"
              company="Tech Innovations Inc."
              image="https://img.heroui.chat/image/avatar?w=200&h=200&u=2"
              quote="JobMatcher helped me prepare for technical interviews with its AI practice sessions. I landed a job at my dream company within a month!"
            />
            <TestimonialCard 
              name="Michael Chen"
              role="Marketing Manager"
              company="Global Brands"
              image="https://img.heroui.chat/image/avatar?w=200&h=200&u=3"
              quote="The resume analysis tool pointed out key improvements that made my resume stand out. I received 3x more interview calls after using JobMatcher."
            />
            <TestimonialCard 
              name="Emily Rodriguez"
              role="UX Designer"
              company="Creative Solutions"
              image="https://img.heroui.chat/image/avatar?w=200&h=200&u=4"
              quote="The job matching algorithm is incredibly accurate. It connected me with opportunities that perfectly matched my skills and career goals."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals who have found their dream jobs with JobMatcher.
          </p>
          <Button 
            as={RouterLink} 
            to="/sign-up" 
            color="default" 
            size="lg"
            variant="solid"
          >
            Get Started for Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
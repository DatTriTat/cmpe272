import React from 'react';
import { Card, CardBody, CardHeader, Button, Tabs, Tab, Progress, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

const AIInterviewPracticePage: React.FC = () => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selected, setSelected] = React.useState("preparation");
  const [feedback, setFeedback] = React.useState<string | null>(null);
  
  const questions = [
    "Tell me about yourself and your background in software development.",
    "What experience do you have with React and its ecosystem?",
    "Can you describe a challenging project you worked on and how you solved the problems?",
    "How do you approach testing in your projects?",
    "What's your experience with state management in React applications?"
  ];
  
  const handleStartRecording = () => {
    setIsRecording(true);
    setFeedback(null);
    
    setTimeout(() => {
      setIsRecording(false);
      setFeedback("Your answer was clear and concise. You effectively highlighted your experience with React hooks and component architecture. Consider providing more specific examples of projects where you've implemented these concepts. Your body language was confident, but try to maintain more consistent eye contact with the camera.");
    }, 10000);
  };
  
  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
    setFeedback(null);
  };
  
  const handlePreviousQuestion = () => {
    setCurrentQuestion((prev) => (prev - 1 + questions.length) % questions.length);
    setFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Interview Practice</h1>
          <Chip color="primary">React Developer Position</Chip>
        </div>
        
        <Tabs 
          aria-label="Interview practice sections" 
          selectedKey={selected} 
          onSelectionChange={setSelected as any}
        >
          <Tab key="preparation" title="Preparation">
            <Card>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Interview Tips</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:check-circle" className="text-success mt-1" />
                      <span>Find a quiet space with good lighting and minimal background distractions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:check-circle" className="text-success mt-1" />
                      <span>Test your camera and microphone before starting the practice session.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:check-circle" className="text-success mt-1" />
                      <span>Dress professionally as you would for an actual interview.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:check-circle" className="text-success mt-1" />
                      <span>Prepare examples of your past work and achievements to reference in your answers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="lucide:check-circle" className="text-success mt-1" />
                      <span>Practice the STAR method (Situation, Task, Action, Result) for behavioral questions.</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">What to Expect</h3>
                  <p className="mb-4">
                    This practice session will simulate a real interview for a React Developer position. You'll be presented with common interview questions, and you can record your responses. Our AI will analyze your answers and provide feedback on:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardBody className="text-center p-4">
                        <Icon icon="lucide:message-square" className="text-primary mx-auto mb-2" width={24} height={24} />
                        <h4 className="font-semibold">Content</h4>
                        <p className="text-sm text-default-500">Clarity, relevance, and structure of your answers</p>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody className="text-center p-4">
                        <Icon icon="lucide:mic" className="text-primary mx-auto mb-2" width={24} height={24} />
                        <h4 className="font-semibold">Delivery</h4>
                        <p className="text-sm text-default-500">Tone, pace, and vocal clarity</p>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody className="text-center p-4">
                        <Icon icon="lucide:video" className="text-primary mx-auto mb-2" width={24} height={24} />
                        <h4 className="font-semibold">Body Language</h4>
                        <p className="text-sm text-default-500">Eye contact, posture, and gestures</p>
                      </CardBody>
                    </Card>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    color="primary" 
                    size="lg"
                    onPress={() => setSelected("practice")}
                    startContent={<Icon icon="lucide:play" />}
                  >
                    Start Practice Session
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Tab>
          
          <Tab key="practice" title="Practice Session">
            <Card>
              <CardHeader className="border-b border-divider">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Question {currentQuestion + 1} of {questions.length}</h3>
                    <div className="flex gap-2">
                      <Button 
                        isIconOnly 
                        variant="flat" 
                        onPress={handlePreviousQuestion}
                        isDisabled={currentQuestion === 0}
                      >
                        <Icon icon="lucide:chevron-left" />
                      </Button>
                      <Button 
                        isIconOnly 
                        variant="flat" 
                        onPress={handleNextQuestion}
                        isDisabled={currentQuestion === questions.length - 1}
                      >
                        <Icon icon="lucide:chevron-right" />
                      </Button>
                    </div>
                  </div>
                  <Progress 
                    value={(currentQuestion + 1) * (100 / questions.length)} 
                    className="mb-2" 
                    color="primary"
                  />
                </div>
              </CardHeader>
              
              <CardBody>
                <div className="space-y-6">
                  <div className="bg-content2 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Question:</h4>
                    <p className="text-lg">{questions[currentQuestion]}</p>
                  </div>
                  
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative">
                    {!isRecording ? (
                      <div className="text-center">
                        <Icon icon="lucide:video" className="text-white/70 mx-auto mb-2" width={48} height={48} />
                        <p className="text-white/70">Your camera preview will appear here</p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-danger/20 p-2 rounded-full animate-pulse">
                          <Icon icon="lucide:record" className="text-danger" width={24} height={24} />
                        </div>
                      </div>
                    )}
                    
                    {isRecording && (
                      <div className="absolute bottom-4 right-4 bg-danger text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <span className="animate-pulse">●</span> Recording
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center">
                    {!isRecording ? (
                      <Button 
                        color="primary" 
                        onPress={handleStartRecording}
                        startContent={<Icon icon="lucide:mic" />}
                        size="lg"
                      >
                        Start Recording
                      </Button>
                    ) : (
                      <Button 
                        color="danger" 
                        onPress={() => setIsRecording(false)}
                        startContent={<Icon icon="lucide:square" />}
                        size="lg"
                      >
                        Stop Recording
                      </Button>
                    )}
                  </div>
                  
                  {feedback && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">AI Feedback:</h4>
                      <Card className="bg-content2">
                        <CardBody>
                          <p>{feedback}</p>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Tab>
          
          <Tab key="history" title="Practice History">
            <Card>
              <CardBody>
                <div className="text-center py-8">
                  <Icon icon="lucide:history" className="mx-auto mb-4 text-default-400" width={48} height={48} />
                  <h3 className="text-xl font-semibold mb-2">No Practice Sessions Yet</h3>
                  <p className="text-default-500 mb-6">
                    Complete practice sessions to see your history and track your improvement over time.
                  </p>
                  <Button 
                    color="primary" 
                    onPress={() => setSelected("practice")}
                  >
                    Start Your First Practice
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AIInterviewPracticePage;
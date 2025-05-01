import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Progress,
  Chip,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { getFirstQuestion, getNextQuestion, getFeedback } from "../../utils/api"; 
const AIInterviewPracticePage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selected, setSelected] = React.useState("preparation");
  const [inputValue, setInputValue] = React.useState("");
  const [responseHistory, setResponseHistory] = React.useState<string[]>([]);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isInputDisabled, setIsInputDisabled] = React.useState(false);
  const [question, setQuestion] = React.useState<string | null>(null);
  const [role] = React.useState("React Developer"); // hoặc nhận từ props/context
  const [previousQuestion, setPreviousQuestion] = React.useState<string | null>(
    null
  );

  const questions = [
    "Tell me about yourself and your background in software development.",
    "What experience do you have with React and its ecosystem?",
    "Can you describe a challenging project you worked on and how you solved the problems?",
    "How do you approach testing in your projects?",
    "What's your experience with state management in React applications?",
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !question) return;
  
    setResponseHistory([...responseHistory, inputValue]);
    setInputValue("");
    setIsInputDisabled(true);
  
    const aiFeedback = await getFeedback(role, question, inputValue);
    setFeedback(aiFeedback);
  };
  

  const handleNextQuestion = async () => {
    if (!question || responseHistory.length === 0) return;
  
    const latestAnswer = responseHistory[responseHistory.length - 1];
    const next = await getNextQuestion(role, question, latestAnswer);
  
    setPreviousQuestion(question); 
    setQuestion(next);
    setResponseHistory([]);
    setFeedback(null);
    setIsInputDisabled(false);
  };
  

  const handlePreviousQuestion = () => {
    setCurrentQuestion(
      (prev) => (prev - 1 + questions.length) % questions.length
    );
    setResponseHistory([]);
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
                    {[
                      "Find a quiet space with good lighting and minimal background distractions.",
                      "Test your camera and microphone before starting the practice session.",
                      "Dress professionally as you would for an actual interview.",
                      "Prepare examples of your past work and achievements to reference in your answers.",
                      "Practice the STAR method (Situation, Task, Action, Result) for behavioral questions.",
                    ].map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon
                          icon="lucide:check-circle"
                          className="text-success mt-1"
                        />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">What to Expect</h3>
                  <p className="mb-4">
                    This practice session will simulate a real interview for a
                    React Developer position. You'll be presented with common
                    interview questions, and you can type your responses. Our AI
                    will analyze your answers and provide feedback on:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: "lucide:message-square",
                        title: "Content",
                        desc: "Clarity, relevance, and structure of your answers",
                      },
                      {
                        icon: "lucide:mic",
                        title: "Delivery",
                        desc: "Tone, pace, and clarity of written expression",
                      },
                      {
                        icon: "lucide:video",
                        title: "Structure",
                        desc: "Logical flow and completeness of your thoughts",
                      },
                    ].map((item, idx) => (
                      <Card key={idx}>
                        <CardBody className="text-center p-4">
                          <Icon
                            icon={item.icon}
                            className="text-primary mx-auto mb-2"
                            width={24}
                            height={24}
                          />
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-default-500">
                            {item.desc}
                          </p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    color="primary"
                    size="lg"
                    onPress={async () => {
                      const first = await getFirstQuestion(role);
                      setQuestion(first);
                      setPreviousQuestion(first);
                      setSelected("practice");
                    }}
                    startContent={<Icon icon="lucide:play" />}
                  />
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="practice" title="Practice Session">
            <Card>
              <CardHeader className="border-b border-divider">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      Question {currentQuestion + 1} of {questions.length}
                    </h3>
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
                    <p className="text-lg">{question}</p>
                    </div>

                  <div className="space-y-2">
                    {responseHistory.map((resp, idx) => (
                      <div
                        key={idx}
                        className="bg-default-100 p-3 rounded-md text-sm"
                      >
                        <strong>Your response:</strong> {resp}
                      </div>
                    ))}

                    <Input
                      fullWidth
                      placeholder="Type your response..."
                      value={inputValue}
                      onValueChange={setInputValue}
                      isDisabled={isInputDisabled}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                      }}
                      endContent={
                        <Button
                          isIconOnly
                          color="primary"
                          variant="light"
                          onPress={handleSendMessage}
                          isDisabled={!inputValue.trim() || isInputDisabled}
                        >
                          <Icon icon="lucide:send" />
                        </Button>
                      }
                    />
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
                  <Icon
                    icon="lucide:history"
                    className="mx-auto mb-4 text-default-400"
                    width={48}
                    height={48}
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    No Practice Sessions Yet
                  </h3>
                  <p className="text-default-500 mb-6">
                    Complete practice sessions to see your history and track
                    your improvement over time.
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

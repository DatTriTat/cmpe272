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
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  getFirstQuestion,
  getNextQuestion,
  getFeedback,
  saveInterviewSession,
  getStarQuestion,  
} from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { getInterviewHistory } from "../../utils/api";

const AIInterviewPracticePage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selected, setSelected] = React.useState("preparation");
  const [inputValue, setInputValue] = React.useState("");
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isInputDisabled, setIsInputDisabled] = React.useState(false);
  const [question, setQuestion] = React.useState<string | null>(null);
  const [role, setRole] = React.useState("");
  //getStarQuestion state
  const [starQuestion, setStarQuestion] = React.useState<string | null>(null);
  const [previousQuestion, setPreviousQuestion] = React.useState<string | null>(
    null
  );
  const [tempRole, setTempRole] = React.useState("");
  const [questions, setQuestions] = React.useState<
    { question: string; answer: string; feedback: string }[]
  >([]);
  const totalQuestions = 6;
  const [history, setHistory] = React.useState<any[]>([]);
  const { user, setUser } = useAuth();
  const [viewingHistorySession, setViewingHistorySession] =
    React.useState<null | {
      role: string;
      questions: { question: string; answer: string; feedback: string }[];
    }>(null);
  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!user) return;
        const res = await getInterviewHistory(user?.token);
        setHistory(res.sessions);
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    if (selected === "history") {
      fetchHistory();
    }
  }, [selected]);

  const handleSendMessage = async () => {
    const currentQ = questions[currentQuestion];
    if (!inputValue.trim() || !currentQ?.question) return;

    setIsInputDisabled(true);

    const aiFeedback = await getFeedback(role, currentQ.question, inputValue);
    setInputValue("");
    setFeedback(aiFeedback);
    console.log(questions);
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      answer: inputValue,
      feedback: aiFeedback,
    };
    const allAnswered =
      updatedQuestions.length === totalQuestions &&
      updatedQuestions.every((q) => q.answer.trim() !== "");
    if (allAnswered) {
      try {
        if (!user?.token) throw new Error("Missing Firebase token");

        await saveInterviewSession(role, updatedQuestions, user?.token);
      } catch (err) {
        console.error("Failed to save session:", err);
      }
    }
    setQuestions(updatedQuestions);
    console.log("Updated questions:", updatedQuestions);
  };

  const handleNextQuestion = async () => {
    const nextIndex = currentQuestion + 1;
    let nextQ;
    if (nextIndex < questions.length) {
      setCurrentQuestion(nextIndex);
      setInputValue("");
      setFeedback(questions[nextIndex].feedback || null);
      setIsInputDisabled(!!questions[nextIndex].answer);
      return;
    }

    if (questions.length >= totalQuestions) return;

    const current = questions[currentQuestion];
    if (!current?.answer || current.answer.trim() === "") {
      return;
    }
    if (questions.length === totalQuestions - 1) {
      nextQ = await getStarQuestion(role, current.question, current.answer);
    }
    else{
      nextQ = await getNextQuestion(role, current.question, current.answer);
    }
    // Check if we are at the last question and need to get a STAR question

   
    
    setQuestions((prev) => [
      ...prev,
      { question: nextQ, answer: "", feedback: "" },
    ]);
    setCurrentQuestion(nextIndex);
    setInputValue("");
    setFeedback(null);
    setIsInputDisabled(false);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion === 0) return;
    const newIndex = currentQuestion - 1;
    setCurrentQuestion(newIndex);
    setInputValue("");
    setFeedback(questions[newIndex].feedback);
    setIsInputDisabled(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Interview Practice</h1>
          {role && selected === "practice" && (
            <Chip color="primary">{role}</Chip>
          )}
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
                      "Choose a distraction-free space where you can focus and type comfortably.",
                      "Use proper grammar and avoid slang or overly casual language.",
                      "You might need to reference past projects, skills, or experiences.",
                      "Have a few strong stories ready using the STAR method (Situation, Task, Action, Result).",
                      "Think before you type — clarity and thoughtfulness matter more than speed.",
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
                    position. You'll be presented with common interview
                    questions, and you can type your responses. Our AI will
                    analyze your answers and provide feedback on:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: "lucide:message-square",
                        title: "Content",
                        desc: "Clarity, relevance, and structure of your answers",
                      },
                      {
                        icon: "lucide:pen-line",
                        title: "Clarity",
                        desc: "Grammar, tone, and how clearly you express ideas",
                      },
                      {
                        icon: "lucide:blocks",
                        title: "Structure",
                        desc: "Logical flow and completeness of your response",
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

                <div className="flex flex-col items-center gap-4 w-full">
                  <Input
                    fullWidth
                    placeholder="Role (e.g., React Developer):"
                    value={tempRole}
                    onValueChange={setTempRole}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <div>
                    <Button
                      color="primary"
                      size="lg"
                      onPress={async () => {
                        setRole(tempRole);
                        setCurrentQuestion(0);
                        setIsInputDisabled(false);
                        const first = await getFirstQuestion(tempRole);
                        setQuestion(first);
                        setPreviousQuestion(first);
                        setSelected("practice");
                        setQuestions([
                          { question: first, answer: "", feedback: "" },
                        ]);
                      }}
                      startContent={<Icon icon="lucide:play" />}
                    >
                      Start Practice Session
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="practice"
            title="Practice Session"
            isDisabled={!role.trim()}
          >
            <Card>
              <CardHeader className="border-b border-divider">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      Question {currentQuestion + 1} of {totalQuestions}
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
                        isDisabled={
                          !questions[currentQuestion]?.answer.trim() ||
                          (currentQuestion >= questions.length - 1 &&
                            questions.length >= totalQuestions)
                        }
                      >
                        <Icon icon="lucide:chevron-right" />
                      </Button>
                    </div>
                  </div>
                  <Progress
                    value={(currentQuestion + 1) * (100 / totalQuestions)}
                    className="mb-2"
                    color="primary"
                  />
                </div>
              </CardHeader>

              <CardBody>
                <div className="space-y-6">
                  <div className="bg-content2 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Question:</h4>
                    <p className="text-lg">
                      {questions[currentQuestion]?.question}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {questions[currentQuestion]?.answer && (
                      <div className="bg-default-100 p-3 rounded-md text-sm">
                        <strong>Your response:</strong>{" "}
                        {questions[currentQuestion].answer}
                      </div>
                    )}

                    <Textarea
                      fullWidth
                      minRows={1}
                      maxRows={10}
                      placeholder="Type your response..."
                      value={inputValue}
                      onValueChange={setInputValue}
                      isDisabled={isInputDisabled}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
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

                  {questions[currentQuestion]?.feedback && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">AI Feedback:</h4>
                      <Card className="bg-content2">
                        <CardBody>
                          <p>{questions[currentQuestion].feedback}</p>{" "}
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
                {history.length === 0 ? (
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
                      onPress={() => setSelected("preparation")}
                    >
                      Start Your First Practice
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((session) => (
                      <div key={session._id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold">{session.role}</h4>
                        <p className="text-sm text-default-500">
                          {new Date(session.createdAt).toLocaleString()} —{" "}
                          {session.questions.length} questions
                        </p>
                        <Button
                          className="mt-2"
                          color="primary"
                          onPress={() => {
                            setViewingHistorySession({
                              role: session.role,
                              questions: session.questions,
                            });
                            setRole(session.role);
                            setSelected("practice");
                            setCurrentQuestion(0);
                            setIsInputDisabled(true);
                            setQuestions(session.questions);
                            setFeedback(session.questions[0]?.feedback || null);
                            setInputValue("");
                          }}
                        >
                          View Session
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AIInterviewPracticePage;

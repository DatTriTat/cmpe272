import React from 'react';
import { Card, CardBody, CardHeader, Button, Input, Avatar, Divider, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIChatInterviewPage: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: 'Hello! I\'m your AI interviewer for today. We\'ll be discussing your experience with React development. Let\'s start with a simple question: Can you tell me about a challenging React project you\'ve worked on recently?',
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "That's interesting! Can you elaborate on how you handled the state management in that project?",
        "Great explanation. What were some of the challenges you faced during implementation?",
        "I see. How did you ensure the performance of your React components?",
        "Interesting approach. How would you improve the architecture if you had to rebuild it today?",
        "Thanks for sharing. Let's move on to another question. How do you stay updated with the latest React trends and best practices?"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: randomResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader className="border-b border-divider">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <Avatar
                src="https://img.heroui.chat/image/ai?w=200&h=200&u=1"
                className="w-10 h-10"
              />
              <div>
                <h2 className="text-lg font-semibold">AI Interviewer</h2>
                <p className="text-default-500 text-sm">React Developer Position</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                isIconOnly 
                variant="light" 
                aria-label="Settings"
              >
                <Icon icon="lucide:settings" />
              </Button>
              <Button 
                isIconOnly 
                variant="light" 
                aria-label="End Interview"
                color="danger"
              >
                <Icon icon="lucide:phone-off" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`chat-bubble ${
                    message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                  }`}
                >
                  {message.content}
                  <div 
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-default-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chat-bubble chat-bubble-ai flex items-center gap-2">
                  <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-4 border-t border-divider">
            <div className="flex gap-2">
              <Input
                fullWidth
                placeholder="Type your response..."
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={handleKeyPress}
                endContent={
                  <Button 
                    isIconOnly 
                    color="primary" 
                    variant="light" 
                    onPress={handleSendMessage}
                    isDisabled={!inputValue.trim() || isLoading}
                  >
                    <Icon icon="lucide:send" />
                  </Button>
                }
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-default-500">
              <span>Press Enter to send</span>
              <span>Shift + Enter for new line</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AIChatInterviewPage;
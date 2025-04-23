import React, { useState } from 'react';

const InterviewChat = () => {
  const [jobTitle, setJobTitle] = useState('Software Engineer at Google');
  const [chatLog, setChatLog] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedLog = [...chatLog, { sender: 'user', text: input }];
    setChatLog(updatedLog);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_title: jobTitle, user_response: input })
      });

      const data = await response.json();
      setChatLog([...updatedLog, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setChatLog([...updatedLog, { sender: 'ai', text: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-4">Interview Chat Simulator</h1>

      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full p-2 border rounded mb-6"
        placeholder="Enter job title (e.g. Data Analyst at Meta)"
      />

      <div className="border rounded p-4 h-96 overflow-y-scroll bg-gray-50 mb-4">
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type your response..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default InterviewChat;
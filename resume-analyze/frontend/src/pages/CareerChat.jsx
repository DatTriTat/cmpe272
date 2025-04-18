import React, { useState } from 'react';
import '../index.css';

const CareerChat = () => {
  const [suggestions, setSuggestions] = useState([
    'Data Analyst',
    'Cybersecurity Consultant',
    'Project Manager',
    'Software Developer'
  ]);

  const [selected, setSelected] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalChoice = customInput.trim() || selected;
    if (finalChoice) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Career Guidance Chat</h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <p className="mb-2 text-lg">Choose a suggested career:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((career, index) => (
                <button
                  key={index}
                  type="button"
                  className={`border p-3 rounded-xl text-left shadow hover:bg-gray-100 ${selected === career ? 'border-blue-500 bg-blue-50' : ''}`}
                  onClick={() => setSelected(career)}
                >
                  {career}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg mb-2">Or type your own:</label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full border px-4 py-2 rounded-md shadow"
              placeholder="Enter another career..."
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700">
            Submit Career Choice
          </button>
        </form>
      ) : (
        <div className="mt-6 text-xl font-semibold text-green-700">
          ✅ Career Selected: {customInput || selected}
        </div>
      )}
    </div>
  );
};

export default CareerChat;

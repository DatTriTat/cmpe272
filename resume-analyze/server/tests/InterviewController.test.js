import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getFirstQuestion,
  getFeedback,
  saveInterview,
  getNextQuestion
} from '../controllers/interviewController.js';
import { saveInterviewService } from '../services/interviewService.js';
import {
  generateFirstQuestion,
  generateFeedback,
  generateFollowupQuestion
} from '../services/langchainService.js';

vi.mock('../services/langchainService.js', () => ({
  generateFirstQuestion: vi.fn(() => Promise.resolve("What’s your experience with SQL?")),
  generateFeedback: vi.fn(() => Promise.resolve("Strong response with real project examples.")),
  generateFollowupQuestion: vi.fn(() => Promise.resolve("How did you overcome that?"))
}));

vi.mock('../services/interviewService.js', () => ({
  saveInterviewService: vi.fn(() => Promise.resolve({ _id: 'mock123' }))
}));

describe('Interview Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, user: { uid: "test123" } };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  it('getFirstQuestion should return 400 if role is missing', async () => {
    await getFirstQuestion(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('getFirstQuestion should return question if role is provided', async () => {
    req.body.role = "Data Analyst";
    await getFirstQuestion(req, res);
    expect(res.json).toHaveBeenCalledWith({ question: "What’s your experience with SQL?" });
  });

  it('getFeedback should return 400 if role/question/answer is missing', async () => {
    await getFeedback(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('getFeedback should return feedback if inputs are valid', async () => {
    req.body = {
      role: "DevOps Engineer",
      question: "Tell me about a deployment challenge",
      answer: "We had a rollback issue in Jenkins..."
    };
    await getFeedback(req, res);
    expect(res.json).toHaveBeenCalledWith({
      feedback: "Strong response with real project examples."
    });
  });

  it('saveInterview should return 400 for invalid data', async () => {
    req.body = {}; // missing role/questions
    await saveInterview(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid data" });
  });

  it('saveInterview should return session if valid input provided', async () => {
    req.body = {
      role: "DevOps Engineer",
      questions: [{ question: "Q1", answer: "A1", feedback: "Good" }]
    };
    await saveInterview(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Session saved",
      session: { _id: 'mock123' }
    });
  });

  it('getNextQuestion should return 400 if required fields are missing', async () => {
    req.body = { role: "Analyst" }; // missing question/answer
    await getNextQuestion(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

import {
  generateFollowupQuestion,
  generateFeedback,
  generateFirstQuestion,
  generateInterviewQuestions,
} from "../services/langchainService.js";
import {saveInterviewService,} from "../services/interviewService.js";
import InterviewSession from "../models/interviewSessionSchema.js";

export async function getInterviewQuestions(req, res) {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: "Missing required field: role" });
    }

    const questions = await generateInterviewQuestions(role);

    res.status(200).json({ questions });
  } catch (err) {
    console.error("Error generating full interview questions:", err);
    res.status(500).json({ error: "Failed to generate questions" });
  }
}

export async function getNextQuestion(req, res) {
  try {
    const { role, previousQuestion, previousAnswer } = req.body;

    if (!role || !previousAnswer || !previousQuestion) {
      return res.status(400).json({
        error:
          "Missing required fields: role, previousQuestion, previousAnswer",
      });
    }

    const question = await generateFollowupQuestion(
      role,
      previousQuestion,
      previousAnswer
    );
    res.json({ question });
  } catch (err) {
    console.error("Error generating follow-up question:", err);
    res.status(500).json({ error: "Failed to generate question" });
  }
}

// POST /api/interview/feedback
export async function getFeedback(req, res) {
  try {
    const { role, question, answer } = req.body;

    if (!role || !question || !answer) {
      return res
        .status(400)
        .json({ error: "Missing required fields: role, question, answer" });
    }

    const feedback = await generateFeedback(role, question, answer);
    res.json({ feedback });
  } catch (err) {
    console.error("Error generating feedback:", err);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
}
export async function getFirstQuestion(req, res) {

  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: "Missing required field: role" });
    }

    const question = await generateFirstQuestion(role);
    res.json({ question });
  } catch (err) {
    console.error("Error generating first question:", err);
    res.status(500).json({ error: "Failed to generate first question" });
  }
}


export async function saveInterview(req, res) {
  try {
    const { role, questions } = req.body;
    const uid = req.user.uid;

    if (!role || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const session = await saveInterviewService({
      uid,
      role,
      questions,
    });

    res.status(200).json({ message: "Session saved", session });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


export async function getInterviewHistory(req, res) {
  try {
    const { uid } = req.user;

    const sessions = await InterviewSession.find({ uid }).sort({ createdAt: -1 });

    res.status(200).json({ sessions });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

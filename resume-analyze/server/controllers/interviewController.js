import {
  generateFollowupQuestion,
  generateFeedback,
  generateFirstQuestion,
  generateInterviewQuestions,
  generateStarQuestion,
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
// will be used to generate a STAR question for the user
// will be called atleast once in the interview process
// POST /api/interview/star
export async function getStarQuestion(req, res) {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: "Missing required field: role" });
    }

    const question = await generateStarQuestion(role);
    res.status(200).json({ question });
  } catch (err) {
    console.error("Error generating STAR question:", err);
    res.status(500).json({ error: "Failed to generate STAR question" });
  }
}
// POST /api/interview/next-question
// Generates a follow-up question based on the candidate's previous answer
// This is used to continue the interview process and keep it dynamic
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
// Generates feedback for a given question and answer
// This is used to provide the candidate with insights on their performance
// and areas for improvement
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
// POST /api/interview/first-question
// Generates the first question for a specific role
// This is the starting point of the interview process
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

import {
  generateFollowupQuestion,
  generateFeedback,
  generateFirstQuestion,

} from "../services/langchainService.js";

// POST /api/interview/next-question
export async function getNextQuestion(req, res) {
  try {
    const { role, previousQuestion, previousAnswer } = req.body;

    if (!role || !previousAnswer || !previousQuestion) {
      return res
        .status(400)
        .json({
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
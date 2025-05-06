import express from "express";
import {
  getNextQuestion,        // Generates a follow-up question based on the candidate's previous answer
  getFeedback,            // Returns feedback for a given question and candidate answer
  getFirstQuestion,       // Starts an interview with an initial role-based question
  getInterviewQuestions,  // Generates a complete 10-question structured interview flow
  saveInterview,          // Saves the interview session with user's role and question history
  getInterviewHistory,    // Retrieves all past interview sessions for the authenticated user
  getStarQuestion,       // Retrieves a star question for the user
} from "../controllers/interviewController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
const router = express.Router();

// POST 
// Generate the next question based on previous question and answer
router.post("/next-question", getNextQuestion);
// POST
// Generate feedback for a given question and answer
router.post("/feedback", getFeedback);
// POST
// Generate the first question for a specific role
// This is the starting point of the interview process
router.post("/first-question", getFirstQuestion);
// POST
// Generate a complete interview flow for a specific role, get the users experience and relevant context in the 
// form of skills and projects.
// This is useful for preparing a structured interview session
router.post("/interview/questions", getInterviewQuestions);
// POST
// Save the interview session with user's role and question history
// This allows users to keep track of their interview progress and review past sessions
router.post("/save", checkAuth, checkRole("user"), saveInterview);
// POST
//  Get a star question for the user
router.post("/star", getStarQuestion);
// GET
// Retrieve all past interview sessions for the authenticated user
// This is useful for users to review their interview history and progress

router.get(
  "/interview-history",
  checkAuth,
  checkRole("user"),
  getInterviewHistory
);

export default router;

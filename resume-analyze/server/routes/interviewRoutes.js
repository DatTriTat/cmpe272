import express from "express";
import {
  getFirstQuestion,
  getNextQuestion,
  getFeedback,
  saveInterview,
  getInterviewHistory,
} from "../controllers/interviewController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
const router = express.Router();

router.post("/next-question", getNextQuestion);
router.post("/feedback", getFeedback);
router.post("/first-question", getFirstQuestion);
router.post("/save", checkAuth, checkRole("user"), saveInterview);
router.get(
  "/interview-history",
  checkAuth,
  checkRole("user"),
  getInterviewHistory
);

export default router;

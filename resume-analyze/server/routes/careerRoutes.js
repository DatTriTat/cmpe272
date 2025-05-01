import express from "express";
import multer from "multer";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { getCoursesForSkills } from "../controllers/courseController.js";
import {
  analyzeResumeController,
  analyzeCareer,
  ingestSkills,
} from "../controllers/analyzeResumeController.js";
const upload = multer({ storage: multer.memoryStorage() });

export default (skillsCollection, cachedCoursesCollection) => {
  const router = express.Router();

  router.get(
    "/analyze-career",
    checkAuth,
    checkRole("user"),
    (req, res) => analyzeCareer(req, res, skillsCollection, cachedCoursesCollection)
  );

  router.post(
    "/analyze-resume",
    upload.single("file"),
    checkAuth,
    checkRole("user"),
    analyzeResumeController
  );

  router.post("/ingest", (req, res) =>
    ingestSkills(req, res, skillsCollection)
  );

  router.post("/courses", (req, res) =>
    getCoursesForSkills(req, res, cachedCoursesCollection)
  );

  return router;
};

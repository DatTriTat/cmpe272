import express from "express";
import multer from "multer";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import {
  analyzeCareer,
  ingestSkills,
} from "../controllers/careerController.js";
import { getCoursesForSkills } from "../controllers/courseController.js";

const upload = multer({ dest: "uploads/" });

export default (skillsCollection, cachedCoursesCollection) => {
  const router = express.Router();

  router.post(
    "/analyze-career",
    checkAuth,
    checkRole("user"),
    upload.single("file"),
    (req, res) => analyzeCareer(req, res, skillsCollection)
  );

  router.post("/ingest", (req, res) => ingestSkills(req, res, skillsCollection));

  router.post("/courses", (req, res) =>
    getCoursesForSkills(req, res, cachedCoursesCollection)
  );

  return router;
};

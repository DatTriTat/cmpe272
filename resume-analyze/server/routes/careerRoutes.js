import express from "express";
import multer from "multer";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { analyzeCareer, ingestSkills } from "../controllers/careerController.js";

const upload = multer({ dest: "uploads/" });

export default (collection) => {
  const router = express.Router();

  router.post("/analyze-career"/*, checkAuth, checkRole("user")*/, upload.single("file"), (req, res) => analyzeCareer(req, res, collection));

  router.post("/ingest", (req, res) => ingestSkills(req, res, collection));

  return router;
};
import express from 'express';
import { interviewSession } from '../controllers/interviewController.js';
import { checkAuth } from "../middlewares/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";
import { mapResumeToProfileFromFile } from "../controllers/analyzeResumeController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.post('/interview', interviewSession);
router.put("/profile", checkAuth, updateProfile);
router.post("/profile/map", upload.single("file"), mapResumeToProfileFromFile);

export default router;

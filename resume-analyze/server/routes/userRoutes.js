import express from 'express';
import { checkAuth } from "../middlewares/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";
import { mapResumeToProfileFromFile } from "../controllers/analyzeResumeController.js";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.put("/profile", checkAuth, updateProfile);
router.post("/profile/map", upload.single("file"), mapResumeToProfileFromFile);

export default router;

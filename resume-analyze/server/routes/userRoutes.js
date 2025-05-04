import express from 'express';
import { checkAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { updateProfile, saveCareerResult,  getCareerResultsByUser } from "../controllers/userController.js";
import { mapResumeToProfileFromFile } from "../controllers/analyzeResumeController.js";
import multer from "multer";
import { searchJobsController } from "../controllers/jobController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.put("/profile", checkAuth, checkRole("user"), updateProfile);
router.post("/profile/map", upload.single("file"), mapResumeToProfileFromFile);
router.get("/jobs/search", searchJobsController);
router.post("/career-results", checkAuth, checkRole("user"), saveCareerResult);
router.get("/career-results", checkAuth, checkRole("user"), getCareerResultsByUser);
export default router;

import express from 'express';
import { checkAuth } from "../middlewares/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";
import { mapResumeToProfileFromFile } from "../controllers/analyzeResumeController.js";
import { parseResume } from "../utils/parseResume.js";
import multer from "multer";
import { searchJobsController } from "../controllers/jobController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.put("/profile", checkAuth, updateProfile);
router.post("/profile/map", upload.single("file"), mapResumeToProfileFromFile);
router.get("/jobs/search", searchJobsController);


router.post("/resume/parse", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      const result = await parseResume(req.file);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Resume parsing failed:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
export default router;

// ✅ New (ESM compatible)
import express from 'express';
import { interviewSession } from '../controllers/interviewController.js';

const router = express.Router();
router.post('/interview', interviewSession);

export default router;

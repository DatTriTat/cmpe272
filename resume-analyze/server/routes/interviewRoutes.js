import express from 'express';
import {   getFirstQuestion,
    getNextQuestion, getFeedback } from '../controllers/interviewController.js';

const router = express.Router();

router.post('/next-question', getNextQuestion);
router.post('/feedback', getFeedback);
router.post('/first-question', getFirstQuestion);
export default router;

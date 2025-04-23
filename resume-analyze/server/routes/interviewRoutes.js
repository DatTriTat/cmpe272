const express = require('express');
const { interviewSession } = require('../controllers/interviewController');
const router = express.Router();

router.post('/interview', interviewSession);

module.exports = router;

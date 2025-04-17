import express from "express";
import { verifyLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/verify", verifyLogin); // POST /api/auth/verify

export default router;
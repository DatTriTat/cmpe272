import express from "express";
import { verifyLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/verify", verifyLogin);

export default router;
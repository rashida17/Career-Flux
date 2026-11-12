import { Router } from "express";
import { signup, login, sendSignupOtp, verifySignupOtp, googleAuth } from "../controllers/authController.js";

const router = Router();

router.post("/send-otp", sendSignupOtp); // POST /api/auth/send-otp
router.post("/verify-otp", verifySignupOtp); 
router.post("/signup", signup);          // POST /api/auth/signup
router.post("/login", login);            // POST /api/auth/login
router.post("/google", googleAuth);      // POST /api/auth/google

export default router;
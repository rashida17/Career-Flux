// backend/routes/jobSeekerRoutes.js
import express from "express";
import {
  getJobSeekerProfile,
  updateJobSeekerProfile
} from "../controllers/jobSeekerController.js";
import { protect } from "../middleware/authMiddleware.js"; // Match your actual filename (e.g. auth.js)

const router = express.Router();

router.get("/profile", protect, getJobSeekerProfile);
router.post("/profile", protect, updateJobSeekerProfile);

export default router;
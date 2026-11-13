
import { Router } from "express";

import {
  createJob,
  getMyJobs,
} from "../controllers/jobController.js";

import {
  protect,
  employerOnly,
} from "../middleware/authMiddleware.js";

const router = Router();

// Publish job (authenticated employers only)
router.post("/", protect, employerOnly, createJob);

// Get jobs posted by logged-in employer
router.get("/my-jobs", protect, employerOnly, getMyJobs);

export default router;

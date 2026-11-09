
import { Router } from "express";

import {
  getAllUsers,
  getRecentUsers,
  updateUserStatus,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = Router();

// Get all registered users
router.get("/users", protect, adminOnly, getAllUsers);

// Get users registered in the last 24 hours
router.get("/users/recent", protect, adminOnly, getRecentUsers);

// Activate or deactivate a user account
router.patch("/users/:id/status", protect, adminOnly, updateUserStatus);

export default router;

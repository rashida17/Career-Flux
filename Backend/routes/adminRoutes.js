import { Router } from "express";
import {
  getAllUsers,
  updateUserStatus,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = Router();

// Get all registered users
router.get("/users", protect, adminOnly, getAllUsers);

// Activate or deactivate a user account
router.patch("/users/:id/status", protect, adminOnly, updateUserStatus);

export default router;
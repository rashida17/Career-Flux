import express from "express";
import {
  getSkills,
  addSkill,
  addEvidence,
  deleteSkill,
  deleteEvidence,
} from "../controllers/jobSeekerSkillController.js";
import { protect } from "../middleware/authMiddleware.js"; // Match your actual filename (e.g. auth.js)

const router = express.Router();

router.get("/", protect, getSkills);
router.post("/", protect, addSkill);
router.post("/:skillId/evidence", protect, addEvidence);
router.delete("/:skillId", protect, deleteSkill);
router.delete("/:skillId/evidence/:evidenceId", protect, deleteEvidence);

export default router;
import { Router } from "express";
import { protect, employerOnly, adminOnly } from "../middleware/authMiddleware.js";
import { verificationUpload } from "../middleware/verificationUpload.js";
import {
  getMyVerification, submitVerification,
  listRequests, getRequestCounts, getDocument, approveRequest, rejectRequest, unverifyRequest,
} from "../controllers/verificationController.js";

const router = Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// EMPLOYER
router.get("/verification/me", protect, employerOnly, wrap(getMyVerification));
router.post("/verification", protect, employerOnly, verificationUpload, wrap(submitVerification));

// ADMIN
router.get("/admin/verification-requests/counts", protect, adminOnly, wrap(getRequestCounts));
router.get("/admin/verification-requests", protect, adminOnly, wrap(listRequests));
router.get("/admin/verification-requests/:id/document", protect, adminOnly, wrap(getDocument));
router.patch("/admin/verification-requests/:id/approve", protect, adminOnly, wrap(approveRequest));
router.patch("/admin/verification-requests/:id/reject", protect, adminOnly, wrap(rejectRequest));
router.patch("/admin/verification-requests/:id/unverify", protect, adminOnly, wrap(unverifyRequest));

export default router;
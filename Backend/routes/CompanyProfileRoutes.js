import { Router } from "express";
import { imageUpload } from "../middleware/upload.js";
import { protect, employerOnly } from "../middleware/authMiddleware.js";
import {
  getMyCompany, saveMyCompany, getMyEmployer, saveMyEmployer,
  getMyPublicProfile, getPublicCompany,
} from "../controllers/CompanyController.js";

const router = Router();

// async errors go to your errorHandler middleware
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// multer errors (wrong type / too big) -> clean 422 message
const upload = (fields) => (req, res, next) =>
  imageUpload.fields(fields)(req, res, (err) => {
    if (!err) return next();
    const msg = err.code === "LIMIT_FILE_SIZE" ? "Image is too large." : err.message;
    res.status(422).json({ message: msg, errors: {} });
  });

// PUBLIC (candidates, no login)
router.get("/companies/:id/public", wrap(getPublicCompany));

// EMPLOYER ONLY
router.get("/company-profile/me", protect, employerOnly, wrap(getMyCompany));
router.put(
  "/company-profile/me", protect, employerOnly,
  upload([{ name: "logo", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
  wrap(saveMyCompany)
);
router.get("/company-profile/me/public", protect, employerOnly, wrap(getMyPublicProfile));

router.get("/employer-profile/me", protect, employerOnly, wrap(getMyEmployer));
router.put(
  "/employer-profile/me", protect, employerOnly,
  upload([{ name: "photo", maxCount: 1 }]),
  wrap(saveMyEmployer)
);

export default router;
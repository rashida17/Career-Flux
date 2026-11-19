import mongoose from "mongoose";
import CompanyProfile from "../models/CompanyProfile.js";
import VerificationRequest from "../models/VerificationRequest.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { deleteVerificationFile, streamVerificationDocument } from "../middleware/verificationUpload.js";

const CLIENT_URL = () => process.env.CLIENT_URL || "http://localhost:5173";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const normalizeWebsite = (w = "") => {
  const v = String(w).trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

// emails must never break the request, so errors are only logged
const safeEmail = async (payload) => {
  try { await sendEmail(payload); } catch (err) { console.error("Verification email failed:", err.message); }
};

async function notifyAdmins(company, request) {
  // If ADMIN_NOTIFY_EMAIL is set in .env, ONLY those addresses get the email (comma separated for several).
  // Otherwise every active admin account gets it. Invalid addresses are skipped.
  let to = (process.env.ADMIN_NOTIFY_EMAIL || "").split(",").map((s) => s.trim()).filter((s) => EMAIL_RE.test(s));
  if (!to.length) {
    const admins = await User.find({ role: "admin", isActive: true }).select("email");
    to = admins.map((a) => a.email).filter((e) => EMAIL_RE.test(e));
  }
  to = [...new Set(to)];
  if (!to.length) return;

  const link = `${CLIENT_URL()}/admin/company-verification`;
  await safeEmail({
    to: to.join(","),
    subject: `New verification request: ${company.companyName}`,
    text: `${company.companyName} submitted a company verification request.\nWebsite: ${request.website || "-"}\nReview it here: ${link}`,
    html: `<p><b>${escapeHtml(company.companyName)}</b> submitted a company verification request.</p>
           <p>Website: ${escapeHtml(request.website || "-")}</p>
           <p><a href="${link}">Review the request</a></p>`,
  });
}

/* ---------------- EMPLOYER ---------------- */

// GET /api/verification/me  ->  { status: "none" | "pending" | "verified" | "rejected" | "unverified", rejectionReason }
export const getMyVerification = async (req, res) => {
  const company = await CompanyProfile.findOne({ user: req.user._id });
  if (!company) return res.json({ data: { status: "none", hasCompany: false } });
  if (company.isVerified) return res.json({ data: { status: "verified", hasCompany: true } });

  const last = await VerificationRequest.findOne({ company: company._id }).sort({ createdAt: -1 });
  if (!last || last.status === "approved") return res.json({ data: { status: "none", hasCompany: true } });
  res.json({ data: { status: last.status, rejectionReason: last.rejectionReason, hasCompany: true } });
};

// POST /api/verification   (multipart: website, document=PDF)
export const submitVerification = async (req, res) => {
  const file = req.file;
  const bail = (code, message) => {
    if (file) deleteVerificationFile(file);
    return res.status(code).json({ message, errors: {} });
  };

  const company = await CompanyProfile.findOne({ user: req.user._id });
  if (!company) return bail(400, "Please save your company profile before requesting verification.");
  if (company.isVerified) return bail(409, "Your company is already verified.");

  const website = normalizeWebsite(req.body.website);
  if (website && !/^https?:\/\/\S+\.\S+/i.test(website)) return bail(422, "Enter a valid company website URL.");
  if (!file) return bail(422, "Please upload your legal document as a PDF.");

  if (await VerificationRequest.exists({ company: company._id, status: "pending" })) {
    return bail(409, "You already have a request under review.");
  }

  let request;
  try {
    request = await VerificationRequest.create({
      company: company._id,
      user: req.user._id,
      website,
      document: file.cloudId,
      originalName: file.originalname,
    });
  } catch (err) {
    if (err.code === 11000) return bail(409, "You already have a request under review.");
    throw err;
  }

  notifyAdmins(company, request); // fire and forget
  res.status(201).json({ message: "Verification request submitted.", data: { status: "pending" } });
};

/* ---------------- ADMIN ---------------- */

// GET /api/admin/verification-requests?status=pending|approved|rejected|unverified
export const listRequests = async (req, res) => {
  const status = ["pending", "approved", "rejected", "unverified"].includes(req.query.status) ? req.query.status : null;
  const docs = await VerificationRequest.find(status ? { status } : {})
    .sort({ createdAt: -1 })
    .limit(200)
    .populate("company", "companyName contactEmail logo")
    .populate("user", "email");

  res.json({
    data: docs.map((r) => ({
      id: r._id,
      status: r.status,
      website: r.website,
      documentName: r.originalName,
      rejectionReason: r.rejectionReason,
      submittedAt: r.createdAt,
      reviewedAt: r.reviewedAt,
      company: r.company && {
        id: r.company._id,
        name: r.company.companyName,
        email: r.company.contactEmail,
        logo: r.company.logo || "",
      },
      accountEmail: r.user?.email || "",
    })),
  });
};

export const getRequestCounts = async (req, res) => {
  const groupedCounts = await VerificationRequest.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const counts = { all: 0, pending: 0, verified: 0, rejected: 0, unverified: 0 };

  groupedCounts.forEach(({ _id, count }) => {
    const key = _id === "approved" ? "verified" : _id;
    if (key in counts && key !== "all") {
      counts[key] = count;
      counts.all += count;
    }
  });

  res.json({ data: counts });
};

// GET /api/admin/verification-requests/:id/document   (streams the PDF, admins only)
export const getDocument = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Request not found." });
  const r = await VerificationRequest.findById(req.params.id);
  if (!r) return res.status(404).json({ message: "Request not found." });

  await streamVerificationDocument(r.document, res);
};

async function loadReviewable(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(404).json({ message: "Request not found." }); return null; }
  const r = await VerificationRequest.findById(req.params.id).populate("company", "companyName");
  if (!r) { res.status(404).json({ message: "Request not found." }); return null; }
  if (!["pending", "unverified"].includes(r.status)) { res.status(409).json({ message: `This request was already ${r.status}.` }); return null; }
  return r;
}

// PATCH /api/admin/verification-requests/:id/approve
export const approveRequest = async (req, res) => {
  const r = await loadReviewable(req, res);
  if (!r) return;

  r.status = "approved";
  r.rejectionReason = "";
  r.reviewedBy = req.user._id;
  r.reviewedAt = new Date();
  await r.save();
  await CompanyProfile.updateOne({ _id: r.company._id }, { isVerified: true }); // shows the badge on the public profile

  const employer = await User.findById(r.user).select("email");
  if (employer) {
    safeEmail({
      to: employer.email,
      subject: "Your company is now verified",
      text: `Good news! ${r.company.companyName} has been verified. The verified badge now appears on your company profile.`,
      html: `<p>Good news! <b>${escapeHtml(r.company.companyName)}</b> has been verified.</p><p>The verified badge now appears on your company profile.</p>`,
    });
  }
  res.json({ message: "Company verified.", data: { id: r._id, status: r.status } });
};

// PATCH /api/admin/verification-requests/:id/reject   body: { reason }
export const rejectRequest = async (req, res) => {
  const reason = String(req.body.reason ?? "").trim().slice(0, 300);
  if (reason.length < 5) return res.status(422).json({ message: "Please give a short reason (at least 5 characters).", errors: {} });

  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Request not found." });
  const r = await VerificationRequest.findById(req.params.id).populate("company", "companyName");
  if (!r) return res.status(404).json({ message: "Request not found." });
  if (r.status !== "pending") return res.status(409).json({ message: `This request was already ${r.status}.` });

  r.status = "rejected";
  r.rejectionReason = reason;
  r.reviewedBy = req.user._id;
  r.reviewedAt = new Date();
  await r.save();

  const employer = await User.findById(r.user).select("email");
  if (employer) {
    safeEmail({
      to: employer.email,
      subject: "Your verification request was not approved",
      text: `Your verification request for ${r.company.companyName} was not approved.\nReason: ${reason}\nYou can fix this and submit a new request from your dashboard.`,
      html: `<p>Your verification request for <b>${escapeHtml(r.company.companyName)}</b> was not approved.</p>
             <p><b>Reason:</b> ${escapeHtml(reason)}</p>
             <p>You can fix this and submit a new request from your dashboard.</p>`,
    });
  }
  res.json({ message: "Request rejected.", data: { id: r._id, status: r.status } });
};

// PATCH /api/admin/verification-requests/:id/unverify
export const unverifyRequest = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Request not found." });
  const r = await VerificationRequest.findById(req.params.id).populate("company", "companyName");
  if (!r) return res.status(404).json({ message: "Request not found." });
  if (r.status !== "approved") return res.status(409).json({ message: "Only a verified company can be unverified." });

  r.status = "unverified";
  r.reviewedBy = req.user._id;
  r.reviewedAt = new Date();
  await r.save();
  await CompanyProfile.updateOne({ _id: r.company._id }, { isVerified: false });

  const employer = await User.findById(r.user).select("email");
  if (employer) {
    safeEmail({
      to: employer.email,
      subject: "Your company verification was removed",
      text: `The verification for ${r.company.companyName} has been removed by an administrator. You can submit a new verification request from your dashboard.`,
      html: `<p>The verification for <b>${escapeHtml(r.company.companyName)}</b> has been removed by an administrator.</p><p>You can submit a new verification request from your dashboard.</p>`,
    });
  }
  res.json({ message: "Company verification removed.", data: { id: r._id, status: r.status } });
};
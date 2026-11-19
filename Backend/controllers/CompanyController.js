import mongoose from "mongoose";
import CompanyProfile, { OWNERSHIP, SIZES, INDUSTRIES } from "../models/CompanyProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";
import { removeFile, toCloudUrl } from "../middleware/Upload.js";
import Job from "../models/Job.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-\s\d]{7,20}$/;
const TWO_MB = 2 * 1024 * 1024;

/* ---------- helpers ---------- */
const cloudStorageUrl = (url) => url || "";

const cleanupUploads = (files) =>
  Object.values(files || {}).flat().forEach((f) => removeFile(toCloudUrl(f)));

const normalizeWebsite = (w = "") => {
  const v = w.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

// shape the FORM reads (same field names as the forms)
const companyToForm = (c) =>
  c && {
    id: c._id,
    companyName: c.companyName,
    logo: cloudStorageUrl(c.logo),
    coverImage: cloudStorageUrl(c.coverImage),
    establishedDate: c.establishedDate,
    ownership: c.ownership,
    size: c.size,
    industry: c.industry,
    website: c.website,
    location: c.location,
    address: c.address,
    contactEmail: c.contactEmail,
    contactPhone: c.contactPhone,
    bio: c.bio,
    isVerified: c.isVerified,
  };

const employerToForm = (e) =>
  e && {
    fullName: e.fullName,
    jobTitle: e.jobTitle,
    email: e.email,
    phone: e.phone,
    photo: cloudStorageUrl(e.photo),
  };

// shape the PUBLIC PROFILE page renders (same as buildCompanyProfile on the client)
const toPublicProfile = (c, e) => ({
  id: c._id,
  name: c.companyName,
  category: c.industry,
  logoUrl: cloudStorageUrl(c.logo),
  coverUrl: cloudStorageUrl(c.coverImage),
  location: c.location,
  size: c.size,
  employees: c.size,
  since: c.establishedDate ? `Since ${c.establishedDate.slice(0, 4)}` : "",
  website: (c.website || "").replace(/^https?:\/\//i, "").replace(/\/$/, ""),
  sector: c.industry,
  ownership: c.ownership,
  hq: c.location,
  address: c.address,
  contactEmail: c.contactEmail,
  contactPhone: c.contactPhone,
  isVerified: c.isVerified,
  about: (c.bio || "").split(/\n+/).filter(Boolean),
  recruiter: {
    name: e?.fullName || "Hiring Manager",
    role: e?.jobTitle || "Employer",
    email: e?.email || "",
    phone: e?.phone || "",
    avatar: cloudStorageUrl(e?.photo),
  },
});

// ---- jobs shown on the public company page (from your Job model) ----
const timeAgo = (d) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};
const MODE_TONE = { Remote: "green", "On-site": "blue", Hybrid: "amber" };

const mapJobToCard = (j) => ({
  id: j._id,
  title: j.title,
  salary: j.salary || "Not disclosed",
  level: j.experience,
  posted: timeAgo(j.createdAt),
  location: j.workMode === "Remote" ? `Remote \u2022 ${j.location}` : j.location,
  badges: [
    ...(Date.now() - new Date(j.createdAt).getTime() < 3 * 86400000 ? [{ label: "New", tone: "blue" }] : []),
    { label: j.jobType, tone: "slate" },
    { label: j.workMode, tone: MODE_TONE[j.workMode] || "slate" },
  ],
});

async function getJobsForCompany(employerUserId) {
  const filter = { employer: employerUserId, status: "open", deadline: { $gte: new Date() } };
  const [docs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).limit(6),
    Job.countDocuments(filter),
  ]);
  return { jobs: docs.map(mapJobToCard), total };
}

/* ---------- validation ---------- */
function validateCompany(b, { hasLogo, files }) {
  const err = {};
  const need = (k, msg) => { if (!b[k]?.toString().trim()) err[k] = msg; };

  need("companyName", "Company name is required.");
  need("location", "Location is required.");
  need("contactEmail", "Company contact email is required.");
  need("contactPhone", "Company phone number is required.");

  if (!b.establishedDate) err.establishedDate = "Please select the date your company was established.";
  else if (isNaN(Date.parse(b.establishedDate)) || new Date(b.establishedDate) > new Date())
    err.establishedDate = "The established date cannot be in the future.";

  if (!OWNERSHIP.includes(b.ownership)) err.ownership = "Please select an ownership type.";
  if (!SIZES.includes(b.size)) err.size = "Please select a company size.";
  if (!INDUSTRIES.includes(b.industry)) err.industry = "Please select an industry.";

  if (b.contactEmail && !EMAIL_RE.test(b.contactEmail)) err.contactEmail = "Enter a valid email address.";
  if (b.contactPhone && !PHONE_RE.test(b.contactPhone)) err.contactPhone = "Enter a valid phone number.";
  if (b.website?.trim() && !/^https?:\/\/\S+\.\S+/i.test(normalizeWebsite(b.website))) err.website = "Enter a valid URL.";

  const bio = (b.bio || "").trim();
  if (bio.length < 30) err.bio = "Please write at least 30 characters about your company.";
  else if (bio.length > 600) err.bio = "Bio must be 600 characters or fewer.";

  if (!hasLogo) err.logo = "Please upload your company logo.";
  if (files?.logo?.[0]?.size > TWO_MB) err.logo = "Image must be 2MB or smaller.";
  if (files?.coverImage?.[0]?.size > TWO_MB) err.coverImage = "Image must be 2MB or smaller.";
  return err;
}

function validateEmployer(b, files) {
  const err = {};
  if (!b.fullName?.trim()) err.fullName = "Full name is required.";
  if (!b.jobTitle?.trim()) err.jobTitle = "Job title is required.";
  if (!b.email?.trim()) err.email = "Work email is required.";
  else if (!EMAIL_RE.test(b.email)) err.email = "Enter a valid email address.";
  if (!b.phone?.trim()) err.phone = "Phone number is required.";
  else if (!PHONE_RE.test(b.phone)) err.phone = "Enter a valid phone number.";
  if (files?.photo?.[0]?.size > TWO_MB) err.photo = "Image must be 2MB or smaller.";
  return err;
}

const fail = (res, errors) => res.status(422).json({ message: "Please fix the highlighted fields.", errors });

/* ---------- company profile (employer, authenticated) ---------- */
export const getMyCompany = async (req, res) => {
  const c = await CompanyProfile.findOne({ user: req.user._id });
  res.json({ data: companyToForm(c) }); // null if not created yet
};

export const saveMyCompany = async (req, res) => {
  const existing = await CompanyProfile.findOne({ user: req.user._id });
  const b = req.body;
  const errors = validateCompany(b, { hasLogo: !!(existing?.logo || req.files?.logo?.length), files: req.files });
  if (Object.keys(errors).length) { cleanupUploads(req.files); return fail(res, errors); }

  const update = {
    companyName: b.companyName.trim(),
    establishedDate: b.establishedDate,
    ownership: b.ownership,
    size: b.size,
    industry: b.industry,
    website: normalizeWebsite(b.website),
    location: b.location.trim(),
    address: (b.address || "").trim(),
    contactEmail: b.contactEmail.trim().toLowerCase(),
    contactPhone: b.contactPhone.trim(),
    bio: b.bio.trim(),
  };
  // isVerified is intentionally NOT in here

  const oldLogo = existing?.logo, oldCover = existing?.coverImage;
  if (req.files?.logo?.[0]) update.logo = toCloudUrl(req.files.logo[0]);
  if (req.files?.coverImage?.[0]) update.coverImage = toCloudUrl(req.files.coverImage[0]);

  const saved = await CompanyProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: update, $setOnInsert: { user: req.user._id } },
    { returnDocument: "after", upsert: true, runValidators: true }
  );

  if (update.logo && oldLogo) removeFile(oldLogo);
  if (update.coverImage && oldCover) removeFile(oldCover);

  res.json({ message: "Company profile saved.", data: companyToForm(saved) });
};

/* ---------- employer profile (employer, authenticated) ---------- */
export const getMyEmployer = async (req, res) => {
  const e = await EmployerProfile.findOne({ user: req.user._id });
  res.json({ data: employerToForm(e) });
};

export const saveMyEmployer = async (req, res) => {
  const errors = validateEmployer(req.body, req.files);
  if (Object.keys(errors).length) { cleanupUploads(req.files); return fail(res, errors); }

  const existing = await EmployerProfile.findOne({ user: req.user._id });
  const b = req.body;
  const update = {
    fullName: b.fullName.trim(),
    jobTitle: b.jobTitle.trim(),
    email: b.email.trim().toLowerCase(),
    phone: b.phone.trim(),
  };
  if (req.files?.photo?.[0]) update.photo = toCloudUrl(req.files.photo[0]);

  const saved = await EmployerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: update, $setOnInsert: { user: req.user._id } },
    { returnDocument: "after", upsert: true, runValidators: true }
  );
  if (update.photo && existing?.photo) removeFile(existing.photo);

  res.json({ message: "Employer profile saved.", data: employerToForm(saved) });
};

/* ---------- public profile ---------- */
// Employer previewing their own page ("View Public Profile" button)
export const getMyPublicProfile = async (req, res) => {
  const c = await CompanyProfile.findOne({ user: req.user._id });
  if (!c) return res.status(404).json({ message: "Save your company profile first." });
  const e = await EmployerProfile.findOne({ user: req.user._id });
  const { jobs, total } = await getJobsForCompany(c.user);
  res.json({ data: { company: { ...toPublicProfile(c, e), totalOpenRoles: total }, jobs } });
};

// Anyone (candidates) viewing /companies/:id
export const getPublicCompany = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Company not found." });
  const c = await CompanyProfile.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Company not found." });
  const e = await EmployerProfile.findOne({ user: c.user });
  const { jobs, total } = await getJobsForCompany(c.user);
  res.json({ data: { company: { ...toPublicProfile(c, e), totalOpenRoles: total }, jobs } });
};
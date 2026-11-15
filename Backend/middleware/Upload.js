import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";

const FOLDERS = { logo: "logos", coverImage: "covers", photo: "photos" };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join("uploads", FOLDERS[file.fieldname] || "misc");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype === "image/png" ? ".png" : ".jpg";
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

export const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // hard ceiling; logo/photo get the 2MB check in the controller
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only PNG or JPG images are allowed."));
  },
});

// remove a stored file (relative path like /uploads/logos/x.png)
export const removeFile = (relPath) => {
  if (!relPath || !relPath.startsWith("/uploads/")) return;
  fs.unlink(path.join(process.cwd(), relPath), () => {});
};

export const toRelPath = (file) => (file ? `/${file.path.replace(/\\/g, "/")}` : "");
import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

// only used for OLD requests that were saved on disk before moving to Cloudinary
export const VERIFICATION_DIR = path.join(process.cwd(), "private_uploads", "verification");

const configure = () =>
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

const pdfUploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(new Error("Only PDF files are allowed."));
  },
});

// type "authenticated" = private: the file can NOT be opened without a signed URL
const uploadPdf = (buffer) =>
  new Promise((resolve, reject) => {
    configure();
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          type: "authenticated",
          public_id: `careerflux/verification/${crypto.randomBytes(12).toString("hex")}.pdf`,
        },
        (err, result) => (err ? reject(err) : resolve(result))
      )
      .end(buffer);
  });

export const verificationUpload = (req, res, next) =>
  pdfUploader.single("document")(req, res, async (err) => {
    if (err) {
      const message = err.code === "LIMIT_FILE_SIZE" ? "PDF must be 5MB or smaller." : err.message;
      return res.status(422).json({ message, errors: {} });
    }
    const file = req.file;
    if (!file) return next(); // the controller reports "Please upload your legal document"

    // real PDFs start with "%PDF-" (the mimetype alone can be faked); checked BEFORE uploading
    if (file.buffer.subarray(0, 5).toString() !== "%PDF-") {
      return res.status(422).json({ message: "The uploaded file is not a valid PDF.", errors: {} });
    }
    try {
      const result = await uploadPdf(file.buffer);
      file.cloudId = result.public_id; // saved in MongoDB (it is NOT a public link)
      file.buffer = undefined;
      next();
    } catch (e) {
      next(e);
    }
  });

// removes an uploaded PDF (used when the request is rejected before it is saved)
export const deleteVerificationFile = (file) => {
  if (!file?.cloudId) return;
  configure();
  cloudinary.uploader.destroy(file.cloudId, { resource_type: "raw", type: "authenticated" }).catch(() => {});
};

// Admin only: the server downloads the private file with a signed URL and streams it to the admin.
// The signed URL never reaches the browser.
export async function streamVerificationDocument(documentRef, res) {
  // old request saved on local disk (just a file name, no folder)
  if (!documentRef.includes("/")) {
    const full = path.join(VERIFICATION_DIR, path.basename(documentRef));
    if (!fs.existsSync(full)) return res.status(404).json({ message: "Document file is missing." });
    return res.sendFile(full, { headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline" } });
  }

  configure();
  const signedUrl = cloudinary.url(documentRef, {
    resource_type: "raw",
    type: "authenticated",
    sign_url: true,
    secure: true,
  });

  const upstream = await fetch(signedUrl);
  if (!upstream.ok || !upstream.body) {
    return res.status(502).json({ message: "Could not load the document from storage." });
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");
  Readable.fromWeb(upstream.body).pipe(res);
}
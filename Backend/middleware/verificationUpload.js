import crypto from "crypto";
import multer from "multer";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

const configure = () =>
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

const pdfUploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(new Error("Only PDF files are allowed."));
  },
});

// type "authenticated" = private: the file can NOT be opened without a signed request
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
      const message = err.code === "LIMIT_FILE_SIZE" ? "PDF must be 2MB or smaller." : err.message;
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

// Admin only: the server fetches the private file from Cloudinary and streams it to the admin.
// Two download methods are tried. If both fail, the real reason is printed in the BACKEND TERMINAL.
export async function streamVerificationDocument(documentRef, res) {
  configure();
  const attempts = [
    // 1) authenticated API download link (valid for 5 minutes)
    () =>
      cloudinary.utils.private_download_url(documentRef, undefined, {
        resource_type: "raw",
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 300,
      }),
    // 2) signed delivery link
    () =>
      cloudinary.url(documentRef, { resource_type: "raw", type: "authenticated", sign_url: true, secure: true }),
  ];

  for (const [i, buildUrl] of attempts.entries()) {
    try {
      const upstream = await fetch(buildUrl());
      if (upstream.ok && upstream.body) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
        const stream = Readable.fromWeb(upstream.body);
        stream.on("error", () => res.end());
        return stream.pipe(res);
      }
      console.error(
        `[verification document] method ${i + 1} failed -> HTTP ${upstream.status}`,
        (await upstream.text()).slice(0, 300),
        "| x-cld-error:", upstream.headers.get("x-cld-error")
      );
    } catch (e) {
      console.error(`[verification document] method ${i + 1} error ->`, e.message);
    }
  }

  // both methods failed: check whether the file even exists in Cloudinary, to explain why
  try {
    await cloudinary.api.resource(documentRef, { resource_type: "raw", type: "authenticated" });
    console.error("[verification document] the file EXISTS in Cloudinary, so delivery is blocked. Turn on Settings > Security > 'PDF and ZIP files delivery' in the Cloudinary dashboard.");
  } catch (e) {
    console.error("[verification document] Cloudinary says:", e?.error?.message || e.message);
  }
  res.status(502).json({ message: "Could not load the document from storage. See the backend terminal for the reason." });
}
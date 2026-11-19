import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const FOLDERS = { logo: "careerflux/logos", coverImage: "careerflux/covers", photo: "careerflux/photos" };

// configured lazily so .env is always loaded first
const configure = () =>
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

// files are kept in memory only long enough to be sent to Cloudinary
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // hard ceiling; logo/photo get the 2MB check in the controller
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only PNG or JPG images are allowed."));
  },
});

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    configure();
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (err, result) => (err ? reject(err) : resolve(result)))
      .end(buffer);
  });

// same API as before: imageUpload.fields([...]) -> Express middleware
export const imageUpload = {
  fields: (spec) => (req, res, cb) =>
    memoryUpload.fields(spec)(req, res, async (err) => {
      if (err) return cb(err);
      try {
        const files = Object.values(req.files || {}).flat();
        await Promise.all(
          files.map(async (f) => {
            const result = await uploadBuffer(f.buffer, FOLDERS[f.fieldname] || "careerflux/misc");
            f.cloudUrl = result.secure_url; // this URL is what gets saved in MongoDB
            f.buffer = undefined;           // free the memory
          })
        );
        cb();
      } catch (e) {
        cb(e);
      }
    }),
};

// https://res.cloudinary.com/<cloud>/image/upload/v123/careerflux/logos/abc.png -> careerflux/logos/abc
const publicIdFromUrl = (url) => {
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-z0-9]+$/i);
  return m ? decodeURIComponent(m[1]) : null;
};

// Delete an image from Cloudinary.
export const removeFile = (ref) => {
  if (!ref) return;
  if (/^https?:\/\/res\.cloudinary\.com\//i.test(ref)) {
    const id = publicIdFromUrl(ref);
    if (id) {
      configure();
      cloudinary.uploader.destroy(id, { resource_type: "image" }).catch(() => {});
    }
  }
};

// the value saved in the database for an uploaded file
export const toCloudUrl = (file) => (file ? file.cloudUrl || "" : "");
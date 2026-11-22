// backend/models/JobSeekerProfile.js
import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  institute: { type: String, required: true },
  degree: { type: String, required: true },
  startYear: { type: String, required: true },
  endYear: { type: String },
  current: { type: Boolean, default: false }
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  startYear: { type: String, required: true },
  endYear: { type: String },
  current: { type: Boolean, default: false }
});

const jobSeekerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    full_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone_number: { type: String, default: "" },
    location: { type: String, default: "" },
    target_job_title: { type: String, default: "Frontend Developer" },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    is_fresher: { type: Boolean, default: false },
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [{ type: String }],
    profileStrength: { type: Number, default: 40 }
  },
  { timestamps: true }
);

// Change this from module.exports to export default:
const JobSeekerProfile = mongoose.model("JobSeekerProfile", jobSeekerProfileSchema);
export default JobSeekerProfile;
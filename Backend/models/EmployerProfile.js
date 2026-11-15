import mongoose from "mongoose";

const employerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    jobTitle: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    photo: { type: String, default: "" }, // optional, relative path
  },
  { timestamps: true }
);

export default mongoose.model("EmployerProfile", employerProfileSchema);
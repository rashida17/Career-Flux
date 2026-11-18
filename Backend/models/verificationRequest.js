import mongoose from "mongoose";

const verificationRequestSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyProfile", required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    website: { type: String, trim: true, default: "" },
    document: { type: String, required: true },          // file name inside private_uploads/verification
    originalName: { type: String, default: "document.pdf" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    rejectionReason: { type: String, trim: true, default: "", maxlength: 300 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

// a company can only have ONE pending request at a time (also stops double-clicks)
verificationRequestSchema.index(
  { company: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

export default mongoose.model("VerificationRequest", verificationRequestSchema);
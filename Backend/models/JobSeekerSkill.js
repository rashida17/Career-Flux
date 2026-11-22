import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema({
  evidence_title: { type: String, required: true },
  evidence_type: { type: String, enum: ["Project", "Certificate"], required: true },
  description: { type: String, default: "" },
  proof_link: { type: String, required: true },
  file_name: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

const jobSeekerSkillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skill_name: { type: String, required: true, trim: true },
    proficiency_level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    is_ai_suggested: { type: Boolean, default: false },
    added_date: { type: Date, default: Date.now },
    evidence: [evidenceSchema],
  },
  { timestamps: true }
);

export default mongoose.model("JobSeekerSkill", jobSeekerSkillSchema);
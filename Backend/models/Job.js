
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // Employer who posted this job
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic job information
    title: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship"],
      required: true,
    },

    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    vacancies: {
      type: Number,
      required: true,
      min: 1,
    },

    experience: {
      type: String,
      required: true,
      enum: [
        "Fresh Graduate",
        "Entry Level (0-1 years)",
        "1-2 years",
        "2-4 years",
        "4-6 years",
        "6+ years",
      ],
    },

    qualification: {
      type: String,
      required: true,
      enum: [
        "Intermediate",
        "Bachelor's",
        "Master's",
        "MPhil",
        "PhD",
        "Any Qualification",
      ],
    },

    salary: {
      type: String,
      trim: true,
      default: "",
    },

    deadline: {
      type: Date,
      required: true,
    },

    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (skills) =>
          Array.isArray(skills) && skills.length > 0,
        message: "At least one required skill must be added.",
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },

    // Job management
    status: {
      type: String,
      enum: ["draft", "open", "paused", "closed"],
      default: "open",
    },

    applicationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;

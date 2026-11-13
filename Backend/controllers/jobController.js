
import Job from "../models/Job.js";

// Create a new job
export async function createJob(req, res) {
  try {
    const {
      jobTitle,
      jobType,
      workMode,
      location,
      vacancies,
      experience,
      qualification,
      salary,
      deadline,
      skills,
      description,
    } = req.body;

    const job = await Job.create({
      employer: req.user._id,
      title: jobTitle,
      jobType,
      workMode,
      location,
      vacancies: Number(vacancies),
      experience,
      qualification,
      salary: salary || "",
      deadline,
      skills,
      description,
      status: "open",
    });

    return res.status(201).json({
      success: true,
      message: "Job published successfully!",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to publish job.",
    });
  }
}

// Get jobs posted by the logged-in employer
export async function getMyJobs(req, res) {
  try {
    const jobs = await Job.find({
      employer: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your posted jobs.",
    });
  }
}

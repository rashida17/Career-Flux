import JobSeekerSkill from "../models/JobSeekerSkill.js";

// GET: Retrieve all skills for the authenticated job seeker
export const getSkills = async (req, res) => {
  try {
    const userId = req.user._id;
    const skills = await JobSeekerSkill.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST: Add a new skill
export const addSkill = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skill_name, proficiency_level, is_ai_suggested } = req.body;

    // Check if skill already exists for this user
    const existing = await JobSeekerSkill.findOne({
      userId,
      skill_name: { $regex: new RegExp(`^${skill_name}$`, "i") },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "You have already added this skill." });
    }

    const newSkill = await JobSeekerSkill.create({
      userId,
      skill_name,
      proficiency_level: proficiency_level || "Beginner",
      is_ai_suggested: Boolean(is_ai_suggested),
      evidence: [],
    });

    res.status(201).json({ success: true, message: "Skill added successfully", skill: newSkill });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST: Add evidence/proof to an existing skill
export const addEvidence = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { evidence_title, evidence_type, description, proof_link, file_name } = req.body;

    const skill = await JobSeekerSkill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    const newEvidence = {
      evidence_title,
      evidence_type,
      description: description || "",
      proof_link,
      file_name: file_name || null,
    };

    skill.evidence.push(newEvidence);
    await skill.save();

    res.status(200).json({ success: true, message: "Proof added successfully", skill });
  } catch (error) {
    console.error("Error adding evidence:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE: Remove a skill
export const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    await JobSeekerSkill.findByIdAndDelete(skillId);
    res.status(200).json({ success: true, message: "Skill removed successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE: Remove specific evidence from a skill
export const deleteEvidence = async (req, res) => {
  try {
    const { skillId, evidenceId } = req.params;
    const skill = await JobSeekerSkill.findById(skillId);

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    skill.evidence = skill.evidence.filter((ev) => ev._id.toString() !== evidenceId);
    await skill.save();

    res.status(200).json({ success: true, message: "Proof deleted successfully", skill });
  } catch (error) {
    console.error("Error deleting evidence:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
import JobSeekerProfile from "../models/JobSeekerProfile.js";
import User from "../models/User.js";

// GET: Fetch job seeker profile along with the registered email from the User model
export const getJobSeekerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Retrieve the authenticated user's email and name from the User collection
    const user = await User.findById(userId).select("email name");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile = await JobSeekerProfile.findOne({ userId });

    // Create a default profile if one does not exist yet
    if (!profile) {
      profile = await JobSeekerProfile.create({
        userId,
        full_name: user.name || "",
        email: user.email,
        profileStrength: 40,
      });
    } else if (profile.email !== user.email) {
      // Sync profile email with the User model if there is any discrepancy
      profile.email = user.email;
      await profile.save();
    }

    // Always enforce the registered email from the User model in the response
    const profileObj = profile.toObject();
    profileObj.email = user.email;

    res.status(200).json({ success: true, profile: profileObj });
  } catch (error) {
    console.error("Error fetching job seeker profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST: Save or update job seeker profile while keeping the registered email immutable
export const updateJobSeekerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the registered email from the User model
    const user = await User.findById(userId).select("email");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Strip email and restricted identifiers from incoming request payload
    const { email, _id, userId: bodyUserId, ...safeUpdateData } = req.body;

    // Force-assign the immutable registered email from the User model
    safeUpdateData.email = user.email;

    // Calculate profile completion strength
    let strength = 40;
    if (safeUpdateData.phone_number) strength += 15;
    if (safeUpdateData.location) strength += 15;
    if (safeUpdateData.bio) strength += 15;
    if (safeUpdateData.education && safeUpdateData.education.length > 0) strength += 15;
    safeUpdateData.profileStrength = Math.min(strength, 100);

    // Upsert profile document in MongoDB
    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId },
      { $set: safeUpdateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error updating job seeker profile:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
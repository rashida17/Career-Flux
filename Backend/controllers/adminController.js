import User from "../models/User.js";

// GET: Fetch all registered users
export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({
      role: { $in: ["jobseeker", "employer"] },
    })
      .select("name email role isActive createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Users fetched successfully",
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH: Activate or deactivate an account
export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: { $in: ["jobseeker", "employer"] },
      },
      { $set: { isActive } },
      { new: true, runValidators: true }
    ).select("name email role isActive");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: `Account ${isActive ? "activated" : "deactivated"} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
}

// GET: Fetch users registered in the last 24 hours
export async function getRecentUsers(req, res, next) {
  try {
    const last24Hours = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const users = await User.find({
      role: { $in: ["jobseeker", "employer"] },
      createdAt: { $gte: last24Hours },
    })
      .select("name email role isActive createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Recent users fetched successfully",
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
}

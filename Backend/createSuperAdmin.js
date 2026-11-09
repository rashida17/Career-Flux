
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";

async function createSuperAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
    }

    if (password.length < 8) {
      throw new Error("Admin password must be at least 8 characters");
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log("Super Admin already exists.");
      } else {
        console.log("This email already belongs to a non-admin account.");
      }
      return;
    }

    await User.create({
      email,
      password,
      role: "admin",
      isActive: true,
    });

    console.log("Super Admin created successfully!");
  } catch (error) {
    console.error("Super Admin creation failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createSuperAdmin();

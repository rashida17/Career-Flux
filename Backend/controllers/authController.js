// Backend logic signup and login 

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const OTP_TTL_MIN = 10;
const OTP_RESEND_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;

const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
const safeUser = (u) => ({ id: u._id, email: u.email, role: u.role }); // never send the password

const ROLES = ["jobseeker", "employer"];
const isValidEmail = (e) => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

// Same rules and wording as the signup page. Returns what is wrong (empty list = password is fine).
function passwordProblems(p) {
  const problems = [];
  if (p.length < 8) problems.push("is too short (minimum 8 characters)");
  if (p.length > 64) problems.push("is too long (maximum 64 characters)");
  if (!/[A-Z]/.test(p)) problems.push("has no uppercase letter");
  if (!/[a-z]/.test(p)) problems.push("has no lowercase letter");
  if (!/\d/.test(p)) problems.push("has no number");
  if (!/[^A-Za-z0-9\s]/.test(p)) problems.push("has no special character (like ! @ # $)");
  if (/\s/.test(p)) problems.push("contains spaces");
  return problems;
}
const joinList = (items) =>
  items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items[0];

// POST /api/auth/send-otp
export async function sendSignupOtp(req, res, next) {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // Stop people from spamming the send button
    const existing = await Otp.findOne({ email });
    if (existing) {
      const wait = OTP_RESEND_SECONDS - Math.floor((Date.now() - existing.lastSentAt.getTime()) / 1000);
      if (wait > 0) {
        return res.status(429).json({ message: `Please wait ${wait} seconds before requesting a new code` });
      }
    }

    const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    const codeHash = await bcrypt.hash(code, 10);

    await Otp.findOneAndUpdate(
      { email },
      {
        codeHash,
        attempts: 0,
        expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000),
        lastSentAt: new Date(),
      },
      { upsert: true }
    );

    await sendEmail({
      to: email,
      subject: "Your verification code",
      text: `Your verification code is ${code}. It expires in ${OTP_TTL_MIN} minutes.`,
      html: `<p>Your verification code is:</p>
             <h2 style="letter-spacing:4px">${code}</h2>
             <p>It expires in ${OTP_TTL_MIN} minutes. If you did not request this, ignore this email.</p>`,
    });

    res.json({ message: "Verification code sent to your email" });
  } catch (err) {
    next(err);
  }
}
// POST /api/auth/verify-otp   body: { email, otp }
// Only CHECKS the code. It does not delete it, because signup checks it again.
export async function verifySignupOtp(req, res, next) {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const otp = String(req.body.otp ?? "").trim();

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: "Enter the 6-digit code sent to your email" });
    }

    const record = await Otp.findOne({ email });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Code expired. Please request a new one" });
    }
    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await record.deleteOne();
      return res.status(429).json({ message: "Too many wrong attempts. Please request a new code" });
    }
    if (!(await bcrypt.compare(otp, record.codeHash))) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Incorrect code" });
    }

    res.json({ message: "Email verified" });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    // String(...) forces plain text, so objects sent by an attacker cannot reach the database query
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const confirmPassword = String(req.body.confirmPassword ?? password);
    const role = String(req.body.role ?? "");

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Role must be jobseeker or employer" });
    }
    const problems = passwordProblems(password);
    if (problems.length) {
      return res.status(400).json({ message: `Password not accepted: it ${joinList(problems)}.` });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (await User.exists({ email })) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    
        // ---- OTP check: the email must be verified before the account is created ----
    const otp = String(req.body.otp ?? "").trim();
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: "Enter the 6-digit code sent to your email" });
    }
    const record = await Otp.findOne({ email });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Code expired. Please request a new one" });
    }
    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await record.deleteOne();
      return res.status(429).json({ message: "Too many wrong attempts. Please request a new code" });
    }
    if (!(await bcrypt.compare(otp, record.codeHash))) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Incorrect code" });
    }
    await Otp.deleteOne({ email }); // a code can only be used once
   

    const user = await User.create({ email, password, role }); // the model hashes the password before saving

    res.status(201).json({
      message: "Account created successfully",
      token: makeToken(user),
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
// export async function login(req, res, next) {
//   try {
//     const email = String(req.body.email ?? "").trim().toLowerCase();
//     const password = String(req.body.password ?? "");
//     if (!email || !password) {
//       return res.status(400).json({ message: "Enter your email and password" });
//     }

//     const user = await User.findOne({ email }).select("+password");
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: "Incorrect email or password" });
//     }

//     res.json({ message: "Logged in", token: makeToken(user), user: safeUser(user) });
//   } catch (err) {
//     next(err);
//   }
// }
export async function login(req, res, next) {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
 
    // The password is hidden by default in the model (select: false), so we ask for it here
    const user = await User.findOne({ email }).select("+password");
 
    // Same message whether the email does not exist or the password is wrong,
    // so nobody can use the login form to find out which emails have accounts
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isActive) {
  return res.status(403).json({
    message: "Your account has been deactivated. Please contact admin.",
  });
}
 
    res.status(200).json({
      message: "Login successful",
      token: makeToken(user),   // the teammate's version returned no token; the frontend needs one to stay logged in
      user: safeUser(user),
    });
  } catch (err) {
    next(err); // errorHandler middleware logs it and sends "Something went wrong on the server"
  }
}
 
// Lets routes written for the teammate's name keep working:  import { loginUser } from ...
export { login as loginUser };

// POST /api/auth/google   body: { credential, role? }
export async function googleAuth(req, res, next) {
  try {
    const credential = String(req.body.credential ?? "");
    const role = String(req.body.role ?? "");
    if (!credential) return res.status(400).json({ message: "Google sign-in failed" });

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ message: "Google sign-in failed" });
    }
    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ message: "Your Google email is not verified" });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      if (!ROLES.includes(role)) {
        return res.status(404).json({ message: "No account found. Please sign up first" });
      }
      user = await User.create({ email, name: payload.name ?? "", googleId: payload.sub, role });
    } else if (!user.googleId) {
      // Existing email account: link Google to it (safe, Google verified the email)
      await User.updateOne({ _id: user._id }, { googleId: payload.sub });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated. Please contact admin." });
    }

    res.status(200).json({ message: "Login successful", token: makeToken(user), user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}
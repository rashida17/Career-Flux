// Backend logic signup and login 
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
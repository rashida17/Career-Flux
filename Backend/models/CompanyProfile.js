import mongoose from "mongoose";

export const OWNERSHIP = ["Private Limited", "Public Limited", "Sole Proprietorship", "Partnership", "Government / Public Sector", "Non-Profit / NGO", "Startup"];
export const SIZES = ["1 - 10 Employees", "11 - 50 Employees", "51 - 200 Employees", "201 - 500 Employees", "501 - 1000 Employees", "1000+ Employees"];
export const INDUSTRIES = ["Information Technology", "Software & Cloud", "Banking & Finance", "Healthcare", "Education", "Manufacturing", "Retail & E-commerce", "Telecommunications", "Construction & Real Estate", "Marketing & Advertising", "Other"];

const companyProfileSchema = new mongoose.Schema(
  {
    // one company profile per employer account
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },

    companyName: { type: String, required: true, trim: true, maxlength: 120 },
    logo: { type: String, required: true },       // stored as relative path e.g. /uploads/logos/xxx.png
    coverImage: { type: String, default: "" },    // relative path
    establishedDate: { type: String, required: true }, // "YYYY-MM-DD" (matches <input type="date">)
    ownership: { type: String, enum: OWNERSHIP, required: true },
    size: { type: String, enum: SIZES, required: true },
    industry: { type: String, enum: INDUSTRIES, required: true },
    website: { type: String, trim: true, default: "" },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    address: { type: String, trim: true, default: "", maxlength: 250 },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    contactPhone: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true, minlength: 30, maxlength: 600 },

    // NEVER set from the employer form. Only your admin module should flip this.
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CompanyProfile", companyProfileSchema);
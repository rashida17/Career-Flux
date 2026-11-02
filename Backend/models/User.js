// how a user is stored in MongoDB (collection: users)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // unique = no two accounts share an email
    password: { type: String, required: true, select: false },                           // stores the HASH; hidden from queries unless asked for
    role: { type: String, enum: ["jobseeker", "employer"], required: true },             // same values the signup page sends
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// turns the plain password into a hash (only when the password was set or changed)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Used by login: compares the typed password with the stored hash
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
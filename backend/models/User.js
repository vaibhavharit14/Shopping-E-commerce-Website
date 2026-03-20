import mongoose from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, { timestamps: true });

userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  try {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
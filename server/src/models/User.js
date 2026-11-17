import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ASSISTANT", "CLIENT"], required: true, index: true },
    avatar: { type: String, default: "" },
    title: { type: String, default: "" },
    timezone: { type: String, default: "America/Los_Angeles" },
    onboardingCompleted: { type: Boolean, default: false },
    preferences: {
      autoClassify: { type: Boolean, default: true },
      digestFrequency: { type: String, enum: ["REALTIME", "DAILY", "WEEKLY"], default: "DAILY" },
      density: { type: String, enum: ["COMPACT", "COMFORTABLE"], default: "COMPACT" },
      defaultTone: { type: String, enum: ["PROFESSIONAL", "CONCISE", "WARM"], default: "PROFESSIONAL" }
    }
  },
  { timestamps: true }
);
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export {
  UserModel
};

import mongoose, { Schema } from "mongoose";
const activitySchema = new Schema(
  {
    _id: { type: String },
    userId: { type: String, ref: "User", required: true, index: true },
    userName: { type: String, required: true },
    userRole: { type: String, enum: ["ASSISTANT", "CLIENT"], required: true },
    clientId: { type: String, ref: "Client" },
    conversationId: { type: String, ref: "Conversation" },
    action: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);
const ActivityModel = mongoose.models.Activity || mongoose.model("Activity", activitySchema);
export {
  ActivityModel
};

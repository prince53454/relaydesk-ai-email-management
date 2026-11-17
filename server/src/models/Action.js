import mongoose, { Schema } from "mongoose";
const actionSchema = new Schema(
  {
    _id: { type: String },
    conversationId: { type: String, ref: "Conversation", default: "", index: true },
    clientId: { type: String, ref: "Client", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["URGENT", "HIGH", "MEDIUM", "LOW"], default: "MEDIUM" },
    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED"], default: "PENDING", index: true },
    assignedTo: { type: String, default: "" },
    sourceType: { type: String, enum: ["AI_EXTRACTED", "MANUAL"], default: "AI_EXTRACTED" }
  },
  { timestamps: true }
);
const ActionModel = mongoose.models.Action || mongoose.model("Action", actionSchema);
export {
  ActionModel
};

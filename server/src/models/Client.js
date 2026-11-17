import mongoose, { Schema } from "mongoose";
const clientSchema = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    company: { type: String, default: "" },
    roleTitle: { type: String, default: "" },
    avatar: { type: String, default: "" },
    assistantId: { type: String, ref: "User", required: true, index: true },
    userId: { type: String, ref: "User", index: true },
    vipSenders: [{ type: String }],
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);
const ClientModel = mongoose.models.Client || mongoose.model("Client", clientSchema);
export {
  ClientModel
};

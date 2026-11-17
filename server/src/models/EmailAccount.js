import mongoose, { Schema } from "mongoose";
const emailAccountSchema = new Schema(
  {
    _id: { type: String },
    userId: { type: String, ref: "User", required: true, index: true },
    clientId: { type: String, ref: "Client", required: true, index: true },
    provider: { type: String, enum: ["GMAIL", "OUTLOOK"], required: true },
    emailAddress: { type: String, required: true, lowercase: true, trim: true },
    displayName: { type: String, default: "" },
    connectionStatus: {
      type: String,
      enum: ["CONNECTED_DEMO", "CONNECTED_OAUTH", "DISCONNECTED"],
      default: "CONNECTED_DEMO"
    },
    isSimulated: { type: Boolean, default: true },
    oauthTokens: { type: String, default: "" },
    lastSyncedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);
const EmailAccountModel = mongoose.models.EmailAccount || mongoose.model("EmailAccount", emailAccountSchema);
export {
  EmailAccountModel
};

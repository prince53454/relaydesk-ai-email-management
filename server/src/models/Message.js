import mongoose, { Schema } from "mongoose";
const participantSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true }
  },
  { _id: false }
);
const attachmentSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    mimeType: { type: String, required: true }
  },
  { _id: false }
);
const messageSchema = new Schema(
  {
    _id: { type: String },
    conversationId: { type: String, ref: "Conversation", required: true, index: true },
    providerMessageId: { type: String, default: "", index: true },
    isUnread: { type: Boolean, default: false },
    sender: { type: participantSchema, required: true },
    recipients: [participantSchema],
    body: { type: String, required: true },
    direction: { type: String, enum: ["INBOUND", "OUTBOUND"], default: "INBOUND" },
    isSimulatedSend: { type: Boolean, default: false },
    sentByUserId: { type: String, ref: "User" },
    receivedAt: { type: Date, default: Date.now, index: true },
    attachments: [attachmentSchema]
  },
  { timestamps: true }
);
const MessageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);
export {
  MessageModel
};

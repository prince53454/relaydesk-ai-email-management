import mongoose, { Schema } from "mongoose";
const participantSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true }
  },
  { _id: false }
);
const summarySchema = new Schema(
  {
    overview: { type: String, default: "" },
    mainTopic: { type: String, default: "" },
    importantInformation: [{ type: String }],
    decisions: [{ type: String }],
    requests: [{ type: String }],
    pendingActions: [{ type: String }],
    deadlines: [{ type: String }],
    nextSteps: [{ type: String }],
    generatedBy: { type: String, enum: ["AI_GEMINI", "AI_FALLBACK", "SEEDED"], default: "SEEDED" },
    generatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);
const historyEntrySchema = new Schema(
  {
    classification: {
      type: String,
      enum: ["ASSISTANT_TO_REPLY", "CLIENT_TO_REPLY", "NO_REPLY_NEEDED", "NEEDS_REVIEW"],
      required: true
    },
    confidence: { type: Number, min: 0, max: 1, required: true },
    reason: { type: String, required: true },
    source: {
      type: String,
      enum: ["AI_GEMINI", "AI_FALLBACK", "MANUAL_OVERRIDE", "CLIENT_HANDOVER"],
      required: true
    },
    changedBy: { type: String, required: true },
    changedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);
const noteSchema = new Schema(
  {
    id: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, enum: ["ASSISTANT", "CLIENT"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);
const conversationSchema = new Schema(
  {
    _id: { type: String },
    emailAccountId: { type: String, ref: "EmailAccount", required: true, index: true },
    providerMessageId: { type: String, default: "", index: true },
    providerThreadId: { type: String, default: "" },
    providerMessageHeaderId: { type: String, default: "" },
    clientId: { type: String, ref: "Client", required: true, index: true },
    subject: { type: String, required: true, trim: true },
    snippet: { type: String, default: "" },
    sender: { type: participantSchema, required: true },
    participants: [participantSchema],
    classification: {
      type: String,
      enum: ["ASSISTANT_TO_REPLY", "CLIENT_TO_REPLY", "NO_REPLY_NEEDED", "NEEDS_REVIEW"],
      required: true,
      index: true
    },
    confidence: { type: Number, min: 0, max: 1, default: 0.85 },
    confidenceBand: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], default: "HIGH" },
    classificationReason: { type: String, default: "" },
    classificationSource: {
      type: String,
      enum: ["AI_GEMINI", "AI_FALLBACK", "MANUAL_OVERRIDE", "CLIENT_HANDOVER"],
      default: "AI_FALLBACK"
    },
    manualOverride: { type: Boolean, default: false },
    suggestedAction: { type: String, default: "" },
    suggestedDraft: { type: String, default: "" },
    summary: { type: summarySchema, default: () => ({}) },
    priority: { type: String, enum: ["URGENT", "HIGH", "MEDIUM", "LOW"], default: "MEDIUM", index: true },
    status: {
      type: String,
      enum: ["OPEN", "WAITING_FOR_RESPONSE", "COMPLETED"],
      default: "OPEN",
      index: true
    },
    assignedTo: { type: String, default: "" },
    requiresResponse: { type: Boolean, default: true },
    isImportant: { type: Boolean, default: false, index: true },
    isUnread: { type: Boolean, default: true, index: true },
    isArchived: { type: Boolean, default: false, index: true },
    labels: [{ type: String }],
    classificationHistory: [historyEntrySchema],
    internalNotes: [noteSchema],
    lastMessageAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);
conversationSchema.index({ clientId: 1, classification: 1, isArchived: 1 });
const ConversationModel = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
export {
  ConversationModel
};

import mongoose, { Schema } from "mongoose";
const participantSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true }
  },
  { _id: false }
);
const meetingSchema = new Schema(
  {
    _id: { type: String },
    conversationId: { type: String, ref: "Conversation", default: "", index: true },
    clientId: { type: String, ref: "Client", required: true, index: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    timezone: { type: String, default: "America/Los_Angeles" },
    durationMinutes: { type: Number, default: 30 },
    participants: [participantSchema],
    location: { type: String, default: "Video Conference" },
    status: {
      type: String,
      enum: ["PROPOSED", "CONFIRMED", "RESCHEDULING", "CANCELLED"],
      default: "PROPOSED",
      index: true
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);
const MeetingModel = mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);
export {
  MeetingModel
};

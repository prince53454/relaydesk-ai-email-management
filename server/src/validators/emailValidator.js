import { z } from "zod";
const updateEmailSchema = z.object({
  isImportant: z.boolean().optional(),
  isUnread: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  status: z.enum(["OPEN", "WAITING_FOR_RESPONSE", "COMPLETED"]).optional(),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).optional(),
  assignedTo: z.string().max(80).optional()
});
const overrideClassificationSchema = z.object({
  classification: z.enum([
    "ASSISTANT_TO_REPLY",
    "CLIENT_TO_REPLY",
    "NO_REPLY_NEEDED",
    "NEEDS_REVIEW"
  ]),
  reason: z.string().min(3, "Please provide a brief reason").max(500),
  assignedTo: z.string().max(80).optional()
});
const sendReplySchema = z.object({
  body: z.string().min(2, "Reply body cannot be empty").max(15e3),
  markCompleted: z.boolean().optional(),
  setWaitingForResponse: z.boolean().optional()
});
const addNoteSchema = z.object({
  content: z.string().min(2, "Note cannot be empty").max(2e3)
});
const handoverSchema = z.object({
  note: z.string().max(2e3).optional()
});
export {
  addNoteSchema,
  handoverSchema,
  overrideClassificationSchema,
  sendReplySchema,
  updateEmailSchema
};

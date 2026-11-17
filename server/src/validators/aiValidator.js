import { z } from "zod";
const classifyRequestSchema = z.object({
  conversationId: z.string().min(1),
  forceReclassify: z.boolean().optional()
});
const summarizeRequestSchema = z.object({
  conversationId: z.string().min(1)
});
const draftReplySchema = z.object({
  conversationId: z.string().min(1),
  mode: z.enum([
    "GENERATE",
    "REWRITE",
    "SHORTER",
    "FORMAL",
    "FRIENDLIER",
    "IMPROVE_GRAMMAR",
    "CUSTOM"
  ]).default("GENERATE"),
  existingDraft: z.string().max(15e3).optional(),
  instruction: z.string().max(1e3).optional(),
  tone: z.enum(["PROFESSIONAL", "CONCISE", "WARM"]).optional()
});
const chatRequestSchema = z.object({
  message: z.string().min(1, "Message is required").max(2e3),
  conversationId: z.string().optional(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(2e3)
    })
  ).max(20).optional()
});
const extractActionsSchema = z.object({
  conversationId: z.string().min(1)
});
export {
  chatRequestSchema,
  classifyRequestSchema,
  draftReplySchema,
  extractActionsSchema,
  summarizeRequestSchema
};

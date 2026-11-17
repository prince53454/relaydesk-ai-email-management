import { Router } from "express";
import {
  aiChat,
  classifyEmail,
  draftReply,
  extractActions,
  summarizeEmail
} from "../controllers/aiController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { aiRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { validateBody } from "../middleware/validateMiddleware.js";
import {
  chatRequestSchema,
  classifyRequestSchema,
  draftReplySchema,
  extractActionsSchema,
  summarizeRequestSchema
} from "../validators/aiValidator.js";
const router = Router();
router.use(authenticate);
router.use(aiRateLimiter);
router.post("/classify", validateBody(classifyRequestSchema), classifyEmail);
router.post("/summarize", validateBody(summarizeRequestSchema), summarizeEmail);
router.post("/draft-reply", validateBody(draftReplySchema), draftReply);
router.post("/chat", validateBody(chatRequestSchema), aiChat);
router.post("/extract-actions", validateBody(extractActionsSchema), extractActions);
var stdin_default = router;
export {
  stdin_default as default
};

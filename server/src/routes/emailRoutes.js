import { Router } from "express";
import {
  addInternalNote,
  getEmailById,
  listEmails,
  markCompleted,
  overrideClassification,
  requestAssistantTakeover,
  sendSimulatedReply,
  toggleArchive,
  toggleRead,
  updateEmail
} from "../controllers/emailController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateMiddleware.js";
import {
  addNoteSchema,
  handoverSchema,
  overrideClassificationSchema,
  sendReplySchema,
  updateEmailSchema
} from "../validators/emailValidator.js";
const router = Router();
router.use(authenticate);
router.get("/", listEmails);
router.get("/:id", getEmailById);
router.patch("/:id", validateBody(updateEmailSchema), updateEmail);
router.patch(
  "/:id/classification",
  validateBody(overrideClassificationSchema),
  overrideClassification
);
router.patch("/:id/archive", toggleArchive);
router.patch("/:id/read", toggleRead);
router.patch("/:id/complete", markCompleted);
router.post("/:id/reply", validateBody(sendReplySchema), sendSimulatedReply);
router.post("/:id/takeover", validateBody(handoverSchema), requestAssistantTakeover);
router.post("/:id/note", validateBody(addNoteSchema), addInternalNote);
var stdin_default = router;
export {
  stdin_default as default
};

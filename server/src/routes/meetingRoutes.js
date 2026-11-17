import { Router } from "express";
import { createMeeting, listMeetings, updateMeeting } from "../controllers/meetingController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = Router();
router.use(authenticate);
router.get("/", listMeetings);
router.post("/", createMeeting);
router.patch("/:id", updateMeeting);
var stdin_default = router;
export {
  stdin_default as default
};

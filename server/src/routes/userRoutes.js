import { Router } from "express";
import { updateUserSettings } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = Router();
router.use(authenticate);
router.patch("/settings", updateUserSettings);
var stdin_default = router;
export {
  stdin_default as default
};

import { Router } from "express";
import { createAction, listActions, updateAction } from "../controllers/actionController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = Router();
router.use(authenticate);
router.get("/", listActions);
router.post("/", createAction);
router.patch("/:id", updateAction);
var stdin_default = router;
export {
  stdin_default as default
};

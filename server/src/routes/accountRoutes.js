import { Router } from "express";
import {
  connectAccount,
  disconnectAccount,
  listAccounts,
  syncAccount,
  oauthCallback
} from "../controllers/accountController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/oauth/callback/:provider", oauthCallback);
router.use(authenticate);
router.get("/", listAccounts);
router.post("/connect", connectAccount);
router.post("/:id/sync", syncAccount);
router.delete("/:id", disconnectAccount);
var stdin_default = router;
export {
  stdin_default as default
};

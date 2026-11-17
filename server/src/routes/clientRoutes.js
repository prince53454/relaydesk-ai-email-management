import { Router } from "express";
import {
  createClient,
  getClientById,
  listClients,
  updateClient
} from "../controllers/clientController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = Router();
router.use(authenticate);
router.get("/", listClients);
router.post("/", createClient);
router.get("/:id", getClientById);
router.patch("/:id", updateClient);
var stdin_default = router;
export {
  stdin_default as default
};

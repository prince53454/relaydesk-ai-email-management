import { Router } from "express";
import {
  getDashboardActivity,
  getDashboardOverview,
  getDashboardStats
} from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = Router();
router.use(authenticate);
router.get("/stats", getDashboardStats);
router.get("/activity", getDashboardActivity);
router.get("/overview", getDashboardOverview);
var stdin_default = router;
export {
  stdin_default as default
};

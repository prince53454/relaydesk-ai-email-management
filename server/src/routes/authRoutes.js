import { Router } from "express";
import {
  completeOnboarding,
  demoSwitchRole,
  getMe,
  login,
  logout,
  register
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { loginSchema, onboardingSchema, registerSchema } from "../validators/authValidator.js";
const router = Router();
router.post("/register", authRateLimiter, validateBody(registerSchema), register);
router.post("/login", authRateLimiter, validateBody(loginSchema), login);
router.post("/demo-switch", authenticate, authRateLimiter, demoSwitchRole);
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);
router.post("/onboarding", authenticate, validateBody(onboardingSchema), completeOnboarding);
var stdin_default = router;
export {
  stdin_default as default
};

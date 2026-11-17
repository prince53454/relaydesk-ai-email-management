import rateLimit from "express-rate-limit";
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests, please try again shortly."
  }
});
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1e3,
  max: 45,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI request rate limit reached. Please wait a few seconds."
  }
});
export {
  aiRateLimiter,
  authRateLimiter
};

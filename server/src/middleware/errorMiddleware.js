import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
function notFoundHandler(req, _res, next) {
  if (req.path.startsWith("/api")) {
    return next(new ApiError(404, `API endpoint not found: ${req.method} ${req.originalUrl}`));
  }
  return next();
}
function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details
    });
  }
  if (err.message === "Origin is not allowed by CORS") {
    return res.status(403).json({ success: false, message: "Origin is not allowed by CORS" });
  }
  logger.error("Unhandled server error", err);
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message || "Internal server error"
  });
}
export {
  errorHandler,
  notFoundHandler
};

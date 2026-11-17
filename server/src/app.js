import express from "express";
import { corsMiddleware } from "./config/cors.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { aiProvider } from "./services/ai/aiProvider.js";
import { isMongoConnected } from "./config/database.js";
function createApiApp() {
  const app = express();
  app.use(corsMiddleware);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      service: "RelayDesk API",
      database: isMongoConnected() ? "mongodb" : "local-persistent-store",
      aiMode: aiProvider.isLiveAIConfigured() ? "gemini-live" : "deterministic-fallback",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/clients", clientRoutes);
  app.use("/api/emails", emailRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/meetings", meetingRoutes);
  app.use("/api/actions", actionRoutes);
  app.use("/api/accounts", accountRoutes);
  app.use("/api/*", notFoundHandler);
  app.use(errorHandler);
  return app;
}
export {
  createApiApp
};

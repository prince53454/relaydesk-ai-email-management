import path from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import { env } from "./server/src/config/environment.js";
import { connectDatabase } from "./server/src/config/database.js";
import { seedIfEmpty } from "./server/src/seed/seedDatabase.js";
import { createApiApp } from "./server/src/app.js";
import { startEmailSyncWorker } from "./server/src/services/email/syncWorker.js";
import { logger } from "./server/src/utils/logger.js";
import { errorHandler } from "./server/src/middleware/errorMiddleware.js";
async function startServer() {
  await connectDatabase();
  await seedIfEmpty(false);
  startEmailSyncWorker();
  const app = createApiApp();
  if (env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.use(errorHandler);
  app.listen(env.PORT, "0.0.0.0", () => {
    logger.info(`RelayDesk full-stack server running on http://0.0.0.0:${env.PORT}`);
  });
}
startServer().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});

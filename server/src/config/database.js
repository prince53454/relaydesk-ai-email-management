import mongoose from "mongoose";
import { env } from "./environment.js";
import { logger } from "../utils/logger.js";
import { loadLocalStore } from "./localStore.js";
let usingMongo = false;
function isMongoConnected() {
  return usingMongo && mongoose.connection.readyState === 1;
}
async function connectDatabase() {
  if (env.MONGODB_URI && env.MONGODB_URI.trim().length > 0) {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5e3
      });
      usingMongo = true;
      logger.info("Connected to MongoDB database");
      return { mode: "mongodb" };
    } catch (error) {
      logger.warn("Failed to connect to MONGODB_URI; falling back to local persistent store", error);
    }
  }
  loadLocalStore();
  usingMongo = false;
  logger.info("Initialized local persistent document store (.data/relaydesk.json)");
  return { mode: "local-store" };
}
export {
  connectDatabase,
  isMongoConnected
};

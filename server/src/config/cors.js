import cors from "cors";
import { env } from "./environment.js";
const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = [env.APP_URL, "http://localhost:3000", "http://localhost:5173"].filter(Boolean).map((value) => value.replace(/\/$/, ""));
    if (allowed.includes(origin.replace(/\/$/, ""))) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});
export {
  corsMiddleware
};

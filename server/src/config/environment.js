import dotenv from "dotenv";
dotenv.config({ path: process.env.RELAYDESK_ENV_FILE || ".env", override: true });
const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3e3),
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "relaydesk-dev-jwt-secret-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  AI_PROVIDER: process.env.AI_PROVIDER || "gemini",
  AI_MODEL: process.env.AI_MODEL || "gemini-3.8-flash",
  APP_URL: process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER || "",
  REGISTRATION_EMAIL_FROM: process.env.REGISTRATION_EMAIL_FROM || ""
};
if (!Number.isInteger(env.PORT) || env.PORT < 1 || env.PORT > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}
if (env.NODE_ENV === "production" && env.JWT_SECRET === "relaydesk-dev-jwt-secret-change-in-production") {
  throw new Error("Set a unique JWT_SECRET before starting RelayDesk in production");
}
export {
  env
};

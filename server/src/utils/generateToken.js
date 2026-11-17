import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";
function generateToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
}
function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
export {
  generateToken,
  verifyToken
};

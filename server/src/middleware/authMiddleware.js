import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/generateToken.js";
import { dataStore } from "../repositories/dataStore.js";
async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    if (!token) {
      return next(new ApiError(401, "Authentication required. Please sign in."));
    }
    const decoded = verifyToken(token);
    const user = await dataStore.findUserById(decoded.userId);
    if (!user) {
      return next(new ApiError(401, "Session invalid or user no longer exists."));
    }
    const { password: _pwd, ...safeUser } = user;
    req.user = safeUser;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired authentication token."));
  }
}
export {
  authenticate
};

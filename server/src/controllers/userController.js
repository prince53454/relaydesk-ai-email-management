import { dataStore } from "../repositories/dataStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { recordActivity } from "../services/notificationService.js";
const updateUserSettings = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { name, title, timezone, preferences } = req.body;
  const updated = await dataStore.updateUser(req.user.id, {
    ...name ? { name: String(name).trim() } : {},
    ...title !== void 0 ? { title: String(title).trim() } : {},
    ...timezone ? { timezone: String(timezone) } : {},
    ...preferences ? {
      preferences: {
        ...req.user.preferences,
        ...preferences
      }
    } : {}
  });
  if (!updated) throw new ApiError(404, "User not found");
  const { password: _p, ...safeUser } = updated;
  await recordActivity({
    user: safeUser,
    action: "SETTINGS_UPDATED",
    description: `${safeUser.name} updated workspace preferences`
  });
  return sendSuccess(res, { user: safeUser }, "Settings saved");
});
export {
  updateUserSettings
};

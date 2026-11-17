import { dataStore, newId } from "../repositories/dataStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getAuthorizedClientIds, getAuthorizedClients } from "../services/accessService.js";
import { recordActivity } from "../services/notificationService.js";
const listMeetings = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const clients = await getAuthorizedClients(req.user);
  const allowedIds = new Set(clients.map((c) => c.id));
  const clientsMap = new Map(clients.map((c) => [c.id, c]));
  const conversations = await dataStore.listConversations();
  const convMap = new Map(conversations.map((c) => [c.id, c]));
  const all = await dataStore.listMeetings();
  const requestedClientId = String(req.query.clientId || "");
  if (requestedClientId && !allowedIds.has(requestedClientId)) throw new ApiError(403, "Unauthorized client workspace");
  const filtered = all.filter((m) => allowedIds.has(m.clientId) && (!requestedClientId || m.clientId === requestedClientId)).map((m) => ({
    ...m,
    clientName: clientsMap.get(m.clientId)?.name || "Client",
    conversationSubject: convMap.get(m.conversationId)?.subject || ""
  }));
  return sendSuccess(res, { meetings: filtered });
});
const createMeeting = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { conversationId, clientId, title, date, time, timezone, durationMinutes, location, participants } = req.body;
  if (!title || !date || !time) {
    throw new ApiError(400, "Meeting title, date, and time are required");
  }
  const allowedIds = await getAuthorizedClientIds(req.user);
  const targetClientId = clientId || allowedIds[0];
  if (!targetClientId || !allowedIds.includes(targetClientId)) {
    throw new ApiError(403, "Unauthorized client workspace");
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const meeting = await dataStore.createMeeting({
    id: newId(),
    conversationId: conversationId || "",
    clientId: targetClientId,
    title: String(title).trim(),
    date: String(date),
    time: String(time),
    timezone: timezone || req.user.timezone || "America/Los_Angeles",
    durationMinutes: Number(durationMinutes) || 30,
    participants: Array.isArray(participants) ? participants : [],
    location: location || "Video Conference",
    status: "PROPOSED",
    createdAt: now,
    updatedAt: now
  });
  await recordActivity({
    user: req.user,
    clientId: targetClientId,
    conversationId,
    action: "MEETING_CREATED",
    description: `Scheduled "${meeting.title}" for ${meeting.date} at ${meeting.time}`
  });
  return sendSuccess(res, { meeting }, "Meeting added", 201);
});
const updateMeeting = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const id = String(req.params.id);
  const existing = await dataStore.findMeetingById(id);
  if (!existing) throw new ApiError(404, "Meeting not found");
  const allowedIds = await getAuthorizedClientIds(req.user);
  if (!allowedIds.includes(existing.clientId)) {
    throw new ApiError(403, "Access denied");
  }
  const updated = await dataStore.updateMeeting(id, req.body);
  await recordActivity({
    user: req.user,
    clientId: existing.clientId,
    conversationId: existing.conversationId,
    action: "MEETING_UPDATED",
    description: `Updated "${existing.title}" (${req.body.status || "details updated"})`
  });
  return sendSuccess(res, { meeting: updated }, "Meeting updated");
});
export {
  createMeeting,
  listMeetings,
  updateMeeting
};

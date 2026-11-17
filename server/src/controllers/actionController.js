import { dataStore, newId } from "../repositories/dataStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getAuthorizedClientIds, getAuthorizedClients } from "../services/accessService.js";
import { recordActivity } from "../services/notificationService.js";
const listActions = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const clients = await getAuthorizedClients(req.user);
  const allowedIds = new Set(clients.map((c) => c.id));
  const clientsMap = new Map(clients.map((c) => [c.id, c]));
  const conversations = await dataStore.listConversations();
  const convMap = new Map(conversations.map((c) => [c.id, c]));
  const all = await dataStore.listActions();
  const requestedClientId = String(req.query.clientId || "");
  if (requestedClientId && !allowedIds.has(requestedClientId)) throw new ApiError(403, "Unauthorized client workspace");
  const filtered = all.filter((a) => allowedIds.has(a.clientId) && (!requestedClientId || a.clientId === requestedClientId)).map((a) => ({
    ...a,
    clientName: clientsMap.get(a.clientId)?.name || "Client",
    conversationSubject: convMap.get(a.conversationId)?.subject || "Email thread"
  }));
  return sendSuccess(res, { actions: filtered });
});
const createAction = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { conversationId, clientId, title, description, dueDate, priority, assignedTo } = req.body;
  if (!title || !String(title).trim()) throw new ApiError(400, "Action title is required");
  if (dueDate && Number.isNaN(Date.parse(dueDate))) throw new ApiError(400, "Action due date must be a valid date");
  const allowedIds = await getAuthorizedClientIds(req.user);
  const targetClientId = clientId || allowedIds[0];
  if (!targetClientId || !allowedIds.includes(targetClientId)) {
    throw new ApiError(403, "Unauthorized client workspace");
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const action = await dataStore.createAction({
    id: newId(),
    conversationId: conversationId || "",
    clientId: targetClientId,
    title: String(title).trim(),
    description: description ? String(description) : "",
    dueDate: dueDate || new Date(Date.now() + 864e5).toISOString(),
    priority: priority || "MEDIUM",
    status: "PENDING",
    assignedTo: assignedTo || req.user.name,
    sourceType: "MANUAL",
    createdAt: now,
    updatedAt: now
  });
  await recordActivity({
    user: req.user,
    clientId: targetClientId,
    conversationId,
    action: "ACTION_CREATED",
    description: `Created follow-up task "${action.title}"`
  });
  return sendSuccess(res, { action }, "Action created", 201);
});
const updateAction = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const id = String(req.params.id);
  const existing = await dataStore.findActionById(id);
  if (!existing) throw new ApiError(404, "Action not found");
  const allowedIds = await getAuthorizedClientIds(req.user);
  if (!allowedIds.includes(existing.clientId)) {
    throw new ApiError(403, "Access denied");
  }
  const updated = await dataStore.updateAction(id, req.body);
  if (req.body.status === "COMPLETED") {
    await recordActivity({
      user: req.user,
      clientId: existing.clientId,
      conversationId: existing.conversationId,
      action: "ACTION_COMPLETED",
      description: `Completed task "${existing.title}"`
    });
  }
  return sendSuccess(res, { action: updated }, "Action updated");
});
export {
  createAction,
  listActions,
  updateAction
};

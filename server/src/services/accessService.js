import { dataStore } from "../repositories/dataStore.js";
import { ApiError } from "../utils/ApiError.js";
async function getAuthorizedClientIds(user) {
  const clients = await dataStore.listClients();
  if (user.role === "CLIENT") {
    return clients.filter((c) => c.userId === user.id || c.email.toLowerCase() === user.email.toLowerCase()).map((c) => c.id);
  }
  const owned = clients.filter((c) => c.assistantId === user.id).map((c) => c.id);
  return owned;
}
async function getAuthorizedClients(user) {
  const ids = new Set(await getAuthorizedClientIds(user));
  const clients = await dataStore.listClients();
  return clients.filter((c) => ids.has(c.id));
}
async function getAuthorizedConversations(user) {
  const allowedIds = new Set(await getAuthorizedClientIds(user));
  const all = await dataStore.listConversations();
  return all.filter((c) => allowedIds.has(c.clientId));
}
async function assertConversationAccess(user, conversationId) {
  const conv = await dataStore.findConversationById(conversationId);
  if (!conv) {
    throw new ApiError(404, "Conversation not found");
  }
  const allowedIds = new Set(await getAuthorizedClientIds(user));
  if (!allowedIds.has(conv.clientId)) {
    throw new ApiError(403, "You do not have access to this conversation");
  }
  return conv;
}
export {
  assertConversationAccess,
  getAuthorizedClientIds,
  getAuthorizedClients,
  getAuthorizedConversations
};

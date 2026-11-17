import { dataStore, newId } from "../repositories/dataStore.js";
async function recordActivity(params) {
  return dataStore.createActivity({
    id: newId(),
    userId: params.user.id,
    userName: params.user.name,
    userRole: params.user.role,
    clientId: params.clientId,
    conversationId: params.conversationId,
    action: params.action,
    description: params.description,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}
export {
  recordActivity
};

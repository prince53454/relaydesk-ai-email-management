import { dataStore, newId } from "../repositories/dataStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import {
  getAuthorizedClientIds,
  getAuthorizedClients,
  getAuthorizedConversations
} from "../services/accessService.js";
import { recordActivity } from "../services/notificationService.js";
const listClients = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const clients = await getAuthorizedClients(req.user);
  const conversations = await getAuthorizedConversations(req.user);
  const accounts = await dataStore.listEmailAccounts();
  const enriched = clients.map((client) => {
    const clientConvs = conversations.filter((c) => c.clientId === client.id && !c.isArchived);
    return {
      ...client,
      stats: {
        total: clientConvs.length,
        unread: clientConvs.filter((c) => c.isUnread).length,
        clientToReply: clientConvs.filter((c) => c.classification === "CLIENT_TO_REPLY").length,
        assistantToReply: clientConvs.filter((c) => c.classification === "ASSISTANT_TO_REPLY").length
      },
      connectedAccounts: accounts.filter((a) => a.clientId === client.id)
    };
  });
  return sendSuccess(res, { clients: enriched });
});
const getClientById = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const id = String(req.params.id);
  const allowed = await getAuthorizedClientIds(req.user);
  if (!allowed.includes(id)) {
    throw new ApiError(403, "Access denied to this client profile");
  }
  const client = await dataStore.findClientById(id);
  if (!client) throw new ApiError(404, "Client not found");
  return sendSuccess(res, { client });
});
const createClient = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  if (req.user.role !== "ASSISTANT") {
    throw new ApiError(403, "Only assistants can add new managed clients");
  }
  const { name, email, company, roleTitle, notes } = req.body;
  if (!name || !email) {
    throw new ApiError(400, "Client name and email are required");
  }
  const client = await dataStore.createClient({
    id: newId(),
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    company: company ? String(company).trim() : "Independent",
    roleTitle: roleTitle ? String(roleTitle).trim() : "Executive",
    avatar: "",
    assistantId: req.user.id,
    vipSenders: [],
    notes: notes ? String(notes) : "",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  await recordActivity({
    user: req.user,
    clientId: client.id,
    action: "CLIENT_CREATED",
    description: `Added managed client ${client.name} (${client.company})`
  });
  return sendSuccess(res, { client }, "Client created", 201);
});
const updateClient = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  if (req.user.role !== "ASSISTANT") {
    throw new ApiError(403, "Only assistants can update client profiles");
  }
  const id = String(req.params.id);
  const allowed = await getAuthorizedClientIds(req.user);
  if (!allowed.includes(id)) {
    throw new ApiError(403, "Access denied");
  }
  const updated = await dataStore.updateClient(id, req.body);
  if (!updated) throw new ApiError(404, "Client not found");
  return sendSuccess(res, { client: updated }, "Client updated");
});
export {
  createClient,
  getClientById,
  listClients,
  updateClient
};

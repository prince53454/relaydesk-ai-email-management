import { dataStore, newId } from "../repositories/dataStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import {
  assertConversationAccess,
  getAuthorizedClients,
  getAuthorizedConversations
} from "../services/accessService.js";
import { recordActivity } from "../services/notificationService.js";
import { gmailService } from "../services/email/gmailService.js";
import { outlookService } from "../services/email/outlookService.js";
import { decryptTokens } from "../services/email/tokenVault.js";
const PRIORITY_RANK = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
const listEmails = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const [conversations, clients, actions] = await Promise.all([
    getAuthorizedConversations(req.user),
    getAuthorizedClients(req.user),
    dataStore.listActions()
  ]);
  const clientsMap = new Map(clients.map((c) => [c.id, c]));
  const {
    classification,
    clientId,
    search,
    unread,
    important,
    archived,
    status,
    priority,
    actionRequired,
    sort = "newest",
    page = "1",
    limit = "30"
  } = req.query;
  let filtered = conversations;
  if (archived === "true") {
    filtered = filtered.filter((c) => c.isArchived);
  } else if (archived !== "all") {
    filtered = filtered.filter((c) => !c.isArchived);
  }
  if (classification && classification !== "ALL") {
    filtered = filtered.filter((c) => c.classification === classification);
  }
  if (clientId && clientId !== "ALL") {
    filtered = filtered.filter((c) => c.clientId === clientId);
  }
  if (unread === "true") {
    filtered = filtered.filter((c) => c.isUnread);
  }
  if (important === "true") {
    filtered = filtered.filter((c) => c.isImportant);
  }
  if (status && status !== "ALL") {
    filtered = status === "ACTIVE"
      ? filtered.filter((c) => c.status !== "COMPLETED")
      : filtered.filter((c) => c.status === status);
  }
  if (priority && priority !== "ALL") {
    filtered = filtered.filter((c) => c.priority === priority);
  }
  if (actionRequired === "true") {
    const activeActionConvIds = new Set(
      actions.filter((a) => a.status !== "COMPLETED").map((a) => a.conversationId)
    );
    filtered = filtered.filter(
      (c) => c.requiresResponse && c.status !== "COMPLETED" || activeActionConvIds.has(c.id)
    );
  }
  if (search && search.trim().length > 0) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (c) => c.subject.toLowerCase().includes(q) || c.snippet.toLowerCase().includes(q) || c.sender.name.toLowerCase().includes(q) || c.sender.email.toLowerCase().includes(q) || c.classificationReason.toLowerCase().includes(q) || (c.summary?.overview || "").toLowerCase().includes(q)
    );
  }
  if (sort === "oldest") {
    filtered.sort(
      (a, b) => new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime()
    );
  } else if (sort === "priority") {
    filtered.sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]);
  } else if (sort === "confidence_asc") {
    filtered.sort((a, b) => a.confidence - b.confidence);
  } else {
    filtered.sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  }
  const pageNum = Math.max(1, parseInt(page || "1", 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || "30", 10) || 30));
  const total = filtered.length;
  const start = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(start, start + limitNum).map((c) => ({
    ...c,
    clientName: clientsMap.get(c.clientId)?.name || "Client",
    clientCompany: clientsMap.get(c.clientId)?.company || "",
    clientAvatar: clientsMap.get(c.clientId)?.avatar || ""
  }));
  return sendSuccess(res, {
    emails: paginated,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.max(1, Math.ceil(total / limitNum))
    }
  });
});
const getEmailById = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const conv = await assertConversationAccess(req.user, String(req.params.id));
  const [messages, client, account, allActions, allMeetings] = await Promise.all([
    dataStore.listMessagesByConversation(conv.id),
    dataStore.findClientById(conv.clientId),
    dataStore.findEmailAccountById(conv.emailAccountId),
    dataStore.listActions(),
    dataStore.listMeetings()
  ]);
  const actions = allActions.filter((a) => a.conversationId === conv.id);
  const meetings = allMeetings.filter((m) => m.conversationId === conv.id);
  return sendSuccess(res, {
    email: {
      ...conv,
      clientName: client?.name || "Client",
      clientCompany: client?.company || "",
      clientEmail: client?.email || "",
      emailMode: account && !account.isSimulated ? "LIVE_OAUTH" : "SIMULATED_DEMO"
    },
    messages,
    actions,
    meetings
  });
});
const updateEmail = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const existing = await assertConversationAccess(req.user, String(req.params.id));
  const updated = await dataStore.updateConversation(existing.id, req.body);
  if (req.body.isImportant !== void 0) {
    await recordActivity({
      user: req.user,
      clientId: existing.clientId,
      conversationId: existing.id,
      action: req.body.isImportant ? "MARKED_IMPORTANT" : "UNMARKED_IMPORTANT",
      description: `${req.body.isImportant ? "Starred" : "Unstarred"} "${existing.subject}"`
    });
  }
  return sendSuccess(res, { email: updated }, "Conversation updated");
});
const overrideClassification = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const existing = await assertConversationAccess(req.user, String(req.params.id));
  const { classification, reason, assignedTo } = req.body;
  const historyEntry = {
    classification,
    confidence: 1,
    reason,
    source: "MANUAL_OVERRIDE",
    changedBy: req.user.name,
    changedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const defaultAssignee = classification === "CLIENT_TO_REPLY" ? "Client" : classification === "ASSISTANT_TO_REPLY" ? req.user.name : "None";
  const updated = await dataStore.updateConversation(existing.id, {
    classification,
    ...(classification === "CLIENT_TO_REPLY" ? { status: "OPEN" } : {}),
    confidence: 1,
    confidenceBand: "HIGH",
    classificationReason: reason,
    classificationSource: "MANUAL_OVERRIDE",
    manualOverride: true,
    assignedTo: assignedTo || defaultAssignee,
    requiresResponse: classification !== "NO_REPLY_NEEDED",
    classificationHistory: [...existing.classificationHistory || [], historyEntry]
  });
  await recordActivity({
    user: req.user,
    clientId: existing.clientId,
    conversationId: existing.id,
    action: "CLASSIFICATION_OVERRIDDEN",
    description: `Manually changed "${existing.subject}" to ${classification.replace(/_/g, " ")}`
  });
  return sendSuccess(res, { email: updated }, "Classification overridden");
});
const toggleArchive = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const existing = await assertConversationAccess(req.user, String(req.params.id));
  const nextArchived = typeof req.body?.isArchived === "boolean" ? req.body.isArchived : !existing.isArchived;
  const updated = await dataStore.updateConversation(existing.id, { isArchived: nextArchived });
  await recordActivity({
    user: req.user,
    clientId: existing.clientId,
    conversationId: existing.id,
    action: nextArchived ? "ARCHIVED_EMAIL" : "RESTORED_EMAIL",
    description: `${nextArchived ? "Archived" : "Restored"} "${existing.subject}"`
  });
  return sendSuccess(
    res,
    { email: updated },
    nextArchived ? "Conversation archived" : "Conversation restored"
  );
});
const toggleRead = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const existing = await assertConversationAccess(req.user, String(req.params.id));
  const nextUnread = typeof req.body?.isUnread === "boolean" ? req.body.isUnread : !existing.isUnread;
  const updated = await dataStore.updateConversation(existing.id, { isUnread: nextUnread });
  return sendSuccess(res, { email: updated }, nextUnread ? "Marked unread" : "Marked read");
});
const markCompleted = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const existing = await assertConversationAccess(req.user, String(req.params.id));
  const nextStatus = req.body?.status && ["OPEN", "WAITING_FOR_RESPONSE", "COMPLETED"].includes(req.body.status) ? req.body.status : existing.status === "COMPLETED" ? "OPEN" : "COMPLETED";
  const updated = await dataStore.updateConversation(existing.id, {
    status: nextStatus,
    requiresResponse: nextStatus === "OPEN",
    isUnread: false
  });
  await recordActivity({
    user: req.user,
    clientId: existing.clientId,
    conversationId: existing.id,
    action: nextStatus === "COMPLETED" ? "MATTER_HANDLED" : "MATTER_REOPENED",
    description: `${req.user.name} marked "${existing.subject}" as ${nextStatus.toLowerCase()}`
  });
  return sendSuccess(res, { email: updated }, `Conversation marked ${nextStatus.toLowerCase()}`);
});
const sendSimulatedReply = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const existing = await assertConversationAccess(req.user, String(req.params.id));
  const { body, markCompleted: completeAfter = false, setWaitingForResponse = true } = req.body;
  const account = await dataStore.findEmailAccountById(existing.emailAccountId);
  const isLiveSend = Boolean(account && !account.isSimulated && account.oauthTokens);
  if (isLiveSend) {
    const tokens = decryptTokens(account.oauthTokens);
    const adapter = account.provider === "GMAIL" ? gmailService : outlookService;
    await adapter.sendReply({ ...account, oauthTokens: tokens }, existing, body.trim());
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const message = await dataStore.createMessage({
    id: newId(),
    conversationId: existing.id,
    sender: { name: req.user.name, email: req.user.email },
    recipients: [existing.sender],
    body: body.trim(),
    direction: "OUTBOUND",
    isSimulatedSend: !isLiveSend,
    sentByUserId: req.user.id,
    receivedAt: now,
    attachments: []
  });
  const nextStatus = completeAfter ? "COMPLETED" : setWaitingForResponse ? "WAITING_FOR_RESPONSE" : "OPEN";
  const updated = await dataStore.updateConversation(existing.id, {
    snippet: body.trim().slice(0, 140),
    status: nextStatus,
    isUnread: false,
    requiresResponse: false,
    lastMessageAt: now
  });
  await recordActivity({
    user: req.user,
    clientId: existing.clientId,
    conversationId: existing.id,
    action: isLiveSend ? "EMAIL_REPLY_SENT" : "SIMULATED_REPLY_SENT",
    description: `${req.user.name} sent ${isLiveSend ? "a reply" : "a simulated reply"} on "${existing.subject}"`
  });
  return sendSuccess(
    res,
    { email: updated, message, isSimulatedSend: !isLiveSend },
    isLiveSend ? "Reply sent through connected mailbox" : "Simulated reply sent and logged in thread"
  );
});
const requestAssistantTakeover = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const existing = await assertConversationAccess(req.user, String(req.params.id));
  const client = await dataStore.findClientById(existing.clientId);
  const assistant = client ? await dataStore.findUserById(client.assistantId) : null;
  const assistantName = assistant?.name || "Executive Assistant";
  const noteText = req.body?.note?.trim();
  const notes = [...existing.internalNotes || []];
  if (noteText) {
    notes.push({
      id: newId(),
      authorId: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content: `Handover instruction: ${noteText}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  const reason = noteText ? `Client requested assistant takeover: "${noteText}"` : `Client (${req.user.name}) asked executive assistant to take over this conversation.`;
  const updated = await dataStore.updateConversation(existing.id, {
    classification: "ASSISTANT_TO_REPLY",
    confidence: 1,
    confidenceBand: "HIGH",
    classificationReason: reason,
    classificationSource: "CLIENT_HANDOVER",
    manualOverride: true,
    assignedTo: assistantName,
    status: "OPEN",
    requiresResponse: true,
    internalNotes: notes,
    classificationHistory: [
      ...existing.classificationHistory || [],
      {
        classification: "ASSISTANT_TO_REPLY",
        confidence: 1,
        reason,
        source: "CLIENT_HANDOVER",
        changedBy: req.user.name,
        changedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ]
  });
  await recordActivity({
    user: req.user,
    clientId: existing.clientId,
    conversationId: existing.id,
    action: "CLIENT_HANDOVER",
    description: `${req.user.name} handed over "${existing.subject}" to ${assistantName}`
  });
  return sendSuccess(res, { email: updated }, `Handed over to ${assistantName}`);
});
const addInternalNote = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const existing = await assertConversationAccess(req.user, String(req.params.id));
  const newNote = {
    id: newId(),
    authorId: req.user.id,
    authorName: req.user.name,
    authorRole: req.user.role,
    content: req.body.content.trim(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const updated = await dataStore.updateConversation(existing.id, {
    internalNotes: [...existing.internalNotes || [], newNote]
  });
  await recordActivity({
    user: req.user,
    clientId: existing.clientId,
    conversationId: existing.id,
    action: "NOTE_ADDED",
    description: `${req.user.name} added an instruction note on "${existing.subject}"`
  });
  return sendSuccess(res, { email: updated, note: newNote }, "Note added");
});
export {
  addInternalNote,
  getEmailById,
  listEmails,
  markCompleted,
  overrideClassification,
  requestAssistantTakeover,
  sendSimulatedReply,
  toggleArchive,
  toggleRead,
  updateEmail
};

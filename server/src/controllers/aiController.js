import { dataStore, newId } from "../repositories/dataStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import {
  assertConversationAccess,
  getAuthorizedClients,
  getAuthorizedConversations
} from "../services/accessService.js";
import { classifyConversation } from "../services/ai/classificationService.js";
import { summarizeConversation } from "../services/ai/summaryService.js";
import { generateReplyDraft } from "../services/ai/replyService.js";
import { extractActionsAndMeetings } from "../services/ai/actionExtractionService.js";
import { runDatabaseGroundedChat } from "../services/ai/chatService.js";
import { recordActivity } from "../services/notificationService.js";
const classifyEmail = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { conversationId, forceReclassify } = req.body;
  const conv = await assertConversationAccess(req.user, conversationId);
  if (conv.manualOverride && !forceReclassify) {
    return sendSuccess(
      res,
      {
        email: conv,
        skippedBecauseManualOverride: true,
        isFallback: false
      },
      "Manual override active; pass forceReclassify=true to re-run AI classification"
    );
  }
  const [messages, client] = await Promise.all([
    dataStore.listMessagesByConversation(conv.id),
    dataStore.findClientById(conv.clientId)
  ]);
  const result = await classifyConversation(conv, messages, client);
  const historyEntry = {
    classification: result.classification,
    confidence: result.confidence,
    reason: result.reason,
    source: result.provider,
    changedBy: req.user.name,
    changedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const updated = await dataStore.updateConversation(conv.id, {
    classification: result.classification,
    confidence: result.confidence,
    confidenceBand: result.confidenceBand,
    classificationReason: result.reason,
    classificationSource: result.provider,
    manualOverride: false,
    suggestedAction: result.suggestedAction,
    priority: result.priority,
    requiresResponse: result.requiresResponse,
    classificationHistory: [...conv.classificationHistory || [], historyEntry]
  });
  await recordActivity({
    user: req.user,
    clientId: conv.clientId,
    conversationId: conv.id,
    action: "AI_CLASSIFIED",
    description: `Classified "${conv.subject}" as ${result.classification.replace(/_/g, " ")} (${Math.round(result.confidence * 100)}%)`
  });
  return sendSuccess(
    res,
    {
      email: updated,
      classificationResult: result,
      isFallback: result.isFallback,
      model: result.model
    },
    result.isFallback ? "Classified using deterministic fallback classifier (AI key not active)" : "AI classification complete"
  );
});
const summarizeEmail = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { conversationId } = req.body;
  const conv = await assertConversationAccess(req.user, conversationId);
  const [messages, client] = await Promise.all([
    dataStore.listMessagesByConversation(conv.id),
    dataStore.findClientById(conv.clientId)
  ]);
  const result = await summarizeConversation(conv, messages, client);
  const updated = await dataStore.updateConversation(conv.id, {
    summary: result.summary
  });
  await recordActivity({
    user: req.user,
    clientId: conv.clientId,
    conversationId: conv.id,
    action: "AI_SUMMARIZED",
    description: `Generated structured summary for "${conv.subject}"`
  });
  return sendSuccess(
    res,
    {
      email: updated,
      summary: result.summary,
      isFallback: result.isFallback,
      model: result.model
    },
    "Summary generated"
  );
});
const draftReply = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { conversationId, mode, existingDraft, instruction, tone } = req.body;
  const conv = await assertConversationAccess(req.user, conversationId);
  const [messages, client] = await Promise.all([
    dataStore.listMessagesByConversation(conv.id),
    dataStore.findClientById(conv.clientId)
  ]);
  const result = await generateReplyDraft({
    conversation: conv,
    messages,
    client,
    mode,
    existingDraft,
    instruction,
    tone: tone || req.user.preferences?.defaultTone || "PROFESSIONAL",
    senderName: req.user.name
  });
  await dataStore.updateConversation(conv.id, {
    suggestedDraft: result.draft
  });
  return sendSuccess(
    res,
    {
      draft: result.draft,
      provider: result.provider,
      isFallback: result.isFallback,
      model: result.model
    },
    "Reply draft generated for review"
  );
});
const extractActions = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { conversationId } = req.body;
  const conv = await assertConversationAccess(req.user, conversationId);
  const [messages, client, existingActions, existingMeetings] = await Promise.all([
    dataStore.listMessagesByConversation(conv.id),
    dataStore.findClientById(conv.clientId),
    dataStore.listActions(),
    dataStore.listMeetings()
  ]);
  const extracted = await extractActionsAndMeetings(conv, messages, client);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const createdActions = [];
  for (const item of extracted.actions) {
    const duplicate = existingActions.find(
      (a) => a.conversationId === conv.id && a.title.toLowerCase() === item.title.toLowerCase()
    );
    if (!duplicate) {
      const created = await dataStore.createAction({
        id: newId(),
        conversationId: conv.id,
        clientId: conv.clientId,
        title: item.title,
        description: item.description,
        dueDate: item.dueDate || now,
        priority: item.priority || conv.priority,
        status: "PENDING",
        assignedTo: item.assignedTo || req.user.name,
        sourceType: "AI_EXTRACTED",
        createdAt: now,
        updatedAt: now
      });
      createdActions.push(created);
    }
  }
  const createdMeetings = [];
  for (const m of extracted.meetings) {
    const duplicate = existingMeetings.find(
      (em) => em.conversationId === conv.id && em.title.toLowerCase() === m.title.toLowerCase()
    );
    if (!duplicate) {
      const created = await dataStore.createMeeting({
        id: newId(),
        conversationId: conv.id,
        clientId: conv.clientId,
        title: m.title,
        date: m.date,
        time: m.time,
        timezone: req.user.timezone || "America/Los_Angeles",
        durationMinutes: m.durationMinutes || 30,
        participants: conv.participants,
        location: m.location || "Video Conference",
        status: m.status || "PROPOSED",
        createdAt: now,
        updatedAt: now
      });
      createdMeetings.push(created);
    }
  }
  await recordActivity({
    user: req.user,
    clientId: conv.clientId,
    conversationId: conv.id,
    action: "AI_EXTRACTED_ITEMS",
    description: `Extracted ${createdActions.length} action(s) and ${createdMeetings.length} meeting(s) from "${conv.subject}"`
  });
  return sendSuccess(
    res,
    {
      createdActions,
      createdMeetings,
      isFallback: extracted.isFallback,
      model: extracted.model
    },
    "Actions and meetings extracted"
  );
});
const aiChat = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { message, conversationId, history } = req.body;
  const [conversations, clients, allActions, allMeetings] = await Promise.all([
    getAuthorizedConversations(req.user),
    getAuthorizedClients(req.user),
    dataStore.listActions(),
    dataStore.listMeetings()
  ]);
  const allowedClientIds = new Set(clients.map((c) => c.id));
  const actions = allActions.filter((a) => allowedClientIds.has(a.clientId));
  const meetings = allMeetings.filter((m) => allowedClientIds.has(m.clientId));
  let focusedMessages;
  if (conversationId) {
    await assertConversationAccess(req.user, conversationId);
    focusedMessages = await dataStore.listMessagesByConversation(conversationId);
  }
  const chatRes = await runDatabaseGroundedChat({
    user: req.user,
    query: message,
    conversationId,
    history,
    conversations,
    clients,
    actions,
    meetings,
    focusedMessages
  });
  return sendSuccess(res, chatRes, "AI response ready");
});
export {
  aiChat,
  classifyEmail,
  draftReply,
  extractActions,
  summarizeEmail
};

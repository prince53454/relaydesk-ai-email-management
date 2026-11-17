import { dataStore, newId } from "../../repositories/dataStore.js";
import { gmailService } from "./gmailService.js";
import { outlookService } from "./outlookService.js";
import { ApiError } from "../../utils/ApiError.js";
import { decryptTokens, encryptTokens } from "./tokenVault.js";
import { classifyConversation } from "../ai/classificationService.js";
async function syncEmailAccount(accountId, { incremental = false } = {}) {
  const account = await dataStore.findEmailAccountById(accountId);
  if (!account) {
    throw new ApiError(404, "Email account not found");
  }
  const adapter = account.provider === "GMAIL" ? gmailService : outlookService;
  if (account.isSimulated) {
    const result = {
      syncedAt: new Date().toISOString(),
      mode: "SIMULATED_DEMO",
      messagesChecked: 0,
      messages: []
    };
    const updated = await dataStore.updateEmailAccount(accountId, { lastSyncedAt: result.syncedAt });
    return { account: updated, sync: result };
  }
  let tokens;
  try { tokens = decryptTokens(account.oauthTokens); } catch { throw new ApiError(400, "Mailbox authorization is invalid. Reconnect this account."); }
  const liveAccount = { ...account, oauthTokens: tokens };
  if (tokens.expires_at && Number(tokens.expires_at) < Date.now() && tokens.refresh_token) {
    const isGoogle = account.provider === "GMAIL";
    const tokenEndpoint = isGoogle ? "https://oauth2.googleapis.com/token" : `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || "common"}/oauth2/v2.0/token`;
    const response = await fetch(tokenEndpoint, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ refresh_token: tokens.refresh_token, client_id: isGoogle ? process.env.GOOGLE_CLIENT_ID : process.env.MICROSOFT_CLIENT_ID, client_secret: isGoogle ? process.env.GOOGLE_CLIENT_SECRET : process.env.MICROSOFT_CLIENT_SECRET, grant_type: "refresh_token" }) });
    const refreshed = await response.json();
    if (!response.ok) throw new ApiError(401, "Gmail authorization expired. Reconnect this account.");
    tokens = { ...tokens, ...refreshed, expires_at: Date.now() + Number(refreshed.expires_in || 3600) * 1000 };
    liveAccount.oauthTokens = tokens;
  }
  const result = await adapter.syncAccount(liveAccount, incremental ? { since: account.lastSyncedAt } : {});
  const existing = await dataStore.listConversations();
  const accountConversations = existing.filter((conversation) => conversation.emailAccountId === accountId);
  const threadConversationIds = new Map(accountConversations.filter((conversation) => conversation.providerThreadId).map((conversation) => [conversation.providerThreadId, conversation.id]));
  const existingMessages = (await Promise.all(accountConversations.map((conversation) => dataStore.listMessagesByConversation(conversation.id)))).flat();
  const knownMessageIds = new Set([
    ...accountConversations.map((conversation) => conversation.providerMessageId),
    ...existingMessages.map((message) => message.providerMessageId)
  ].filter(Boolean));
  const providerMessageMap = new Map([
    ...accountConversations.filter((conversation) => conversation.providerMessageId).map((conversation) => [conversation.providerMessageId, conversation.id]),
    ...existingMessages.filter((message) => message.providerMessageId).map((message) => [message.providerMessageId, message.conversationId])
  ]);
  const clientRecord = await dataStore.findClientById(account.clientId);
  const owner = await dataStore.findUserById(account.userId);
  const incomingMessages = [...(result.messages || [])].sort((left, right) =>
    new Date(left.receivedAt || result.syncedAt).getTime() - new Date(right.receivedAt || result.syncedAt).getTime()
  );
  for (const message of incomingMessages) {
    if (knownMessageIds.has(message.externalId)) {
      const knownConversationId = providerMessageMap.get(message.externalId);
      const matchingMessage = existingMessages.find((existingMessage) => existingMessage.conversationId === knownConversationId && existingMessage.providerMessageId === message.externalId);
      if (matchingMessage && typeof message.isUnread === "boolean") await dataStore.updateMessage(matchingMessage.id, { isUnread: message.isUnread });
      if (knownConversationId && typeof message.isUnread === "boolean") {
        const knownConversation = await dataStore.findConversationById(knownConversationId);
        const threadHasUnread = existingMessages.some((existingMessage) => existingMessage.conversationId === knownConversationId && existingMessage.direction === "INBOUND" && (existingMessage.id === matchingMessage?.id ? message.isUnread : existingMessage.isUnread));
        if (knownConversation && knownConversation.isUnread !== threadHasUnread) await dataStore.updateConversation(knownConversationId, { isUnread: threadHasUnread });
      }
      continue;
    }
    const existingThreadId = message.threadId ? threadConversationIds.get(message.threadId) : null;
    const conversationId = existingThreadId || newId();
    const receivedAt = message.receivedAt || result.syncedAt;
    let conversation = existingThreadId ? await dataStore.findConversationById(existingThreadId) : null;
    if (!conversation) conversation = await dataStore.createConversation({
      id: conversationId, emailAccountId: accountId, providerMessageId: message.externalId, providerMessageHeaderId: message.messageHeaderId || "",
      providerThreadId: message.threadId || "",
      clientId: account.clientId, subject: message.subject, snippet: message.snippet,
      sender: message.sender, participants: [message.sender, { name: account.displayName || account.emailAddress, email: account.emailAddress }],
      classification: "NEEDS_REVIEW", confidence: 0.5, confidenceBand: "LOW",
      classificationReason: "Imported from a connected mailbox; review responsibility.",
      classificationSource: owner?.preferences?.autoClassify === false ? "SEEDED" : "AI_FALLBACK", suggestedAction: "Review this imported email",
      suggestedDraft: "", summary: { overview: message.snippet || message.body.slice(0, 240), mainTopic: message.subject, generatedBy: "SEEDED" },
      priority: message.importance === "high" ? "HIGH" : "MEDIUM", status: "OPEN", assignedTo: "",
      requiresResponse: true, isImportant: false, isUnread: Boolean(message.isUnread), isArchived: false,
      labels: [], classificationHistory: [], internalNotes: [], lastMessageAt: receivedAt
    });
    await dataStore.createMessage({
      id: newId(), conversationId: conversation.id, providerMessageId: message.externalId, isUnread: Boolean(message.isUnread), sender: message.sender,
      recipients: [{ name: account.displayName || account.emailAddress, email: account.emailAddress }],
      body: message.body || message.snippet || "", direction: "INBOUND", isSimulatedSend: false,
      receivedAt, attachments: []
    });
    const messages = await dataStore.listMessagesByConversation(conversation.id);
    const classification = owner?.preferences?.autoClassify === false ? null : await classifyConversation({ ...conversation, status: "OPEN" }, messages, clientRecord);
    const conversationPatch = {
      ...(existingThreadId ? {
        snippet: message.snippet || conversation.snippet,
        sender: message.sender,
        participants: [...new Map([...(conversation.participants || []), message.sender].map((participant) => [participant.email.toLowerCase(), participant])).values()],
        isUnread: conversation.isUnread || Boolean(message.isUnread),
        lastMessageAt: receivedAt,
        status: "OPEN"
      } : {}),
      ...classification ? {
      classification: classification.classification,
      confidence: classification.confidence,
      confidenceBand: classification.confidenceBand,
      classificationReason: classification.reason,
      classificationSource: classification.provider,
      manualOverride: false,
      assignedTo: classification.classification === "CLIENT_TO_REPLY" ? clientRecord?.name || "Client" : classification.classification === "NO_REPLY_NEEDED" ? "None" : owner?.name || "Assistant",
      suggestedAction: classification.suggestedAction,
      priority: classification.priority,
      requiresResponse: classification.requiresResponse,
      classificationHistory: [...conversation.classificationHistory || [], {
        classification: classification.classification,
        confidence: classification.confidence,
        reason: classification.reason,
        source: classification.provider,
        changedBy: "RelayDesk AI",
        changedAt: result.syncedAt
      }]
      } : {}
    };
    await dataStore.updateConversation(conversation.id, conversationPatch);
    knownMessageIds.add(message.externalId);
    providerMessageMap.set(message.externalId, conversation.id);
    if (message.threadId) threadConversationIds.set(message.threadId, conversation.id);
  }
  const updated = await dataStore.updateEmailAccount(accountId, {
    lastSyncedAt: result.syncedAt,
    ...(tokens ? { oauthTokens: encryptTokens(tokens) } : {})
  });
  return { account: updated, sync: result };
}
export {
  syncEmailAccount
};

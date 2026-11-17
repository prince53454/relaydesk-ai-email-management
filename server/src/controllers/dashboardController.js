import { dataStore } from "../repositories/dataStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import {
  getAuthorizedClients,
  getAuthorizedConversations
} from "../services/accessService.js";
import { aiProvider } from "../services/ai/aiProvider.js";
const getDashboardStats = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const [conversations, actions, meetings, clients] = await Promise.all([
    getAuthorizedConversations(req.user),
    dataStore.listActions(),
    dataStore.listMeetings(),
    getAuthorizedClients(req.user)
  ]);
  const requestedClientId = String(req.query.clientId || "");
  const scopedClients = requestedClientId ? clients.filter((client) => client.id === requestedClientId) : clients;
  if (requestedClientId && scopedClients.length === 0) throw new ApiError(403, "Unauthorized client workspace");
  const clientIds = new Set(scopedClients.map((c) => c.id));
  const scopedConversations = conversations.filter((conversation) => clientIds.has(conversation.clientId));
  const activeConvs = scopedConversations.filter((c) => !c.isArchived);
  const openActions = actions.filter(
    (a) => clientIds.has(a.clientId) && a.status !== "COMPLETED"
  );
  const upcomingMeetings = meetings.filter(
    (m) => clientIds.has(m.clientId) && m.status !== "CANCELLED"
  );
  const stats = {
    totalConversations: activeConvs.length,
    archivedCount: scopedConversations.filter((c) => c.isArchived).length,
    unreadEmails: activeConvs.filter((c) => c.isUnread).length,
    importantEmails: activeConvs.filter((c) => c.isImportant).length,
    actionRequiredCount: openActions.length,
    assistantToReplyCount: activeConvs.filter(
      (c) => c.classification === "ASSISTANT_TO_REPLY" && c.status !== "COMPLETED"
    ).length,
    clientToReplyCount: activeConvs.filter(
      (c) => c.classification === "CLIENT_TO_REPLY" && c.status !== "COMPLETED"
    ).length,
    noReplyNeededCount: activeConvs.filter((c) => c.classification === "NO_REPLY_NEEDED").length,
    needsReviewCount: activeConvs.filter(
      (c) => c.classification === "NEEDS_REVIEW" && c.status !== "COMPLETED"
    ).length,
    waitingForResponseCount: activeConvs.filter((c) => c.status === "WAITING_FOR_RESPONSE").length,
    completedCount: activeConvs.filter((c) => c.status === "COMPLETED").length,
    upcomingMeetingsCount: upcomingMeetings.length,
    clientsCount: scopedClients.length,
    aiMode: aiProvider.isLiveAIConfigured() ? "GEMINI_LIVE" : "FALLBACK_DEMO"
  };
  return sendSuccess(res, { stats });
});
const getDashboardActivity = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const clients = await getAuthorizedClients(req.user);
  const clientIds = new Set(clients.map((c) => c.id));
  const activities = await dataStore.listActivities(40);
  const filtered = activities.filter(
    (a) => !a.clientId || clientIds.has(a.clientId) || a.userId === req.user.id
  );
  return sendSuccess(res, { activities: filtered.slice(0, 20) });
});
const getDashboardOverview = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const [conversations, actions, meetings, clients, activities] = await Promise.all([
    getAuthorizedConversations(req.user),
    dataStore.listActions(),
    dataStore.listMeetings(),
    getAuthorizedClients(req.user),
    dataStore.listActivities(30)
  ]);
  const requestedClientId = String(req.query.clientId || "");
  const scopedClients = requestedClientId ? clients.filter((client) => client.id === requestedClientId) : clients;
  if (requestedClientId && scopedClients.length === 0) throw new ApiError(403, "Unauthorized client workspace");
  const clientIds = new Set(scopedClients.map((c) => c.id));
  const scopedConversations = conversations.filter((conversation) => clientIds.has(conversation.clientId));
  const scopedActions = actions.filter((action) => clientIds.has(action.clientId));
  const scopedMeetings = meetings.filter((meeting) => clientIds.has(meeting.clientId));
  const clientsMap = new Map(scopedClients.map((c) => [c.id, c]));
  const activeConvs = scopedConversations.filter((c) => !c.isArchived);
  const priorityInbox = activeConvs.filter(
    (c) => (c.priority === "URGENT" || c.priority === "HIGH" || c.isImportant) && c.status !== "COMPLETED"
  ).slice(0, 6).map((c) => ({ ...c, clientName: clientsMap.get(c.clientId)?.name || "Client" }));
  const recentConversations = activeConvs.slice(0, 8).map((c) => ({ ...c, clientName: clientsMap.get(c.clientId)?.name || "Client" }));
  const upcomingMeetings = scopedMeetings.filter((m) => m.status !== "CANCELLED").slice(0, 5).map((m) => ({ ...m, clientName: clientsMap.get(m.clientId)?.name || "Client" }));
  const pendingFollowUps = scopedActions.filter((a) => a.status !== "COMPLETED").slice(0, 6).map((a) => ({ ...a, clientName: clientsMap.get(a.clientId)?.name || "Client" }));
  const classificationBreakdown = [
    {
      name: "Assistant to Reply",
      key: "ASSISTANT_TO_REPLY",
      value: activeConvs.filter((c) => c.classification === "ASSISTANT_TO_REPLY").length,
      color: "#2563EB"
    },
    {
      name: "Client to Reply",
      key: "CLIENT_TO_REPLY",
      value: activeConvs.filter((c) => c.classification === "CLIENT_TO_REPLY").length,
      color: "#7C3AED"
    },
    {
      name: "Needs Review",
      key: "NEEDS_REVIEW",
      value: activeConvs.filter((c) => c.classification === "NEEDS_REVIEW").length,
      color: "#D97706"
    },
    {
      name: "No Reply Needed",
      key: "NO_REPLY_NEEDED",
      value: activeConvs.filter((c) => c.classification === "NO_REPLY_NEEDED").length,
      color: "#64748B"
    }
  ];
  const clientVolume = scopedClients.map((cl) => ({
    id: cl.id,
    name: cl.name.split(" ")[0],
    fullName: cl.name,
    assistant: activeConvs.filter(
      (c) => c.clientId === cl.id && c.classification === "ASSISTANT_TO_REPLY"
    ).length,
    client: activeConvs.filter(
      (c) => c.clientId === cl.id && c.classification === "CLIENT_TO_REPLY"
    ).length,
    review: activeConvs.filter(
      (c) => c.clientId === cl.id && c.classification === "NEEDS_REVIEW"
    ).length
  }));
  const stats = {
    totalConversations: activeConvs.length,
    unreadEmails: activeConvs.filter((c) => c.isUnread).length,
    importantEmails: activeConvs.filter((c) => c.isImportant).length,
    actionRequiredCount: scopedActions.filter(
      (a) => clientIds.has(a.clientId) && a.status !== "COMPLETED"
    ).length,
    assistantToReplyCount: activeConvs.filter(
      (c) => c.classification === "ASSISTANT_TO_REPLY" && c.status !== "COMPLETED"
    ).length,
    clientToReplyCount: activeConvs.filter(
      (c) => c.classification === "CLIENT_TO_REPLY" && c.status !== "COMPLETED"
    ).length,
    waitingForResponseCount: activeConvs.filter((c) => c.status === "WAITING_FOR_RESPONSE").length,
    needsReviewCount: activeConvs.filter(
      (c) => c.classification === "NEEDS_REVIEW" && c.status !== "COMPLETED"
    ).length,
    noReplyNeededCount: activeConvs.filter((c) => c.classification === "NO_REPLY_NEEDED").length,
    upcomingMeetingsCount: upcomingMeetings.length
  };
  const recentActivity = activities.filter((a) => !a.clientId || clientIds.has(a.clientId) || a.userId === req.user.id).slice(0, 10);
  const urgentThreads = activeConvs.filter(
    (c) => c.priority === "URGENT" && c.status !== "COMPLETED"
  );
  const dailySummary = {
    label: "AI Workspace Briefing",
    headline: `${stats.clientToReplyCount} executive approvals and ${stats.assistantToReplyCount} assistant coordinations active across ${scopedClients.length} client mailbox${scopedClients.length === 1 ? "" : "es"}.`,
    highlights: [
      urgentThreads.length > 0 ? `${urgentThreads.length} urgent thread(s) flagged: ${urgentThreads.slice(0, 2).map((t) => `"${t.subject}"`).join(", ")}.` : "No overdue urgent escalations at this moment.",
      `${stats.needsReviewCount} thread(s) need manual classification review due to ambiguous context.`,
      `${upcomingMeetings.length} upcoming/proposed meetings tracked across calendars.`
    ],
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return sendSuccess(res, {
    stats,
    priorityInbox,
    recentConversations,
    upcomingMeetings,
    pendingFollowUps,
    classificationBreakdown,
    clientVolume,
    recentActivity,
    dailySummary,
    clients: scopedClients
  });
});
export {
  getDashboardActivity,
  getDashboardOverview,
  getDashboardStats
};

import { dataStore, newId } from "../repositories/dataStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { getAuthorizedClientIds, getAuthorizedClients } from "../services/accessService.js";
import { gmailService } from "../services/email/gmailService.js";
import { outlookService } from "../services/email/outlookService.js";
import { syncEmailAccount } from "../services/email/syncService.js";
import { recordActivity } from "../services/notificationService.js";
import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";
import { encryptTokens } from "../services/email/tokenVault.js";
const listAccounts = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const clients = await getAuthorizedClients(req.user);
  const allowedIds = new Set(clients.map((c) => c.id));
  const clientsMap = new Map(clients.map((c) => [c.id, c]));
  const all = await dataStore.listEmailAccounts();
  const accounts = all.filter((a) => allowedIds.has(a.clientId) || a.userId === req.user.id).map(({ oauthTokens: _tokens, ...a }) => ({
    ...a,
    clientName: clientsMap.get(a.clientId)?.name || "Workspace"
  }));
  return sendSuccess(res, {
    accounts,
    providers: [gmailService.getOAuthMetadata(), outlookService.getOAuthMetadata()]
  });
});
const connectAccount = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { provider, emailAddress, displayName, clientId, mode = "LIVE" } = req.body;
  if (!provider || !["GMAIL", "OUTLOOK"].includes(provider)) {
    throw new ApiError(400, "Provider must be GMAIL or OUTLOOK");
  }
  const allowedIds = await getAuthorizedClientIds(req.user);
  const targetClientId = clientId || allowedIds[0];
  if (!targetClientId || !allowedIds.includes(targetClientId)) {
    throw new ApiError(403, "Unauthorized client workspace");
  }
  const service = provider === "GMAIL" ? gmailService : outlookService;
  if (mode !== "LIVE" && mode !== "DEMO") {
    throw new ApiError(400, "Connection mode must be LIVE or DEMO");
  }
  if (mode === "LIVE") {
    if (!service.isLiveOAuthConfigured()) {
      throw new ApiError(503, `${provider === "GMAIL" ? "Google" : "Microsoft"} OAuth is not configured. Set the provider app credentials and callback URL, or choose the demo inbox for evaluation.`);
    }
    const state = jwt.sign({ userId: req.user.id, clientId: targetClientId, provider }, env.JWT_SECRET, { expiresIn: "10m", audience: "relaydesk-email-oauth" });
    return sendSuccess(res, { authUrl: service.getAuthorizationUrl(state) }, "Continue to provider authorization");
  }
  if (!String(emailAddress || "").trim()) {
    throw new ApiError(400, "Email address is required for a demo inbox");
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const account = await dataStore.createEmailAccount({
    id: newId(),
    userId: req.user.id,
    clientId: targetClientId,
    provider,
    emailAddress: String(emailAddress).toLowerCase().trim(),
    displayName: displayName || emailAddress,
    connectionStatus: "CONNECTED_DEMO",
    isSimulated: true,
    lastSyncedAt: now,
    createdAt: now
  });
  await recordActivity({
    user: req.user,
    clientId: targetClientId,
    action: "ACCOUNT_CONNECTED",
    description: `Connected simulated ${provider} demo inbox (${account.emailAddress})`
  });
  return sendSuccess(res, { account }, "Demo email account connected", 201);
});
const oauthCallback = asyncHandler(async (req, res) => {
  try {
    if (req.query.error) throw new Error(String(req.query.error_description || req.query.error));
    const state = jwt.verify(String(req.query.state || ""), env.JWT_SECRET, { audience: "relaydesk-email-oauth" });
    const provider = req.params.provider === "google" ? "GMAIL" : "OUTLOOK";
    if (state.provider !== provider) throw new Error("OAuth provider mismatch");
    const connectedUser = await dataStore.findUserById(state.userId);
    if (!connectedUser) throw new Error("Workspace user no longer exists");
    const clients = await getAuthorizedClients(connectedUser);
    if (!clients.some((client) => client.id === state.clientId)) throw new Error("Workspace authorization is no longer valid");
    const service = provider === "GMAIL" ? gmailService : outlookService;
    const tokens = await service.exchangeCode(String(req.query.code || ""));
    const profile = await service.getProfile(tokens.access_token);
    const emailAddress = String(profile.email || profile.mail || profile.userPrincipalName || "").toLowerCase();
    if (!emailAddress) throw new Error("Provider did not return an email address");
    const existing = (await dataStore.listEmailAccounts()).find((account) => account.clientId === state.clientId && account.emailAddress === emailAddress);
    const now = new Date().toISOString();
    const storedTokens = { ...tokens, expires_at: Date.now() + Number(tokens.expires_in || 0) * 1000 };
    const account = { id: existing?.id || newId(), userId: state.userId, clientId: state.clientId, provider, emailAddress, displayName: profile.name || profile.displayName || emailAddress, connectionStatus: "CONNECTED_OAUTH", isSimulated: false, oauthTokens: encryptTokens(storedTokens), lastSyncedAt: now, createdAt: existing?.createdAt || now };
    if (existing) await dataStore.updateEmailAccount(existing.id, account);
    else await dataStore.createEmailAccount(account);
    await syncEmailAccount(account.id);
    const destination = connectedUser.role === "CLIENT" ? "/client" : "/assistant";
    res.redirect(`${env.APP_URL.replace(/\/$/, "")}${destination}?emailConnected=${provider.toLowerCase()}`);
  } catch (error) {
    let destination = "/assistant/settings";
    try {
      const state = jwt.verify(String(req.query.state || ""), env.JWT_SECRET, { audience: "relaydesk-email-oauth", ignoreExpiration: true });
      const failedUser = await dataStore.findUserById(state.userId);
      if (failedUser?.role === "CLIENT") destination = "/client/settings";
    } catch {}
    res.redirect(`${env.APP_URL.replace(/\/$/, "")}${destination}?emailError=${encodeURIComponent(error.message || "OAuth failed")}`);
  }
});
const syncAccount = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const existing = await dataStore.findEmailAccountById(String(req.params.id));
  if (!existing) throw new ApiError(404, "Email account not found");
  const allowedIds = await getAuthorizedClientIds(req.user);
  if (!allowedIds.includes(existing.clientId) && existing.userId !== req.user.id) throw new ApiError(403, "Access denied");
  const result = await syncEmailAccount(String(req.params.id));
  if (result.account) delete result.account.oauthTokens;
  return sendSuccess(res, result, "Mailbox synced");
});
const disconnectAccount = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const id = String(req.params.id);
  const existing = await dataStore.findEmailAccountById(id);
  if (!existing) throw new ApiError(404, "Email account not found");
  const allowedIds = await getAuthorizedClientIds(req.user);
  if (!allowedIds.includes(existing.clientId) && existing.userId !== req.user.id) {
    throw new ApiError(403, "Access denied");
  }
  await dataStore.deleteEmailAccount(id);
  await recordActivity({
    user: req.user,
    clientId: existing.clientId,
    action: "ACCOUNT_DISCONNECTED",
    description: `Disconnected ${existing.provider} inbox (${existing.emailAddress})`
  });
  return sendSuccess(res, { deleted: true }, "Email account disconnected");
});
export {
  connectAccount,
  disconnectAccount,
  listAccounts,
  oauthCallback,
  syncAccount
};

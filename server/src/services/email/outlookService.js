import { env } from "../../config/environment.js";
const scopes = ["openid", "email", "profile", "offline_access", "User.Read", "Mail.Read", "Mail.Send"];
const callbackUrl = () => `${env.APP_URL.replace(/\/$/, "")}/api/accounts/oauth/callback/microsoft`;
const hasCredentials = () => Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET);
const configured = () => hasCredentials() && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(process.env.MICROSOFT_CLIENT_ID);
async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error_description || data.error?.message || `Microsoft API returned ${response.status}`);
  return data;
}
function getAuthorizationUrl(state) {
  const url = new URL(`https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || "common"}/oauth2/v2.0/authorize`);
  url.search = new URLSearchParams({ client_id: process.env.MICROSOFT_CLIENT_ID, redirect_uri: callbackUrl(), response_type: "code", response_mode: "query", scope: scopes.join(" "), state }).toString();
  return url.toString();
}
async function exchangeCode(code) {
  return request(`https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || "common"}/oauth2/v2.0/token`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: process.env.MICROSOFT_CLIENT_ID, client_secret: process.env.MICROSOFT_CLIENT_SECRET, redirect_uri: callbackUrl(), grant_type: "authorization_code", scope: scopes.join(" ") }) });
}
async function getProfile(accessToken) {
  return request("https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName", { headers: { authorization: `Bearer ${accessToken}` } });
}
const outlookService = {
  provider: "OUTLOOK", isLiveOAuthConfigured: configured,
  getOAuthMetadata() {
    const isConfigured = configured();
    return {
      provider: "OUTLOOK",
      mode: isConfigured ? "OAUTH_READY" : "SIMULATED_DEMO",
      ...(hasCredentials() && !isConfigured ? { configurationWarning: "Microsoft OAuth requires an Entra application client ID in GUID format. Demo mailbox mode is available until it is configured." } : {}),
      scopes,
      label: "Microsoft 365 / Outlook"
    };
  },
  getAuthorizationUrl, exchangeCode, getProfile,
  async syncAccount(account, { since } = {}) {
    const query = new URLSearchParams({ $top: "50", $select: "id,conversationId,subject,receivedDateTime,from,bodyPreview,body,isRead,importance" });
    if (since) query.set("$filter", `receivedDateTime ge ${new Date(new Date(since).getTime() - 60_000).toISOString()}`);
    const response = await request(`https://graph.microsoft.com/v1.0/me/messages?${query}`, { headers: { authorization: `Bearer ${account.oauthTokens.access_token}` } });
    const messages = (response.value || []).map((item) => ({ externalId: item.id, threadId: item.conversationId || "", subject: item.subject || "(No subject)", snippet: item.bodyPreview || "", sender: { name: item.from?.emailAddress?.name || "Unknown sender", email: item.from?.emailAddress?.address || "unknown@example.com" }, receivedAt: item.receivedDateTime || new Date().toISOString(), body: String(item.body?.content || item.bodyPreview || "").replace(/<[^>]*>/g, " "), isUnread: !item.isRead, importance: item.importance }));
    return { syncedAt: new Date().toISOString(), mode: "LIVE_OAUTH", messagesChecked: messages.length, messages };
  },
  async sendReply(account, conversation, body) {
    if (!conversation.providerMessageId) throw new Error("The original Microsoft message is missing, so this reply cannot be threaded safely. Sync the mailbox and try again.");
    await request(`https://graph.microsoft.com/v1.0/me/messages/${encodeURIComponent(conversation.providerMessageId)}/reply`, { method: "POST", headers: { authorization: `Bearer ${account.oauthTokens.access_token}`, "content-type": "application/json" }, body: JSON.stringify({ comment: body }) });
    return { sentAt: new Date().toISOString() };
  }
};
export { outlookService };

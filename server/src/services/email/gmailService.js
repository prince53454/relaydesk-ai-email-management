import { env } from "../../config/environment.js";

const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const GOOGLE_API = "https://gmail.googleapis.com/gmail/v1";
const scopes = ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"];
const callbackUrl = () => `${env.APP_URL.replace(/\/$/, "")}/api/accounts/oauth/callback/google`;
const configured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || data.error_description || `Google API returned ${response.status}`);
  return data;
}
function getAuthorizationUrl(state) {
  const url = new URL(GOOGLE_AUTH);
  url.search = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: callbackUrl(), response_type: "code", scope: scopes.join(" "), access_type: "offline", prompt: "consent", state }).toString();
  return url.toString();
}
async function exchangeCode(code) {
  return request(GOOGLE_TOKEN, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: callbackUrl(), grant_type: "authorization_code" }) });
}
async function getProfile(accessToken) {
  return request("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { authorization: `Bearer ${accessToken}` } });
}
async function refreshToken(refresh) {
  if (!refresh) throw new Error("Google authorization expired. Reconnect this account.");
  return request(GOOGLE_TOKEN, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ refresh_token: refresh, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, grant_type: "refresh_token" }) });
}
async function api(account, path, options = {}) {
  const tokens = account.oauthTokens;
  const response = await fetch(`${GOOGLE_API}${path}`, { ...options, headers: { authorization: `Bearer ${tokens.access_token}`, ...(options.headers || {}) } });
  if (response.status === 401) {
    throw new Error("Google authorization expired. Reconnect this account.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `Gmail API returned ${response.status}`);
  return data;
}
const gmailService = {
  provider: "GMAIL",
  isLiveOAuthConfigured: configured,
  getOAuthMetadata() { return { provider: "GMAIL", mode: configured() ? "OAUTH_READY" : "SIMULATED_DEMO", scopes, label: "Google Workspace / Gmail" }; },
  getAuthorizationUrl, exchangeCode, getProfile,
  async syncAccount(account, { since } = {}) {
    const query = new URLSearchParams({ maxResults: "50" });
    if (since) query.set("q", `after:${Math.max(0, Math.floor(new Date(since).getTime() / 1000) - 60)}`);
    const list = await api(account, `/users/me/messages?${query}`);
    const messages = await Promise.all((list.messages || []).map(async ({ id }) => {
      const item = await api(account, `/users/me/messages/${encodeURIComponent(id)}?format=full`);
      const headers = Object.fromEntries((item.payload?.headers || []).map((header) => [header.name.toLowerCase(), header.value]));
      const decode = (part) => part?.data ? Buffer.from(part.data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8") : "";
      const findBody = (part) => part?.mimeType === "text/plain" ? decode(part.body) : (part?.parts || []).map(findBody).find(Boolean) || "";
      const from = headers.from || "Unknown sender <unknown@example.com>";
      const match = from.match(/^(.*?)\s*<([^>]+)>$/);
      return { externalId: item.id, threadId: item.threadId, messageHeaderId: headers["message-id"] || "", subject: headers.subject || "(No subject)", snippet: item.snippet || "", sender: { name: match?.[1]?.replace(/^"|"$/g, "") || from, email: match?.[2] || from }, receivedAt: new Date(Number(item.internalDate || Date.now())).toISOString(), body: findBody(item.payload) || item.snippet || "", isUnread: (item.labelIds || []).includes("UNREAD") };
    }));
    return { syncedAt: new Date().toISOString(), mode: "LIVE_OAUTH", messagesChecked: messages.length, messages };
  },
  async sendReply(account, conversation, body) {
    const subject = /^re:/i.test(conversation.subject) ? conversation.subject : `Re: ${conversation.subject}`;
    const replyHeaders = conversation.providerMessageHeaderId ? [`In-Reply-To: ${conversation.providerMessageHeaderId}`, `References: ${conversation.providerMessageHeaderId}`] : [];
    const mime = [`To: ${conversation.sender.email}`, `Subject: ${subject}`, ...replyHeaders, "Content-Type: text/plain; charset=utf-8", "MIME-Version: 1.0", "", body].join("\r\n");
    const raw = Buffer.from(mime, "utf8").toString("base64url");
    const data = await api(account, "/users/me/messages/send", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ raw, ...(conversation.providerThreadId ? { threadId: conversation.providerThreadId } : {}) }) });
    return { providerMessageId: data.id, sentAt: new Date().toISOString() };
  }
};
export { gmailService };

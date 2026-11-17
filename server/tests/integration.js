import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import { connectDatabase } from "../src/config/database.js";
import { seedIfEmpty } from "../src/seed/seedDatabase.js";
import { createApiApp } from "../src/app.js";
async function request(baseUrl, path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.token ? { Authorization: `Bearer ${options.token}` } : {}
    },
    ...options.redirect ? { redirect: options.redirect } : {},
    ...options.body !== void 0 ? { body: JSON.stringify(options.body) } : {}
  });
  const json = res.headers.get("content-type")?.includes("application/json") ? await res.json() : null;
  return { status: res.status, json };
}
async function runTests() {
  await connectDatabase();
  await seedIfEmpty(true);
  const app = createApiApp();
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    const checkpoint = (label) => console.log(`FLOW: ${label}`);
    checkpoint("health and authentication");
    const health = await request(baseUrl, "/api/health");
    assert.equal(health.status, 200);
    assert.equal(health.json.success, true);
    const unauth = await request(baseUrl, "/api/emails");
    assert.equal(unauth.status, 401);
    const elenaLogin = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { email: "elena@relaydesk.ai", password: "DemoPass123!" }
    });
    assert.equal(elenaLogin.status, 200);
    const elenaToken = elenaLogin.json.data.token;
    assert.equal(elenaLogin.json.data.user.role, "ASSISTANT");
    const victoriaLogin = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: { email: "victoria@sterlingventures.com", password: "ClientPass123!" }
    });
    assert.equal(victoriaLogin.status, 200);
    const victoriaToken = victoriaLogin.json.data.token;
    assert.equal(victoriaLogin.json.data.user.role, "CLIENT");
    const victoriaProfile = await request(baseUrl, "/api/clients/cli_victoria_01", {
      token: victoriaToken
    });
    assert.equal(victoriaProfile.status, 200);
    assert.equal((await request(baseUrl, "/api/auth/me", { token: elenaToken })).status, 200);
    assert.equal((await request(baseUrl, "/api/auth/logout", { method: "POST", token: elenaToken })).status, 200);
    assert.equal((await request(baseUrl, "/api/auth/login", { method: "POST", body: { email: "elena@relaydesk.ai", password: "wrong" } })).status, 401);
    assert.equal((await request(baseUrl, "/api/auth/login", { method: "POST", body: { email: "not-an-email", password: "x" } })).status, 400);
    checkpoint("client management, role access, dashboard, settings");
    const crossTenant = await request(baseUrl, "/api/emails/conv_21", {
      token: victoriaToken
    });
    assert.equal(crossTenant.status, 403);
    assert.equal((await request(baseUrl, "/api/clients", { token: elenaToken })).status, 200);
    assert.equal((await request(baseUrl, "/api/clients", { token: victoriaToken })).status, 200);
    assert.equal((await request(baseUrl, "/api/clients/cli_david_02", { token: victoriaToken })).status, 403);
    const createdClient = await request(baseUrl, "/api/clients", { method: "POST", token: elenaToken, body: { name: "Test Executive", email: `exec_${Date.now()}@example.test`, company: "Test Co" } });
    assert.equal(createdClient.status, 201);
    assert.equal((await request(baseUrl, "/api/clients", { method: "POST", token: victoriaToken, body: { name: "Unauthorized", email: "unauthorized@example.test" } })).status, 403);
    const updatedClient = await request(baseUrl, "/api/clients/cli_victoria_01", { method: "PATCH", token: elenaToken, body: { notes: "Updated test note" } });
    assert.equal(updatedClient.status, 200);
    assert.equal(updatedClient.json.data.client.notes, "Updated test note");
    const overview = await request(baseUrl, "/api/dashboard/overview", { token: elenaToken });
    assert.equal(overview.status, 200);
    assert.ok(overview.json.data.stats.totalConversations >= 15);
    assert.equal((await request(baseUrl, "/api/dashboard/stats?clientId=cli_victoria_01", { token: elenaToken })).status, 200);
    assert.equal((await request(baseUrl, "/api/dashboard/activity", { token: elenaToken })).status, 200);
    assert.equal((await request(baseUrl, "/api/dashboard/stats?clientId=cli_aria_03", { token: victoriaToken })).status, 403);
    assert.equal((await request(baseUrl, "/api/users/settings", { method: "PATCH", token: elenaToken, body: { name: "Elena Vance", timezone: "America/Los_Angeles", preferences: { defaultTone: "WARM" } } })).status, 200);
    checkpoint("mailbox connections and inbox filters");
    const demoSync = await request(baseUrl, "/api/accounts/acc_victoria_gmail/sync", {
      method: "POST",
      token: elenaToken
    });
    assert.equal(demoSync.status, 200);
    assert.equal(demoSync.json.data.sync.mode, "SIMULATED_DEMO");
    assert.equal(demoSync.json.data.sync.messagesChecked, 0);
    const demoGmail = await request(baseUrl, "/api/accounts/connect", {
      method: "POST",
      token: elenaToken,
      body: { provider: "GMAIL", emailAddress: "gmail-demo@example.test", clientId: "cli_victoria_01", mode: "DEMO" }
    });
    assert.equal(demoGmail.status, 201);
    assert.equal(demoGmail.json.data.account.isSimulated, true);
    const syncedGmailDemo = await request(baseUrl, `/api/accounts/${demoGmail.json.data.account.id}/sync`, {
      method: "POST",
      token: elenaToken
    });
    assert.equal(syncedGmailDemo.status, 200);
    assert.equal(syncedGmailDemo.json.data.sync.mode, "SIMULATED_DEMO");
    const invalidConnectionMode = await request(baseUrl, "/api/accounts/connect", {
      method: "POST",
      token: elenaToken,
      body: { provider: "GMAIL", emailAddress: "bad-mode@example.test", clientId: "cli_victoria_01", mode: "OTHER" }
    });
    assert.equal(invalidConnectionMode.status, 400);
    const outlookDemo = await request(baseUrl, "/api/accounts/connect", {
      method: "POST",
      token: elenaToken,
      body: { provider: "OUTLOOK", emailAddress: "outlook-demo@example.test", clientId: "cli_victoria_01", mode: "DEMO" }
    });
    assert.equal(outlookDemo.status, 201);
    assert.equal(outlookDemo.json.data.account.provider, "OUTLOOK");
    assert.equal(outlookDemo.json.data.account.isSimulated, true);
    const syncedOutlookDemo = await request(baseUrl, `/api/accounts/${outlookDemo.json.data.account.id}/sync`, {
      method: "POST",
      token: elenaToken
    });
    assert.equal(syncedOutlookDemo.status, 200);
    assert.equal(syncedOutlookDemo.json.data.sync.mode, "SIMULATED_DEMO");
    const clientQueue = await request(baseUrl, "/api/emails?classification=CLIENT_TO_REPLY", {
      token: elenaToken
    });
    assert.equal(clientQueue.status, 200);
    assert.ok(clientQueue.json.data.emails.length > 0);
    assert.equal((await request(baseUrl, "/api/emails?unread=true&important=true&sort=priority&limit=3&page=1", { token: elenaToken })).status, 200);
    assert.equal((await request(baseUrl, "/api/emails?archived=all&search=board", { token: elenaToken })).status, 200);
    assert.equal((await request(baseUrl, "/api/emails?clientId=cli_aria_03", { token: victoriaToken })).json.data.emails.length, 0);
    const detail = await request(baseUrl, "/api/emails/conv_01", { token: elenaToken });
    assert.equal(detail.status, 200);
    assert.ok(detail.json.data.messages.length >= 2);
    assert.equal((await request(baseUrl, "/api/emails/conv_01/read", { method: "PATCH", token: elenaToken, body: { isUnread: false } })).status, 200);
    assert.equal((await request(baseUrl, "/api/emails/conv_01", { token: elenaToken })).json.data.email.isUnread, false);
    assert.equal((await request(baseUrl, "/api/emails/conv_21", { token: victoriaToken })).status, 403);
    assert.equal((await request(baseUrl, "/api/emails/conv_01/note", { method: "POST", token: elenaToken, body: { content: "Confirm board packet" } })).status, 200);
    assert.equal((await request(baseUrl, "/api/emails/conv_01/archive", { method: "PATCH", token: elenaToken, body: { isArchived: true } })).status, 200);
    assert.equal((await request(baseUrl, "/api/emails/conv_01/archive", { method: "PATCH", token: elenaToken, body: { isArchived: false } })).status, 200);
    const override = await request(baseUrl, "/api/emails/conv_05/classification", {
      method: "PATCH",
      token: elenaToken,
      body: {
        classification: "ASSISTANT_TO_REPLY",
        reason: "Confirmed routine intro follow-up"
      }
    });
    assert.equal(override.status, 200);
    assert.equal(override.json.data.email.manualOverride, true);
    if (process.env.RELAYDESK_SKIP_AI_TESTS !== "true") {
    const aiSum = await request(baseUrl, "/api/ai/summarize", {
      method: "POST",
      token: elenaToken,
      body: { conversationId: "conv_01" }
    });
    assert.equal(aiSum.status, 200);
    assert.ok(aiSum.json.data.summary.overview.length > 10);
    checkpoint("AI summarize/classify/draft/extract/chat live provider flows");
    const classification = await request(baseUrl, "/api/ai/classify", { method: "POST", token: elenaToken, body: { conversationId: "conv_06", forceReclassify: true } });
    assert.equal(classification.status, 200);
    assert.ok(classification.json.data.classificationResult.classification);
    assert.equal((await request(baseUrl, "/api/ai/classify", { method: "POST", token: elenaToken, body: { conversationId: "missing" } })).status, 404);
    const aiDraft = await request(baseUrl, "/api/ai/draft-reply", {
      method: "POST",
      token: elenaToken,
      body: { conversationId: "conv_02", mode: "GENERATE" }
    });
    assert.equal(aiDraft.status, 200);
    assert.ok(aiDraft.json.data.draft.length > 20);
    for (const mode of ["SHORTER", "FORMAL", "FRIENDLIER", "IMPROVE_GRAMMAR", "CUSTOM", "REWRITE"]) {
      checkpoint(`AI draft mode ${mode}`);
      const result = await request(baseUrl, "/api/ai/draft-reply", { method: "POST", token: elenaToken, body: { conversationId: "conv_02", mode, existingDraft: "Hello, please confirm your available time.", instruction: "Keep the Thursday meeting details." } });
      assert.equal(result.status, 200, `Draft mode ${mode} failed`);
      assert.ok(result.json.data.draft.length > 5, `Draft mode ${mode} returned an empty draft`);
    }
    const extracted = await request(baseUrl, "/api/ai/extract-actions", { method: "POST", token: elenaToken, body: { conversationId: "conv_04" } });
    assert.equal(extracted.status, 200);
    const aiChat = await request(baseUrl, "/api/ai/chat", {
      method: "POST",
      token: elenaToken,
      body: { message: "Which conversations require client approval?" }
    });
    assert.equal(aiChat.status, 200);
    assert.ok(aiChat.json.data.references.length > 0);
    assert.equal((await request(baseUrl, "/api/ai/chat", { method: "POST", token: victoriaToken, body: { message: "Summarize my mailbox", conversationId: "conv_21" } })).status, 403);
    assert.equal((await request(baseUrl, "/api/ai/chat", { method: "POST", token: elenaToken, body: { message: "" } })).status, 400);
    } else {
      checkpoint("AI paths covered in the prior configured-provider run");
    }
    checkpoint("handover, conversation state, reply actions");
    const handover = await request(baseUrl, "/api/emails/conv_03/takeover", {
      method: "POST",
      token: victoriaToken,
      body: { note: "Please coordinate my panel availability directly" }
    });
    assert.equal(handover.status, 200);
    assert.equal(handover.json.data.email.classification, "ASSISTANT_TO_REPLY");
    const checkFromAssistant = await request(baseUrl, "/api/emails/conv_03", {
      token: elenaToken
    });
    assert.equal(checkFromAssistant.status, 200);
    assert.equal(checkFromAssistant.json.data.email.classification, "ASSISTANT_TO_REPLY");
    assert.equal((await request(baseUrl, "/api/emails/conv_04/complete", { method: "PATCH", token: elenaToken, body: { status: "COMPLETED" } })).json.data.email.status, "COMPLETED");
    assert.equal((await request(baseUrl, "/api/emails/conv_04/complete", { method: "PATCH", token: elenaToken, body: { status: "OPEN" } })).json.data.email.status, "OPEN");
    assert.equal((await request(baseUrl, "/api/emails/conv_04", { method: "PATCH", token: elenaToken, body: { isImportant: true, priority: "HIGH" } })).status, 200);
    assert.equal((await request(baseUrl, "/api/emails/conv_04", { token: elenaToken })).json.data.email.isImportant, true);
    assert.equal((await request(baseUrl, "/api/emails/conv_04/reply", { method: "POST", token: elenaToken, body: { body: "Thanks for the information.", setWaitingForResponse: true } })).json.data.email.status, "WAITING_FOR_RESPONSE");
    const replyRes = await request(baseUrl, "/api/emails/conv_02/reply", {
      method: "POST",
      token: elenaToken,
      body: { body: "Confirmed for Thursday at 2:00 PM PT.", markCompleted: true }
    });
    assert.equal(replyRes.status, 200);
    assert.equal(replyRes.json.data.email.status, "COMPLETED");
    checkpoint("actions, meetings, provider lifecycle, registration/onboarding");
    assert.equal((await request(baseUrl, "/api/actions", { token: elenaToken })).status, 200);
    const action = await request(baseUrl, "/api/actions", { method: "POST", token: elenaToken, body: { clientId: "cli_victoria_01", conversationId: "conv_01", title: "Test follow-up", priority: "HIGH" } });
    assert.equal(action.status, 201);
    assert.equal((await request(baseUrl, `/api/actions/${action.json.data.action.id}`, { method: "PATCH", token: elenaToken, body: { status: "COMPLETED" } })).json.data.action.status, "COMPLETED");
    assert.equal((await request(baseUrl, "/api/actions", { method: "POST", token: elenaToken, body: { title: "Invalid due date", dueDate: "nope" } })).status, 400);
    assert.equal((await request(baseUrl, "/api/actions", { method: "POST", token: victoriaToken, body: { clientId: "cli_david_02", title: "Cross tenant" } })).status, 403);
    assert.equal((await request(baseUrl, "/api/meetings", { token: elenaToken })).status, 200);
    const meeting = await request(baseUrl, "/api/meetings", { method: "POST", token: elenaToken, body: { clientId: "cli_victoria_01", conversationId: "conv_01", title: "Test review", date: "2027-01-10", time: "14:00", participants: [{ name: "Victoria Sterling", email: "victoria@sterlingventures.com" }] } });
    assert.equal(meeting.status, 201);
    assert.equal((await request(baseUrl, `/api/meetings/${meeting.json.data.meeting.id}`, { method: "PATCH", token: elenaToken, body: { status: "CONFIRMED" } })).json.data.meeting.status, "CONFIRMED");
    assert.equal((await request(baseUrl, "/api/meetings", { method: "POST", token: victoriaToken, body: { clientId: "cli_david_02", title: "Cross tenant", date: "2027-01-10", time: "14:00" } })).status, 403);
    assert.equal((await request(baseUrl, "/api/accounts", { token: elenaToken })).status, 200);
    const liveGmail = await request(baseUrl, "/api/accounts/connect", {
      method: "POST", token: elenaToken,
      body: { provider: "GMAIL", emailAddress: "ignored@example.test", clientId: "cli_victoria_01", mode: "LIVE" }
    });
    assert.equal(liveGmail.status, 200);
    assert.match(liveGmail.json.data.authUrl, /^https:\/\/accounts\.google\.com\//);
    const liveOutlook = await request(baseUrl, "/api/accounts/connect", {
      method: "POST", token: elenaToken,
      body: { provider: "OUTLOOK", emailAddress: "ignored@example.test", clientId: "cli_victoria_01", mode: "LIVE" }
    });
    assert.equal(liveOutlook.status, 200);
    assert.match(liveOutlook.json.data.authUrl, /^https:\/\/login\.microsoftonline\.com\//);
    assert.equal((await request(baseUrl, "/api/accounts/acc_david_outlook/sync", { method: "POST", token: victoriaToken })).status, 403);
    assert.equal((await request(baseUrl, "/api/accounts/not-found/sync", { method: "POST", token: elenaToken })).status, 404);
    assert.equal((await request(baseUrl, "/api/accounts/acc_victoria_gmail", { method: "DELETE", token: elenaToken })).status, 200);
    assert.equal((await request(baseUrl, "/api/accounts/acc_victoria_gmail", { method: "DELETE", token: elenaToken })).status, 404);
    assert.equal((await request(baseUrl, "/api/accounts/oauth/callback/google?error=access_denied", { redirect: "manual" })).status, 302);
    assert.equal((await request(baseUrl, "/api/missing-endpoint")).status, 404);
    const assistantRegistration = await request(baseUrl, "/api/auth/register", {
      method: "POST",
      body: {
        name: "Test Assistant",
        email: `test_${Date.now()}@relaydesk.ai`,
        password: "Password123!",
        role: "ASSISTANT"
      }
    });
    assert.equal(assistantRegistration.status, 400);
    const reg = await request(baseUrl, "/api/auth/register", {
      method: "POST",
      body: {
        name: "Test Client",
        email: `client_${Date.now()}@example.com`,
        password: "Password123!",
        role: "CLIENT"
      }
    });
    assert.equal(reg.status, 201);
    const newToken = reg.json.data.token;
    const onboard = await request(baseUrl, "/api/auth/onboarding", {
      method: "POST",
      token: newToken,
      body: { provider: "GMAIL", emailAddress: "demo@relaydesk.ai", complete: true }
    });
    assert.equal(onboard.status, 200);
    assert.equal(onboard.json.data.user.onboardingCompleted, true);
    console.log("ALL_INTEGRATION_TESTS_PASSED");
  } finally {
    await seedIfEmpty(true);
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
  }
}
runTests().catch((err) => {
  console.error("INTEGRATION_TEST_FAILED:", err);
  process.exit(1);
});

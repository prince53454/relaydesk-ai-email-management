import bcrypt from "bcryptjs";
import { dataStore, newId } from "../repositories/dataStore.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";
import { recordActivity } from "../services/notificationService.js";
import { sendRegistrationEmail } from "../services/email/registrationMailer.js";
import { logger } from "../utils/logger.js";
import { SEED_IDS } from "../seed/seedUsers.js";
function sanitizeUser(user) {
  const { password: _pwd, ...safe } = user;
  return safe;
}
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, title, timezone } = req.body;
  const existing = await dataStore.findUserByEmail(email);
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const user = {
    id: newId(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role,
    avatar: "",
    title: title || (role === "ASSISTANT" ? "Executive Assistant" : "Executive Client"),
    timezone: timezone || "America/Los_Angeles",
    onboardingCompleted: false,
    preferences: {
      autoClassify: true,
      digestFrequency: "DAILY",
      density: "COMPACT",
      defaultTone: "PROFESSIONAL"
    },
    createdAt: now,
    updatedAt: now
  };
  await dataStore.createUser(user);
  if (role === "CLIENT") {
    const users = await dataStore.listUsers();
      const defaultAssistant = users.find((u) => u.role === "ASSISTANT") || null;
    if (defaultAssistant) {
      await dataStore.createClient({
        id: newId(),
        name: user.name,
        email: user.email,
        company: "Executive Office",
        roleTitle: user.title || "Principal",
        avatar: "",
        assistantId: defaultAssistant.id,
        userId: user.id,
        vipSenders: [],
        notes: "Newly registered client workspace.",
        createdAt: now
      });
    }
  } else {
    await dataStore.createClient({
      id: newId(),
      name: `${user.name.split(" ")[0]}'s Principal`,
      email: `principal.${user.email}`,
      company: "Executive Partners",
      roleTitle: "Managing Partner",
      avatar: "",
      assistantId: user.id,
      vipSenders: [],
      notes: "Default client workspace created during registration.",
      createdAt: now
    });
  }
  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  const safeUser = sanitizeUser(user);
  await recordActivity({
    user: safeUser,
    action: "USER_REGISTERED",
    description: `${user.name} registered as ${user.role}`
  });
  let emailSent = false;
  try {
    const result = await sendRegistrationEmail(user);
    emailSent = result.sent;
    if (!result.sent) logger.warn("Registration email was not sent", result.reason);
  } catch (error) {
    logger.warn("Registration email delivery failed", error.message);
  }
  return sendSuccess(
    res,
    { token, user: safeUser, emailSent },
    emailSent ? "Account created and welcome email sent" : "Account created, but welcome email could not be sent",
    201
  );
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await dataStore.findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }
  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  const safeUser = sanitizeUser(user);
  await recordActivity({
    user: safeUser,
    action: "USER_LOGIN",
    description: `${user.name} signed in`
  });
  return sendSuccess(res, { token, user: safeUser }, "Signed in successfully");
});
const demoSwitchRole = asyncHandler(async (req, res) => {
  const role = req.body?.role;
  if (!['ASSISTANT', 'CLIENT'].includes(role)) throw new ApiError(400, "Choose an Assistant or Client demo workspace.");
  const email = role === "ASSISTANT" ? "elena@relaydesk.ai" : "victoria@sterlingventures.com";
  const user = await dataStore.findUserByEmail(email);
  if (!user) throw new ApiError(404, "The seeded demo workspace is unavailable.");
  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  const safeUser = sanitizeUser(user);
  await recordActivity({ user: safeUser, action: "USER_LOGIN", description: `${user.name} opened the ${role} demo workspace` });
  return sendSuccess(res, { token, user: safeUser }, "Demo workspace switched");
});
const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }
  return sendSuccess(res, { user: req.user }, "Session active");
});
const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await recordActivity({
      user: req.user,
      action: "USER_LOGOUT",
      description: `${req.user.name} signed out`
    });
  }
  return sendSuccess(res, { ok: true }, "Logged out successfully");
});
const completeOnboarding = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Not authenticated");
  const { role, provider, emailAddress, displayName, timezone, complete } = req.body;
  if (role && role !== req.user.role) {
    throw new ApiError(403, "Account role cannot be changed during onboarding");
  }
  // The demo sign-in can use any assistant credential; attach the active
  // assistant to the sample clients so its inbox and Copilot have live data.
  if (req.user.role === "ASSISTANT") {
    const seededClients = await dataStore.listClients();
    for (const client of seededClients.filter((item) =>
      [SEED_IDS.clients.victoria, SEED_IDS.clients.david, SEED_IDS.clients.aria].includes(item.id)
    )) {
      await dataStore.updateClient(client.id, { assistantId: req.user.id });
    }
  }
  const updated = await dataStore.updateUser(req.user.id, {
    role: role || req.user.role,
    timezone: timezone || req.user.timezone,
    onboardingCompleted: complete ?? true
  });
  if (provider && emailAddress) {
    const clients = await dataStore.listClients();
    const targetClient = req.user.role === "CLIENT" ? clients.find((c) => c.userId === req.user.id) : clients.find((c) => c.assistantId === req.user.id);
    if (targetClient) {
      const existingAccount = (await dataStore.listEmailAccounts()).find((account) =>
        account.clientId === targetClient.id && account.emailAddress.toLowerCase() === emailAddress.toLowerCase().trim()
      );
      if (!existingAccount) await dataStore.createEmailAccount({
        id: newId(),
        userId: req.user.id,
        clientId: targetClient.id,
        provider,
        emailAddress: emailAddress.toLowerCase().trim(),
        displayName: displayName || req.user.name,
        connectionStatus: "CONNECTED_DEMO",
        isSimulated: true,
        lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  }
  return sendSuccess(
    res,
    { user: updated ? sanitizeUser(updated) : req.user },
    "Onboarding updated"
  );
});
export {
  completeOnboarding,
  demoSwitchRole,
  getMe,
  login,
  logout,
  register
};

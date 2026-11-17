import crypto from "crypto";
import { isMongoConnected } from "../config/database.js";
import { loadLocalStore, saveLocalStore } from "../config/localStore.js";
import { UserModel } from "../models/User.js";
import { ClientModel } from "../models/Client.js";
import { EmailAccountModel } from "../models/EmailAccount.js";
import { ConversationModel } from "../models/Conversation.js";
import { MessageModel } from "../models/Message.js";
import { ActionModel } from "../models/Action.js";
import { MeetingModel } from "../models/Meeting.js";
import { ActivityModel } from "../models/Activity.js";
function newId() {
  return crypto.randomBytes(12).toString("hex");
}
function normalizeDoc(doc) {
  const maybeDoc = doc;
  const plain = typeof maybeDoc.toObject === "function" ? maybeDoc.toObject() : { ...doc };
  const id = String(plain._id || plain.id || "");
  delete plain._id;
  delete plain.__v;
  return { ...plain, id };
}
const dataStore = {
  // USERS
  async findUserByEmail(email) {
    const normalized = email.toLowerCase().trim();
    if (isMongoConnected()) {
      const doc = await UserModel.findOne({ email: normalized });
      return doc ? normalizeDoc(doc) : null;
    }
    const store = loadLocalStore();
    return store.users.find((u) => u.email.toLowerCase() === normalized) || null;
  },
  async findUserById(id) {
    if (isMongoConnected()) {
      const doc = await UserModel.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    const store = loadLocalStore();
    return store.users.find((u) => u.id === id) || null;
  },
  async listUsers() {
    if (isMongoConnected()) {
      const docs = await UserModel.find({});
      return docs.map((d) => normalizeDoc(d));
    }
    return loadLocalStore().users;
  },
  async createUser(user) {
    if (isMongoConnected()) {
      const doc = await UserModel.create({ _id: user.id, ...user });
      return normalizeDoc(doc);
    }
    const store = loadLocalStore();
    store.users.push(user);
    saveLocalStore(store);
    return user;
  },
  async updateUser(id, patch) {
    if (isMongoConnected()) {
      const doc = await UserModel.findByIdAndUpdate(id, { $set: patch }, { returnDocument: "after" });
      return doc ? normalizeDoc(doc) : null;
    }
    const store = loadLocalStore();
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    store.users[idx] = { ...store.users[idx], ...patch, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    saveLocalStore(store);
    return store.users[idx];
  },
  // CLIENTS
  async listClients() {
    if (isMongoConnected()) {
      const docs = await ClientModel.find({});
      return docs.map((d) => normalizeDoc(d));
    }
    return loadLocalStore().clients;
  },
  async findClientById(id) {
    if (isMongoConnected()) {
      const doc = await ClientModel.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return loadLocalStore().clients.find((c) => c.id === id) || null;
  },
  async findClientByUserIdOrEmail(userId, email) {
    if (isMongoConnected()) {
      const doc = await ClientModel.findOne({ $or: [{ userId }, { email: email.toLowerCase() }] });
      return doc ? normalizeDoc(doc) : null;
    }
    return loadLocalStore().clients.find(
      (c) => c.userId === userId || c.email.toLowerCase() === email.toLowerCase()
    ) || null;
  },
  async createClient(client) {
    if (isMongoConnected()) {
      const doc = await ClientModel.create({ _id: client.id, ...client });
      return normalizeDoc(doc);
    }
    const store = loadLocalStore();
    store.clients.push(client);
    saveLocalStore(store);
    return client;
  },
  async updateClient(id, patch) {
    if (isMongoConnected()) {
      const doc = await ClientModel.findByIdAndUpdate(id, { $set: patch }, { returnDocument: "after" });
      return doc ? normalizeDoc(doc) : null;
    }
    const store = loadLocalStore();
    const idx = store.clients.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    store.clients[idx] = { ...store.clients[idx], ...patch };
    saveLocalStore(store);
    return store.clients[idx];
  },
  // EMAIL ACCOUNTS
  async listEmailAccounts() {
    if (isMongoConnected()) {
      const docs = await EmailAccountModel.find({});
      return docs.map((d) => normalizeDoc(d));
    }
    return loadLocalStore().emailAccounts;
  },
  async findEmailAccountById(id) {
    if (isMongoConnected()) {
      const doc = await EmailAccountModel.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return loadLocalStore().emailAccounts.find((a) => a.id === id) || null;
  },
  async createEmailAccount(account) {
    if (isMongoConnected()) {
      const doc = await EmailAccountModel.create({ _id: account.id, ...account });
      return normalizeDoc(doc);
    }
    const store = loadLocalStore();
    store.emailAccounts.push(account);
    saveLocalStore(store);
    return account;
  },
  async updateEmailAccount(id, patch) {
    if (isMongoConnected()) {
      const doc = await EmailAccountModel.findByIdAndUpdate(id, { $set: patch }, { returnDocument: "after" });
      return doc ? normalizeDoc(doc) : null;
    }
    const store = loadLocalStore();
    const idx = store.emailAccounts.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    store.emailAccounts[idx] = { ...store.emailAccounts[idx], ...patch };
    saveLocalStore(store);
    return store.emailAccounts[idx];
  },
  async deleteEmailAccount(id) {
    if (isMongoConnected()) {
      const res = await EmailAccountModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = loadLocalStore();
    const before = store.emailAccounts.length;
    store.emailAccounts = store.emailAccounts.filter((a) => a.id !== id);
    saveLocalStore(store);
    return store.emailAccounts.length < before;
  },
  // CONVERSATIONS
  async listConversations() {
    if (isMongoConnected()) {
      const docs = await ConversationModel.find({}).sort({ lastMessageAt: -1 });
      return docs.map((d) => normalizeDoc(d));
    }
    return [...loadLocalStore().conversations].sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  },
  async findConversationById(id) {
    if (isMongoConnected()) {
      const doc = await ConversationModel.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return loadLocalStore().conversations.find((c) => c.id === id) || null;
  },
  async createConversation(conv) {
    if (isMongoConnected()) {
      const doc = await ConversationModel.create({ _id: conv.id, ...conv });
      return normalizeDoc(doc);
    }
    const store = loadLocalStore();
    store.conversations.push(conv);
    saveLocalStore(store);
    return conv;
  },
  async updateConversation(id, patch) {
    if (isMongoConnected()) {
      const doc = await ConversationModel.findByIdAndUpdate(
        id,
        { $set: { ...patch, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } },
        { returnDocument: "after" }
      );
      return doc ? normalizeDoc(doc) : null;
    }
    const store = loadLocalStore();
    const idx = store.conversations.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    store.conversations[idx] = {
      ...store.conversations[idx],
      ...patch,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    saveLocalStore(store);
    return store.conversations[idx];
  },
  // MESSAGES
  async listMessagesByConversation(conversationId) {
    if (isMongoConnected()) {
      const docs = await MessageModel.find({ conversationId }).sort({ receivedAt: 1 });
      return docs.map((d) => normalizeDoc(d));
    }
    return loadLocalStore().messages.filter((m) => m.conversationId === conversationId).sort((a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime());
  },
  async createMessage(msg) {
    if (isMongoConnected()) {
      const doc = await MessageModel.create({ _id: msg.id, ...msg });
      return normalizeDoc(doc);
    }
    const store = loadLocalStore();
    store.messages.push(msg);
    saveLocalStore(store);
    return msg;
  },
  async updateMessage(id, patch) {
    if (isMongoConnected()) {
      const doc = await MessageModel.findByIdAndUpdate(id, { $set: patch }, { returnDocument: "after" });
      return doc ? normalizeDoc(doc) : null;
    }
    const store = loadLocalStore();
    const index = store.messages.findIndex((message) => message.id === id);
    if (index === -1) return null;
    store.messages[index] = { ...store.messages[index], ...patch };
    saveLocalStore(store);
    return store.messages[index];
  },
  // ACTIONS
  async listActions() {
    if (isMongoConnected()) {
      const docs = await ActionModel.find({}).sort({ dueDate: 1 });
      return docs.map((d) => normalizeDoc(d));
    }
    return [...loadLocalStore().actions].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  },
  async findActionById(id) {
    if (isMongoConnected()) {
      const doc = await ActionModel.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return loadLocalStore().actions.find((a) => a.id === id) || null;
  },
  async createAction(action) {
    if (isMongoConnected()) {
      const doc = await ActionModel.create({ _id: action.id, ...action });
      return normalizeDoc(doc);
    }
    const store = loadLocalStore();
    store.actions.push(action);
    saveLocalStore(store);
    return action;
  },
  async updateAction(id, patch) {
    if (isMongoConnected()) {
      const doc = await ActionModel.findByIdAndUpdate(
        id,
        { $set: { ...patch, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } },
        { returnDocument: "after" }
      );
      return doc ? normalizeDoc(doc) : null;
    }
    const store = loadLocalStore();
    const idx = store.actions.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    store.actions[idx] = {
      ...store.actions[idx],
      ...patch,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    saveLocalStore(store);
    return store.actions[idx];
  },
  // MEETINGS
  async listMeetings() {
    if (isMongoConnected()) {
      const docs = await MeetingModel.find({}).sort({ date: 1, time: 1 });
      return docs.map((d) => normalizeDoc(d));
    }
    return [...loadLocalStore().meetings].sort((a, b) => a.date.localeCompare(b.date));
  },
  async findMeetingById(id) {
    if (isMongoConnected()) {
      const doc = await MeetingModel.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return loadLocalStore().meetings.find((m) => m.id === id) || null;
  },
  async createMeeting(meeting) {
    if (isMongoConnected()) {
      const doc = await MeetingModel.create({ _id: meeting.id, ...meeting });
      return normalizeDoc(doc);
    }
    const store = loadLocalStore();
    store.meetings.push(meeting);
    saveLocalStore(store);
    return meeting;
  },
  async updateMeeting(id, patch) {
    if (isMongoConnected()) {
      const doc = await MeetingModel.findByIdAndUpdate(
        id,
        { $set: { ...patch, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } },
        { returnDocument: "after" }
      );
      return doc ? normalizeDoc(doc) : null;
    }
    const store = loadLocalStore();
    const idx = store.meetings.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    store.meetings[idx] = {
      ...store.meetings[idx],
      ...patch,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    saveLocalStore(store);
    return store.meetings[idx];
  },
  // ACTIVITIES
  async listActivities(limit = 50) {
    if (isMongoConnected()) {
      const docs = await ActivityModel.find({}).sort({ timestamp: -1 }).limit(limit);
      return docs.map((d) => normalizeDoc(d));
    }
    return [...loadLocalStore().activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
  },
  async createActivity(activity) {
    if (isMongoConnected()) {
      const doc = await ActivityModel.create({ _id: activity.id, ...activity });
      return normalizeDoc(doc);
    }
    const store = loadLocalStore();
    store.activities.unshift(activity);
    if (store.activities.length > 250) {
      store.activities = store.activities.slice(0, 250);
    }
    saveLocalStore(store);
    return activity;
  }
};
export {
  dataStore,
  newId
};

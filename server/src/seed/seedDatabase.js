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
import { dataStore } from "../repositories/dataStore.js";
import { buildSeedUsersAndClients } from "./seedUsers.js";
import { buildSeedConversationsAndWork } from "./seedEmails.js";
import { logger } from "../utils/logger.js";
const CLIENT_REPLY_EXAMPLE_IDS = new Set(["conv_29", "conv_30", "conv_31"]);

async function ensureClientReplyExamples() {
  const { conversations, messages } = buildSeedConversationsAndWork();
  for (const conversation of conversations.filter((item) => CLIENT_REPLY_EXAMPLE_IDS.has(item.id))) {
    if (!(await dataStore.findConversationById(conversation.id))) {
      await dataStore.createConversation(conversation);
    }
    if ((await dataStore.listMessagesByConversation(conversation.id)).length === 0) {
      for (const message of messages.filter((item) => item.conversationId === conversation.id)) {
        await dataStore.createMessage(message);
      }
    }
  }
}

async function seedIfEmpty(force = false) {
  if (isMongoConnected()) {
    const existingCount = await UserModel.countDocuments();
    if (existingCount > 0 && !force) {
      await ensureClientReplyExamples();
      return { seeded: false, count: existingCount };
    }
    if (force) {
      await Promise.all([
        UserModel.deleteMany({}),
        ClientModel.deleteMany({}),
        EmailAccountModel.deleteMany({}),
        ConversationModel.deleteMany({}),
        MessageModel.deleteMany({}),
        ActionModel.deleteMany({}),
        MeetingModel.deleteMany({}),
        ActivityModel.deleteMany({})
      ]);
    }
    const { users: users2, clients: clients2, emailAccounts: emailAccounts2 } = await buildSeedUsersAndClients();
    const { conversations: conversations2, messages: messages2, actions: actions2, meetings: meetings2, activities: activities2 } = buildSeedConversationsAndWork();
    await UserModel.insertMany(users2.map((u) => ({ _id: u.id, ...u })));
    await ClientModel.insertMany(clients2.map((c) => ({ _id: c.id, ...c })));
    await EmailAccountModel.insertMany(emailAccounts2.map((a) => ({ _id: a.id, ...a })));
    await ConversationModel.insertMany(conversations2.map((c) => ({ _id: c.id, ...c })));
    await MessageModel.insertMany(messages2.map((m) => ({ _id: m.id, ...m })));
    await ActionModel.insertMany(actions2.map((a) => ({ _id: a.id, ...a })));
    await MeetingModel.insertMany(meetings2.map((m) => ({ _id: m.id, ...m })));
    await ActivityModel.insertMany(activities2.map((a) => ({ _id: a.id, ...a })));
    logger.info(`Seeded MongoDB with ${conversations2.length} conversations`);
    return { seeded: true, count: conversations2.length };
  }
  const current = loadLocalStore();
  if (current.users.length > 0 && !force) {
    await ensureClientReplyExamples();
    return { seeded: false, count: current.conversations.length };
  }
  const { users, clients, emailAccounts } = await buildSeedUsersAndClients();
  const { conversations, messages, actions, meetings, activities } = buildSeedConversationsAndWork();
  saveLocalStore({
    users,
    clients,
    emailAccounts,
    conversations,
    messages,
    actions,
    meetings,
    activities
  });
  logger.info(`Seeded local persistent store with ${conversations.length} conversations`);
  return { seeded: true, count: conversations.length };
}
export {
  seedIfEmpty
};

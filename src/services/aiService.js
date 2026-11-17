import { api } from "./api";
const aiService = {
  async classify(conversationId, forceReclassify = true) {
    const res = await api.post("/ai/classify", { conversationId, forceReclassify });
    return res.data.data;
  },
  async summarize(conversationId) {
    const res = await api.post("/ai/summarize", { conversationId });
    return res.data.data;
  },
  async draftReply(payload) {
    const res = await api.post("/ai/draft-reply", payload);
    return res.data.data;
  },
  async extractActions(conversationId) {
    const res = await api.post("/ai/extract-actions", { conversationId });
    return res.data.data;
  },
  async chat(payload) {
    const res = await api.post("/ai/chat", payload);
    return res.data.data;
  }
};
export {
  aiService
};

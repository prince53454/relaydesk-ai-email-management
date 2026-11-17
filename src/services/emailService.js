import { api } from "./api";
const emailService = {
  async list(params = {}) {
    const res = await api.get("/emails", { params });
    return res.data.data;
  },
  async getById(id) {
    const res = await api.get(`/emails/${id}`);
    return res.data.data;
  },
  async update(id, patch) {
    const res = await api.patch(`/emails/${id}`, patch);
    return res.data.data.email;
  },
  async overrideClassification(id, payload) {
    const res = await api.patch(`/emails/${id}/classification`, payload);
    return res.data.data.email;
  },
  async toggleArchive(id, isArchived) {
    const res = await api.patch(`/emails/${id}/archive`, { isArchived });
    return res.data.data.email;
  },
  async toggleRead(id, isUnread) {
    const res = await api.patch(`/emails/${id}/read`, { isUnread });
    return res.data.data.email;
  },
  async markCompleted(id, status) {
    const res = await api.patch(`/emails/${id}/complete`, { status });
    return res.data.data.email;
  },
  async sendSimulatedReply(id, payload) {
    const res = await api.post(`/emails/${id}/reply`, payload);
    return res.data.data;
  },
  async requestTakeover(id, note) {
    const res = await api.post(`/emails/${id}/takeover`, { note });
    return res.data.data.email;
  },
  async addNote(id, content) {
    const res = await api.post(`/emails/${id}/note`, { content });
    return res.data.data.email;
  }
};
export {
  emailService
};

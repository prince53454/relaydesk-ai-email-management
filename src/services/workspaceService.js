import { api } from "./api";
const dashboardService = {
  async getOverview(clientId) {
    const res = await api.get("/dashboard/overview", { params: clientId && clientId !== "ALL" ? { clientId } : {} });
    return res.data.data;
  },
  async getStats(clientId) {
    const res = await api.get("/dashboard/stats", { params: clientId && clientId !== "ALL" ? { clientId } : {} });
    return res.data.data.stats;
  },
  async getActivity() {
    const res = await api.get("/dashboard/activity");
    return res.data.data.activities;
  }
};
const clientService = {
  async list() {
    const res = await api.get("/clients");
    return res.data.data.clients;
  },
  async create(payload) {
    const res = await api.post("/clients", payload);
    return res.data.data.client;
  },
  async update(id, patch) {
    const res = await api.patch(`/clients/${id}`, patch);
    return res.data.data.client;
  }
};
const actionService = {
  async list(clientId) {
    const res = await api.get("/actions", { params: clientId && clientId !== "ALL" ? { clientId } : {} });
    return res.data.data.actions;
  },
  async create(payload) {
    const res = await api.post("/actions", payload);
    return res.data.data.action;
  },
  async update(id, patch) {
    const res = await api.patch(`/actions/${id}`, patch);
    return res.data.data.action;
  }
};
const meetingService = {
  async list(clientId) {
    const res = await api.get("/meetings", { params: clientId && clientId !== "ALL" ? { clientId } : {} });
    return res.data.data.meetings;
  },
  async create(payload) {
    const res = await api.post("/meetings", payload);
    return res.data.data.meeting;
  },
  async update(id, patch) {
    const res = await api.patch(`/meetings/${id}`, patch);
    return res.data.data.meeting;
  }
};
const accountService = {
  async list() {
    const res = await api.get("/accounts");
    return res.data.data;
  },
  async connect(payload) {
    const res = await api.post("/accounts/connect", payload);
    return res.data.data;
  },
  async sync(id) {
    const res = await api.post(`/accounts/${id}/sync`);
    return res.data.data;
  },
  async disconnect(id) {
    await api.delete(`/accounts/${id}`);
  }
};
export {
  accountService,
  actionService,
  clientService,
  dashboardService,
  meetingService
};

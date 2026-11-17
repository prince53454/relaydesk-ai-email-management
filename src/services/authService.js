import { api, TOKEN_STORAGE_KEY } from "./api";
const authService = {
  async login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data.data;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    return { token, user };
  },
  async register(payload) {
    const res = await api.post("/auth/register", payload);
    const { token, user, emailSent } = res.data.data;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    return { token, user, emailSent };
  },
  async getMe() {
    const res = await api.get("/auth/me");
    return res.data.data.user;
  },
  async switchDemoRole(role) {
    const res = await api.post("/auth/demo-switch", { role });
    const { token, user } = res.data.data;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    return user;
  },
  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  },
  async completeOnboarding(payload) {
    const res = await api.post("/auth/onboarding", payload);
    return res.data.data.user;
  },
  async updateSettings(payload) {
    const res = await api.patch("/users/settings", payload);
    return res.data.data.user;
  }
};
export {
  authService
};

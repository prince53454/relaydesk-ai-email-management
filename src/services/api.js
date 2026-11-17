import axios from "axios";
const TOKEN_STORAGE_KEY = "relaydesk_jwt_token_v2";
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 3e4
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || "An unexpected network error occurred";
    return Promise.reject(new Error(message));
  }
);
export {
  TOKEN_STORAGE_KEY,
  api
};

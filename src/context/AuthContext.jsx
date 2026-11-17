import { jsx } from "react/jsx-runtime";
import { createContext, useCallback, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { TOKEN_STORAGE_KEY } from "../services/api";
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authService.getMe();
      setUser(me);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data.user;
  };
  const register = async (payload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    return { user: data.user, emailSent: data.emailSent };
  };
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };
  const switchDemoRole = async (role) => {
    const nextUser = await authService.switchDemoRole(role);
    setUser(nextUser);
    return nextUser;
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, loading, login, register, logout, switchDemoRole, refreshUser, setUser }, children });
}
export {
  AuthContext,
  AuthProvider
};

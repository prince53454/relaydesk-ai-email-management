import { jsx } from "react/jsx-runtime";
import { createContext, useCallback, useEffect, useState } from "react";
import { emailService } from "../services/emailService";
import { clientService } from "../services/workspaceService";
import { useAuth } from "../hooks/useAuth";
const EmailContext = createContext(null);
function EmailProvider({ children }) {
  const { user } = useAuth();
  const [emails, setEmails] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("ALL");
  const [pendingThreadId, setPendingThreadId] = useState(void 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 30, total: 0, totalPages: 1 });
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotConversationId, setCopilotConversationId] = useState(void 0);
  const refreshClients = useCallback(async () => {
    if (!user) return;
    try {
      const list = await clientService.list();
      setClients(list);
    } catch {
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      refreshClients();
    } else {
      setEmails([]);
      setClients([]);
      setSelectedClientId("ALL");
    }
  }, [user, refreshClients]);
  const fetchEmails = useCallback(
    async (params = {}, { silent = false } = {}) => {
      if (!user) return;
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const res = await emailService.list({
          clientId: selectedClientId !== "ALL" ? selectedClientId : void 0,
          ...params
        });
        setEmails(res.emails);
        setPagination(res.pagination);
      } catch (err) {
        if (!silent) {
          setError(err instanceof Error ? err.message : "Failed to load conversations");
          setEmails([]);
          setPagination({ page: 1, limit: 30, total: 0, totalPages: 1 });
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [user, selectedClientId]
  );
  const updateLocalEmail = useCallback((updated) => {
    setEmails((prev) => prev.map((e) => e.id === updated.id ? { ...e, ...updated } : e));
  }, []);
  return /* @__PURE__ */ jsx(
    EmailContext.Provider,
    {
      value: {
        emails,
        clients,
        selectedClientId,
        setSelectedClientId,
        pendingThreadId,
        setPendingThreadId,
        loading,
        error,
        pagination,
        fetchEmails,
        refreshClients,
        updateLocalEmail,
        copilotOpen,
        setCopilotOpen,
        copilotConversationId,
        setCopilotConversationId
      },
      children
    }
  );
}
export {
  EmailContext,
  EmailProvider
};

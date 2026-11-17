import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { EmailFilters } from "../../components/emails/EmailFilters";
import { EmailList } from "../../components/emails/EmailList";
import { EmailDetails } from "../../components/emails/EmailDetails";
import { EmptyState } from "../../components/common/EmptyState";
import { useEmails } from "../../hooks/useEmails";
import { useDebounce } from "../../hooks/useDebounce";
import { emailService } from "../../services/emailService";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
const VIEW_TITLES = {
  ALL: "All Emails",
  ASSISTANT_TO_REPLY: "Assistant to Reply",
  CLIENT_TO_REPLY: "Client to Reply",
  NO_REPLY_NEEDED: "No Reply Needed",
  NEEDS_REVIEW: "Needs Review",
  WAITING: "Waiting for Response",
  IMPORTANT: "Important Emails",
  ARCHIVED: "Archived Conversations"
};
const validPriorities = ["ALL", "URGENT", "HIGH", "MEDIUM", "LOW"];
const validSorts = ["newest", "priority", "confidence_asc", "oldest"];
const validArchiveModes = ["ACTIVE", "ALL", "ARCHIVED"];
function InboxWorkspace({ mode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const threadFromUrl = searchParams.get("thread") || void 0;
  const {
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
    updateLocalEmail
  } = useEmails();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 250);
  const [priority, setPriority] = useState(validPriorities.includes(searchParams.get("priority")) ? searchParams.get("priority") : "ALL");
  const [sort, setSort] = useState(validSorts.includes(searchParams.get("sort")) ? searchParams.get("sort") : "newest");
  const [unreadOnly, setUnreadOnly] = useState(searchParams.get("unread") === "true");
  const [actionRequiredOnly, setActionRequiredOnly] = useState(searchParams.get("actionRequired") === "true");
  const [archivedMode, setArchivedMode] = useState(validArchiveModes.includes(searchParams.get("archived")) ? searchParams.get("archived") : mode === "ARCHIVED" ? "ARCHIVED" : "ACTIVE");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(threadFromUrl);
  const previousClientId = useRef(selectedClientId);
  useEffect(() => {
    setSelectedId(threadFromUrl);
  }, [threadFromUrl]);
  useEffect(() => {
    setPage(1);
  }, [mode, debouncedSearch, priority, sort, unreadOnly, actionRequiredOnly, archivedMode, selectedClientId]);
  useEffect(() => {
    if (previousClientId.current === selectedClientId) return;
    previousClientId.current = selectedClientId;
    setSelectedId(void 0);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("thread");
      return next;
    }, { replace: true });
  }, [selectedClientId, setSearchParams]);
  useEffect(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (debouncedSearch) next.set("search", debouncedSearch);
      else next.delete("search");
      if (priority !== "ALL") next.set("priority", priority);
      else next.delete("priority");
      if (sort !== "newest") next.set("sort", sort);
      else next.delete("sort");
      if (unreadOnly) next.set("unread", "true");
      else next.delete("unread");
      if (actionRequiredOnly) next.set("actionRequired", "true");
      else next.delete("actionRequired");
      if (archivedMode !== "ACTIVE") next.set("archived", archivedMode);
      else next.delete("archived");
      return next;
    }, { replace: true });
  }, [debouncedSearch, priority, sort, unreadOnly, actionRequiredOnly, archivedMode, setSearchParams]);
  useEffect(() => {
    if (!pendingThreadId) return;
    setSelectedId(pendingThreadId);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("thread", pendingThreadId);
      return next;
    });
    setPendingThreadId(void 0);
  }, [pendingThreadId, setPendingThreadId, setSearchParams]);
  const buildEmailParams = useCallback(() => {
    const params = {
      search: debouncedSearch || void 0,
      priority: priority !== "ALL" ? priority : void 0,
      sort,
      unread: unreadOnly ? true : void 0,
      actionRequired: actionRequiredOnly ? true : void 0,
      archived: archivedMode === "ARCHIVED" ? true : archivedMode === "ALL" ? "all" : false,
      page,
      limit: 30
    };
    if (mode === "ASSISTANT_TO_REPLY") params.classification = "ASSISTANT_TO_REPLY";
    else if (mode === "CLIENT_TO_REPLY") params.classification = "CLIENT_TO_REPLY";
    else if (mode === "NO_REPLY_NEEDED") params.classification = "NO_REPLY_NEEDED";
    else if (mode === "NEEDS_REVIEW") params.classification = "NEEDS_REVIEW";
    else if (mode === "WAITING") params.status = "WAITING_FOR_RESPONSE";
    else if (mode === "IMPORTANT") params.important = true;
    return params;
  }, [mode, debouncedSearch, priority, sort, unreadOnly, actionRequiredOnly, archivedMode, page]);
  useEffect(() => {
    fetchEmails(buildEmailParams());
  }, [buildEmailParams, selectedClientId, fetchEmails]);
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") fetchEmails(buildEmailParams(), { silent: true });
    };
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [buildEmailParams, fetchEmails]);
  const handleEmailUpdated = useCallback((updated) => {
    updateLocalEmail(updated);
    fetchEmails(buildEmailParams());
    const noLongerMatchesArchiveFilter =
      (archivedMode === "ARCHIVED" && !updated.isArchived) ||
      (archivedMode === "ACTIVE" && updated.isArchived);
    if (noLongerMatchesArchiveFilter) {
      setSelectedId(void 0);
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.delete("thread");
        return next;
      });
    }
  }, [updateLocalEmail, fetchEmails, buildEmailParams, archivedMode, setSearchParams]);
  const handleSelectEmail = async (email) => {
    setSelectedId(email.id);
    // Selecting an email in the inbox should not silently scope a currently open workspace chat.
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("thread", email.id);
      return next;
    });
    if (email.isUnread) {
      try {
        const updated = await emailService.toggleRead(email.id, false);
        updateLocalEmail(updated);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Unable to mark conversation as read");
      }
    }
  };
  const handleToggleImportant = async (email, e) => {
    e.stopPropagation();
    try {
      const updated = await emailService.update(email.id, { isImportant: !email.isImportant });
      handleEmailUpdated(updated);
      toast.success(updated.isImportant ? "Marked important" : "Removed from important");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };
  const handleResetFilters = () => {
    setSearch("");
    setPriority("ALL");
    setUnreadOnly(false);
    setActionRequiredOnly(false);
    setArchivedMode("ACTIVE");
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: VIEW_TITLES[mode], noPadding: true, children: /* @__PURE__ */ jsxs("div", { className: "h-full flex overflow-hidden", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `w-full lg:w-[400px] xl:w-[430px] border-r border-[#E2E8F0] bg-white flex flex-col shrink-0 ${selectedId ? "hidden lg:flex" : "flex"}`,
        children: [
          /* @__PURE__ */ jsx(
            EmailFilters,
            {
              search,
              onSearchChange: setSearch,
              priority,
              onPriorityChange: setPriority,
              sort,
              onSortChange: setSort,
              unreadOnly,
              onUnreadOnlyChange: setUnreadOnly,
              actionRequiredOnly,
              onActionRequiredChange: setActionRequiredOnly,
              archivedMode,
              onArchivedModeChange: setArchivedMode,
              clients,
              selectedClientId,
              onClientChange: setSelectedClientId
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 overflow-hidden", children: /* @__PURE__ */ jsx(
            EmailList,
            {
              emails,
              selectedId,
              loading,
              error,
              onSelect: handleSelectEmail,
              onToggleImportant: handleToggleImportant,
              onResetFilters: handleResetFilters,
              onRetry: () => fetchEmails(buildEmailParams()),
              pagination,
              onPageChange: setPage
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `flex-1 min-w-0 h-full overflow-hidden ${selectedId ? "flex flex-col" : "hidden lg:flex lg:flex-col"}`,
        children: selectedId ? /* @__PURE__ */ jsx(
          EmailDetails,
          {
            conversationId: selectedId,
            onUpdated: handleEmailUpdated,
            onBack: () => {
              setSelectedId(void 0);
              setSearchParams((current) => {
                const next = new URLSearchParams(current);
                next.delete("thread");
                return next;
              });
            }
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center bg-[#F8FAFC]", children: /* @__PURE__ */ jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }),
            title: "Select a conversation",
            description: "Choose an email from the stream to inspect AI classification rationale, executive summary, and reply tools."
          }
        ) })
      }
    )
  ] }) });
}
export {
  InboxWorkspace
};

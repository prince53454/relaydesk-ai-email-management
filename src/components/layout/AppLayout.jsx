import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNavigation } from "./MobileNavigation";
import { AIChatPanel } from "../ai/AIChatPanel";
import { dashboardService } from "../../services/workspaceService";
import { useEmails } from "../../hooks/useEmails";
function AppLayout({ title, children, noPadding = false }) {
  const { selectedClientId } = useEmails();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counts, setCounts] = useState({});
  const refreshCounts = useCallback(async () => {
    try {
      const stats = await dashboardService.getStats(selectedClientId);
      setCounts(stats);
    } catch {
    }
  }, [selectedClientId]);
  useEffect(() => {
    refreshCounts();
    const timer = setInterval(refreshCounts, 60_000);
    return () => clearInterval(timer);
  }, [refreshCounts, title]);
  return /* @__PURE__ */ jsxs("div", { className: "h-[100dvh] w-full overflow-hidden flex bg-[#F8FAFC]", children: [
    /* @__PURE__ */ jsx("div", { className: "hidden lg:block h-full", children: /* @__PURE__ */ jsx(
      Sidebar,
      {
        collapsed,
        onToggleCollapse: () => setCollapsed((c) => !c),
        counts
      }
    ) }),
    /* @__PURE__ */ jsx(
      MobileNavigation,
      {
        open: mobileOpen,
        onClose: () => setMobileOpen(false),
        counts
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col h-full overflow-hidden", children: [
      /* @__PURE__ */ jsx(Header, { title, onOpenMobileMenu: () => setMobileOpen(true) }),
      /* @__PURE__ */ jsx("main", { className: `flex-1 min-h-0 overflow-y-auto ${noPadding ? "" : "p-4 sm:p-6"}`, children })
    ] }),
    /* @__PURE__ */ jsx(AIChatPanel, {})
  ] });
}
export {
  AppLayout
};

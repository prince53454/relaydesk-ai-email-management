import { jsx, jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { useEmails } from "../../hooks/useEmails";
function MobileNavigation({ open, onClose, counts }) {
  const { user } = useAuth();
  const { clients, selectedClientId, setSelectedClientId } = useEmails();
  if (!open) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 lg:hidden flex", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-[#0F172A]/40", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 h-full flex", children: [
      /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
        user?.role === "ASSISTANT" && clients.length > 0 && /* @__PURE__ */ jsx("div", { className: "p-3 border-b border-[#E2E8F0] bg-white", children: /* @__PURE__ */ jsxs("select", { "aria-label": "Workspace client scope", value: selectedClientId, onChange: (e) => setSelectedClientId(e.target.value), className: "w-full h-9 px-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#334155]", children: [jsx("option", { value: "ALL", children: `All Clients (${clients.length})` }), clients.map((client) => jsx("option", { value: client.id, children: client.name }, client.id))] }) }),
        /* @__PURE__ */ jsx(Sidebar, { collapsed: false, onToggleCollapse: onClose, counts, onNavigate: onClose })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          "aria-label": "Close menu",
          className: "m-3 h-8 w-8 rounded-full bg-white text-[#0F172A] flex items-center justify-center shadow",
          children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
        }
      )
    ] })
  ] });
}
export {
  MobileNavigation
};

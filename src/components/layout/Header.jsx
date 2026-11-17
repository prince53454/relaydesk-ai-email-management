import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeftRight, Bot, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEmails } from "../../hooks/useEmails";
import { Avatar } from "../common/Avatar";
import { Button } from "../common/Button";
import toast from "react-hot-toast";
function Header({ title, onOpenMobileMenu, showClientFilter = true }) {
  const { user, logout, switchDemoRole } = useAuth();
  const { clients, selectedClientId, setSelectedClientId, copilotOpen, setCopilotOpen, setCopilotConversationId } = useEmails();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/register");
  };
  const handleSwitchDemoRole = async () => {
    const role = user?.role === "ASSISTANT" ? "CLIENT" : "ASSISTANT";
    try {
      const nextUser = await switchDemoRole(role);
      navigate(nextUser.role === "ASSISTANT" ? "/assistant" : "/client");
    } catch {
      toast.error("Could not switch demo workspace");
    }
  };
  return /* @__PURE__ */ jsxs("header", { className: "h-14 px-4 sm:px-6 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
      onOpenMobileMenu && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onOpenMobileMenu,
          "aria-label": "Open navigation menu",
          className: "lg:hidden p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded cursor-pointer",
          children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-[15px] font-semibold text-[#0F172A] truncate", children: title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 shrink-0", children: [
      showClientFilter && user?.role === "ASSISTANT" && clients.length > 0 && /* @__PURE__ */ jsxs(
        "select",
        {
          "aria-label": "Workspace client scope",
          value: selectedClientId,
          onChange: (e) => setSelectedClientId(e.target.value),
          className: "hidden sm:block h-8 max-w-40 px-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#334155] focus:outline-none focus:border-[#2563EB]",
          children: [
            /* @__PURE__ */ jsxs("option", { value: "ALL", children: [
              "All Clients (",
              clients.length,
              ")"
            ] }),
            clients.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
          ]
        }
      ),
      user && /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          variant: "secondary",
          onClick: handleSwitchDemoRole,
          title: `Switch to ${user.role === "ASSISTANT" ? "Client" : "Executive"} demo view`,
          children: [
            /* @__PURE__ */ jsx(ArrowLeftRight, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: user.role === "ASSISTANT" ? "Client view" : "Executive view" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          variant: copilotOpen ? "primary" : "secondary",
          onClick: () => {
            setCopilotConversationId(void 0);
            setCopilotOpen((o) => !o);
          },
          children: [
            /* @__PURE__ */ jsx(Bot, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "AI Copilot" })
          ]
        }
      ),
      user && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pl-2 border-l border-[#E2E8F0]", children: [
        /* @__PURE__ */ jsx(Avatar, { name: user.name, avatarKey: user.avatar, size: "sm" }),
        /* @__PURE__ */ jsxs("div", { className: "hidden md:block text-left leading-tight", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-[#0F172A] whitespace-nowrap", children: user.name }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#64748B] whitespace-nowrap", children: user.role === "ASSISTANT" ? "Assistant" : "Client" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleLogout,
            title: "Sign out",
            "aria-label": "Sign out",
            className: "inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#DC2626] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer",
            children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Sign out" })]
          }
        )
      ] })
    ] })
  ] });
}
export {
  Header
};

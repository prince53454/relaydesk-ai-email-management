import { jsx, jsxs } from "react/jsx-runtime";
import { NavLink, useLocation } from "react-router-dom";
import {
  Archive,
  Calendar,
  CheckSquare,
  Clock,
  Eye,
  Inbox,
  LayoutDashboard,
  MailCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Star,
  UserCheck,
  Users,
  Bot
} from "lucide-react";
import { cn } from "../../utils/helpers";
function Sidebar({ collapsed, onToggleCollapse, counts, onNavigate }) {
  const location = useLocation();
  const isInboxRoute = /^\/assistant\/(emails|assistant-to-reply|client-to-reply|no-reply-needed|needs-review|waiting|important|archived)$/.test(location.pathname);
  const inboxContextSearch = isInboxRoute ? location.search : "";
  const sections = [
    {
      title: "Workspace",
      items: [
        { to: "/assistant", label: "Overview", icon: LayoutDashboard, end: true },
        {
          to: "/assistant/emails",
          label: "All Emails",
          icon: Inbox,
          count: counts.totalConversations
        },
        {
          to: "/assistant/important",
          label: "Important",
          icon: Star,
          count: counts.importantEmails
        }
      ]
    },
    {
      title: "AI Triage Queues",
      items: [
        {
          to: "/assistant/assistant-to-reply",
          label: "Assistant to Reply",
          icon: Bot,
          count: counts.assistantToReplyCount,
          accent: "text-[#2563EB]"
        },
        {
          to: "/assistant/client-to-reply",
          label: "Client to Reply",
          icon: UserCheck,
          count: counts.clientToReplyCount,
          accent: "text-[#7C3AED]"
        },
        {
          to: "/assistant/needs-review",
          label: "Needs Review",
          icon: Eye,
          count: counts.needsReviewCount,
          accent: "text-[#D97706]"
        },
        {
          to: "/assistant/no-reply-needed",
          label: "No Reply Needed",
          icon: MailCheck,
          count: counts.noReplyNeededCount
        }
      ]
    },
    {
      title: "Execution",
      items: [
        {
          to: "/assistant/action-required",
          label: "Action Required",
          icon: CheckSquare,
          count: counts.actionRequiredCount
        },
        {
          to: "/assistant/waiting",
          label: "Waiting for Response",
          icon: Clock,
          count: counts.waitingForResponseCount
        },
        {
          to: "/assistant/meetings",
          label: "Meetings",
          icon: Calendar,
          count: counts.upcomingMeetingsCount
        },
        {
          to: "/assistant/clients",
          label: "Clients",
          icon: Users,
          count: counts.clientsCount
        },
        {
          to: "/assistant/archived",
          label: "Archived",
          icon: Archive,
          count: counts.archivedCount
        },
        { to: "/assistant/settings", label: "Settings", icon: Settings }
      ]
    }
  ];
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: cn(
        "h-full bg-white border-r border-[#E2E8F0] flex flex-col transition-[width] duration-150 select-none shrink-0",
        collapsed ? "w-16" : "w-[236px]"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "h-14 px-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-2", children: [
          !collapsed && /* @__PURE__ */ jsx(
            NavLink,
            {
              to: "/assistant",
              className: "font-display text-[15px] font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0",
              children: "RelayDesk"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onToggleCollapse,
              "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
              className: "p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer mx-auto sm:mx-0",
              children: collapsed ? /* @__PURE__ */ jsx(PanelLeftOpen, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(PanelLeftClose, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto py-3 px-2 space-y-5", children: sections.map((section) => /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          !collapsed && /* @__PURE__ */ jsx("p", { className: "px-2.5 pb-1 text-[11px] font-medium text-[#94A3B8]", children: section.title }),
          section.items.map((item) => {
            const Icon = item.icon;
            const isInboxDestination = /^\/assistant\/(emails|assistant-to-reply|client-to-reply|no-reply-needed|needs-review|waiting|important|archived)$/.test(item.to);
            return /* @__PURE__ */ jsxs(
              NavLink,
              {
                to: `${item.to}${isInboxDestination ? inboxContextSearch : ""}`,
                end: item.end,
                onClick: onNavigate,
                title: collapsed ? item.label : void 0,
                className: ({ isActive }) => cn(
                  "flex items-center justify-between gap-2 px-2.5 h-8 rounded-md text-[13px] transition-colors whitespace-nowrap",
                  isActive ? "bg-[#EFF6FF] text-[#1D4ED8] font-medium" : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                ),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                    /* @__PURE__ */ jsx(Icon, { className: cn("h-4 w-4 shrink-0", item.accent) }),
                    !collapsed && /* @__PURE__ */ jsx("span", { className: "truncate", children: item.label })
                  ] }),
                  !collapsed && typeof item.count === "number" && /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono tabular-nums text-[#64748B] shrink-0", children: item.count })
                ]
              },
              item.to
            );
          })
        ] }, section.title)) })
      ]
    }
  );
}
export {
  Sidebar
};

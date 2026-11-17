import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ClassificationBadge } from "../common/ClassificationBadge";
import { PRIORITY_META } from "../../utils/constants";
import { formatRelativeTime } from "../../utils/formatDate";
import { Avatar } from "../common/Avatar";
function PriorityInbox({
  title,
  emails,
  viewAllTo,
  onSelectEmail
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: title }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: viewAllTo,
          className: "text-xs font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1 whitespace-nowrap",
          children: [
            /* @__PURE__ */ jsx("span", { children: "View all" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
          ]
        }
      )
    ] }),
    emails.length === 0 ? /* @__PURE__ */ jsx("p", { className: "p-6 text-xs text-[#64748B] text-center", children: "No active conversations in this queue." }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-[#F1F5F9]", children: emails.map((email) => /* @__PURE__ */ jsxs(
      onSelectEmail ? "button" : Link,
      {
        ...(onSelectEmail ? { type: "button", onClick: () => onSelectEmail(email) } : { to: `/assistant/emails?thread=${email.id}` }),
        className: "w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-[#F8FAFC] transition-colors",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 min-w-0", children: [
            /* @__PURE__ */ jsx(Avatar, { name: email.sender.name, size: "sm" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[13px] font-medium text-[#0F172A] truncate", children: email.subject }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#64748B] truncate mt-0.5", children: [
                email.sender.name,
                " \xB7 ",
                email.clientName,
                " \xB7",
                " ",
                /* @__PURE__ */ jsx("span", { className: PRIORITY_META[email.priority].textClass, children: PRIORITY_META[email.priority].label })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1 shrink-0", children: [
            /* @__PURE__ */ jsx(ClassificationBadge, { classification: email.classification, compact: true }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono tabular-nums text-[#94A3B8]", children: formatRelativeTime(email.lastMessageAt) })
          ] })
        ]
      },
      email.id
    )) })
  ] });
}
export {
  PriorityInbox
};

import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Star } from "lucide-react";
import { Avatar } from "../common/Avatar";
import { ClassificationBadge } from "../common/ClassificationBadge";
import { PRIORITY_META } from "../../utils/constants";
import { formatRelativeTime } from "../../utils/formatDate";
import { cn } from "../../utils/helpers";
function EmailCard({
  email,
  selected = false,
  onSelect,
  onToggleImportant
}) {
  const priorityMeta = PRIORITY_META[email.priority];
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: () => onSelect(email),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(email);
        }
      },
      className: cn(
        "group px-4 py-3 border-b border-[#F1F5F9] cursor-pointer transition-colors duration-100 select-none",
        selected ? "bg-[#EFF6FF]/75" : "bg-white hover:bg-[#F8FAFC]"
      ),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative pt-0.5 shrink-0", children: [
          /* @__PURE__ */ jsx(Avatar, { name: email.sender.name, size: "sm" }),
          email.isUnread && /* @__PURE__ */ jsx(
            "span",
            {
              title: "Unread",
              className: "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#2563EB] ring-2 ring-white"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "text-[13px] truncate",
                    email.isUnread ? "font-semibold text-[#0F172A]" : "font-medium text-[#334155]"
                  ),
                  children: email.sender.name
                }
              ),
              email.clientName && /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-[#94A3B8] truncate hidden sm:inline", children: [
                "\xB7 ",
                email.clientName
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono tabular-nums text-[#64748B]", children: formatRelativeTime(email.lastMessageAt) }),
              onToggleImportant && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": email.isImportant ? "Remove star" : "Star conversation",
                  onClick: (e) => onToggleImportant(email, e),
                  className: "p-1 -mr-1 text-[#94A3B8] hover:text-[#D97706] transition-colors cursor-pointer",
                  children: /* @__PURE__ */ jsx(
                    Star,
                    {
                      className: cn(
                        "h-3.5 w-3.5",
                        email.isImportant && "fill-[#D97706] text-[#D97706]"
                      )
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: cn(
                "text-[13px] truncate mt-0.5",
                email.isUnread ? "font-semibold text-[#0F172A]" : "font-medium text-[#1E293B]"
              ),
              children: email.subject
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B] truncate mt-0.5", children: email.snippet }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 mt-2", children: [
            /* @__PURE__ */ jsx(ClassificationBadge, { classification: email.classification, compact: true }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-[#64748B] font-mono tabular-nums", children: [
              /* @__PURE__ */ jsx("span", { className: priorityMeta.textClass, children: priorityMeta.label }),
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\xB7" }),
              /* @__PURE__ */ jsxs("span", { children: [
                Math.round(email.confidence * 100),
                "%"
              ] }),
              email.status === "COMPLETED" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\xB7" }),
                /* @__PURE__ */ jsx("span", { className: "text-[#059669] font-sans font-medium", children: "Handled" })
              ] }),
              email.status === "WAITING_FOR_RESPONSE" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\xB7" }),
                /* @__PURE__ */ jsx("span", { className: "text-[#7C3AED] font-sans font-medium", children: "Waiting" })
              ] })
            ] })
          ] })
        ] })
      ] })
    }
  );
}
export {
  EmailCard
};

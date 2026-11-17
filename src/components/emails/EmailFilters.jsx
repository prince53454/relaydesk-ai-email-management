import { jsx, jsxs } from "react/jsx-runtime";
import { Search, SlidersHorizontal } from "lucide-react";
function EmailFilters({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  unreadOnly,
  onUnreadOnlyChange,
  actionRequiredOnly = false,
  onActionRequiredChange,
  archivedMode = "ACTIVE",
  onArchivedModeChange,
  clients = [],
  selectedClientId = "ALL",
  onClientChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "p-3 border-b border-[#E2E8F0] bg-white space-y-2.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "search",
          value: search,
          onChange: (e) => onSearchChange(e.target.value),
          placeholder: "Search sender, subject, or AI summary...",
          className: "w-full h-9 pl-8 pr-3 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#2563EB]"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-nowrap sm:flex-wrap items-center gap-1.5 overflow-x-auto -mx-3 px-3 pb-1 sm:mx-0 sm:px-0 sm:pb-0", children: [
      clients.length > 0 && onClientChange && /* @__PURE__ */ jsxs(
        "select",
        {
          "aria-label": "Filter by client",
          value: selectedClientId,
          onChange: (e) => onClientChange(e.target.value),
          className: "h-8 shrink-0 px-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#334155] focus:outline-none focus:border-[#2563EB]",
          children: [
            /* @__PURE__ */ jsx("option", { value: "ALL", children: "All Clients" }),
            clients.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
          ]
        }
      ),
      onActionRequiredChange && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onActionRequiredChange(!actionRequiredOnly), className: `h-8 shrink-0 px-2.5 text-xs rounded border transition-colors cursor-pointer whitespace-nowrap ${actionRequiredOnly ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]"}`, children: "Action Required" }),
      onArchivedModeChange && /* @__PURE__ */ jsxs("select", { "aria-label": "Archive filter", value: archivedMode, onChange: (e) => onArchivedModeChange(e.target.value), className: "h-8 shrink-0 px-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#334155]", children: [jsx("option", { value: "ACTIVE", children: "Active" }), jsx("option", { value: "ALL", children: "Include Archived" }), jsx("option", { value: "ARCHIVED", children: "Archived Only" })] }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          "aria-label": "Filter by priority",
          value: priority,
          onChange: (e) => onPriorityChange(e.target.value),
          className: "h-8 shrink-0 px-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#334155] focus:outline-none focus:border-[#2563EB]",
          children: [
            /* @__PURE__ */ jsx("option", { value: "ALL", children: "All Priorities" }),
            /* @__PURE__ */ jsx("option", { value: "URGENT", children: "Urgent" }),
            /* @__PURE__ */ jsx("option", { value: "HIGH", children: "High" }),
            /* @__PURE__ */ jsx("option", { value: "MEDIUM", children: "Medium" }),
            /* @__PURE__ */ jsx("option", { value: "LOW", children: "Low" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0 sm:ml-auto", children: [
        /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-3 w-3 text-[#64748B]" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            "aria-label": "Sort conversations",
            value: sort,
            onChange: (e) => onSortChange(e.target.value),
            className: "h-8 px-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#334155] focus:outline-none focus:border-[#2563EB]",
            children: [
              /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest" }),
              /* @__PURE__ */ jsx("option", { value: "priority", children: "Highest Priority" }),
              /* @__PURE__ */ jsx("option", { value: "confidence_asc", children: "Lowest Confidence" }),
              /* @__PURE__ */ jsx("option", { value: "oldest", children: "Oldest" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onUnreadOnlyChange(!unreadOnly),
          className: `h-8 px-2.5 text-xs rounded border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${unreadOnly ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]"}`,
          children: "Unread"
        }
      )
    ] })
  ] });
}
export {
  EmailFilters
};

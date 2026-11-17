import { jsx, jsxs } from "react/jsx-runtime";
import { formatRelativeTime } from "../../utils/formatDate";
function ActivityFeed({ activities }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-4 py-3 border-b border-[#E2E8F0]", children: /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: "Recent Activity" }) }),
    activities.length === 0 ? /* @__PURE__ */ jsx("p", { className: "p-6 text-xs text-[#64748B] text-center", children: "No recent activity logged." }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-[#F1F5F9]", children: activities.map((item) => /* @__PURE__ */ jsxs("div", { className: "px-4 py-2.5 flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[13px] text-[#1E293B]", children: item.description }),
        /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#64748B] mt-0.5", children: [
          item.userName,
          " \xB7 ",
          item.userRole === "ASSISTANT" ? "Assistant" : "Client"
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono tabular-nums text-[#94A3B8] shrink-0", children: formatRelativeTime(item.timestamp) })
    ] }, item.id)) })
  ] });
}
export {
  ActivityFeed
};

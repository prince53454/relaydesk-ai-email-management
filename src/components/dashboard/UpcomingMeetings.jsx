import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
function UpcomingMeetings({ meetings }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: "Upcoming Meetings" }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/assistant/meetings",
          className: "text-xs font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1",
          children: [
            /* @__PURE__ */ jsx("span", { children: "Schedule" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
          ]
        }
      )
    ] }),
    meetings.length === 0 ? /* @__PURE__ */ jsx("p", { className: "p-6 text-xs text-[#64748B] text-center", children: "No upcoming meetings scheduled." }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-[#F1F5F9]", children: meetings.map((mtg) => /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "h-7 w-7 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#475569] shrink-0", children: /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[13px] font-medium text-[#0F172A] truncate", children: mtg.title }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#64748B] truncate mt-0.5", children: [
            mtg.clientName,
            " \xB7 ",
            mtg.location
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-mono tabular-nums font-medium text-[#0F172A]", children: [
          mtg.date,
          " \xB7 ",
          mtg.time
        ] }),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: `text-[11px] font-medium ${mtg.status === "CONFIRMED" ? "text-[#059669]" : mtg.status === "RESCHEDULING" ? "text-[#D97706]" : "text-[#2563EB]"}`,
            children: mtg.status.charAt(0) + mtg.status.slice(1).toLowerCase()
          }
        )
      ] })
    ] }, mtg.id)) })
  ] });
}
export {
  UpcomingMeetings
};

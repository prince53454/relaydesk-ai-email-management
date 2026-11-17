import { jsx, jsxs } from "react/jsx-runtime";
import { Avatar } from "../common/Avatar";
import { formatShortDateTime } from "../../utils/formatDate";
function ConversationThread({ messages }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: messages.map((msg) => {
    const isOutbound = msg.direction === "OUTBOUND";
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `rounded-lg border p-4 ${isOutbound ? "bg-[#F8FAFC] border-[#CBD5E1]" : "bg-white border-[#E2E8F0]"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#F1F5F9]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsx(Avatar, { name: msg.sender.name, size: "sm" }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-[#0F172A]", children: msg.sender.name }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#64748B] truncate", children: [
                    "<",
                    msg.sender.email,
                    ">"
                  ] }),
                  isOutbound && /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-medium text-[#2563EB]", children: [
                    "\xB7 ",
                    msg.isSimulatedSend ? "Simulated Reply" : "Outbound"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#64748B]", children: [
                  "To: ",
                  msg.recipients.map((r) => r.email).join(", ")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono tabular-nums text-[#64748B]", children: formatShortDateTime(msg.receivedAt) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-[13px] text-[#1E293B] leading-relaxed whitespace-pre-wrap", children: msg.body })
        ]
      },
      msg.id
    );
  }) });
}
export {
  ConversationThread
};

import { jsx, jsxs } from "react/jsx-runtime";
import { Bot } from "lucide-react";
import { Button } from "../common/Button";
import { useEmails } from "../../hooks/useEmails";
function AIDailySummary({
  label = "AI Daily Briefing",
  headline,
  highlights
}) {
  const { setCopilotOpen, setCopilotConversationId } = useEmails();
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4 text-[#2563EB]" }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: label })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[13px] font-medium text-[#1E293B]", children: headline }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-xs text-[#475569] list-disc list-inside", children: highlights.map((h, i) => /* @__PURE__ */ jsx("li", { children: h }, i)) })
    ] }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "md",
        variant: "secondary",
        onClick: () => {
          setCopilotConversationId(void 0);
          setCopilotOpen(true);
        },
        children: [
          /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4 text-[#2563EB]" }),
          /* @__PURE__ */ jsx("span", { children: "Ask Copilot" })
        ]
      }
    )
  ] });
}
export {
  AIDailySummary
};

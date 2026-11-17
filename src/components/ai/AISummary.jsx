import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { RefreshCw, CalendarPlus } from "lucide-react";
import { Button } from "../common/Button";
import { aiService } from "../../services/aiService";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";
function AISummary({ conversation, onUpdated, onExtracted }) {
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const summary = conversation.summary;
  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await aiService.summarize(conversation.id);
      onUpdated(res.email);
      toast.success(
        res.isFallback ? "Summary refreshed via fallback analyzer" : "AI summary regenerated"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to regenerate summary");
    } finally {
      setLoading(false);
    }
  };
  const handleExtractActions = async () => {
    setExtracting(true);
    try {
      const res = await aiService.extractActions(conversation.id);
      toast.success(
        `Extracted ${res.createdActions.length} task(s) and ${res.createdMeetings.length} meeting(s)`
      );
      onExtracted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setExtracting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-[#0F172A]", children: "AI Executive Briefing" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#64748B] font-mono tabular-nums", children: [
          summary?.generatedBy === "AI_GEMINI" ? "Gemini AI" : summary?.generatedBy === "AI_FALLBACK" ? "Fallback Summary" : "Indexed Summary",
          " ",
          "\xB7 Updated ",
          formatRelativeTime(summary?.generatedAt || conversation.updatedAt)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "secondary", onClick: handleExtractActions, loading: extracting, children: [
          /* @__PURE__ */ jsx(CalendarPlus, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsx("span", { children: "Extract Actions" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "secondary", onClick: handleRegenerate, loading, children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsx("span", { children: "Regenerate" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-[13px] text-[#1E293B] leading-relaxed", children: summary?.overview }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-3 pt-2 border-t border-[#F1F5F9] text-xs", children: [
      summary?.importantInformation?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#0F172A] mb-1", children: "Important Information" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-[#475569] list-disc list-inside", children: summary.importantInformation.map((item, i) => /* @__PURE__ */ jsx("li", { children: item }, i)) })
      ] }),
      summary?.requests?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#0F172A] mb-1", children: "Key Requests" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-[#475569] list-disc list-inside", children: summary.requests.map((item, i) => /* @__PURE__ */ jsx("li", { children: item }, i)) })
      ] }),
      summary?.pendingActions?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#0F172A] mb-1", children: "Pending Actions & Next Steps" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-[#475569] list-disc list-inside", children: summary.pendingActions.map((item, i) => /* @__PURE__ */ jsx("li", { children: item }, i)) })
      ] }),
      summary?.decisions?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#0F172A] mb-1", children: "Decisions Required" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-[#475569] list-disc list-inside", children: summary.decisions.map((item, i) => /* @__PURE__ */ jsx("li", { children: item }, i)) })
      ] }),
      summary?.deadlines?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#B91C1C] mb-1", children: "Deadlines" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-[#475569] list-disc list-inside", children: summary.deadlines.map((item, i) => /* @__PURE__ */ jsx("li", { children: item }, i)) })
      ] }),
      summary?.nextSteps?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#0F172A] mb-1", children: "Recommended Next Steps" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-[#475569] list-disc list-inside", children: summary.nextSteps.map((item, i) => /* @__PURE__ */ jsx("li", { children: item }, i)) })
      ] })
    ] })
  ] });
}
export {
  AISummary
};

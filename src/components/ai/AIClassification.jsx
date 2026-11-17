import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { RefreshCw, SlidersHorizontal, History, Check } from "lucide-react";
import { ClassificationBadge } from "../common/ClassificationBadge";
import { Button } from "../common/Button";
import { CLASSIFICATION_META } from "../../utils/constants";
import { formatRelativeTime } from "../../utils/formatDate";
import { aiService } from "../../services/aiService";
import { emailService } from "../../services/emailService";
import toast from "react-hot-toast";
const ALL_CLASSES = [
  "ASSISTANT_TO_REPLY",
  "CLIENT_TO_REPLY",
  "NO_REPLY_NEEDED",
  "NEEDS_REVIEW"
];
function AIClassification({
  conversation,
  onUpdated,
  canEdit = true
}) {
  const [editing, setEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedClass, setSelectedClass] = useState(
    conversation.classification
  );
  const [reason, setReason] = useState(conversation.classificationReason);
  const [assignedTo, setAssignedTo] = useState(conversation.assignedTo);
  const [saving, setSaving] = useState(false);
  const [reclassifying, setReclassifying] = useState(false);
  useEffect(() => {
    setSelectedClass(conversation.classification);
    setReason(conversation.classificationReason || "");
    setAssignedTo(conversation.assignedTo || "");
    setEditing(false);
    setShowHistory(false);
  }, [conversation.id, conversation.classification, conversation.classificationReason, conversation.assignedTo]);
  const handleReclassify = async () => {
    setReclassifying(true);
    try {
      const res = await aiService.classify(conversation.id, true);
      onUpdated(res.email);
      setSelectedClass(res.email.classification);
      setReason(res.email.classificationReason);
      setAssignedTo(res.email.assignedTo);
      toast.success(
        res.isFallback ? "Reclassified using demo fallback engine" : "Reclassified with Gemini AI"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reclassification failed");
    } finally {
      setReclassifying(false);
    }
  };
  const handleSaveOverride = async () => {
    if (reason.trim().length < 3) {
      toast.error("Please enter a brief explanation for the override.");
      return;
    }
    setSaving(true);
    try {
      const updated = await emailService.overrideClassification(conversation.id, {
        classification: selectedClass,
        reason: reason.trim(),
        assignedTo: assignedTo.trim() || void 0
      });
      onUpdated(updated);
      setEditing(false);
      toast.success("Classification override saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save override");
    } finally {
      setSaving(false);
    }
  };
  const confidencePct = Math.round((conversation.confidence || 0) * 100);
  const sourceLabel = conversation.classificationSource === "MANUAL_OVERRIDE" ? "Manual Override" : conversation.classificationSource === "CLIENT_HANDOVER" ? "Client Handover" : conversation.classificationSource === "AI_FALLBACK" ? "Fallback Classifier" : "AI Engine";
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
        /* @__PURE__ */ jsx(ClassificationBadge, { classification: conversation.classification }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#64748B] font-mono tabular-nums", children: [
          confidencePct,
          "% confidence \xB7 ",
          conversation.confidenceBand
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#64748B]", children: [
          "\xB7 ",
          sourceLabel
        ] }),
        conversation.confidenceBand === "MEDIUM" && /* @__PURE__ */ jsx("span", { className: "text-xs text-[#B45309] font-medium", children: "\xB7 Review advised" })
      ] }),
      canEdit && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => setShowHistory((s) => !s),
            title: "View classification history",
            children: [
              /* @__PURE__ */ jsx(History, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "History" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "secondary",
            onClick: handleReclassify,
            loading: reclassifying,
            children: [
              /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "Reclassify" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "secondary",
            onClick: () => {
              setSelectedClass(conversation.classification);
              setReason(conversation.classificationReason);
              setAssignedTo(conversation.assignedTo);
              setEditing((e) => !e);
            },
            children: [
              /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "Override" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-[13px] text-[#334155] leading-relaxed", children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium text-[#0F172A]", children: "Rationale: " }),
      conversation.classificationReason
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Owner: ",
        /* @__PURE__ */ jsx("strong", { className: "font-medium text-[#0F172A]", children: conversation.assignedTo || "Unassigned" })
      ] }),
      conversation.suggestedAction && /* @__PURE__ */ jsxs("span", { children: [
        "Recommended: ",
        /* @__PURE__ */ jsx("span", { className: "text-[#0F172A]", children: conversation.suggestedAction })
      ] })
    ] }),
    editing && /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-[#E2E8F0] space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: ALL_CLASSES.map((cls) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setSelectedClass(cls),
          className: `px-2.5 py-2 text-left rounded-md border text-xs transition-colors cursor-pointer ${selectedClass === cls ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] font-medium" : "border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]"}`,
          children: CLASSIFICATION_META[cls].label
        },
        cls
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-[#334155] mb-1", children: "Explanation / Override Note" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: reason,
              onChange: (e) => setReason(e.target.value),
              className: "w-full h-9 px-3 text-[13px] border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#2563EB]",
              placeholder: "Explain why this responsibility applies..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-[#334155] mb-1", children: "Assigned To" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: assignedTo,
              onChange: (e) => setAssignedTo(e.target.value),
              className: "w-full h-9 px-3 text-[13px] border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#2563EB]",
              placeholder: "Assistant or Client name"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => setEditing(false), children: "Cancel" }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "primary", onClick: handleSaveOverride, loading: saving, children: [
          /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsx("span", { children: "Save Override" })
        ] })
      ] })
    ] }),
    showHistory && /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-[#E2E8F0] space-y-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-[#0F172A]", children: "Classification Audit History" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: (conversation.classificationHistory || []).map((entry, idx) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "text-xs text-[#475569] flex flex-wrap items-center justify-between gap-2 py-1 border-b border-[#F1F5F9] last:border-0",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-[#0F172A]", children: CLASSIFICATION_META[entry.classification]?.label || entry.classification }),
              " ",
              "\xB7 ",
              entry.changedBy,
              " \xB7 ",
              entry.source.replace(/_/g, " ").toLowerCase(),
              /* @__PURE__ */ jsx("p", { className: "text-[#64748B] mt-0.5", children: entry.reason })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono tabular-nums text-[11px] text-[#94A3B8]", children: [
              Math.round(entry.confidence * 100),
              "% \xB7 ",
              formatRelativeTime(entry.changedAt)
            ] })
          ]
        },
        idx
      )) })
    ] })
  ] });
}
export {
  AIClassification
};

import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Copy, Send, Wand2, Check } from "lucide-react";
import { Button } from "../common/Button";
import { aiService } from "../../services/aiService";
import { emailService } from "../../services/emailService";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
const REWRITE_ACTIONS = [
  { mode: "GENERATE", label: "Generate Draft" },
  { mode: "SHORTER", label: "Shorter" },
  { mode: "FORMAL", label: "More Formal" },
  { mode: "FRIENDLIER", label: "Friendlier" },
  { mode: "IMPROVE_GRAMMAR", label: "Fix Grammar" },
  { mode: "REWRITE", label: "Polish" }
];
function AIReplyGenerator({ conversation, onReplySent }) {
  const { user } = useAuth();
  const [draft, setDraft] = useState(conversation.suggestedDraft || "");
  const [customInstruction, setCustomInstruction] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [markDone, setMarkDone] = useState(false);
  const [providerLabel, setProviderLabel] = useState("");
  useEffect(() => {
    setDraft(conversation.suggestedDraft || "");
    setCustomInstruction("");
    setProviderLabel("");
    setMarkDone(false);
    setCopied(false);
  }, [conversation.id]);
  const runDraftAction = async (mode) => {
    if (mode !== "GENERATE" && mode !== "CUSTOM" && !draft.trim()) {
      toast.error("Generate or type a draft first before rewriting.");
      return;
    }
    setGenerating(true);
    try {
      const res = await aiService.draftReply({
        conversationId: conversation.id,
        mode,
        existingDraft: draft,
        instruction: customInstruction.trim() || void 0,
        tone: user?.preferences?.defaultTone
      });
      setDraft(res.draft);
      setProviderLabel(res.isFallback ? "Fallback Draft" : "Gemini Draft");
      toast.success("Draft updated \u2014 review before sending");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate draft");
    } finally {
      setGenerating(false);
    }
  };
  const handleCopy = async () => {
    if (!draft.trim()) return;
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    toast.success("Copied reply to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };
  const handleSendSimulated = async () => {
    if (!draft.trim()) {
      toast.error("Write or generate a reply before sending.");
      return;
    }
    setSending(true);
    try {
      const res = await emailService.sendSimulatedReply(conversation.id, {
        body: draft,
        markCompleted: markDone,
        setWaitingForResponse: !markDone
      });
      setDraft("");
      toast.success(res.isSimulatedSend ? "Demo reply logged in conversation thread" : "Reply sent through connected mailbox");
      onReplySent(res.email);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-[#0F172A]", children: "Reply Composer" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#64748B]", children: [
          conversation.emailMode === "LIVE_OAUTH" ? "Human approval required \xB7 Sends through connected mailbox" : "Human approval required \xB7 Sending operates in simulated demo mode",
          providerLabel ? ` \xB7 ${providerLabel}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: REWRITE_ACTIONS.map((item) => /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          variant: item.mode === "GENERATE" ? "primary" : "secondary",
          onClick: () => runDraftAction(item.mode),
          disabled: generating,
          children: [
            item.mode === "GENERATE" && /* @__PURE__ */ jsx(Wand2, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { children: item.label })
          ]
        },
        item.mode
      )) })
    ] }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        value: draft,
        onChange: (e) => setDraft(e.target.value),
        rows: 6,
        placeholder: `Draft a reply to ${conversation.sender.name} or click "Generate Draft"...`,
        className: "w-full p-3 text-[13px] text-[#0F172A] bg-[#F8FAFC] border border-[#CBD5E1] rounded-md leading-relaxed focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/15"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          value: customInstruction,
          onChange: (e) => setCustomInstruction(e.target.value),
          placeholder: "Custom AI rewrite instruction (e.g., 'Offer Tuesday 3pm PT instead')...",
          className: "flex-1 h-9 px-3 text-[13px] bg-white border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#2563EB]"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "md",
          variant: "secondary",
          onClick: () => runDraftAction("CUSTOM"),
          loading: generating,
          disabled: !customInstruction.trim(),
          children: "Apply Instruction"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]", children: [
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-xs text-[#475569] cursor-pointer select-none", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: markDone,
            onChange: (e) => setMarkDone(e.target.checked),
            className: "rounded border-[#CBD5E1] text-[#2563EB]"
          }
        ),
        /* @__PURE__ */ jsx("span", { children: "Mark conversation completed after sending" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "secondary", onClick: handleCopy, disabled: !draft.trim(), children: [
          copied ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-[#059669]" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsx("span", { children: copied ? "Copied" : "Copy" })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "md",
            variant: "primary",
            onClick: handleSendSimulated,
            loading: sending,
            disabled: !draft.trim(),
            children: [
              /* @__PURE__ */ jsx(Send, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { children: conversation.emailMode === "LIVE_OAUTH" ? "Send Reply" : "Send Simulated Reply" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  AIReplyGenerator
};

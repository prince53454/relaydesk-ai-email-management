import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, ArrowUpRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aiService } from "../../services/aiService";
import { useEmails } from "../../hooks/useEmails";
import { useAuth } from "../../hooks/useAuth";
import { ClassificationBadge } from "../common/ClassificationBadge";
import { MarkdownMessage } from "./MarkdownMessage";
const SUGGESTED_GLOBAL = [
  "Show all emails requiring my attention",
  "Summarize today's important conversations",
  "Which emails are waiting for responses?",
  "What should I prioritize today?",
  "Which conversations require client approval?",
  "Find unanswered meeting requests"
];
const SUGGESTED_FOCUSED = [
  "Draft a reply to this conversation",
  "Why was this email classified this way?"
];
function AIChatPanel({ onSelectConversation }) {
  const { user } = useAuth();
  const { copilotOpen, setCopilotOpen, copilotConversationId } = useEmails();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "Ask me anything about your live inbox, client approvals, pending follow-ups, or open threads."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const requestId = useRef(0);
  useEffect(() => {
    requestId.current += 1;
    setLoading(false);
    setMessages([{ id: "welcome", role: "assistant", content: copilotConversationId ? "Ask about this conversation, its decisions, or a reply draft." : "Ask me anything about your live inbox, client approvals, pending follow-ups, or open threads." }]);
    setHasStarted(false);
    setInput("");
  }, [copilotConversationId]);
  useEffect(() => () => { requestId.current += 1; }, []);
  if (!copilotOpen || !user) return null;
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setHasStarted(true);
    const userMsg = {
      id: `u_${Date.now()}`,
      role: "user",
      content: trimmed
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const activeRequestId = ++requestId.current;
    try {
      const history = messages.filter((m) => m.id !== "welcome").map((m) => ({ role: m.role, content: m.content }));
      const res = await aiService.chat({
        message: trimmed,
        conversationId: copilotConversationId,
        history
      });
      if (activeRequestId !== requestId.current) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: "assistant",
          content: res.reply,
          references: res.references,
          meta: res.isFallback ? "Grounded Fallback Response" : "Gemini Grounded Response"
        }
      ]);
    } catch (err) {
      if (activeRequestId !== requestId.current) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: err instanceof Error ? err.message : "Unable to reach AI Copilot right now."
        }
      ]);
    } finally {
      if (activeRequestId === requestId.current) setLoading(false);
    }
  };
  const handleReferenceClick = (id) => {
    if (onSelectConversation) {
      onSelectConversation(id);
    } else if (user.role === "ASSISTANT") {
      navigate(`/assistant/emails?thread=${id}`);
    } else {
      navigate(`/client?thread=${id}`);
    }
  };
  const prompts = copilotConversationId ? [...SUGGESTED_FOCUSED, ...SUGGESTED_GLOBAL.slice(0, 3)] : SUGGESTED_GLOBAL;
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      "aria-label": "AI Copilot",
      className: "fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] sm:w-[390px] h-[560px] max-h-[82vh] flex flex-col bg-white/95 backdrop-blur-md border border-[#CBD5E1] rounded-xl shadow-[0_16px_32px_-6px_rgba(15,23,42,0.14)] overflow-hidden",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-7 w-7 rounded-md bg-[#0F172A] text-white flex items-center justify-center", children: /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[13px] font-semibold text-[#0F172A] leading-tight", children: "Inbox Copilot" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#64748B]", children: copilotConversationId ? "Scoped to open thread" : "Grounded in workspace database" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                title: "Clear chat",
                onClick: () => setMessages(messages.slice(0, 1)),
                className: "p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 rounded transition-colors cursor-pointer",
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-label": "Close AI Copilot",
                onClick: () => setCopilotOpen(false),
                className: "p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 rounded transition-colors cursor-pointer",
                children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-3.5 space-y-3", children: [
          !hasStarted && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] p-3 text-xs text-[#1E3A8A]", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Your workspace is ready to explore" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 leading-relaxed", children: "Ask about priorities, client approvals, or follow-ups. Try a prompt below to get started." })
          ] }),
          messages.map((msg) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`,
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `max-w-[92%] rounded-lg px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-[#2563EB] text-white" : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]"}`,
                    children: msg.role === "assistant" ? jsx(MarkdownMessage, { content: msg.content }) : msg.content
                  }
                ),
                msg.meta && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#94A3B8] mt-1 px-1", children: msg.meta }),
                msg.references && msg.references.length > 0 && /* @__PURE__ */ jsxs("div", { className: "w-full mt-2 space-y-1.5", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-[#64748B]", children: "Referenced threads" }),
                  msg.references.map((ref) => /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleReferenceClick(ref.id),
                      className: "w-full text-left p-2 bg-white border border-[#E2E8F0] hover:border-[#2563EB] rounded-md transition-colors flex items-center justify-between gap-2 cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-[#0F172A] truncate", children: ref.subject }),
                          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#64748B] truncate", children: [
                            ref.senderName,
                            " \xB7 ",
                            ref.clientName
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                          /* @__PURE__ */ jsx(
                            ClassificationBadge,
                            {
                              classification: ref.classification,
                              compact: true
                            }
                          ),
                          /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-[#64748B]" })
                        ] })
                      ]
                    },
                    ref.id
                  ))
                ] })
              ]
            },
            msg.id
          )),
          loading && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-[#64748B] px-1", children: [
            /* @__PURE__ */ jsx("span", { className: "h-3.5 w-3.5 rounded-full border-2 border-[#CBD5E1] border-t-[#2563EB] animate-spin" }),
            /* @__PURE__ */ jsx("span", { children: "Copilot is preparing your answer..." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "px-3 py-2 border-t border-[#F1F5F9] bg-[#F8FAFC] flex gap-1.5 overflow-x-auto", children: prompts.map((q) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => sendMessage(q),
            disabled: loading,
            className: "text-[11px] text-[#334155] bg-white border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] px-2.5 py-1 rounded whitespace-nowrap shrink-0 transition-colors cursor-pointer",
            children: q
          },
          q
        )) }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: (e) => {
              e.preventDefault();
              sendMessage(input);
            },
            className: "p-3 border-t border-[#E2E8F0] bg-white flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  placeholder: "Ask about emails, priorities, or drafts...",
                  className: "flex-1 h-9 px-3 text-[13px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-md focus:outline-none focus:bg-white focus:border-[#2563EB]"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: loading || !input.trim(),
                  "aria-label": "Send message",
                  className: "h-9 w-9 rounded-md bg-[#2563EB] text-white flex items-center justify-center hover:bg-[#1D4ED8] disabled:opacity-50 cursor-pointer shrink-0",
                  children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  AIChatPanel
};

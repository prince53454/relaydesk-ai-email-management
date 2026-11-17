import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Mail,
  MailOpen,
  MessageSquarePlus,
  Star,
  X
} from "lucide-react";
import { emailService } from "../../services/emailService";
import { Button } from "../common/Button";
import { Loader } from "../common/Loader";
import { AIClassification } from "../ai/AIClassification";
import { AISummary } from "../ai/AISummary";
import { AIReplyGenerator } from "../ai/AIReplyGenerator";
import { ConversationThread } from "./ConversationThread";
import { formatDueDate, formatShortDateTime } from "../../utils/formatDate";
import { PRIORITY_META } from "../../utils/constants";
import { useEmails } from "../../hooks/useEmails";
import toast from "react-hot-toast";
function EmailDetails({ conversationId, onUpdated, onBack }) {
  const { setCopilotOpen, setCopilotConversationId } = useEmails();
  const [email, setEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [actions, setActions] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteInput, setNoteInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const detailRequestId = useRef(0);
  const loadDetail = async () => {
    const requestId = ++detailRequestId.current;
    setLoading(true);
    try {
      const data = await emailService.getById(conversationId);
      if (requestId !== detailRequestId.current) return;
      setEmail(data.email);
      setMessages(data.messages);
      setActions(data.actions);
      setMeetings(data.meetings);
    } catch (err) {
      if (requestId === detailRequestId.current) toast.error(err instanceof Error ? err.message : "Failed to load conversation");
    } finally {
      if (requestId === detailRequestId.current) setLoading(false);
    }
  };
  useEffect(() => {
    loadDetail();
    return () => { detailRequestId.current += 1; };
  }, [conversationId]);
  const handleUpdated = (updated) => {
    if (updated.id !== conversationId) return;
    setEmail(updated);
    onUpdated(updated);
  };
  const handleToggleRead = async () => {
    if (!email) return;
    try {
      const updated = await emailService.toggleRead(email.id);
      handleUpdated(updated);
      toast.success(updated.isUnread ? "Marked unread" : "Marked read");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not update read status"); }
  };
  const handleToggleImportant = async () => {
    if (!email) return;
    try {
      const updated = await emailService.update(email.id, { isImportant: !email.isImportant });
      handleUpdated(updated);
      toast.success(updated.isImportant ? "Marked important" : "Removed important mark");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not update importance"); }
  };
  const handleToggleArchive = async () => {
    if (!email) return;
    try {
      const updated = await emailService.toggleArchive(email.id);
      handleUpdated(updated);
      toast.success(updated.isArchived ? "Archived conversation" : "Restored to inbox");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not archive conversation"); }
  };
  const handleComplete = async () => {
    if (!email) return;
    try {
      const updated = await emailService.markCompleted(email.id);
      handleUpdated(updated);
      toast.success(updated.status === "COMPLETED" ? "Marked as completed" : "Reopened conversation");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not update conversation status"); }
  };
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!email || !noteInput.trim()) return;
    setSavingNote(true);
    try {
      const updated = await emailService.addNote(email.id, noteInput.trim());
      handleUpdated(updated);
      setNoteInput("");
      toast.success("Internal note added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setSavingNote(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx(Loader, { label: "Loading conversation thread..." });
  if (!email) return null;
  const priorityMeta = PRIORITY_META[email.priority];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-[#F8FAFC]", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-5 py-3.5 bg-white border-b border-[#E2E8F0] space-y-2.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          onBack && /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", onClick: onBack, className: "lg:hidden", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "Back" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#64748B]", children: [
            email.clientName,
            " ",
            email.clientCompany ? `\xB7 ${email.clientCompany}` : ""
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#94A3B8]", children: "\xB7" }),
          /* @__PURE__ */ jsxs("span", { className: `text-xs ${priorityMeta.textClass}`, children: [
            priorityMeta.label,
            " priority"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
          onBack && /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", onClick: onBack, className: "hidden lg:inline-flex", title: "Close email", children: [
            /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Close" })
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", onClick: handleToggleImportant, children: [
            /* @__PURE__ */ jsx(
              Star,
              {
                className: `h-3.5 w-3.5 ${email.isImportant ? "fill-[#D97706] text-[#D97706]" : ""}`
              }
            ),
            /* @__PURE__ */ jsx("span", { children: email.isImportant ? "Starred" : "Star" })
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", onClick: handleToggleRead, children: [
            email.isUnread ? /* @__PURE__ */ jsx(MailOpen, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { children: email.isUnread ? "Mark Read" : "Mark Unread" })
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", onClick: handleToggleArchive, children: [
            email.isArchived ? /* @__PURE__ */ jsx(ArchiveRestore, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Archive, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { children: email.isArchived ? "Restore" : "Archive" })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              variant: email.status === "COMPLETED" ? "secondary" : "primary",
              onClick: handleComplete,
              children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsx("span", { children: email.status === "COMPLETED" ? "Completed" : "Mark Done" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              variant: "secondary",
              onClick: () => {
                setCopilotConversationId(email.id);
                setCopilotOpen(true);
              },
              children: [
                /* @__PURE__ */ jsx(Bot, { className: "h-3.5 w-3.5 text-[#2563EB]" }),
                /* @__PURE__ */ jsx("span", { children: "Ask Copilot" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-[#0F172A] leading-snug", children: email.subject }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#64748B] mt-0.5 font-mono tabular-nums", children: [
          "From ",
          email.sender.name,
          " <",
          email.sender.email,
          "> \xB7 Last activity",
          " ",
          formatShortDateTime(email.lastMessageAt)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-4", children: [
      /* @__PURE__ */ jsx(AIClassification, { conversation: email, onUpdated: handleUpdated }),
      /* @__PURE__ */ jsx(
        AISummary,
        {
          conversation: email,
          onUpdated: handleUpdated,
          onExtracted: loadDetail
        }
      ),
      (actions.length > 0 || meetings.length > 0) && /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
        actions.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-3.5 space-y-2", children: [
          /* @__PURE__ */ jsx("h5", { className: "text-xs font-semibold text-[#0F172A]", children: "Linked Action Items" }),
          actions.map((act) => /* @__PURE__ */ jsxs("div", { className: "text-xs text-[#334155] border-t border-[#F1F5F9] pt-2", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-[#0F172A]", children: act.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-[#64748B] font-mono tabular-nums mt-0.5", children: [
              "Due ",
              formatDueDate(act.dueDate),
              " \xB7 ",
              act.status
            ] })
          ] }, act.id))
        ] }),
        meetings.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-3.5 space-y-2", children: [
          /* @__PURE__ */ jsx("h5", { className: "text-xs font-semibold text-[#0F172A]", children: "Identified Meetings" }),
          meetings.map((mtg) => /* @__PURE__ */ jsxs("div", { className: "text-xs text-[#334155] border-t border-[#F1F5F9] pt-2", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-[#0F172A]", children: mtg.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-[#64748B] font-mono tabular-nums mt-0.5", children: [
              mtg.date,
              " at ",
              mtg.time,
              " \xB7 ",
              mtg.status
            ] })
          ] }, mtg.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-xs font-semibold text-[#475569] mb-2", children: [
          "Conversation History (",
          messages.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx(ConversationThread, { messages })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-xs font-semibold text-[#0F172A]", children: [
          "Team Notes & Client Instructions (",
          email.internalNotes?.length || 0,
          ")"
        ] }),
        email.internalNotes?.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-2", children: email.internalNotes.map((note) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[#64748B] mb-1", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-[#0F172A]", children: [
                  note.authorName,
                  " (",
                  note.authorRole,
                  ")"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-mono tabular-nums", children: formatShortDateTime(note.createdAt) })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[#334155]", children: note.content })
            ]
          },
          note.id
        )) }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleAddNote, className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: noteInput,
              onChange: (e) => setNoteInput(e.target.value),
              placeholder: "Add an internal note or follow-up instruction...",
              className: "flex-1 h-9 px-3 text-[13px] border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#2563EB]"
            }
          ),
          /* @__PURE__ */ jsxs(Button, { type: "submit", size: "md", variant: "secondary", loading: savingNote, children: [
            /* @__PURE__ */ jsx(MessageSquarePlus, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Add Note" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        AIReplyGenerator,
        {
          conversation: email,
          onReplySent: (updated) => {
            handleUpdated(updated);
            loadDetail();
          }
        }
      )
    ] })
  ] });
}
export {
  EmailDetails
};

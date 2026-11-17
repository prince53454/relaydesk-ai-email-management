import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ExternalLink, Plus } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { actionService } from "../../services/workspaceService";
import { useEmails } from "../../hooks/useEmails";
import { PRIORITY_META } from "../../utils/constants";
import { formatDueDate } from "../../utils/formatDate";
import toast from "react-hot-toast";
function ActionRequiredPage() {
  const { clients, selectedClientId } = useEmails();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("OPEN");
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 864e5).toISOString().slice(0, 10));
  const [clientId, setClientId] = useState("");
  const [priority, setPriority] = useState("HIGH");
  const [saving, setSaving] = useState(false);
  const requestId = useRef(0);
  const load = useCallback(async () => {
    const activeRequestId = ++requestId.current;
    setLoading(true);
    try {
      const list = await actionService.list(selectedClientId);
      if (requestId.current !== activeRequestId) return;
      setActions(list);
    } catch (err) {
      if (requestId.current === activeRequestId) toast.error(err instanceof Error ? err.message : "Failed to load actions");
    } finally {
      if (requestId.current === activeRequestId) setLoading(false);
    }
  }, [selectedClientId]);
  useEffect(() => {
    load();
  }, [load]);
  const handleStatusChange = async (action, status) => {
    try {
      const updated = await actionService.update(action.id, { status });
      setActions((prev) => prev.map((a) => a.id === action.id ? { ...a, ...updated } : a));
      toast.success(`Task marked ${status.toLowerCase().replace("_", " ")}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };
  const handleDueDateChange = async (action, newDate) => {
    try {
      const updated = await actionService.update(action.id, { dueDate: newDate });
      setActions((prev) => prev.map((a) => a.id === action.id ? { ...a, ...updated } : a));
      toast.success("Due date updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update due date");
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await actionService.create({
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        clientId: selectedClientId !== "ALL" ? selectedClientId : clientId || clients[0]?.id,
        priority
      });
      toast.success("Action item created");
      setModalOpen(false);
      setTitle("");
      setDescription("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSaving(false);
    }
  };
  const filtered = actions.filter((a) => {
    if (filter === "OPEN") return a.status !== "COMPLETED";
    if (filter === "COMPLETED") return a.status === "COMPLETED";
    return true;
  });
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Action Required & Follow-Ups", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 p-1 bg-[#E2E8F0]/60 rounded-lg", children: ["OPEN", "COMPLETED", "ALL"].map((tab) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setFilter(tab),
            className: `px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${filter === tab ? "bg-white text-[#0F172A] shadow-xs" : "text-[#475569] hover:text-[#0F172A]"}`,
            children: tab === "OPEN" ? "Open Tasks" : tab === "COMPLETED" ? "Completed" : "All"
          },
          tab
        )) }),
        /* @__PURE__ */ jsxs(Button, { variant: "primary", size: "md", onClick: () => setModalOpen(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "New Follow-up" })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsx(Loader, { label: "Loading action items..." }) : filtered.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white border border-[#E2E8F0] rounded-lg", children: /* @__PURE__ */ jsx(
        EmptyState,
        {
          title: "No action items",
          description: "All extracted follow-ups and manual tasks in this view are cleared."
        }
      ) }) : /* @__PURE__ */ jsx("div", { className: "bg-white border border-[#E2E8F0] rounded-lg divide-y divide-[#F1F5F9]", children: filtered.map((item) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-sm font-medium ${item.status === "COMPLETED" ? "line-through text-[#94A3B8]" : "text-[#0F172A]"}`,
                    children: item.title
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: `text-xs ${PRIORITY_META[item.priority].textClass}`, children: [
                  "\xB7 ",
                  PRIORITY_META[item.priority].label
                ] })
              ] }),
              item.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#475569]", children: item.description }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-[#64748B] pt-1", children: [
                /* @__PURE__ */ jsx("span", { children: item.clientName }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "\xB7 Owner: ",
                  item.assignedTo
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "\xB7 ",
                  item.sourceType === "AI_EXTRACTED" ? "AI Extracted" : "Manual"
                ] }),
                item.conversationId && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: `/assistant/emails?thread=${item.conversationId}`,
                    className: "text-[#2563EB] hover:underline inline-flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsx("span", { children: "Source Email" }),
                      /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  "aria-label": "Task due date",
                  value: item.dueDate.slice(0, 10),
                  onChange: (e) => handleDueDateChange(item, new Date(e.target.value).toISOString()),
                  className: "h-8 px-2 text-xs font-mono tabular-nums bg-[#F8FAFC] border border-[#CBD5E1] rounded",
                  title: `Due ${formatDueDate(item.dueDate)}`
                }
              ),
              item.status !== "COMPLETED" ? /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "primary",
                  onClick: () => handleStatusChange(item, "COMPLETED"),
                  children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }),
                    /* @__PURE__ */ jsx("span", { children: "Complete" })
                  ]
                }
              ) : /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: "secondary",
                  onClick: () => handleStatusChange(item, "PENDING"),
                  children: "Reopen"
                }
              )
            ] })
          ]
        },
        item.id
      )) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { open: modalOpen, onClose: () => setModalOpen(false), title: "Create Follow-up Task", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Task Title",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          required: true,
          placeholder: "Confirm flight upgrade for Victoria"
        }
      ),
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Description",
          value: description,
          onChange: (e) => setDescription(e.target.value),
          placeholder: "Context or instructions..."
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Due Date",
            type: "date",
            value: dueDate,
            onChange: (e) => setDueDate(e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-[#334155] mb-1.5", children: "Priority" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: priority,
              onChange: (e) => setPriority(e.target.value),
              className: "w-full h-9 px-3 text-[13px] border border-[#CBD5E1] rounded-md",
              children: [
                /* @__PURE__ */ jsx("option", { value: "URGENT", children: "Urgent" }),
                /* @__PURE__ */ jsx("option", { value: "HIGH", children: "High" }),
                /* @__PURE__ */ jsx("option", { value: "MEDIUM", children: "Medium" }),
                /* @__PURE__ */ jsx("option", { value: "LOW", children: "Low" })
              ]
            }
          )
        ] })
      ] }),
      clients.length > 0 && selectedClientId === "ALL" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-[#334155] mb-1.5", children: "Client" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: clientId || clients[0]?.id,
            onChange: (e) => setClientId(e.target.value),
            className: "w-full h-9 px-3 text-[13px] border border-[#CBD5E1] rounded-md",
            children: clients.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setModalOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", variant: "primary", loading: saving, children: "Save Task" })
      ] })
    ] }) })
  ] });
}
export {
  ActionRequiredPage
};

import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ExternalLink, MapPin, Plus } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { meetingService } from "../../services/workspaceService";
import { useEmails } from "../../hooks/useEmails";
import toast from "react-hot-toast";
function MeetingsPage() {
  const { clients, selectedClientId } = useEmails();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date(Date.now() + 864e5).toISOString().slice(0, 10));
  const [time, setTime] = useState("10:30 AM");
  const [location, setLocation] = useState("Zoom Video Conference");
  const [clientId, setClientId] = useState("");
  const [saving, setSaving] = useState(false);
  const requestId = useRef(0);
  const load = useCallback(async () => {
    const activeRequestId = ++requestId.current;
    setLoading(true);
    try {
      const list = await meetingService.list(selectedClientId);
      if (requestId.current !== activeRequestId) return;
      setMeetings(list);
    } catch (err) {
      if (requestId.current === activeRequestId) toast.error(err instanceof Error ? err.message : "Failed to load meetings");
    } finally {
      if (requestId.current === activeRequestId) setLoading(false);
    }
  }, [selectedClientId]);
  useEffect(() => {
    load();
  }, [load]);
  const handleStatusUpdate = async (meeting, status) => {
    try {
      const updated = await meetingService.update(meeting.id, { status });
      setMeetings((prev) => prev.map((m) => m.id === meeting.id ? { ...m, ...updated } : m));
      toast.success(`Meeting ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update meeting");
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await meetingService.create({
        title,
        date,
        time,
        location,
        clientId: selectedClientId !== "ALL" ? selectedClientId : clientId || clients[0]?.id
      });
      toast.success("Meeting scheduled");
      setModalOpen(false);
      setTitle("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add meeting");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Meetings & Appointments", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B]", children: "Appointments extracted from client correspondence and calendar requests." }),
        /* @__PURE__ */ jsxs(Button, { variant: "primary", size: "md", onClick: () => setModalOpen(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "Schedule Meeting" })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsx(Loader, { label: "Loading meetings..." }) : meetings.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white border border-[#E2E8F0] rounded-lg", children: /* @__PURE__ */ jsx(
        EmptyState,
        {
          title: "No meetings scheduled",
          description: "Extract meetings from an email thread or schedule one directly."
        }
      ) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: meetings.map((mtg) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white border border-[#E2E8F0] rounded-lg p-4 flex flex-col justify-between gap-4",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: mtg.title }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-[11px] font-medium px-2 py-0.5 rounded border whitespace-nowrap ${mtg.status === "CONFIRMED" ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]" : mtg.status === "RESCHEDULING" ? "bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]" : mtg.status === "CANCELLED" ? "bg-[#F1F5F9] border-[#E2E8F0] text-[#64748B]" : "bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]"}`,
                    children: mtg.status
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-xs text-[#475569]", children: [
                /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5 font-mono tabular-nums", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 text-[#64748B]" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    mtg.date,
                    " \xB7 ",
                    mtg.time,
                    " (",
                    mtg.timezone,
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-[#64748B]" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    mtg.durationMinutes,
                    " min \xB7 ",
                    mtg.clientName
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5 text-[#64748B]" }),
                  /* @__PURE__ */ jsx("span", { children: mtg.location })
                ] })
              ] }),
              mtg.notes && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B] pt-1", children: mtg.notes })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F1F5F9]", children: [
              mtg.conversationId ? /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/assistant/emails?thread=${mtg.conversationId}`,
                  className: "text-xs text-[#2563EB] hover:underline inline-flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: "Source Email" }),
                    /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
                  ]
                }
              ) : /* @__PURE__ */ jsx("span", {}),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                mtg.status !== "CONFIRMED" && /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "primary",
                    onClick: () => handleStatusUpdate(mtg, "CONFIRMED"),
                    children: "Confirm"
                  }
                ),
                mtg.status !== "RESCHEDULING" && mtg.status !== "CANCELLED" && /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "secondary",
                    onClick: () => handleStatusUpdate(mtg, "RESCHEDULING"),
                    children: "Reschedule"
                  }
                )
              ] })
            ] })
          ]
        },
        mtg.id
      )) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { open: modalOpen, onClose: () => setModalOpen(false), title: "Schedule Meeting", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Meeting Title",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          required: true,
          placeholder: "LP Quarterly Portfolio Sync"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Date",
            type: "date",
            value: date,
            onChange: (e) => setDate(e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Time",
            value: time,
            onChange: (e) => setTime(e.target.value),
            required: true,
            placeholder: "10:30 AM"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Location / Link",
          value: location,
          onChange: (e) => setLocation(e.target.value)
        }
      ),
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
        /* @__PURE__ */ jsx(Button, { type: "submit", variant: "primary", loading: saving, children: "Save Meeting" })
      ] })
    ] }) })
  ] });
}
export {
  MeetingsPage
};

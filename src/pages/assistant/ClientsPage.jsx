import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Mail, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Avatar } from "../../components/common/Avatar";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { useEmails } from "../../hooks/useEmails";
import { accountService, clientService } from "../../services/workspaceService";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";
function ClientsPage() {
  const { clients, refreshClients, setSelectedClientId } = useEmails();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncingId, setSyncingId] = useState(null);
  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await clientService.create({ name, email, company, roleTitle, notes });
      toast.success("Client workspace added");
      setModalOpen(false);
      setName("");
      setEmail("");
      setCompany("");
      setRoleTitle("");
      setNotes("");
      refreshClients();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create client");
    } finally {
      setSaving(false);
    }
  };
  const handleSync = async (accountId) => {
    setSyncingId(accountId);
    try {
      const result = await accountService.sync(accountId);
      toast.success(result.sync?.mode === "SIMULATED_DEMO" ? "Demo inbox refreshed; sample emails are unchanged" : "Inbox synced");
      refreshClients();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncingId(null);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Managed Clients", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B]", children: "Executive principals assigned to your desk and their connected email accounts." }),
        /* @__PURE__ */ jsxs(Button, { variant: "primary", size: "md", onClick: () => setModalOpen(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "Add Client" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: clients.map((client) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white border border-[#E2E8F0] rounded-lg p-5 space-y-4",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(Avatar, { name: client.name, avatarKey: client.avatar, size: "lg" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: client.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#64748B]", children: [
                    client.roleTitle,
                    " \xB7 ",
                    client.company
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-[#64748B] mt-0.5", children: client.email })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: "secondary",
                  onClick: () => {
                    setSelectedClientId(client.id);
                    navigate("/assistant/emails");
                  },
                  children: "Open Inbox"
                }
              )
            ] }),
            client.notes && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2.5", children: client.notes }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-2 pt-2 border-t border-[#F1F5F9] text-center", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-base font-semibold font-mono tabular-nums text-[#0F172A]", children: client.stats?.total ?? 0 }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#64748B]", children: "Active" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-base font-semibold font-mono tabular-nums text-[#0F172A]", children: client.stats?.unread ?? 0 }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#64748B]", children: "Unread" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-base font-semibold font-mono tabular-nums text-[#2563EB]", children: client.stats?.assistantToReply ?? 0 }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#64748B]", children: "Assistant" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-base font-semibold font-mono tabular-nums text-[#7C3AED]", children: client.stats?.clientToReply ?? 0 }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#64748B]", children: "Client" })
              ] })
            ] }),
            client.connectedAccounts && client.connectedAccounts.length > 0 && /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-[#F1F5F9] space-y-2", children: client.connectedAccounts.map((acc) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center justify-between gap-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3 py-2",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5 text-[#2563EB] shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxs("p", { className: "font-medium text-[#0F172A] truncate", children: [
                        acc.provider,
                        " \xB7 ",
                        acc.emailAddress
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#64748B]", children: [
                        acc.isSimulated ? "Demo Mode \xB7 Synced " : "Live OAuth \xB7 Synced ",
                        formatRelativeTime(acc.lastSyncedAt)
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      loading: syncingId === acc.id,
                      onClick: () => handleSync(acc.id),
                      children: [
                        /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                        /* @__PURE__ */ jsx("span", { children: "Sync" })
                      ]
                    }
                  )
                ]
              },
              acc.id
            )) })
          ]
        },
        client.id
      )) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { open: modalOpen, onClose: () => setModalOpen(false), title: "Add Managed Client", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Input, { label: "Client Name", value: name, onChange: (e) => setName(e.target.value), required: true }),
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Email Address",
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(Input, { label: "Company", value: company, onChange: (e) => setCompany(e.target.value) }),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Role / Title",
            value: roleTitle,
            onChange: (e) => setRoleTitle(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Handling Notes",
          value: notes,
          onChange: (e) => setNotes(e.target.value),
          placeholder: "VIP rules, calendar preferences..."
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setModalOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", variant: "primary", loading: saving, children: "Create Client" })
      ] })
    ] }) })
  ] });
}
export {
  ClientsPage
};

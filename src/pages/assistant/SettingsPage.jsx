import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Mail, Play, Plus, RefreshCw, Shield, Trash2 } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import { useEmails } from "../../hooks/useEmails";
import { authService } from "../../services/authService";
import { accountService } from "../../services/workspaceService";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";
function SettingsPage() {
  const { user, setUser } = useAuth();
  const { clients } = useEmails();
  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [timezone, setTimezone] = useState(user?.timezone || "America/Los_Angeles");
  const [autoClassify, setAutoClassify] = useState(user?.preferences?.autoClassify ?? true);
  const [defaultTone, setDefaultTone] = useState(
    user?.preferences?.defaultTone || "PROFESSIONAL"
  );
  const [saving, setSaving] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState("");
  const [syncingAccountId, setSyncingAccountId] = useState("");
  const [disconnectingAccountId, setDisconnectingAccountId] = useState("");
  const [providers, setProviders] = useState([]);
  const [newProvider, setNewProvider] = useState("GMAIL");
  const [newEmail, setNewEmail] = useState("");
  const [newClientId, setNewClientId] = useState("");
  const [connecting, setConnecting] = useState(false);
  const loadAccounts = async () => {
    setAccountsLoading(true);
    setAccountsError("");
    try {
      const res = await accountService.list();
      setAccounts(res.accounts);
      setProviders(res.providers || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load connected accounts";
      setAccountsError(message);
      toast.error(message);
    } finally { setAccountsLoading(false); }
  };
  useEffect(() => {
    loadAccounts();
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("emailConnected");
    const error = params.get("emailError");
    if (connected) toast.success(`${connected === "gmail" ? "Gmail" : "Microsoft 365"} connected successfully`);
    if (error) toast.error(error);
    if (connected || error) window.history.replaceState({}, "", window.location.pathname);
  }, []);
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateSettings({
        name,
        title,
        timezone,
        preferences: {
          autoClassify,
          defaultTone
        }
      });
      setUser(updated);
      toast.success("Workspace settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };
  const handleConnect = async (e, mode) => {
    e.preventDefault();
    if (mode === "DEMO" && !newEmail.trim()) {
      toast.error("Enter an email address for the demo inbox");
      return;
    }
    setConnecting(true);
    try {
      const result = await accountService.connect({
        provider: newProvider,
        ...(mode === "DEMO" && newEmail.trim() ? { emailAddress: newEmail.trim() } : {}),
        clientId: newClientId || clients[0]?.id,
        mode
      });
      if (result.authUrl) {
        window.location.assign(result.authUrl);
        return;
      }
      setNewEmail("");
      toast.success(`Connected ${newProvider} demo mailbox for evaluation`);
      loadAccounts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnecting(false);
    }
  };
  const selectedProvider = providers.find((item) => item.provider === newProvider);
  const liveOAuthReady = selectedProvider?.mode === "OAUTH_READY";
  const handleDisconnect = async (id) => {
    setDisconnectingAccountId(id);
    try {
      await accountService.disconnect(id);
      toast.success("Account disconnected");
      await loadAccounts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to disconnect");
    } finally { setDisconnectingAccountId(""); }
  };
  const handleSync = async (id) => {
    setSyncingAccountId(id);
    try {
      const result = await accountService.sync(id);
      toast.success(result.sync?.mode === "SIMULATED_DEMO" ? "Demo inbox refreshed; sample emails are unchanged" : "Inbox synced");
      await loadAccounts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    } finally { setSyncingAccountId(""); }
  };
  return /* @__PURE__ */ jsx(AppLayout, { title: "Workspace Settings", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleSaveSettings,
        className: "bg-white border border-[#E2E8F0] rounded-lg p-5 space-y-4",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: "Profile & AI Preferences" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B]", children: "Customize your assistant profile, timezone, and default reply style." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Input, { label: "Display Name", value: name, onChange: (e) => setName(e.target.value), required: true }),
            /* @__PURE__ */ jsx(Input, { label: "Role Title", value: title, onChange: (e) => setTitle(e.target.value) }),
            /* @__PURE__ */ jsx(Input, { label: "Timezone", value: timezone, onChange: (e) => setTimezone(e.target.value) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-[#334155] mb-1.5", children: "Default Draft Tone" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: defaultTone,
                  onChange: (e) => setDefaultTone(e.target.value),
                  className: "w-full h-9 px-3 text-[13px] border border-[#CBD5E1] rounded-md",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "PROFESSIONAL", children: "Professional" }),
                    /* @__PURE__ */ jsx("option", { value: "CONCISE", children: "Concise Executive" }),
                    /* @__PURE__ */ jsx("option", { value: "WARM", children: "Warm & Collaborative" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: autoClassify,
                onChange: (e) => setAutoClassify(e.target.checked),
                className: "rounded border-[#CBD5E1] text-[#2563EB]"
              }
            ),
            /* @__PURE__ */ jsx("span", { children: "Automatically run responsibility classification on newly synced conversations" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsx(Button, { type: "submit", variant: "primary", loading: saving, children: "Save Preferences" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-5 space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: "Connected Email Accounts" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B]", children: "Connect Gmail or Microsoft 365 with OAuth. Mailbox access is granted by the provider and can be revoked here." })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 text-[#2563EB] shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: "Email passwords are never requested. OAuth tokens are encrypted before storage." })
      ] }),
      accountsLoading ? /* @__PURE__ */ jsx("p", { className: "rounded-md bg-[#F8FAFC] p-3 text-xs text-[#64748B]", role: "status", children: "Loading connected mailboxes…" }) : accountsError ? /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-3 text-xs text-[#92400E]", role: "alert", children: [/* @__PURE__ */ jsx("p", { children: accountsError }), /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", className: "mt-2", onClick: loadAccounts, children: "Try again" })] }) : accounts.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-md bg-[#F8FAFC] p-3 text-xs text-[#64748B]", children: "No email accounts connected yet. Add a client mailbox below to get started." }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-md", children: accounts.map((acc) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "p-3.5 flex flex-wrap items-center justify-between gap-3",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-[#2563EB]" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-[13px] font-medium text-[#0F172A]", children: [
                  acc.emailAddress,
                  " ",
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-normal text-[#64748B]", children: [
                    "\xB7 ",
                    acc.provider === "OUTLOOK" ? "Microsoft 365" : "Gmail"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#64748B]", children: [
                  acc.clientName,
                  " \xB7 ",
                  acc.connectionStatus === "DISCONNECTED" ? "Disconnected · reconnect required" : acc.isSimulated ? "Connected · demo mailbox" : "Connected · live mailbox",
                  " \xB7 Synced",
                  " ",
                  formatRelativeTime(acc.lastSyncedAt)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "secondary", loading: syncingAccountId === acc.id, disabled: Boolean(syncingAccountId || disconnectingAccountId), onClick: () => handleSync(acc.id), children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "Sync" })
              ] }),
              /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", loading: disconnectingAccountId === acc.id, disabled: Boolean(syncingAccountId || disconnectingAccountId), "aria-label": `Disconnect ${acc.emailAddress}`, onClick: () => handleDisconnect(acc.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5 text-[#DC2626]" }) })
            ] })
          ]
        },
        acc.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: (e) => handleConnect(e, "LIVE"), className: "grid sm:grid-cols-5 gap-2", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: newProvider,
            onChange: (e) => setNewProvider(e.target.value),
            className: "h-9 px-3 text-[13px] border border-[#CBD5E1] rounded-md",
          children: [
              /* @__PURE__ */ jsx("option", { value: "GMAIL", children: `Gmail${providers.find((item) => item.provider === "GMAIL")?.mode === "OAUTH_READY" ? " · OAuth ready" : " · Demo only"}` }),
              /* @__PURE__ */ jsx("option", { value: "OUTLOOK", children: `Microsoft 365${providers.find((item) => item.provider === "OUTLOOK")?.mode === "OAUTH_READY" ? " · OAuth ready" : " · Demo only"}` })
            ]
          }
        ),
        clients.length > 1 ? /* @__PURE__ */ jsxs("select", { value: newClientId || clients[0]?.id || "", onChange: (e) => setNewClientId(e.target.value), className: "h-9 px-3 text-[13px] border border-[#CBD5E1] rounded-md", "aria-label": "Workspace for mailbox", children: clients.map((client) => /* @__PURE__ */ jsx("option", { value: client.id, children: client.name }, client.id)) }) : /* @__PURE__ */ jsx("div", { className: "h-9 px-3 flex items-center text-xs text-[#64748B] border border-[#E2E8F0] rounded-md", children: clients[0]?.name || "Workspace" }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "primary", loading: connecting, disabled: !liveOAuthReady || !clients.length, children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: liveOAuthReady ? `Connect ${newProvider === "GMAIL" ? "Gmail" : "Microsoft 365"}` : "Live connection unavailable" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "sm:col-span-1 self-center text-[11px] text-[#64748B]", children: liveOAuthReady ? "Real mailbox via provider sign-in" : (selectedProvider?.configurationWarning || "Configure provider OAuth credentials to enable live connection.") })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: (e) => handleConnect(e, "DEMO"), className: "grid sm:grid-cols-5 gap-2", children: [
        /* @__PURE__ */ jsx("input", { type: "email", value: newEmail, onChange: (e) => setNewEmail(e.target.value), placeholder: "demo.inbox@example.com", required: true, className: "sm:col-span-2 h-9 px-3 text-[13px] border border-[#CBD5E1] rounded-md", "aria-label": "Demo inbox email address" }),
        clients.length > 1 ? /* @__PURE__ */ jsxs("span", { className: "h-9 px-3 flex items-center text-xs text-[#64748B] border border-[#E2E8F0] rounded-md", children: ["Workspace: ", clients.find((client) => client.id === (newClientId || clients[0]?.id))?.name || ""] }) : /* @__PURE__ */ jsx("span", { className: "h-9 px-3 flex items-center text-xs text-[#64748B] border border-[#E2E8F0] rounded-md", children: clients[0]?.name || "Workspace" }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "secondary", loading: connecting, disabled: !clients.length, children: [ /* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Play demo inbox — for evaluation" }) ] })
      ] })
      ] })
    ] })
  ] }) });
}
export {
  SettingsPage
};

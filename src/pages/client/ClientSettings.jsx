import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Play, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { accountService, clientService } from "../../services/workspaceService";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { formatRelativeTime } from "../../utils/formatDate";
import toast from "react-hot-toast";

function ClientSettings() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [timezone, setTimezone] = useState(user?.timezone || "America/Los_Angeles");
  const [saving, setSaving] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState("");
  const [syncingAccountId, setSyncingAccountId] = useState("");
  const [disconnectingAccountId, setDisconnectingAccountId] = useState("");
  const [providers, setProviders] = useState([]);
  const [clients, setClients] = useState([]);
  const [provider, setProvider] = useState("GMAIL");
  const [email, setEmail] = useState(user?.email || "");
  const [connecting, setConnecting] = useState(false);

  const loadAccounts = async () => {
    setAccountsLoading(true);
    setAccountsError("");
    try {
      const result = await accountService.list();
      setAccounts(result.accounts || []);
      setProviders(result.providers || []);
      setClients(await clientService.list());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load mailbox status";
      setAccountsError(message);
      toast.error(message);
    } finally { setAccountsLoading(false); }
  };
  useEffect(() => {
    loadAccounts();
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("emailConnected");
    const error = params.get("emailError");
    if (connected) toast.success(`${connected === "gmail" ? "Gmail" : "Microsoft 365"} connected and synced`);
    if (error) toast.error(error);
    if (connected || error) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateSettings({ name, timezone, preferences: { autoClassify: user?.preferences?.autoClassify ?? true, defaultTone: user?.preferences?.defaultTone || "PROFESSIONAL" } });
      setUser(updated);
      toast.success("Preferences saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  const connect = async (mode) => {
    if (mode === "DEMO" && !email.trim()) return toast.error("Enter an email address for the demo inbox");
    setConnecting(true);
    try {
      const result = await accountService.connect({ provider, mode, emailAddress: email.trim(), clientId: clients[0]?.id });
      if (result.authUrl) { window.location.assign(result.authUrl); return; }
      toast.success("Demo mailbox connected. Sample messages are ready in the inbox.");
      await loadAccounts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Connection failed");
    } finally { setConnecting(false); }
  };
  const sync = async (id) => {
    setSyncingAccountId(id);
    try { await accountService.sync(id); toast.success("Mailbox synced"); await loadAccounts(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Sync failed"); }
    finally { setSyncingAccountId(""); }
  };
  const disconnect = async (id) => {
    setDisconnectingAccountId(id);
    try { await accountService.disconnect(id); toast.success("Mailbox disconnected"); await loadAccounts(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Could not disconnect mailbox"); }
    finally { setDisconnectingAccountId(""); }
  };
  const oauthReady = providers.find((item) => item.provider === provider)?.mode === "OAUTH_READY";

  return <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8"><div className="max-w-2xl mx-auto space-y-5">
    <Link to="/client" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A]"><ArrowLeft className="h-3.5 w-3.5" />Back to Client Portal</Link>
    <form onSubmit={handleSave} className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
      <h1 className="font-display text-lg font-semibold text-[#0F172A]">Executive Preferences</h1>
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
      <div className="flex justify-end"><Button type="submit" variant="primary" loading={saving}>Save Preferences</Button></div>
    </form>
    <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
      <div><h2 className="text-sm font-semibold text-[#0F172A]">Email accounts</h2><p className="text-xs text-[#64748B] mt-1">Connect Gmail or Microsoft 365 through secure provider authorization.</p></div>
      {accountsLoading ? <p className="rounded-md bg-[#F8FAFC] p-3 text-xs text-[#64748B]" role="status">Loading connected mailboxes…</p> : accountsError ? <div className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-3 text-xs text-[#92400E]" role="alert"><p>{accountsError}</p><Button size="sm" variant="secondary" onClick={loadAccounts} className="mt-2">Try again</Button></div> : accounts.length ? <div className="divide-y border border-[#E2E8F0] rounded-md">{accounts.map((account) => <div key={account.id} className="p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#2563EB]"/><div><p className="text-sm font-medium">{account.emailAddress} <span className="text-xs text-[#64748B]">· {account.provider === "OUTLOOK" ? "Microsoft 365" : "Gmail"}</span></p><p className="text-xs text-[#64748B]">{account.connectionStatus === "DISCONNECTED" ? "Disconnected · reconnect required" : account.isSimulated ? "Connected · demo inbox" : "Connected · live mailbox"} · Synced {formatRelativeTime(account.lastSyncedAt)}</p></div></div>
        <div className="flex gap-2"><Button size="sm" variant="secondary" loading={syncingAccountId === account.id} disabled={Boolean(syncingAccountId || disconnectingAccountId)} onClick={() => sync(account.id)}><RefreshCw className="h-3.5 w-3.5"/>Sync now</Button><Button size="sm" variant="ghost" loading={disconnectingAccountId === account.id} disabled={Boolean(syncingAccountId || disconnectingAccountId)} onClick={() => disconnect(account.id)}><Trash2 className="h-3.5 w-3.5 text-red-600"/>Disconnect</Button></div>
      </div>)}</div> : <p className="rounded-md bg-[#F8FAFC] p-3 text-xs text-[#64748B]">No mailbox connected yet. Connect Gmail or Microsoft 365 below to sync messages into your portal.</p>}
      <div className="grid sm:grid-cols-4 gap-2">
        <select value={provider} onChange={(e) => setProvider(e.target.value)} className="h-9 px-3 text-sm border rounded-md"><option value="GMAIL">Gmail</option><option value="OUTLOOK">Microsoft 365</option></select>
        <Input type="email" aria-label="Mailbox email address" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button variant="primary" loading={connecting} disabled={!oauthReady || !clients.length} onClick={() => connect("LIVE")}><Plus className="h-4 w-4"/>Connect live</Button>
        <Button variant="secondary" loading={connecting} disabled={!clients.length} onClick={() => connect("DEMO")}><Play className="h-4 w-4"/>Use demo</Button>
      </div>
      {!oauthReady && <p className="text-xs text-[#64748B]">Live provider authorization is not configured yet. The demo inbox is available now.</p>}
      {accounts.length > 0 && <Link to="/client" className="inline-flex text-sm font-medium text-[#2563EB] hover:underline">Open inbox in your portal →</Link>}
    </section>
  </div></div>;
}

export { ClientSettings };

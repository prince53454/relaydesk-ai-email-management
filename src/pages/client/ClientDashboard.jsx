import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Eye, LogOut, Send, UserCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { emailService } from "../../services/emailService";
import { Avatar } from "../../components/common/Avatar";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { ConversationThread } from "../../components/emails/ConversationThread";
import { AIReplyGenerator } from "../../components/ai/AIReplyGenerator";
import { WorkspaceSwitcher } from "../../components/layout/WorkspaceSwitcher";
import { formatShortDateTime } from "../../utils/formatDate";
import toast from "react-hot-toast";

function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeConv, setActiveConv] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [handoverTarget, setHandoverTarget] = useState(null);
  const [handoverNote, setHandoverNote] = useState("");
  const [handoverSaving, setHandoverSaving] = useState(false);
  const detailRequestId = useRef(0);
  const pendingThreadId = useRef(null);
  const conversationRequestId = useRef(0);

  const loadConversations = useCallback(async ({ silent = false } = {}) => {
    const requestId = ++conversationRequestId.current;
    if (!silent) {
      setLoading(true);
      setLoadError("");
    }
    try {
      let result = await emailService.list({ classification: "CLIENT_TO_REPLY", status: "ACTIVE", limit: 100, sort: "priority" });
      // A session transition can race the first request; recheck an empty initial response once.
      if (!silent && user?.id && (result.emails || []).length === 0) {
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        result = await emailService.list({ classification: "CLIENT_TO_REPLY", status: "ACTIVE", limit: 100, sort: "priority" });
      }
      if (requestId === conversationRequestId.current) setConversations(result.emails || []);
    } catch (err) {
      if (requestId !== conversationRequestId.current) return;
      const message = err instanceof Error ? err.message : "Could not load emails needing your attention";
      if (!silent) {
        setLoadError(message);
        toast.error(message);
      }
    } finally { if (!silent && requestId === conversationRequestId.current) setLoading(false); }
  }, [user?.id]);
  useEffect(() => {
    loadConversations();
    const refresh = () => {
      if (document.visibilityState === "visible") loadConversations({ silent: true });
    };
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [loadConversations, user?.id]);

  const openThread = useCallback(async (id) => {
    if (pendingThreadId.current === id) return;
    pendingThreadId.current = id;
    const requestId = ++detailRequestId.current;
    setLoadingDetail(true);
    setActiveConv(null);
    setActiveMessages([]);
    setSearchParams({ thread: id });
    try {
      const result = await emailService.getById(id);
      if (requestId !== detailRequestId.current) return;
      setActiveConv(result.email);
      setActiveMessages(result.messages || []);
      if (result.email.isUnread) {
        try {
          const updated = await emailService.toggleRead(id, false);
          setConversations((items) => items.map((item) => item.id === id ? { ...item, ...updated } : item));
        } catch (err) { toast.error(err instanceof Error ? err.message : "Could not mark this email as read"); }
      }
    } catch (err) {
      if (requestId === detailRequestId.current) toast.error(err instanceof Error ? err.message : "Could not open this conversation");
    } finally {
      if (requestId === detailRequestId.current) {
        setLoadingDetail(false);
        pendingThreadId.current = null;
      }
    }
  }, [setSearchParams]);

  const closeThread = useCallback(() => {
    detailRequestId.current += 1;
    pendingThreadId.current = null;
    setLoadingDetail(false);
    setActiveConv(null);
    setActiveMessages([]);
    setSearchParams({});
  }, [setSearchParams]);
  useEffect(() => {
    const id = searchParams.get("thread");
    if (id) openThread(id);
    else { setActiveConv(null); setActiveMessages([]); }
  }, [searchParams, openThread]);

  const handleMarkHandled = async (conversation) => {
    try {
      const updated = await emailService.markCompleted(conversation.id, "COMPLETED");
      setConversations((items) => items.filter((item) => item.id !== conversation.id));
      setActiveConv((current) => current?.id === conversation.id ? { ...current, ...updated } : current);
      toast.success("Marked as handled");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not mark this matter handled"); }
  };

  const handleTakeover = async (event) => {
    event.preventDefault();
    if (!handoverTarget) return;
    setHandoverSaving(true);
    try {
      const updated = await emailService.requestTakeover(handoverTarget.id, handoverNote);
      setConversations((items) => items.filter((item) => item.id !== handoverTarget.id));
      setActiveConv((current) => current?.id === handoverTarget.id ? { ...current, ...updated } : current);
      toast.success("Your assistant has been asked to take over");
      setHandoverTarget(null);
      setHandoverNote("");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Handover failed"); }
    finally { setHandoverSaving(false); }
  };

  const firstName = user?.name?.split(" ")[0] || "there";
  return <div className="min-h-[100dvh] bg-[#F8FAFC] flex flex-col">
    <header className="h-14 px-4 sm:px-8 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 sticky top-0 z-30">
      <Link to="/client" className="font-display text-base font-bold tracking-tight text-[#0F172A]">RelayDesk</Link>
      <div className="flex items-center gap-3">
        <WorkspaceSwitcher />
        <Link to="/client/settings" className="text-sm text-[#475569] hover:text-[#0F172A]">Preferences</Link>
        {user && <Avatar name={user.name} avatarKey={user.avatar} size="sm"/>}
        <button type="button" aria-label="Sign out" onClick={async () => { await logout(); navigate("/register"); }} className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#DC2626] rounded cursor-pointer"><LogOut className="h-4 w-4"/><span>Sign out</span></button>
      </div>
    </header>

    <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="pb-5 border-b border-[#E2E8F0]">
        <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">Your attention</p>
        <h1 className="font-display text-2xl font-semibold text-[#0F172A] tracking-tight mt-1">Hello, {firstName}</h1>
        <p className="text-sm text-[#475569] mt-1">{conversations.length ? `${conversations.length} conversation${conversations.length === 1 ? "" : "s"} assigned for your attention.` : "Conversations assigned to you will appear here."}</p>
      </div>

      {loading ? <Loader label="Loading your conversations..."/> : loadError ? <div className="bg-white border border-[#E2E8F0] rounded-xl"><EmptyState icon={<AlertCircle className="h-5 w-5 text-[#B45309]"/>} title="Couldn’t load your inbox" description={loadError} action={<Button size="sm" variant="secondary" onClick={loadConversations}>Try again</Button>}/></div> : conversations.length === 0 ? <div className="bg-white border border-[#E2E8F0] rounded-xl"><EmptyState title="You’re all caught up" description="There are no active conversations assigned to you."/></div> : <div className="space-y-4">{conversations.map((conversation) => <article key={conversation.id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-4 transition-shadow hover:shadow-sm">
        <div className="flex items-start gap-3">
          <Avatar name={conversation.sender.name} size="md"/>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#64748B]"><span className="font-semibold text-[#0F172A]">{conversation.sender.name}</span><span aria-hidden="true">·</span><time dateTime={conversation.lastMessageAt}>{formatShortDateTime(conversation.lastMessageAt)}</time></div>
            <h2 className="text-base font-semibold text-[#0F172A] mt-1 leading-snug">{conversation.subject}</h2>
            {conversation.status === "WAITING_FOR_RESPONSE" && <p className="text-xs font-medium text-[#7C3AED] mt-1">Reply sent · Waiting for response</p>}
          </div>
        </div>
        <div className="space-y-3 text-[13px]">
          <div><p className="text-[11px] font-semibold text-[#64748B] mb-1">Summary</p><p className="text-[#1E293B] leading-relaxed">{conversation.summary?.overview || conversation.snippet || "Open the conversation to review the message."}</p></div>
          <div className="pl-3 border-l-2 border-[#8B5CF6]"><p className="text-[11px] font-semibold text-[#6D28D9] mb-1">Why it needs your response</p><p className="text-[#1E293B] leading-relaxed">{conversation.classificationReason || "This conversation was identified as needing your attention."}</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#F1F5F9]">
          <Button size="sm" variant="secondary" onClick={() => openThread(conversation.id)}><Eye className="h-3.5 w-3.5"/>Review conversation</Button>
          <Button size="sm" variant="secondary" onClick={() => setHandoverTarget(conversation)}><UserCheck className="h-3.5 w-3.5 text-[#2563EB]"/>Ask assistant to take over</Button>
          <Button size="sm" variant="ghost" onClick={() => handleMarkHandled(conversation)} className="sm:ml-auto text-[#059669] hover:text-[#047857]"><CheckCircle2 className="h-3.5 w-3.5"/>Mark handled</Button>
        </div>
      </article>)}</div>}
    </main>

    <Modal open={Boolean(activeConv || loadingDetail)} onClose={closeThread} title={activeConv?.subject || "Conversation"} subtitle={activeConv ? `${activeConv.sender.name} <${activeConv.sender.email}>` : undefined} maxWidth="max-w-3xl">
      {loadingDetail || !activeConv ? <Loader label="Loading conversation..."/> : <div className="space-y-4">
        <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-[#1E293B]"><p className="text-xs font-semibold text-[#0F172A] mb-1">AI summary</p><p>{activeConv.summary?.overview || activeConv.snippet}</p><p className="text-xs text-[#64748B] mt-2">{activeConv.classificationReason}</p></div>
        <ConversationThread messages={activeMessages}/>
        <AIReplyGenerator conversation={activeConv} onReplySent={(updated) => { setConversations((items) => items.filter((item) => item.id !== updated.id)); setActiveConv((current) => current?.id === updated.id ? { ...current, ...updated } : current); }}/>
      </div>}
    </Modal>

    <Modal open={Boolean(handoverTarget)} onClose={() => setHandoverTarget(null)} title="Ask your assistant to take over" subtitle={handoverTarget?.subject}>
      <form onSubmit={handleTakeover} className="space-y-4">
        <p className="text-sm text-[#475569]">Your assistant will see this conversation in their reply queue. Add an optional instruction if helpful.</p>
        <textarea value={handoverNote} onChange={(event) => setHandoverNote(event.target.value)} rows={3} placeholder="Optional instruction for your assistant" className="w-full p-3 text-[13px] border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#2563EB]"/>
        <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setHandoverTarget(null)}>Cancel</Button><Button type="submit" variant="primary" loading={handoverSaving}><Send className="h-3.5 w-3.5"/>Hand over</Button></div>
      </form>
    </Modal>
  </div>;
}

export { ClientDashboard };

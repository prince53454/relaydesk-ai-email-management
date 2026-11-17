import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Bot, CheckSquare, Clock, Inbox, Mail, Search, Star, UserCheck } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { StatCard } from "../../components/dashboard/StatCard";
import { AIDailySummary } from "../../components/dashboard/AIDailySummary";
import { DashboardChart } from "../../components/dashboard/DashboardChart";
import { PriorityInbox } from "../../components/dashboard/PriorityInbox";
import { UpcomingMeetings } from "../../components/dashboard/UpcomingMeetings";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { dashboardService, actionService } from "../../services/workspaceService";
import { formatDueDate } from "../../utils/formatDate";
import { useEmails } from "../../hooks/useEmails";
import toast from "react-hot-toast";

function AssistantDashboard() {
  const { selectedClientId, setSelectedClientId, setCopilotConversationId, setPendingThreadId } = useEmails();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const requestId = useRef(0);
  const load = useCallback(async ({ silent = false } = {}) => {
    const activeRequestId = ++requestId.current;
    if (!silent) setLoading(true);
    if (!silent) setLoadError("");
    try {
      const overview = await dashboardService.getOverview(selectedClientId);
      if (requestId.current === activeRequestId) setData(overview);
    } catch (err) {
      if (!silent && requestId.current === activeRequestId) {
        const message = err instanceof Error ? err.message : "Failed to load overview";
        setLoadError(message);
        toast.error(message);
      }
    } finally {
      if (requestId.current === activeRequestId) setLoading(false);
    }
  }, [selectedClientId]);
  useEffect(() => {
    load();
    const timer = setInterval(() => load({ silent: true }), 60_000);
    return () => clearInterval(timer);
  }, [load]);
  const openThread = (email) => {
    if (email.clientId) setSelectedClientId(email.clientId);
    setPendingThreadId(email.id);
    setCopilotConversationId(email.id);
    navigate("/assistant/emails");
  };
  const searchInbox = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(`/assistant/emails${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };
  const handleCompleteFollowUp = async (id) => {
    try {
      await actionService.update(id, { status: "COMPLETED" });
      setData((current) => current ? { ...current, pendingFollowUps: current.pendingFollowUps.filter((action) => action.id !== id), stats: { ...current.stats, actionRequiredCount: Math.max(0, current.stats.actionRequiredCount - 1) } } : current);
      toast.success("Follow-up marked completed");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not update task"); }
  };

  return <AppLayout title="Executive Overview"><div className="max-w-7xl mx-auto space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div><p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">Inbox overview</p><h1 className="font-display text-xl font-semibold text-[#0F172A] mt-1">Your clients, at a glance</h1><p className="text-sm text-[#64748B] mt-1">Open a queue or search across the inbox to get straight to the next task.</p></div>
      <form onSubmit={searchInbox} className="flex w-full sm:w-auto gap-2">
        <label className="relative flex-1 sm:w-72"><span className="sr-only">Search all emails</span><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search emails, people, clients…" className="h-9 w-full rounded-md border border-[#CBD5E1] bg-white pl-9 pr-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"/></label>
        <Button type="submit" variant="secondary">Search</Button>
      </form>
    </div>
    {loading || (!data && !loadError) ? <Loader label="Loading workspace metrics..."/> : loadError ? <div className="rounded-xl border border-[#E2E8F0] bg-white"><EmptyState icon={<AlertCircle className="h-5 w-5 text-[#B45309]"/>} title="Couldn’t load the overview" description={loadError} action={<Button size="sm" variant="secondary" onClick={() => load()}>Try again</Button>}/></div> : <>
      <section aria-label="Inbox totals" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total emails" value={data.stats.totalConversations} icon={Inbox} to="/assistant/emails"/>
        <StatCard label="Unread" value={data.stats.unreadEmails} icon={Mail} to="/assistant/emails"/>
        <StatCard label="Important" value={data.stats.importantEmails} icon={Star} to="/assistant/important"/>
        <StatCard label="Needs action" value={data.stats.actionRequiredCount} icon={CheckSquare} accentClass="text-[#B45309]" to="/assistant/action-required"/>
      </section>
      <section aria-label="Triage queues" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Assistant to reply" subtitle="Assigned to you" value={data.stats.assistantToReplyCount} icon={Bot} accentClass="text-[#2563EB]" to="/assistant/assistant-to-reply"/>
        <StatCard label="Client attention" subtitle="Waiting on your principal" value={data.stats.clientToReplyCount} icon={UserCheck} accentClass="text-[#7C3AED]" to="/assistant/client-to-reply"/>
        <StatCard label="Waiting for response" subtitle="Follow up when needed" value={data.stats.waitingForResponseCount} icon={Clock} to="/assistant/waiting"/>
      </section>
      <AIDailySummary label={data.dailySummary.label} headline={data.dailySummary.headline} highlights={data.dailySummary.highlights}/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PriorityInbox title="Priority Inbox" emails={data.priorityInbox} viewAllTo="/assistant/important" onSelectEmail={openThread}/>
        <PriorityInbox title="Recent Conversations" emails={data.recentConversations.slice(0, 6)} viewAllTo="/assistant/emails" onSelectEmail={openThread}/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UpcomingMeetings meetings={data.upcomingMeetings}/>
        <section className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between"><h2 className="text-sm font-semibold text-[#0F172A]">Pending Follow-ups</h2><Link to="/assistant/action-required" className="text-xs font-medium text-[#2563EB] hover:underline">All tasks</Link></div>
          {data.pendingFollowUps.length === 0 ? <p className="p-6 text-xs text-[#64748B] text-center">No pending follow-ups.</p> : <div className="divide-y divide-[#F1F5F9]">{data.pendingFollowUps.map((act) => <div key={act.id} className="px-4 py-3 flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-[13px] font-medium text-[#0F172A] truncate">{act.title}</p><p className="text-xs text-[#64748B] mt-0.5">{act.clientName} · Due {formatDueDate(act.dueDate)}</p></div><Button size="sm" variant="secondary" onClick={() => handleCompleteFollowUp(act.id)}>Done</Button></div>)}</div>}
        </section>
        <ActivityFeed activities={data.recentActivity}/>
      </div>
      <DashboardChart classificationBreakdown={data.classificationBreakdown} clientVolume={data.clientVolume}/>
    </>}
  </div></AppLayout>;
}

export { AssistantDashboard };

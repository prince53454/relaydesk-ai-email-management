import { Link } from "react-router-dom";
import { ArrowRight, MailCheck, ShieldCheck } from "lucide-react";

function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="RelayDesk home">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2563EB] text-white"><MailCheck className="h-5 w-5" /></span>
          <span className="font-display text-lg font-bold tracking-tight">RelayDesk</span>
        </Link>
        <Link to="/login" className="text-sm font-semibold text-[#475569] hover:text-[#2563EB]">Sign in <span aria-hidden="true">→</span></Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-white px-3 py-1.5 text-xs font-semibold text-[#2563EB]"><ShieldCheck className="h-3.5 w-3.5" /> A calmer way to manage executive email</span>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-6xl">The right emails reach the right person.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#64748B] sm:text-lg">RelayDesk helps executive assistants organize inboxes, surface decisions, and keep clients in control of what matters.</p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="text-sm leading-6 text-[#64748B]">Sign in to your workspace to manage executive email, review decisions, and coordinate with your assistant.</p>
          <Link to="/login" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">Sign in <ArrowRight className="h-4 w-4" /></Link>
          <p className="mt-4 text-sm text-[#64748B]">New to RelayDesk? <Link to="/register" className="font-semibold text-[#2563EB] hover:underline">Create a client account</Link></p>
        </div>
      </section>
    </main>
  );
}

export { Home };

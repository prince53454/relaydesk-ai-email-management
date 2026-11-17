import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Mail, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { accountService } from "../../services/workspaceService";
import { useEmails } from "../../hooks/useEmails";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import toast from "react-hot-toast";
function OnboardingFlow() {
  const { user, setUser, switchDemoRole } = useAuth();
  const { clients } = useEmails();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState("GMAIL");
  const [mailboxEmail, setMailboxEmail] = useState(user?.email || "");
  const [timezone, setTimezone] = useState(user?.timezone || "America/Los_Angeles");
  const [saving, setSaving] = useState(false);
  const connectMailbox = async (mode = "LIVE") => {
    setSaving(true);
    try {
      const result = await accountService.connect({
        provider,
        emailAddress: mailboxEmail || user?.email,
        clientId: clients[0]?.id,
        mode
      });
      if (result.authUrl) {
        const updatedUser = await authService.completeOnboarding({ role: user?.role, timezone, complete: true });
        setUser(updatedUser);
        window.location.assign(result.authUrl);
        return;
      }
      const updatedUser = await authService.completeOnboarding({ role: user?.role, timezone, complete: true });
      setUser(updatedUser);
      toast.success("Demo mailbox connected for evaluation.");
      setStep(4);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start mailbox connection");
    } finally {
      setSaving(false);
    }
  };
  const finishOnboarding = async () => {
    setSaving(true);
    try {
      const updated = await authService.completeOnboarding({
        role: user?.role,
        timezone,
        complete: true
      });
      setUser(updated);
      toast.success("Workspace ready");
      if (updated.role === "CLIENT") {
        await switchDemoRole("ASSISTANT");
      }
      navigate("/assistant");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to complete onboarding");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xl bg-white border border-[#E2E8F0] rounded-xl p-7 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-[#64748B]", children: [
      /* @__PURE__ */ jsx("span", { className: "font-display font-semibold text-[#0F172A]", children: "RelayDesk Setup" }),
      /* @__PURE__ */ jsxs("span", { className: "font-mono tabular-nums", children: [
        "Step ",
        step,
        " of 4"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1.5", children: [1, 2, 3, 4].map((s) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `h-1 rounded-full ${s <= step ? "bg-[#2563EB]" : "bg-[#E2E8F0]"}`
      },
      s
    )) }),
    step === 1 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-2xl font-semibold text-[#0F172A]", children: [
        "Welcome, ",
        user?.name || "Executive User"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[#475569] leading-relaxed", children: "Let\u2019s configure your intelligent email triage workspace. RelayDesk separates routine coordination from personal decisions so assistants and clients stay aligned." }),
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Primary Timezone",
          value: timezone,
          onChange: (e) => setTimezone(e.target.value),
          hint: "Used for extracted meeting schedules and deadlines."
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxs(Button, { variant: "primary", onClick: () => setStep(2), children: [
        /* @__PURE__ */ jsx("span", { children: "Continue" }),
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] }) })
    ] }),
    step === 2 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-semibold text-[#0F172A]", children: "Your Workspace Role" }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[#0F172A]", children: user?.role === "ASSISTANT" ? "Personal Assistant" : "Executive Client" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B] mt-1", children: "Your account role is set at registration and stays fixed during setup. You can continue onboarding and open the dashboard for this account." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setStep(1), children: "Back" }),
        /* @__PURE__ */ jsxs(Button, { variant: "primary", onClick: () => setStep(3), children: [
          /* @__PURE__ */ jsx("span", { children: "Next: Connect Email" }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] })
    ] }),
    step === 3 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-semibold text-[#0F172A]", children: "Connect your email account" }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A] flex items-start gap-2", children: [
        /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsx("span", { children: "For live email, sign in with Google or Microsoft and approve mailbox access there. RelayDesk never asks for your email password. Choose Use sample inbox to explore with demo email data." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setProvider("GMAIL"),
            className: `p-3.5 rounded-lg border text-left cursor-pointer ${provider === "GMAIL" ? "border-[#2563EB] bg-[#F8FAFC]" : "border-[#E2E8F0]"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-semibold text-sm text-[#0F172A]", children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-[#DC2626]" }),
                /* @__PURE__ */ jsx("span", { children: "Google Gmail" })
              ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#64748B] mt-1", children: "Google OAuth 2.0" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setProvider("OUTLOOK"),
            className: `p-3.5 rounded-lg border text-left cursor-pointer ${provider === "OUTLOOK" ? "border-[#2563EB] bg-[#F8FAFC]" : "border-[#E2E8F0]"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-semibold text-sm text-[#0F172A]", children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-[#2563EB]" }),
                /* @__PURE__ */ jsx("span", { children: "Microsoft Outlook" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#64748B] mt-1", children: "Microsoft Graph OAuth" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Mailbox address (used for the demo inbox)",
          type: "email",
          value: mailboxEmail,
          onChange: (e) => setMailboxEmail(e.target.value),
          placeholder: "executive@company.com"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setStep(2), children: "Back" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => connectMailbox("DEMO"), loading: saving, children: "Play demo inbox — for evaluation" }),
          /* @__PURE__ */ jsxs(Button, { variant: "primary", onClick: () => connectMailbox("LIVE"), loading: saving, children: [
            /* @__PURE__ */ jsx("span", { children: `Connect real ${provider === "GMAIL" ? "Gmail" : "Microsoft 365"}` }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] })
      ] })
    ] }),
    step === 4 && /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-center py-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-semibold text-[#0F172A]", children: "Setup Complete" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-[#475569] max-w-md mx-auto", children: [
        "Demo connection for ",
        provider === "GMAIL" ? "Google Workspace" : "Microsoft 365",
        " demo mailbox (",
        mailboxEmail || user?.email,
        ") is connected and ready for AI triage."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setStep(3), children: "Back" }),
        /* @__PURE__ */ jsxs(Button, { variant: "primary", size: "lg", onClick: finishOnboarding, loading: saving, children: [
          /* @__PURE__ */ jsx("span", { children: "Open Dashboard" }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  OnboardingFlow
};

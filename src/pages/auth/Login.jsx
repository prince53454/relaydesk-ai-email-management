import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MailCheck, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import toast from "react-hot-toast";
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const performLogin = async (targetEmail, targetPass) => {
    setLoading(true);
    try {
      const user = await login(targetEmail, targetPass);
      toast.success(`Welcome back, ${user.name}`);
      if (!user.onboardingCompleted) {
        navigate("/onboarding");
      } else {
        navigate(user.role === "ASSISTANT" ? "/assistant" : "/client");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    performLogin(email, password);
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-10 px-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-6 bg-[#0F172A] text-white rounded-xl p-8 flex flex-col justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-[#2563EB] flex items-center justify-center", children: /* @__PURE__ */ jsx(MailCheck, { className: "h-4 w-4 text-white" }) }),
          /* @__PURE__ */ jsx("span", { className: "font-display text-lg font-bold tracking-tight", children: "RelayDesk" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-8 leading-snug text-balance", children: "Executive email triage built for assistants and their principals." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[#94A3B8] mt-3 leading-relaxed", children: "Automatically separate routine scheduling from high-stakes executive decisions, surface structured AI briefings, and hand over threads seamlessly." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-6 border-t border-white/10 space-y-3 text-xs text-[#CBD5E1]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-[#60A5FA] shrink-0" }),
          /* @__PURE__ */ jsx("span", { children: "Role-isolated workspaces for Assistants and Clients" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[#94A3B8]", children: "Sign in to your role-specific workspace using the matching portal." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl p-7 flex flex-col justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-semibold text-[#0F172A]", children: "Sign in to workspace" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B] mt-1", children: "Enter your email and password to continue." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Email address",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true,
              placeholder: "name@company.com"
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Password",
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true,
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            }
          ),
          /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "primary", size: "lg", className: "w-full", loading, children: [
            /* @__PURE__ */ jsx("span", { children: "Sign In" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#64748B] mt-6 text-center", children: [
        "New to RelayDesk?",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/register", className: "text-[#2563EB] font-medium hover:underline", children: "Create an account" })
      ] })
    ] })
  ] }) });
}
export {
  Login
};

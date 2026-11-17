import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MailCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import toast from "react-hot-toast";
function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await register({ name, email, password });
      if (result.emailSent) {
        toast.success("Account created and welcome email sent");
      } else {
        toast.error("Account created, but the welcome email could not be sent. Check SMTP settings.");
      }
      navigate("/onboarding");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl p-7", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
      /* @__PURE__ */ jsx("div", { className: "h-7 w-7 rounded-md bg-[#2563EB] text-white flex items-center justify-center", children: /* @__PURE__ */ jsx(MailCheck, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("span", { className: "font-display text-base font-bold text-[#0F172A]", children: "RelayDesk" })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-semibold text-[#0F172A]", children: "Create your account" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B] mt-1", children: "Create an Executive Client portal. Assistant accounts are provisioned by your workspace administrator." }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-5 space-y-4", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Full Name",
          value: name,
          onChange: (e) => setName(e.target.value),
          required: true,
          placeholder: "Jordan Taylor"
        }
      ),
      /* @__PURE__ */ jsx(
        Input,
        {
          label: "Work Email",
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
          placeholder: "jordan@company.com"
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
          minLength: 6,
          placeholder: "Minimum 6 characters"
        }
      ),
      /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "primary", size: "lg", className: "w-full", loading, children: [
        /* @__PURE__ */ jsx("span", { children: "Continue to Setup" }),
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#64748B] mt-5 text-center", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-[#2563EB] font-medium hover:underline", children: "Sign in" })
    ] })
  ] }) });
}
export {
  Register
};

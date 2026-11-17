import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
function NotFound() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-[#64748B]", children: "404" }),
    /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl font-semibold text-[#0F172A]", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-[#475569]", children: "The workspace route you requested does not exist." }),
    /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Button, { variant: "primary", children: "Return Home" }) }) })
  ] }) });
}
export {
  NotFound
};

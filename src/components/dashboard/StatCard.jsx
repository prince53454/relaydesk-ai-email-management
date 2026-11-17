import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { cn } from "../../utils/helpers";
function StatCard({ label, value, subtitle, icon: Icon, accentClass, to }) {
  const inner = /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg p-4 transition-colors h-full flex flex-col justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-[#64748B] truncate", children: label }),
      Icon && /* @__PURE__ */ jsx(Icon, { className: cn("h-4 w-4 shrink-0 text-[#64748B]", accentClass) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2.5 flex items-baseline justify-between gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: cn("font-display text-2xl font-semibold tabular-nums text-[#0F172A]", accentClass), children: value }),
      subtitle && /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#64748B] truncate", children: subtitle })
    ] })
  ] });
  if (to) {
    return /* @__PURE__ */ jsx(Link, { to, className: "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]", children: inner });
  }
  return inner;
}
export {
  StatCard
};

import { jsx, jsxs } from "react/jsx-runtime";
import { Inbox } from "lucide-react";
function EmptyState({ title, description, action, icon }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center py-12 px-6", children: [
    /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center text-[#64748B] mb-3", children: icon || /* @__PURE__ */ jsx(Inbox, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-[#0F172A]", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B] mt-1 max-w-sm leading-relaxed", children: description }),
    action && /* @__PURE__ */ jsx("div", { className: "mt-4", children: action })
  ] });
}
export {
  EmptyState
};

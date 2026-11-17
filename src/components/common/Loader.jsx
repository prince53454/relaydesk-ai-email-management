import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "../../utils/helpers";
function Loader({ label = "Loading...", className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center justify-center gap-2.5 py-10 text-xs text-[#64748B]", className), children: [
    /* @__PURE__ */ jsx("span", { className: "h-4 w-4 rounded-full border-2 border-[#CBD5E1] border-t-[#2563EB] animate-spin" }),
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}
function ListSkeleton({ rows = 6 }) {
  return /* @__PURE__ */ jsx("div", { className: "divide-y divide-[#F1F5F9]", children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 flex items-center gap-3 animate-pulse", children: [
    /* @__PURE__ */ jsx("div", { className: "h-7 w-7 rounded-full bg-[#E2E8F0] shrink-0" }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5", children: [
      /* @__PURE__ */ jsx("div", { className: "h-3.5 w-1/3 bg-[#E2E8F0] rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 w-2/3 bg-[#F1F5F9] rounded" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-4 w-20 bg-[#F1F5F9] rounded" })
  ] }, i)) });
}
export {
  ListSkeleton,
  Loader
};

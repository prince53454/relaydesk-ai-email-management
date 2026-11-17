import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "../../utils/helpers";
function Input({ label, error, hint, className, id, ...rest }) {
  const inputId = id || rest.name;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: inputId, className: "block text-xs font-medium text-[#334155]", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        id: inputId,
        className: cn(
          "w-full h-9 px-3 text-[13px] text-[#0F172A] bg-white border border-[#CBD5E1] rounded-md placeholder:text-[#94A3B8] transition-shadow focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/15",
          error && "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15",
          className
        ),
        ...rest
      }
    ),
    error && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#DC2626]", children: error }),
    !error && hint && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B]", children: hint })
  ] });
}
export {
  Input
};

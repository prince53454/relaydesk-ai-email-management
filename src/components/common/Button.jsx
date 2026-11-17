import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "../../utils/helpers";
function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}) {
  const variants = {
    primary: "bg-[#2563EB] text-white border border-[#1D4ED8] hover:bg-[#1D4ED8] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]",
    violet: "bg-[#7C3AED] text-white border border-[#6D28D9] hover:bg-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]",
    secondary: "bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] hover:border-[#94A3B8]",
    ghost: "bg-transparent text-[#475569] border border-transparent hover:bg-[#F1F5F9] hover:text-[#0F172A]",
    danger: "bg-[#DC2626] text-white border border-[#B91C1C] hover:bg-[#B91C1C]"
  };
  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5 rounded",
    md: "h-9 px-3.5 text-[13px] gap-2 rounded-md",
    lg: "h-10 px-4 text-sm gap-2 rounded-lg"
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type,
      disabled: disabled || loading,
      className: cn(
        "inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      ),
      ...rest,
      children: [
        loading && /* @__PURE__ */ jsx("span", { className: "h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" }),
        children
      ]
    }
  );
}
export {
  Button
};

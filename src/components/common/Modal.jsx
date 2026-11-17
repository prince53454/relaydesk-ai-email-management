import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { X } from "lucide-react";
function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg"
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-[2px] p-4",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title,
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `w-full ${maxWidth} bg-white border border-[#E2E8F0] rounded-xl shadow-[0_16px_32px_-6px_rgba(15,23,42,0.12)] overflow-hidden`,
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 px-5 py-4 border-b border-[#E2E8F0]", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-[15px] font-semibold text-[#0F172A]", children: title }),
                subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B] mt-0.5", children: subtitle })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "aria-label": "Close modal",
                  className: "p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-5 max-h-[80vh] overflow-y-auto", children })
          ]
        }
      )
    }
  );
}
export {
  Modal
};

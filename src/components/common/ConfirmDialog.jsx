import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "./Modal";
import { Button } from "./Button";
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  loading = false
}) {
  return /* @__PURE__ */ jsxs(Modal, { open, onClose, title, maxWidth: "max-w-md", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[13px] text-[#475569] leading-relaxed", children: description }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 mt-5", children: [
      /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: onClose, disabled: loading, children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: onConfirm, loading, children: confirmLabel })
    ] })
  ] });
}
export {
  ConfirmDialog
};

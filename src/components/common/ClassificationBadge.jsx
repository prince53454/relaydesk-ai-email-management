import { jsx } from "react/jsx-runtime";
import { CLASSIFICATION_META } from "../../utils/constants";
import { cn } from "../../utils/helpers";
function ClassificationBadge({
  classification,
  compact = false
}) {
  const meta = CLASSIFICATION_META[classification] || CLASSIFICATION_META.NEEDS_REVIEW;
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center h-[22px] px-2 rounded-md border text-[11px] font-semibold whitespace-nowrap shrink-0",
        meta.bgClass,
        meta.borderClass,
        meta.textClass
      ),
      title: `${meta.label}: ${meta.description}`,
      "aria-label": `${meta.label}. ${meta.description}`,
      children: compact ? meta.shortLabel : meta.label
    }
  );
}
export {
  ClassificationBadge
};

import { jsx } from "react/jsx-runtime";
import { useState } from "react";
import { resolveAvatarSrc } from "../../assets/images/avatars";
import { cn, getInitials } from "../../utils/helpers";
const SIZE_CLASSES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm"
};
const PALETTES = [
  "bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]",
  "bg-[#F5F3FF] text-[#6D28D9] border-[#EDE9FE]",
  "bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]",
  "bg-[#F1F5F9] text-[#334155] border-[#E2E8F0]"
];
function Avatar({ name, avatarKey, size = "md", className }) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = resolveAvatarSrc(avatarKey);
  const paletteIdx = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % PALETTES.length;
  if (src && !imgFailed) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt: name,
        referrerPolicy: "no-referrer",
        onError: () => setImgFailed(true),
        className: cn(
          "rounded-full object-cover border border-[#E2E8F0] shrink-0 bg-[#F1F5F9]",
          SIZE_CLASSES[size],
          className
        )
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-label": name,
      className: cn(
        "rounded-full border flex items-center justify-center font-semibold shrink-0 select-none",
        PALETTES[paletteIdx],
        SIZE_CLASSES[size],
        className
      ),
      children: getInitials(name || "U")
    }
  );
}
export {
  Avatar
};

const CLASSIFICATION_META = {
  ASSISTANT_TO_REPLY: {
    label: "Assistant to Reply",
    shortLabel: "Assistant",
    textClass: "text-[#1D4ED8]",
    bgClass: "bg-[#2563EB]/[0.08]",
    borderClass: "border-[#2563EB]/25",
    description: "Administrative, scheduling, or logistics thread handled by the assistant."
  },
  CLIENT_TO_REPLY: {
    label: "Client to Reply",
    shortLabel: "Client",
    textClass: "text-[#6D28D9]",
    bgClass: "bg-[#7C3AED]/[0.08]",
    borderClass: "border-[#7C3AED]/25",
    description: "Requires executive decision, personal sign-off, or principal voice."
  },
  NO_REPLY_NEEDED: {
    label: "No Reply Needed",
    shortLabel: "No Reply",
    textClass: "text-[#475569]",
    bgClass: "bg-[#64748B]/[0.08]",
    borderClass: "border-[#64748B]/25",
    description: "Informational digest, receipt, or confirmation requiring no response."
  },
  NEEDS_REVIEW: {
    label: "Needs Review",
    shortLabel: "Review",
    textClass: "text-[#B45309]",
    bgClass: "bg-[#D97706]/[0.08]",
    borderClass: "border-[#D97706]/25",
    description: "Low confidence or ambiguous context requiring manual triage."
  }
};
const PRIORITY_META = {
  URGENT: { label: "Urgent", textClass: "text-[#B91C1C] font-semibold" },
  HIGH: { label: "High", textClass: "text-[#B45309] font-medium" },
  MEDIUM: { label: "Medium", textClass: "text-[#475569]" },
  LOW: { label: "Low", textClass: "text-[#94A3B8]" }
};
export {
  CLASSIFICATION_META,
  PRIORITY_META
};

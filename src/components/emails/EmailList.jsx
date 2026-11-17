import { jsx, jsxs } from "react/jsx-runtime";
import { EmailCard } from "./EmailCard";
import { ListSkeleton } from "../common/Loader";
import { EmptyState } from "../common/EmptyState";
import { Button } from "../common/Button";
function EmailList({
  emails,
  selectedId,
  loading,
  error,
  onSelect,
  onToggleImportant,
  onResetFilters,
  onRetry,
  pagination,
  onPageChange
}) {
  if (loading) return /* @__PURE__ */ jsx(ListSkeleton, { rows: 7 });
  if (error) {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "Unable to load conversations",
        description: error,
        action: onRetry && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", onClick: onRetry, children: "Try again" })
      }
    );
  }
  if (emails.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "No matching conversations",
        description: "No emails match the current category or search filters.",
        action: onResetFilters && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", onClick: onResetFilters, children: "Clear filters" })
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto divide-y divide-[#F1F5F9]", children: emails.map((email) => /* @__PURE__ */ jsx(
      EmailCard,
      {
        email,
        selected: email.id === selectedId,
        onSelect,
        onToggleImportant
      },
      email.id
    )) }),
    pagination && pagination.totalPages > 1 && onPageChange && /* @__PURE__ */ jsxs("div", { className: "px-4 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]", children: [
      /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
        "Page ",
        pagination.page,
        " of ",
        pagination.totalPages,
        " (",
        pagination.total,
        " threads)"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "secondary",
            disabled: pagination.page <= 1,
            onClick: () => onPageChange(pagination.page - 1),
            children: "Prev"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "secondary",
            disabled: pagination.page >= pagination.totalPages,
            onClick: () => onPageChange(pagination.page + 1),
            children: "Next"
          }
        )
      ] })
    ] })
  ] });
}
export {
  EmailList
};

import { jsx, jsxs } from "react/jsx-runtime";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
function DashboardChart({ classificationBreakdown, clientVolume }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: "Responsibility Distribution" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B]", children: "Active inbox split by triage owner" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "h-[190px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: classificationBreakdown,
              dataKey: "value",
              nameKey: "name",
              cx: "50%",
              cy: "50%",
              innerRadius: 48,
              outerRadius: 74,
              paddingAngle: 2,
              children: classificationBreakdown.map((entry) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, entry.key))
            }
          ),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              contentStyle: {
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                fontSize: 12
              }
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: classificationBreakdown.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "h-2.5 w-2.5 rounded-sm shrink-0",
                style: { backgroundColor: item.color }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[#334155] truncate", children: item.name })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-mono tabular-nums font-semibold text-[#0F172A]", children: item.value })
        ] }, item.key)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#E2E8F0] rounded-lg p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[#0F172A]", children: "Client Queue Load" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#64748B]", children: "Pending threads per managed principal" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-[190px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: clientVolume, margin: { top: 8, right: 8, left: -18, bottom: 0 }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#F1F5F9", vertical: false }),
        /* @__PURE__ */ jsx(
          XAxis,
          {
            dataKey: "name",
            tick: { fontSize: 12, fill: "#64748B" },
            axisLine: false,
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            allowDecimals: false,
            tick: { fontSize: 11, fill: "#64748B" },
            axisLine: false,
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            contentStyle: {
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontSize: 12
            }
          }
        ),
        /* @__PURE__ */ jsx(Bar, { dataKey: "assistant", name: "Assistant to Reply", fill: "#2563EB", radius: [4, 4, 0, 0] }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "client", name: "Client to Reply", fill: "#7C3AED", radius: [4, 4, 0, 0] }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "review", name: "Needs Review", fill: "#D97706", radius: [4, 4, 0, 0] })
      ] }) }) })
    ] })
  ] });
}
export {
  DashboardChart
};

import { jsx, jsxs } from "react/jsx-runtime";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { EmailProvider } from "./context/EmailContext";
import { AppRoutes } from "./routes/AppRoutes";
function App() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs(EmailProvider, { children: [
    /* @__PURE__ */ jsx(AppRoutes, {}),
    /* @__PURE__ */ jsx(
      Toaster,
      {
        position: "top-right",
        toastOptions: {
          duration: 3200,
          style: {
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            color: "#0F172A"
          }
        }
      }
    )
  ] }) });
}
export {
  App as default
};

import { Fragment, jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/common/Loader";
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader, { label: "Restoring session..." }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/register", replace: true });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
export {
  ProtectedRoute
};

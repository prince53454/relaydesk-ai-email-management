import { Fragment, jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
function RoleBasedRoute({
  allowedRole,
  children
}) {
  const { user } = useAuth();
  if (!user) return /* @__PURE__ */ jsx(Navigate, { to: "/register", replace: true });
  if (user.role !== allowedRole) {
    return /* @__PURE__ */ jsx(Navigate, { to: user.role === "ASSISTANT" ? "/assistant" : "/client", replace: true });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
export {
  RoleBasedRoute
};

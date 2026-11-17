import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/common/Loader";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";

const lazyPage = (load, name) => lazy(() => load().then((module) => ({ default: module[name] })));

const Login = lazyPage(() => import("../pages/auth/Login.jsx"), "Login");
const OpenExecutiveDemo = lazyPage(() => import("../pages/auth/OpenExecutiveDemo.jsx"), "OpenExecutiveDemo");
const Home = lazyPage(() => import("../pages/Home.jsx"), "Home");
const Register = lazyPage(() => import("../pages/auth/Register.jsx"), "Register");
const OnboardingFlow = lazyPage(() => import("../pages/onboarding/OnboardingFlow.jsx"), "OnboardingFlow");
const AssistantDashboard = lazyPage(() => import("../pages/assistant/AssistantDashboard.jsx"), "AssistantDashboard");
const InboxWorkspace = lazyPage(() => import("../pages/assistant/InboxWorkspace.jsx"), "InboxWorkspace");
const ActionRequiredPage = lazyPage(() => import("../pages/assistant/ActionRequiredPage.jsx"), "ActionRequiredPage");
const MeetingsPage = lazyPage(() => import("../pages/assistant/MeetingsPage.jsx"), "MeetingsPage");
const ClientsPage = lazyPage(() => import("../pages/assistant/ClientsPage.jsx"), "ClientsPage");
const SettingsPage = lazyPage(() => import("../pages/assistant/SettingsPage.jsx"), "SettingsPage");
const ClientDashboard = lazyPage(() => import("../pages/client/ClientDashboard.jsx"), "ClientDashboard");
const ClientSettings = lazyPage(() => import("../pages/client/ClientSettings.jsx"), "ClientSettings");
const NotFound = lazyPage(() => import("../pages/NotFound.jsx"), "NotFound");

function AssistantRoute({ children }) {
  return <ProtectedRoute><RoleBasedRoute allowedRole="ASSISTANT">{children}</RoleBasedRoute></ProtectedRoute>;
}

function ClientRoute({ children }) {
  return <ProtectedRoute><RoleBasedRoute allowedRole="CLIENT">{children}</RoleBasedRoute></ProtectedRoute>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen grid place-items-center bg-[#F8FAFC]"><Loader /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/open-executive-demo" element={<ProtectedRoute><OpenExecutiveDemo /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />
          <Route path="/assistant" element={<AssistantRoute><AssistantDashboard /></AssistantRoute>} />
          <Route path="/assistant/emails" element={<AssistantRoute><InboxWorkspace mode="ALL" /></AssistantRoute>} />
          <Route path="/assistant/assistant-to-reply" element={<AssistantRoute><InboxWorkspace mode="ASSISTANT_TO_REPLY" /></AssistantRoute>} />
          <Route path="/assistant/client-to-reply" element={<AssistantRoute><InboxWorkspace mode="CLIENT_TO_REPLY" /></AssistantRoute>} />
          <Route path="/assistant/no-reply-needed" element={<AssistantRoute><InboxWorkspace mode="NO_REPLY_NEEDED" /></AssistantRoute>} />
          <Route path="/assistant/needs-review" element={<AssistantRoute><InboxWorkspace mode="NEEDS_REVIEW" /></AssistantRoute>} />
          <Route path="/assistant/waiting" element={<AssistantRoute><InboxWorkspace mode="WAITING" /></AssistantRoute>} />
          <Route path="/assistant/important" element={<AssistantRoute><InboxWorkspace mode="IMPORTANT" /></AssistantRoute>} />
          <Route path="/assistant/archived" element={<AssistantRoute><InboxWorkspace mode="ARCHIVED" /></AssistantRoute>} />
          <Route path="/assistant/action-required" element={<AssistantRoute><ActionRequiredPage /></AssistantRoute>} />
          <Route path="/assistant/meetings" element={<AssistantRoute><MeetingsPage /></AssistantRoute>} />
          <Route path="/assistant/clients" element={<AssistantRoute><ClientsPage /></AssistantRoute>} />
          <Route path="/assistant/settings" element={<AssistantRoute><SettingsPage /></AssistantRoute>} />
          <Route path="/client" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
          <Route path="/client/settings" element={<ClientRoute><ClientSettings /></ClientRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export { AppRoutes };

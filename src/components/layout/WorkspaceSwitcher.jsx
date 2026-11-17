import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

function WorkspaceSwitcher() {
  const { user, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState(false);

  const switchTo = async (role) => {
    if (!user || user.role === role || switching) return;
    setSwitching(true);
    try {
      const nextUser = await switchDemoRole(role);
      navigate(nextUser.role === "ASSISTANT" ? "/assistant" : "/client");
    } catch {
      toast.error("Could not switch workspace");
    } finally {
      setSwitching(false);
    }
  };

  if (!user) return null;

  return (
    <div role="group" aria-label="Switch workspace" className="inline-flex shrink-0 rounded-md border border-[#CBD5E1] bg-white p-0.5">
      <button type="button" aria-pressed={user.role === "ASSISTANT"} disabled={switching} onClick={() => switchTo("ASSISTANT")} className={`rounded px-2 py-1.5 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs ${user.role === "ASSISTANT" ? "bg-[#EFF6FF] text-[#1D4ED8]" : "text-[#475569] hover:bg-[#F8FAFC]"}`}>Executive</button>
      <button type="button" aria-pressed={user.role === "CLIENT"} disabled={switching} onClick={() => switchTo("CLIENT")} className={`rounded px-2 py-1.5 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs ${user.role === "CLIENT" ? "bg-[#F5F3FF] text-[#6D28D9]" : "text-[#475569] hover:bg-[#F8FAFC]"}`}>Client</button>
    </div>
  );
}

export { WorkspaceSwitcher };

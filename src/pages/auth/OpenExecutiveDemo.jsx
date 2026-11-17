import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";

function OpenExecutiveDemo() {
  const { switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    switchDemoRole("ASSISTANT")
      .then(() => navigate("/assistant", { replace: true }))
      .catch(() => {
        toast.error("Could not open the Executive workspace");
        navigate("/client", { replace: true });
      });
  }, [navigate, switchDemoRole]);

  return <div className="min-h-screen grid place-items-center bg-[#F8FAFC]"><Loader label="Opening Executive workspace..." /></div>;
}

export { OpenExecutiveDemo };

import { useContext } from "react";
import { EmailContext } from "../context/EmailContext";
function useEmails() {
  const ctx = useContext(EmailContext);
  if (!ctx) throw new Error("useEmails must be used inside EmailProvider");
  return ctx;
}
export {
  useEmails
};

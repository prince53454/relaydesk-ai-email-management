import { z } from "zod";
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Valid email address is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  // Public sign-up creates client accounts only. Assistant accounts are provisioned by an administrator.
  role: z.literal("CLIENT").default("CLIENT"),
  title: z.string().max(80).optional(),
  timezone: z.string().max(60).optional()
});
const loginSchema = z.object({
  email: z.string().email("Valid email address is required"),
  password: z.string().min(1, "Password is required")
});
const onboardingSchema = z.object({
  role: z.enum(["ASSISTANT", "CLIENT"]).optional(),
  provider: z.enum(["GMAIL", "OUTLOOK"]).optional(),
  emailAddress: z.string().email().optional(),
  displayName: z.string().max(80).optional(),
  timezone: z.string().max(60).optional(),
  complete: z.boolean().optional()
});
export {
  loginSchema,
  onboardingSchema,
  registerSchema
};

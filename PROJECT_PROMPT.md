# RelayDesk project prompt

Build and maintain RelayDesk, a polished, mobile-responsive MERN-style prototype for personal assistants managing executive email, based on the SANKAR GROUP AI Full-Stack Engineer Intern assignment.

## Product

RelayDesk helps executive assistants manage multiple client inboxes. It separates routine work from decisions needing the executive, classifies conversations as Assistant to Reply, Client to Reply, No Reply Needed, or Needs Review, and gives clients a minimal portal for decisions and assistant handover.

## Existing implementation

- React, Vite, Tailwind CSS, Express, and MongoDB-compatible persistence (with a local JSON store for demos).
- Authenticated assistant and client experiences; onboarding; segmented inbox; search and filters; conversation detail; classification overrides; summaries; reply drafting; actions and meetings; inbox Copilot; responsive layouts.
- Gmail and Microsoft 365 OAuth adapters are implemented. OAuth credentials must be supplied by the developer in `.env`; never ask users for mailbox passwords or put credentials in source control.
- With OAuth configured, use the provider consent flow, encrypt tokens at rest, sync recent messages, and classify imported conversations. Clearly label demo connections when credentials are absent. Simulated inboxes must never be represented as real mailbox access.
- AI may use Gemini when `GEMINI_API_KEY` is configured and deterministic grounded fallbacks otherwise. Replies are drafted for user review; do not send generated content without explicit user action.

## Engineering expectations

Preserve the existing component and service architecture. Prioritize complete, coherent user journeys and clear loading, empty, error, and success feedback. Keep assistant and client access properly scoped. Never expose secrets in frontend code, logs, examples, or generated documentation. Make changes in the existing stack and verify with `npm run check` when implementation changes warrant it.

## Assignment priorities

1. Clear onboarding and email authorization/connection status.
2. Assistant dashboard with useful inbox counts, segments, search, and filters.
3. Automatic response-responsibility classification with manual correction and low-confidence review.
4. Minimal client view for client-response threads, original conversation, handled status, and assistant takeover.
5. Conversation reading and management: important, unread, archive, completion, and reply review.
6. Useful AI summaries, action/meeting extraction, reply drafts, and grounded inbox questions.
7. Professional, accessible, mobile-responsive visual design.

Treat this as a functional prototype. Use sample data or simulated connections only when live integrations are unavailable, and state that limitation accurately.

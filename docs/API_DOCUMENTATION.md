# RelayDesk REST API Documentation

All endpoints return `{ success: boolean, message: string, data: ... }`. Protected endpoints require `Authorization: Bearer <token>`.

## Authentication
- `POST /api/auth/register` — Register ASSISTANT or CLIENT account
- `POST /api/auth/login` — Sign in and receive JWT
- `GET /api/auth/me` — Verify active JWT and return user profile
- `POST /api/auth/logout` — Log sign-out activity
- `POST /api/auth/onboarding` — Save onboarding step & simulated mailbox connection

## Dashboard
- `GET /api/dashboard/stats` — Live sidebar & KPI counters
- `GET /api/dashboard/activity` — Recent workspace activity log
- `GET /api/dashboard/overview` — Full overview payload (stats, charts, priority inbox, meetings, follow-ups, daily summary)

## Email Management
- `GET /api/emails` — Filter (`classification`, `clientId`, `search`, `unread`, `important`, `archived`, `status`, `priority`), sort, and paginate
- `GET /api/emails/:id` — Conversation details, full message history, linked actions & meetings
- `PATCH /api/emails/:id` — Update flags (`isImportant`, `isUnread`, `priority`, `status`)
- `PATCH /api/emails/:id/classification` — Manual override with precedence & audit history
- `PATCH /api/emails/:id/archive` — Archive / restore conversation
- `PATCH /api/emails/:id/read` — Toggle read/unread
- `PATCH /api/emails/:id/complete` — Mark matter handled / reopen
- `POST /api/emails/:id/reply` — Append simulated outbound reply & update thread status
- `POST /api/emails/:id/takeover` — Client-to-assistant handover
- `POST /api/emails/:id/note` — Add internal note or instruction

## AI Intelligence
- `POST /api/ai/classify` — AI classification (`ASSISTANT_TO_REPLY | CLIENT_TO_REPLY | NO_REPLY_NEEDED | NEEDS_REVIEW`)
- `POST /api/ai/summarize` — Structured briefing regeneration
- `POST /api/ai/draft-reply` — Generate or rewrite drafts (`GENERATE`, `SHORTER`, `FORMAL`, `FRIENDLIER`, `IMPROVE_GRAMMAR`, `REWRITE`, `CUSTOM`)
- `POST /api/ai/extract-actions` — Extract follow-up tasks and meeting requests into DB
- `POST /api/ai/chat` — Database-grounded AI Copilot with thread references

## Clients, Actions, Meetings, Accounts & Settings
- `GET/POST /api/clients`, `GET/PATCH /api/clients/:id`
- `GET/POST /api/actions`, `PATCH /api/actions/:id`
- `GET/POST /api/meetings`, `PATCH /api/meetings/:id`
- `GET /api/accounts`, `POST /api/accounts/connect`, `POST /api/accounts/:id/sync`, `DELETE /api/accounts/:id`
- `PATCH /api/users/settings`

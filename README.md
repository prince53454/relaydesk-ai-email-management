# RelayDesk — AI Personal Assistant Email Management Platform

RelayDesk is a full-stack intelligent email management platform built for Personal Assistants and their Executive Clients. It automatically classifies conversation ownership (`ASSISTANT_TO_REPLY`, `CLIENT_TO_REPLY`, `NO_REPLY_NEEDED`, `NEEDS_REVIEW`), generates structured executive summaries, drafts context-aware replies, extracts meetings & action items, and provides a dedicated Client Portal for approvals and instant assistant handover.

## Demo Login Credentials

### Personal Assistants
- **Elena Vance** (Senior Executive Assistant — Victoria Sterling & David Thorne)
  - Email: `elena@relaydesk.ai`
  - Password: `DemoPass123!`
- **Marcus Chen** (Executive Chief of Staff — Aria Kapoor)
  - Email: `marcus@relaydesk.ai`
  - Password: `DemoPass123!`

### Executive Clients
- **Victoria Sterling** (Managing Partner, Sterling Ventures)
  - Email: `victoria@sterlingventures.com`
  - Password: `ClientPass123!`
- **David Thorne** (Managing Director, Thorne Capital Group)
  - Email: `david@thornecapital.com`
  - Password: `ClientPass123!`
- **Aria Kapoor** (Founder & CEO, Lumina Health AI)
  - Email: `aria@luminahealth.ai`
  - Password: `ClientPass123!`

## Setup & Commands

```bash
# Install dependencies
npm install

# Create a local .env file and set the variables listed below

# Run full-stack development server (Express API + Vite on port 3000)
npm run dev

# Build production frontend bundle
npm run build

# Validate the production frontend build and Node server syntax
npm run check

# Run backend API integration checks
npm run test:integration

# Re-seed database
npm run seed -- --force
```

## Environment Variables
Create a local `.env` file and set the variables you need:
- `PORT=3000`
- `APP_URL=http://localhost:3000` (the browser origin allowed by the API)
- `MONGODB_URI=` (Optional; connects to MongoDB Atlas if set, otherwise persists locally to `.data/relaydesk.json`)
- `JWT_SECRET=` (Use a long, random secret outside local demo development)
- `GEMINI_API_KEY=` (Optional for live Gemini calls; uses a deterministic fallback when absent)
- `GOOGLE_CLIENT_ID=` and `GOOGLE_CLIENT_SECRET=` (Enable Gmail OAuth)
- `MICROSOFT_CLIENT_ID=` and `MICROSOFT_CLIENT_SECRET=` (Enable Microsoft 365 OAuth; optional `MICROSOFT_TENANT_ID=common`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` (Send a welcome email after registration)

Registration welcome emails use Nodemailer. Configure SMTP using `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`; for Gmail SMTP, use an App Password (requires 2-Step Verification), not your normal password or OAuth client secret. Alternatively, set `REGISTRATION_EMAIL_FROM` to a Gmail address that has already been connected live in RelayDesk; Nodemailer will use its stored Gmail OAuth refresh token and the existing `gmail.send` permission. Restart the server after changing `.env`. Other SMTP providers can use their own host, port, TLS, and credentials.

OAuth credentials must be created in your own Google Cloud / Microsoft Entra developer accounts. `.env.example` is a blank template and is not loaded by the server. Without provider credentials, the app explicitly creates a simulated demo connection; it cannot read a real mailbox. For live sync, configure the provider credentials in `.env`, set the matching `APP_URL`, register the callback URLs below, restart the server, then connect the mailbox from onboarding or Workspace Settings. The first successful OAuth callback imports and classifies recent messages.

Register these OAuth redirect URIs with the providers, matching `APP_URL`:
- Google: `{APP_URL}/api/accounts/oauth/callback/google`
- Microsoft: `{APP_URL}/api/accounts/oauth/callback/microsoft`

The local JSON store and seeded users make the demo usable without MongoDB or an AI key. To connect MongoDB, set `MONGODB_URI` to a database URI before starting the server. Do not commit `.env`.

## Deploying to Render

The repository includes `render.yaml` for a single full-stack Render web service. Connect the GitHub repository as a Blueprint; Render generates `JWT_SECRET` and keeps `.env` values out of GitHub. Set `MONGODB_URI` in the Render service environment to a MongoDB Atlas connection string for persistent production data. Without MongoDB, the local `.data` store is ephemeral on Render and can be lost when the service restarts or redeploys. `APP_URL` defaults to Render's `RENDER_EXTERNAL_URL`; set it explicitly only when using a custom domain. If you configure live Gmail or Microsoft OAuth, add that deployed URL's callback URLs from the section below to each provider's app settings.

## Development Modes
- `npm run dev` starts the combined Express API and Vite development server.
- `npm run dev:client` starts Vite only (the API must be running separately at the configured origin/proxy).
- `npm run dev:server` starts the API/server entry point.
- `npm run build` creates the production frontend bundle. `npm start` serves that bundle and the API when `NODE_ENV=production`.
- `npm run seed -- --force` resets and repopulates the configured demo data store; it overwrites existing demo data.

The frontend uses React, JSX, and Vite. The backend uses JavaScript ES modules with Express and is launched by `server.js`; the frontend source lives in `src` and backend source in `server/src`. This repository uses one root package and combined development server rather than separate `client` and `server` npm packages.

Public registration is for executive client accounts. Assistant accounts in the demo are provisioned seed accounts; assistant role assignment is not available through public registration.

## Email Connections
- Gmail and Microsoft 365 connect through provider OAuth; the app never requests email passwords.
- OAuth tokens are encrypted at rest. Connected inbox sync imports recent messages into the workspace, and replies on imported conversations send through the connected provider.
- When provider credentials are not configured, the app offers a clearly labeled simulated demo connection for previews. Demo mode does not access external email.

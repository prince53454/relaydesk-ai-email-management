# Google OAuth verification preparation

This document records the current RelayDesk Gmail integration and the remaining work for Google OAuth verification. It is a preparation checklist, not evidence that Google has approved the app.

## Current integration

- OAuth client: configured through `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.
- Callback (local development): `http://localhost:3000/api/accounts/oauth/callback/google`.
- Requested scopes:
  - `openid`, `email`, `profile` to identify the Google account.
  - `https://www.googleapis.com/auth/gmail.readonly` to import and read mail for inbox triage, classification, summaries, and reply drafting.
  - `https://www.googleapis.com/auth/gmail.send` to send a reply after a user submits it in RelayDesk.
- Imported email content and OAuth credentials are stored by the RelayDesk server. OAuth tokens are encrypted using AES-256-GCM with a key derived from `JWT_SECRET`.
- When a Gemini API key is configured, email content is sent to the configured Gemini API for classification, summaries, or draft generation. Without a key, deterministic local fallback behavior is used.
- The Gmail connection imports recent messages and stores message bodies in the app database. Disconnecting the mailbox currently removes the connection record; it does not remove the already imported conversation and message records.

## Google Cloud configuration

For local testing, add each account under **Google Auth Platform → Audience → Test users** while the app is in Testing.

For a public app, configure the OAuth audience as External, use a production HTTPS origin, and register:

`{APP_URL}/api/accounts/oauth/callback/google`

Do not use `localhost` in a production OAuth client. The homepage, privacy policy, terms, and OAuth callback must use the production domain. Verify that domain in Google Search Console and list it in the OAuth branding configuration.

## Verification requirements to plan for

1. A production website on a domain the project owner controls.
2. Public homepage, privacy policy, and terms of service on that domain.
3. A support contact and developer contact in Google Auth Platform branding.
4. Accurate OAuth consent screen branding and an explanation for every requested scope.
5. A video demonstrating the complete OAuth flow and the Gmail features that use each scope.
6. Google review of Gmail scopes. `gmail.readonly` is restricted; because RelayDesk's server stores imported message data, Google may require an independent security assessment for production access. Confirm the current assessment requirement and cost with Google's verification flow before committing to launch costs.
7. Production security configuration: strong unique `JWT_SECRET`, rotated Google client secret, HTTPS, production database and backups, documented data retention/deletion, and a deployed privacy contact process.

## Open items before submission

- Production app domain / `APP_URL`:
- Public support email:
- Public privacy policy URL:
- Public terms URL:
- Privacy/data deletion contact and retention period:
- Hosting and database location/provider:
- Confirm whether Gemini processing is enabled in production and which model/provider is used:
- Verification video URL:
- Google security assessment requirement and vendor/cost, if Google requires it:

Do not submit guessed or placeholder details. Google requires the public disclosures and the actual deployed behavior to match.

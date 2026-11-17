# RelayDesk Architecture

## Overview
RelayDesk is a full-stack JavaScript MERN application connecting Executive Assistants and Clients through a shared, role-isolated database and server-side Gemini AI intelligence layer. The React frontend uses JSX and Vite; Express and its services use JavaScript ES modules.

## Layers
1. **Frontend (`src/`)**: React 19, Vite, Tailwind CSS v4, React Router DOM, Recharts, Axios, Lucide icons.
2. **API & Middleware (`server/src/`)**: Express.js REST API, JWT authentication (`jsonwebtoken`), bcrypt password hashing, Zod validation, express-rate-limit, and strict per-client access isolation (`accessService.js`).
3. **Database Layer (`server/src/models/`, `server/src/repositories/`)**: Mongoose schemas (`User`, `Client`, `EmailAccount`, `Conversation`, `Message`, `Action`, `Meeting`, `Activity`) with automatic fallback to an atomic persistent disk store (`.data/relaydesk.json`) when `MONGODB_URI` is not supplied.
4. **AI Service Abstraction (`server/src/services/ai/`)**: Uses `@google/genai` (`gemini-4-hydrogen`) exclusively server-side with structured JSON schemas (`Type.OBJECT`) and explicit fallback labeling (`AI_FALLBACK`) if no API key is active.
5. **Email Integration Abstraction (`server/src/services/email/`)**: Adapter interfaces for Google Workspace (Gmail) and Microsoft 365 (Outlook) clearly separating simulated demo connections from live OAuth flows.

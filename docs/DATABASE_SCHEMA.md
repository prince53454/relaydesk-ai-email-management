# RelayDesk Database Schema

Defined as Mongoose schemas in `server/src/models/`:

1. **User**: `name`, `email` (unique indexed), `password` (bcrypt), `role` (`ASSISTANT` | `CLIENT`), `avatar`, `title`, `timezone`, `onboardingCompleted`, `preferences`.
2. **Client**: `name`, `email`, `company`, `roleTitle`, `avatar`, `assistantId` (ref User), `userId` (ref User), `vipSenders`, `notes`.
3. **EmailAccount**: `userId`, `clientId`, `provider` (`GMAIL` | `OUTLOOK`), `emailAddress`, `connectionStatus`, `isSimulated`, `lastSyncedAt`.
4. **Conversation**: `emailAccountId`, `clientId`, `subject`, `snippet`, `sender`, `participants`, `classification`, `confidence`, `confidenceBand`, `classificationReason`, `classificationSource`, `manualOverride`, `suggestedAction`, `suggestedDraft`, `summary` (structured briefing), `priority`, `status`, `assignedTo`, `requiresResponse`, `isImportant`, `isUnread`, `isArchived`, `classificationHistory`, `internalNotes`, `lastMessageAt`. Compound index on `{ clientId, classification, isArchived }`.
5. **Message**: `conversationId` (indexed), `sender`, `recipients`, `body`, `direction`, `isSimulatedSend`, `receivedAt`, `attachments`.
6. **Action**: `conversationId`, `clientId`, `title`, `description`, `dueDate`, `priority`, `status`, `assignedTo`, `sourceType`.
7. **Meeting**: `conversationId`, `clientId`, `title`, `date`, `time`, `timezone`, `durationMinutes`, `participants`, `location`, `status`.
8. **Activity**: `userId`, `userName`, `userRole`, `clientId`, `conversationId`, `action`, `description`, `timestamp`.

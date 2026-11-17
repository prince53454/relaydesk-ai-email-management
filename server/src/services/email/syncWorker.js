import { dataStore } from "../../repositories/dataStore.js";
import { logger } from "../../utils/logger.js";
import { syncEmailAccount } from "./syncService.js";

function startEmailSyncWorker(intervalMs = 60_000) {
  let syncing = false;
  const syncNewMessages = async () => {
    if (syncing) return;
    syncing = true;
    try {
      const accounts = (await dataStore.listEmailAccounts()).filter((account) => !account.isSimulated && account.connectionStatus === "CONNECTED_OAUTH");
      for (const account of accounts) {
        try {
          await syncEmailAccount(account.id, { incremental: true });
        } catch (error) {
          logger.warn(`Automatic email sync failed for account ${account.id}`, error);
        }
      }
    } catch (error) {
      logger.warn("Could not load accounts for automatic email sync", error);
    } finally {
      syncing = false;
    }
  };

  void syncNewMessages();
  const timer = setInterval(syncNewMessages, intervalMs);
  timer.unref?.();
  return timer;
}

export { startEmailSyncWorker };

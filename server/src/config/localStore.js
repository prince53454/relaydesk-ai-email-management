import fs from "fs";
import path from "path";
const DATA_DIR = path.resolve(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "relaydesk.json");
const EMPTY_STORE = {
  users: [],
  clients: [],
  emailAccounts: [],
  conversations: [],
  messages: [],
  actions: [],
  meetings: [],
  activities: []
};
let memoryCache = null;
function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}
function loadLocalStore() {
  if (memoryCache) return memoryCache;
  ensureDir();
  if (!fs.existsSync(DATA_FILE)) {
    memoryCache = structuredClone(EMPTY_STORE);
    saveLocalStore(memoryCache);
    return memoryCache;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    memoryCache = {
      users: parsed.users || [],
      clients: parsed.clients || [],
      emailAccounts: parsed.emailAccounts || [],
      conversations: parsed.conversations || [],
      messages: parsed.messages || [],
      actions: parsed.actions || [],
      meetings: parsed.meetings || [],
      activities: parsed.activities || []
    };
    return memoryCache;
  } catch {
    memoryCache = structuredClone(EMPTY_STORE);
    saveLocalStore(memoryCache);
    return memoryCache;
  }
}
function saveLocalStore(data) {
  ensureDir();
  memoryCache = data;
  const tmpFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpFile, DATA_FILE);
}
function resetLocalStore() {
  memoryCache = structuredClone(EMPTY_STORE);
  saveLocalStore(memoryCache);
}
export {
  loadLocalStore,
  resetLocalStore,
  saveLocalStore
};

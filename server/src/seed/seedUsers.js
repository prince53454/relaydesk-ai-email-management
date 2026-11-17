import bcrypt from "bcryptjs";
const SEED_IDS = {
  users: {
    elena: "usr_elena_vance_01",
    marcus: "usr_marcus_chen_02",
    victoria: "usr_victoria_03",
    david: "usr_david_thorne_04",
    aria: "usr_aria_kapoor_05"
  },
  clients: {
    victoria: "cli_victoria_01",
    david: "cli_david_02",
    aria: "cli_aria_03"
  },
  accounts: {
    victoriaGmail: "acc_victoria_gmail",
    davidOutlook: "acc_david_outlook",
    ariaGmail: "acc_aria_gmail"
  }
};
async function buildSeedUsersAndClients() {
  const assistantHash = await bcrypt.hash("DemoPass123!", 10);
  const clientHash = await bcrypt.hash("ClientPass123!", 10);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const users = [
    {
      id: SEED_IDS.users.elena,
      name: "Elena Vance",
      email: "elena@relaydesk.ai",
      password: assistantHash,
      role: "ASSISTANT",
      avatar: "elena",
      title: "Senior Executive Assistant",
      timezone: "America/Los_Angeles",
      onboardingCompleted: true,
      preferences: {
        autoClassify: true,
        digestFrequency: "DAILY",
        density: "COMPACT",
        defaultTone: "PROFESSIONAL"
      },
      createdAt: now,
      updatedAt: now
    },
    {
      id: SEED_IDS.users.marcus,
      name: "Marcus Chen",
      email: "marcus@relaydesk.ai",
      password: assistantHash,
      role: "ASSISTANT",
      avatar: "marcus",
      title: "Executive Chief of Staff",
      timezone: "America/New_York",
      onboardingCompleted: true,
      preferences: {
        autoClassify: true,
        digestFrequency: "REALTIME",
        density: "COMPACT",
        defaultTone: "CONCISE"
      },
      createdAt: now,
      updatedAt: now
    },
    {
      id: SEED_IDS.users.victoria,
      name: "Victoria Sterling",
      email: "victoria@sterlingventures.com",
      password: clientHash,
      role: "CLIENT",
      avatar: "victoria",
      title: "Managing Partner",
      timezone: "America/Los_Angeles",
      onboardingCompleted: true,
      preferences: {
        autoClassify: true,
        digestFrequency: "DAILY",
        density: "COMFORTABLE",
        defaultTone: "PROFESSIONAL"
      },
      createdAt: now,
      updatedAt: now
    },
    {
      id: SEED_IDS.users.david,
      name: "David Thorne",
      email: "david@thornecapital.com",
      password: clientHash,
      role: "CLIENT",
      avatar: "david",
      title: "Managing Director",
      timezone: "America/New_York",
      onboardingCompleted: true,
      preferences: {
        autoClassify: true,
        digestFrequency: "DAILY",
        density: "COMFORTABLE",
        defaultTone: "CONCISE"
      },
      createdAt: now,
      updatedAt: now
    },
    {
      id: SEED_IDS.users.aria,
      name: "Aria Kapoor",
      email: "aria@luminahealth.ai",
      password: clientHash,
      role: "CLIENT",
      avatar: "aria",
      title: "Founder & CEO",
      timezone: "America/Los_Angeles",
      onboardingCompleted: true,
      preferences: {
        autoClassify: true,
        digestFrequency: "REALTIME",
        density: "COMFORTABLE",
        defaultTone: "WARM"
      },
      createdAt: now,
      updatedAt: now
    }
  ];
  const clients = [
    {
      id: SEED_IDS.clients.victoria,
      name: "Victoria Sterling",
      email: "victoria@sterlingventures.com",
      company: "Sterling Ventures",
      roleTitle: "Managing Partner",
      avatar: "victoria",
      assistantId: SEED_IDS.users.elena,
      userId: SEED_IDS.users.victoria,
      vipSenders: ["board@meridianbio.com", "counsel@cooley.com", "lp-relations@calpers.gov"],
      notes: "Prioritize LP communications, term sheets, and board prep. Elena handles all travel and calendar requests.",
      createdAt: now
    },
    {
      id: SEED_IDS.clients.david,
      name: "David Thorne",
      email: "david@thornecapital.com",
      company: "Thorne Capital Group",
      roleTitle: "Managing Director",
      avatar: "david",
      assistantId: SEED_IDS.users.elena,
      userId: SEED_IDS.users.david,
      vipSenders: ["m.alvarez@goldmansachs.com", "audit@deloitte.com"],
      notes: "Prefers concise bullet summaries for investment memos. Never auto-confirm Friday afternoon meetings.",
      createdAt: now
    },
    {
      id: SEED_IDS.clients.aria,
      name: "Aria Kapoor",
      email: "aria@luminahealth.ai",
      company: "Lumina Health AI",
      roleTitle: "Founder & CEO",
      avatar: "aria",
      assistantId: SEED_IDS.users.marcus,
      userId: SEED_IDS.users.aria,
      vipSenders: ["fda-liaison@luminahealth.ai", "series-b@sequoia.com"],
      notes: "Series B diligence active. Flag clinical partnership approvals immediately.",
      createdAt: now
    }
  ];
  const emailAccounts = [
    {
      id: SEED_IDS.accounts.victoriaGmail,
      userId: SEED_IDS.users.elena,
      clientId: SEED_IDS.clients.victoria,
      provider: "GMAIL",
      emailAddress: "victoria@sterlingventures.com",
      displayName: "Victoria Sterling (Google Workspace)",
      connectionStatus: "CONNECTED_DEMO",
      isSimulated: true,
      lastSyncedAt: now,
      createdAt: now
    },
    {
      id: SEED_IDS.accounts.davidOutlook,
      userId: SEED_IDS.users.elena,
      clientId: SEED_IDS.clients.david,
      provider: "OUTLOOK",
      emailAddress: "david@thornecapital.com",
      displayName: "David Thorne (Microsoft 365)",
      connectionStatus: "CONNECTED_DEMO",
      isSimulated: true,
      lastSyncedAt: now,
      createdAt: now
    },
    {
      id: SEED_IDS.accounts.ariaGmail,
      userId: SEED_IDS.users.marcus,
      clientId: SEED_IDS.clients.aria,
      provider: "GMAIL",
      emailAddress: "aria@luminahealth.ai",
      displayName: "Aria Kapoor (Google Workspace)",
      connectionStatus: "CONNECTED_DEMO",
      isSimulated: true,
      lastSyncedAt: now,
      createdAt: now
    }
  ];
  return { users, clients, emailAccounts };
}
export {
  SEED_IDS,
  buildSeedUsersAndClients
};

import { SEED_IDS } from "./seedUsers.js";
function hoursAgo(h) {
  return new Date(Date.now() - h * 60 * 60 * 1e3).toISOString();
}
function daysFromNow(d) {
  return new Date(Date.now() + d * 24 * 60 * 60 * 1e3).toISOString();
}
function dateFromNow(d) {
  return new Date(Date.now() + d * 24 * 60 * 60 * 1e3).toISOString().slice(0, 10);
}
const RAW_THREADS = [
  // VICTORIA STERLING (12 threads managed by Elena)
  {
    id: "conv_01",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Final Sign-Off: Northstar Robotics Series A Term Sheet ($14M Lead)",
    senderName: "Julian Vance-Houghton",
    senderEmail: "jvance@cooley.com",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.96,
    reason: "Legal counsel requires Victoria\u2019s direct approval on the revised liquidation preference and pro-rata side letter before countersigning.",
    summaryOverview: "Cooley LLP has circulated the clean execution copy of the Northstar Robotics Series A term sheet incorporating the 1x non-participating preference.",
    requests: ["Confirm approval of Section 4.2 pro-rata side letter", "Authorize signature release by 4:00 PM PT"],
    deadlines: ["Today 4:00 PM PT"],
    suggestedAction: "Present side-letter summary to Victoria for immediate sign-off.",
    priority: "URGENT",
    status: "OPEN",
    isImportant: true,
    isUnread: true,
    labels: ["Deal Flow", "Legal"],
    hoursOffset: 1.5,
    messages: [
      {
        fromName: "Julian Vance-Houghton",
        fromEmail: "jvance@cooley.com",
        direction: "INBOUND",
        hoursOffset: 5,
        body: "Hi Victoria,\n\nNorthstar\u2019s counsel pushed back lightly on the information rights threshold, proposing $2M rather than $1M for major investor status. Everything else matches your investment committee memo."
      },
      {
        fromName: "Julian Vance-Houghton",
        fromEmail: "jvance@cooley.com",
        direction: "INBOUND",
        hoursOffset: 1.5,
        body: "Update: Founders accepted our $1M threshold compromise. Attached is the clean execution PDF and pro-rata side letter.\n\nPlease confirm you approve releasing your signature block before 4:00 PM PT today so we can lock the round before tomorrow\u2019s board call."
      }
    ]
  },
  {
    id: "conv_02",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Request to reschedule tomorrow\u2019s Meridian Bio diligence sync",
    senderName: "Clara Reynolds",
    senderEmail: "creynolds@meridianbio.com",
    classification: "ASSISTANT_TO_REPLY",
    confidence: 0.94,
    reason: "Routine calendar rescheduling request that Elena can coordinate directly against Victoria\u2019s schedule.",
    summaryOverview: "Meridian Bio asks to move tomorrow\u2019s 10:00 AM diligence call to Thursday afternoon or Friday morning due to a lab audit.",
    requests: ["Move tomorrow 10:00 AM PT meeting to Thu 2:00 PM PT or Fri 9:30 AM PT"],
    deadlines: ["Before tomorrow 10:00 AM PT"],
    suggestedAction: "Confirm Thursday 2:00 PM PT slot and update calendar invite.",
    priority: "HIGH",
    status: "OPEN",
    isImportant: false,
    isUnread: true,
    labels: ["Scheduling"],
    hoursOffset: 2.2,
    messages: [
      {
        fromName: "Clara Reynolds",
        fromEmail: "creynolds@meridianbio.com",
        direction: "INBOUND",
        hoursOffset: 2.2,
        body: "Hi Elena & Victoria,\n\nOur clinical director was pulled into an unscheduled lab audit tomorrow morning. Would it be possible to move tomorrow\u2019s 10:00 AM PT diligence sync to either Thursday at 2:00 PM PT or Friday at 9:30 AM PT?\n\nApologies for the short notice!"
      }
    ]
  },
  {
    id: "conv_03",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "CalPERS Annual LP Summit \u2014 Keynote Panel Confirmation & Bio",
    senderName: "Margaret Okafor",
    senderEmail: "mokafor@calpers-summit.org",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.89,
    reason: "Requires Victoria\u2019s personal confirmation on keynote talking points and fireside topic selection.",
    summaryOverview: "CalPERS summit organizers need Victoria to choose between two panel themes and confirm whether she wants a 15-minute LP Q&A.",
    requests: ["Select preferred panel theme (AI Infrastructure vs DeepTech Liquidity)", "Approve bio copy"],
    deadlines: ["Friday EOD"],
    suggestedAction: "Confirm Victoria\u2019s preferred panel angle and return approved bio.",
    priority: "HIGH",
    status: "OPEN",
    isImportant: true,
    isUnread: true,
    labels: ["LP Relations", "Speaking"],
    hoursOffset: 4,
    messages: [
      {
        fromName: "Margaret Okafor",
        fromEmail: "mokafor@calpers-summit.org",
        direction: "INBOUND",
        hoursOffset: 4,
        body: 'Dear Victoria,\n\nWe are finalizing the LP Summit program for next month. Could you let us know whether you prefer to anchor the "AI Infrastructure Capital Cycles" panel or the "DeepTech Secondary Liquidity" fireside? Also let us know if you are comfortable with an open 15-minute LP Q&A.'
      }
    ]
  },
  {
    id: "conv_04",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "London & Zurich Flight Options + Claridge\u2019s Reservation Hold",
    senderName: "Amex Centurion Travel",
    senderEmail: "concierge@centuriontravel.com",
    classification: "ASSISTANT_TO_REPLY",
    confidence: 0.95,
    reason: "Travel itinerary confirmation and hotel hold release fall under standard executive assistant logistics.",
    summaryOverview: "Amex Travel holds BA284 SFO-LHR business class seats and a 3-night suite at Claridge\u2019s until 6:00 PM tonight.",
    requests: ["Confirm seat 4A on BA284 and guarantee Claridge\u2019s reservation"],
    deadlines: ["Today 6:00 PM PT"],
    suggestedAction: "Ticket BA284 and confirm Claridge\u2019s room block using corporate card on file.",
    priority: "HIGH",
    status: "OPEN",
    isImportant: false,
    isUnread: true,
    labels: ["Travel"],
    hoursOffset: 5,
    messages: [
      {
        fromName: "Amex Centurion Travel",
        fromEmail: "concierge@centuriontravel.com",
        direction: "INBOUND",
        hoursOffset: 5,
        body: "Hello Elena,\n\nPer your request for Victoria\u2019s Europe LP roadshow, we have placed a courtesy hold on BA284 departing Nov 19 at 5:15 PM (Seat 4A) and 3 nights at Claridge\u2019s Mayfair. Please confirm ticketing before 6:00 PM PT today so the fare lock does not expire."
      }
    ]
  },
  {
    id: "conv_05",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Regarding the Q4 proposal we discussed earlier",
    senderName: "Henrik Lindqvist",
    senderEmail: "henrik@nordicgrid.io",
    classification: "NEEDS_REVIEW",
    confidence: 0.54,
    reason: 'Ambiguous message referencing an unspecified "Q4 proposal" without attachments or clear action owner.',
    summaryOverview: 'Henrik asks for feedback on "the Q4 proposal" with no attached document or prior email context in this thread.',
    requests: ["Clarify which Q4 proposal Henrik is referring to"],
    deadlines: [],
    suggestedAction: "Check CRM / prior threads to determine if this is an intro or active co-investment.",
    priority: "MEDIUM",
    status: "OPEN",
    isImportant: false,
    isUnread: true,
    labels: ["Triage"],
    hoursOffset: 6.5,
    messages: [
      {
        fromName: "Henrik Lindqvist",
        fromEmail: "henrik@nordicgrid.io",
        direction: "INBOUND",
        hoursOffset: 6.5,
        body: "Victoria,\n\nFollowing up on the Q4 proposal we discussed \u2014 let me know your thoughts on structure and whether we should loop in your team this week.\n\nBest,\nHenrik"
      }
    ]
  },
  {
    id: "conv_06",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "PitchBook Weekly Venture Monitor \u2014 Q4 Liquidity Brief",
    senderName: "PitchBook Research",
    senderEmail: "newsletter@pitchbook.com",
    classification: "NO_REPLY_NEEDED",
    confidence: 0.98,
    reason: "Automated industry newsletter requiring no response.",
    summaryOverview: "Weekly venture capital market digest covering Q4 Series A/B valuation multiples.",
    requests: [],
    deadlines: [],
    suggestedAction: "No reply needed; archive after review.",
    priority: "LOW",
    status: "COMPLETED",
    isImportant: false,
    isUnread: false,
    labels: ["Newsletter"],
    hoursOffset: 8,
    messages: [
      {
        fromName: "PitchBook Research",
        fromEmail: "newsletter@pitchbook.com",
        direction: "INBOUND",
        hoursOffset: 8,
        body: "This week in Venture: AI infrastructure multiples expanded 14% QoQ while median Series B timelines lengthened to 22 months. Read the full quarterly report on PitchBook."
      }
    ]
  },
  {
    id: "conv_07",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Private Dinner Seating & Dietary Preferences \u2014 Rosewood Sand Hill",
    senderName: "Sophia Laurent",
    senderEmail: "slaurent@rosewoodhotels.com",
    classification: "ASSISTANT_TO_REPLY",
    confidence: 0.92,
    reason: "Event logistics and menu confirmation for client dinner.",
    summaryOverview: "Rosewood events desk requests final headcount (10 guests) and dietary notes for next Wednesday\u2019s founder dinner.",
    requests: ["Confirm final guest count of 10 and submit dietary restrictions"],
    deadlines: ["Monday 12:00 PM PT"],
    suggestedAction: "Send confirmed attendee list and Victoria\u2019s pescatarian preference.",
    priority: "MEDIUM",
    status: "OPEN",
    isImportant: false,
    isUnread: false,
    labels: ["Hospitality"],
    hoursOffset: 11,
    messages: [
      {
        fromName: "Sophia Laurent",
        fromEmail: "slaurent@rosewoodhotels.com",
        direction: "INBOUND",
        hoursOffset: 11,
        body: "Hi Elena,\n\nLooking forward to hosting Sterling Ventures\u2019 private dining room next Wednesday at 7:00 PM. Could you confirm final headcount and any allergies by Monday noon?"
      }
    ]
  },
  {
    id: "conv_08",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Board Observer Seat Nomination \u2014 Synthetix Bio",
    senderName: "Dr. Kenji Sato",
    senderEmail: "kenji@synthetixbio.com",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.93,
    reason: "CEO asks Victoria personally whether she will serve as board observer or designate a partner.",
    summaryOverview: "Synthetix Bio is preparing its December board deck and asks if Victoria wants the observer seat personally.",
    requests: ["Confirm board observer designee before Nov 22 board packet"],
    deadlines: ["Nov 18"],
    suggestedAction: "Confirm whether Victoria takes the seat or nominates Principal Maya Lin.",
    priority: "HIGH",
    status: "WAITING_FOR_RESPONSE",
    isImportant: true,
    isUnread: false,
    labels: ["Board", "Portfolio"],
    hoursOffset: 14,
    messages: [
      {
        fromName: "Dr. Kenji Sato",
        fromEmail: "kenji@synthetixbio.com",
        direction: "INBOUND",
        hoursOffset: 16,
        body: "Hi Victoria,\n\nWe are locking the December board roster. Do you plan to take the observer seat yourself or delegate to someone on your investment team?"
      },
      {
        fromName: "Elena Vance",
        fromEmail: "elena@relaydesk.ai",
        direction: "OUTBOUND",
        hoursOffset: 14,
        body: "Hi Dr. Sato,\n\nVictoria is reviewing the December board calendar and will confirm her designee shortly.\n\nBest,\nElena"
      }
    ]
  },
  {
    id: "conv_09",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Carta Receipt: Sterling Ventures Fund III Management Fee Wire Confirmed",
    senderName: "Carta Fund Admin",
    senderEmail: "notifications@carta.com",
    classification: "NO_REPLY_NEEDED",
    confidence: 0.97,
    reason: "Automated payment receipt requiring no reply.",
    summaryOverview: "Automated confirmation that the Q4 management fee disbursement cleared via SVB Commercial.",
    requests: [],
    deadlines: [],
    suggestedAction: "File under Fund III Administration.",
    priority: "LOW",
    status: "COMPLETED",
    isImportant: false,
    isUnread: false,
    labels: ["Finance", "Automated"],
    hoursOffset: 18,
    messages: [
      {
        fromName: "Carta Fund Admin",
        fromEmail: "notifications@carta.com",
        direction: "INBOUND",
        hoursOffset: 18,
        body: "Wire confirmation #CR-88412: $185,000.00 processed successfully for Sterling Ventures Fund III LP. No action required."
      }
    ]
  },
  {
    id: "conv_10",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Updated Zoom Dial-In & Deck Upload \u2014 Helion Climate Intro",
    senderName: "Marcus Vance-White",
    senderEmail: "mwhite@helionclimate.co",
    classification: "ASSISTANT_TO_REPLY",
    confidence: 0.88,
    reason: "Meeting link logistics and pre-read deck intake.",
    summaryOverview: "Helion Climate shared updated Zoom credentials and asks where to upload their data room pre-read.",
    requests: ["Acknowledge receipt of deck and confirm Zoom link works"],
    deadlines: [],
    suggestedAction: "Confirm deck saved to Victoria\u2019s briefing folder and verify calendar link.",
    priority: "MEDIUM",
    status: "OPEN",
    isImportant: false,
    isUnread: false,
    labels: ["Deal Flow"],
    hoursOffset: 22,
    messages: [
      {
        fromName: "Marcus Vance-White",
        fromEmail: "mwhite@helionclimate.co",
        direction: "INBOUND",
        hoursOffset: 22,
        body: "Hi Elena,\n\nSharing our updated investor deck ahead of Friday\u2019s 11:00 AM intro call. Let us know if Victoria needs any specific unit-economics slides added before then."
      }
    ]
  },
  {
    id: "conv_11",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Partnership Agreement Redlines \u2014 Quantum Compute Co-Invest",
    senderName: "Nadia Al-Mansoor",
    senderEmail: "nadia@crescentpartners.ae",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.91,
    reason: "Cross-fund co-investment governance terms require partner-level approval.",
    summaryOverview: "Crescent Partners returned redlines on the SPV fee split and veto threshold for the Quantum Compute co-invest.",
    requests: ["Approve 0/10 SPV carry split or counter-propose"],
    deadlines: ["Nov 20"],
    suggestedAction: "Escalate SPV governance redlines to Victoria.",
    priority: "HIGH",
    status: "OPEN",
    isImportant: true,
    isUnread: true,
    labels: ["Co-Invest", "Legal"],
    hoursOffset: 26,
    messages: [
      {
        fromName: "Nadia Al-Mansoor",
        fromEmail: "nadia@crescentpartners.ae",
        direction: "INBOUND",
        hoursOffset: 26,
        body: "Victoria,\n\nAttached are our redlines on the Quantum Compute SPV. Specifically, we requested a 50% threshold for follow-on reserve calls rather than unanimous consent. Would love your sign-off so legal can finalize."
      }
    ]
  },
  {
    id: "conv_12",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Q3 Offsite Venue Deposit Paid \u2014 Napa Valley",
    senderName: "Meadowood Events",
    senderEmail: "events@meadowood.com",
    classification: "NO_REPLY_NEEDED",
    confidence: 0.95,
    reason: "Completed vendor confirmation already settled.",
    summaryOverview: "Receipt confirming Meadowood deposit and finalized AV package for Q3 partner offsite.",
    requests: [],
    deadlines: [],
    suggestedAction: "Keep archived for accounting.",
    priority: "LOW",
    status: "COMPLETED",
    isImportant: false,
    isUnread: false,
    isArchived: true,
    labels: ["Events"],
    hoursOffset: 72,
    messages: [
      {
        fromName: "Meadowood Events",
        fromEmail: "events@meadowood.com",
        direction: "INBOUND",
        hoursOffset: 72,
        body: "Thank you for your deposit payment. Your conference suite reservation is confirmed."
      }
    ]
  },
  // DAVID THORNE (8 threads managed by Elena)
  {
    id: "conv_13",
    clientId: SEED_IDS.clients.david,
    accountId: SEED_IDS.accounts.davidOutlook,
    clientEmail: "david@thornecapital.com",
    clientName: "David Thorne",
    assistantName: "Elena Vance",
    subject: "URGENT: Audit Committee Sign-Off Needed on FY26 Valuation Policy",
    senderName: "Rachel Kim, CPA",
    senderEmail: "rkim@deloitte.com",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.97,
    reason: "Statutory audit sign-off requires Managing Director authorization before Deloitte files the quarterly review.",
    summaryOverview: "Deloitte requires David\u2019s formal electronic attestation on the updated ASC 820 fair-value methodology.",
    requests: ['Review memo page 3 and reply "Approved" for audit workpapers'],
    deadlines: ["Tomorrow 12:00 PM ET"],
    suggestedAction: "Flag urgently for David\u2019s review and confirmation.",
    priority: "URGENT",
    status: "OPEN",
    isImportant: true,
    isUnread: true,
    labels: ["Audit", "Compliance"],
    hoursOffset: 1.8,
    messages: [
      {
        fromName: "Rachel Kim, CPA",
        fromEmail: "rkim@deloitte.com",
        direction: "INBOUND",
        hoursOffset: 1.8,
        body: "David,\n\nTo release our quarterly assurance letter on schedule tomorrow afternoon, we need your written sign-off on the ASC 820 mark-to-market methodology adjustments outlined on page 3 of the attached memo.\n\nPlease confirm before 12:00 PM ET tomorrow."
      }
    ]
  },
  {
    id: "conv_14",
    clientId: SEED_IDS.clients.david,
    accountId: SEED_IDS.accounts.davidOutlook,
    clientEmail: "david@thornecapital.com",
    clientName: "David Thorne",
    assistantName: "Elena Vance",
    subject: "Goldman Sachs Private Wealth Dinner \u2014 Confirming Driver & Arrival",
    senderName: "Mateo Alvarez",
    senderEmail: "m.alvarez@goldmansachs.com",
    classification: "ASSISTANT_TO_REPLY",
    confidence: 0.93,
    reason: "Arrival time and car service logistics handled by assistant.",
    summaryOverview: "Goldman Sachs event team requests David\u2019s arrival window and car plate details for security clearance at 200 West St.",
    requests: ["Provide car service details and confirm 6:30 PM ET arrival"],
    deadlines: ["Tomorrow 3:00 PM ET"],
    suggestedAction: "Send black-car confirmation and RSVP for 6:30 PM ET.",
    priority: "MEDIUM",
    status: "OPEN",
    isImportant: false,
    isUnread: true,
    labels: ["Logistics"],
    hoursOffset: 3.5,
    messages: [
      {
        fromName: "Mateo Alvarez",
        fromEmail: "m.alvarez@goldmansachs.com",
        direction: "INBOUND",
        hoursOffset: 3.5,
        body: "Hi Elena,\n\nFor Thursday\u2019s private credit roundtable at 200 West Street, could you share David\u2019s driver details for building security and confirm whether he is joining the 6:00 PM reception or arriving right at 6:30 PM?"
      }
    ]
  },
  {
    id: "conv_15",
    clientId: SEED_IDS.clients.david,
    accountId: SEED_IDS.accounts.davidOutlook,
    clientEmail: "david@thornecapital.com",
    clientName: "David Thorne",
    assistantName: "Elena Vance",
    subject: "Follow-up: Advisory Retainer Scope for Apex Logistics",
    senderName: "Thomas Wright",
    senderEmail: "twright@apexlogistics.com",
    classification: "NEEDS_REVIEW",
    confidence: 0.58,
    reason: "Unclear whether David intends to accept an advisory role or pass to an operating partner.",
    summaryOverview: "Apex Logistics CEO proposes a 12-month strategic advisory retainer with equity warrants.",
    requests: ["Decide whether to engage personally or decline politely"],
    deadlines: [],
    suggestedAction: "Ask David whether to schedule an exploratory call or decline.",
    priority: "MEDIUM",
    status: "OPEN",
    isImportant: false,
    isUnread: true,
    labels: ["Advisory", "Triage"],
    hoursOffset: 7,
    messages: [
      {
        fromName: "Thomas Wright",
        fromEmail: "twright@apexlogistics.com",
        direction: "INBOUND",
        hoursOffset: 7,
        body: "David,\n\nWe would love to formalize an advisory seat ahead of our 2027 debt refinancing. Let me know if the attached retainer structure works or if someone on your team should take the lead."
      }
    ]
  },
  {
    id: "conv_16",
    clientId: SEED_IDS.clients.david,
    accountId: SEED_IDS.accounts.davidOutlook,
    clientEmail: "david@thornecapital.com",
    clientName: "David Thorne",
    assistantName: "Elena Vance",
    subject: "Re: Quarterly Portfolio Review \u2014 Scheduling 45-min Prep Call",
    senderName: "Laura Jennings",
    senderEmail: "ljennings@thornecapital.com",
    classification: "ASSISTANT_TO_REPLY",
    confidence: 0.91,
    reason: "Internal calendar scheduling for portfolio prep session.",
    summaryOverview: "Thorne Capital VP asks Elena to find a 45-minute slot on Monday morning for David to review Q4 slides.",
    requests: ["Hold 45 minutes on Monday 9:00 AM - 11:30 AM ET"],
    deadlines: [],
    suggestedAction: "Book Monday 10:00 AM ET in David\u2019s calendar and reply to Laura.",
    priority: "MEDIUM",
    status: "OPEN",
    isImportant: false,
    isUnread: false,
    labels: ["Internal", "Scheduling"],
    hoursOffset: 9,
    messages: [
      {
        fromName: "Laura Jennings",
        fromEmail: "ljennings@thornecapital.com",
        direction: "INBOUND",
        hoursOffset: 9,
        body: "Hey Elena,\n\nCan you grab 45 minutes with David on Monday morning so we can walk through the credit fund attribution slides before the LP call?"
      }
    ]
  },
  {
    id: "conv_17",
    clientId: SEED_IDS.clients.david,
    accountId: SEED_IDS.accounts.davidOutlook,
    clientEmail: "david@thornecapital.com",
    clientName: "David Thorne",
    assistantName: "Elena Vance",
    subject: "Bloomberg Credit Markets Morning Briefing",
    senderName: "Bloomberg Markets",
    senderEmail: "briefing@news.bloomberg.com",
    classification: "NO_REPLY_NEEDED",
    confidence: 0.99,
    reason: "Daily market newsletter requiring no reply.",
    summaryOverview: "Daily fixed-income and private credit yield spread summary.",
    requests: [],
    deadlines: [],
    suggestedAction: "No reply needed.",
    priority: "LOW",
    status: "COMPLETED",
    isImportant: false,
    isUnread: false,
    labels: ["Newsletter"],
    hoursOffset: 12,
    messages: [
      {
        fromName: "Bloomberg Markets",
        fromEmail: "briefing@news.bloomberg.com",
        direction: "INBOUND",
        hoursOffset: 12,
        body: "Morning Credit Brief: High-yield spreads tightened 8 bps overnight ahead of Treasury auction guidance."
      }
    ]
  },
  {
    id: "conv_18",
    clientId: SEED_IDS.clients.david,
    accountId: SEED_IDS.accounts.davidOutlook,
    clientEmail: "david@thornecapital.com",
    clientName: "David Thorne",
    assistantName: "Elena Vance",
    subject: "Approval Required: Redline Waiver on Beacon Manufacturing Credit Facility",
    senderName: "Samuel Brooks",
    senderEmail: "sbrooks@kirkland.com",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.94,
    reason: "Credit covenant waiver requires Managing Director approval.",
    summaryOverview: "Beacon Manufacturing requested a 30-day leverage ratio covenant waiver; Kirkland drafted the consent letter.",
    requests: ["Approve covenant waiver terms or request 25bps amendment fee"],
    deadlines: ["Nov 19"],
    suggestedAction: "Brief David on covenant waiver terms and fee option.",
    priority: "HIGH",
    status: "WAITING_FOR_RESPONSE",
    isImportant: true,
    isUnread: false,
    labels: ["Credit", "Legal"],
    hoursOffset: 16,
    messages: [
      {
        fromName: "Samuel Brooks",
        fromEmail: "sbrooks@kirkland.com",
        direction: "INBOUND",
        hoursOffset: 20,
        body: "David,\n\nBeacon\u2019s CFO requested a temporary 30-day waiver on the Q4 senior leverage test. Recommend charging a 25bps consent fee."
      },
      {
        fromName: "Elena Vance",
        fromEmail: "elena@relaydesk.ai",
        direction: "OUTBOUND",
        hoursOffset: 16,
        body: "Hi Sam,\n\nThanks \u2014 David is reviewing the 25bps fee recommendation and will respond once his committee call wraps."
      }
    ]
  },
  {
    id: "conv_19",
    clientId: SEED_IDS.clients.david,
    accountId: SEED_IDS.accounts.davidOutlook,
    clientEmail: "david@thornecapital.com",
    clientName: "David Thorne",
    assistantName: "Elena Vance",
    subject: "Expense Report #ER-2041 Approved & Reimbursed",
    senderName: "Concur Expense",
    senderEmail: "noreply@concursolutions.com",
    classification: "NO_REPLY_NEEDED",
    confidence: 0.98,
    reason: "Automated expense reimbursement notification.",
    summaryOverview: "Automated confirmation that Chicago travel expenses ($2,418.50) were reimbursed.",
    requests: [],
    deadlines: [],
    suggestedAction: "No action needed.",
    priority: "LOW",
    status: "COMPLETED",
    isImportant: false,
    isUnread: false,
    labels: ["Finance"],
    hoursOffset: 28,
    messages: [
      {
        fromName: "Concur Expense",
        fromEmail: "noreply@concursolutions.com",
        direction: "INBOUND",
        hoursOffset: 28,
        body: "Your expense report #ER-2041 totaling $2,418.50 has been approved and scheduled for direct deposit."
      }
    ]
  },
  {
    id: "conv_20",
    clientId: SEED_IDS.clients.david,
    accountId: SEED_IDS.accounts.davidOutlook,
    clientEmail: "david@thornecapital.com",
    clientName: "David Thorne",
    assistantName: "Elena Vance",
    subject: "Speaking Invitation: Milken Institute Private Credit Roundtable",
    senderName: "Grace Holloway",
    senderEmail: "gholloway@milkeninstitute.org",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.87,
    reason: "High-profile conference invitation requiring David\u2019s personal acceptance.",
    summaryOverview: "Milken Institute invites David to join a 4-person private credit panel in Miami in December.",
    requests: ["Confirm speaker interest for Dec 8 panel"],
    deadlines: ["Nov 21"],
    suggestedAction: "Check David\u2019s December calendar and obtain his decision.",
    priority: "MEDIUM",
    status: "OPEN",
    isImportant: true,
    isUnread: false,
    labels: ["Speaking"],
    hoursOffset: 30,
    messages: [
      {
        fromName: "Grace Holloway",
        fromEmail: "gholloway@milkeninstitute.org",
        direction: "INBOUND",
        hoursOffset: 30,
        body: "Dear David,\n\nWe would be honored to feature your perspective on direct lending resilience at our December 8 roundtable in Miami. Please let us know if your schedule permits."
      }
    ]
  },
  // ARIA KAPOOR (8 threads managed by Marcus Chen)
  {
    id: "conv_21",
    clientId: SEED_IDS.clients.aria,
    accountId: SEED_IDS.accounts.ariaGmail,
    clientEmail: "aria@luminahealth.ai",
    clientName: "Aria Kapoor",
    assistantName: "Marcus Chen",
    subject: "FDA Pre-Sub Briefing Book \u2014 Final CEO Attestation Required",
    senderName: "Dr. Priya Nair",
    senderEmail: "priya@luminahealth.ai",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.96,
    reason: "Regulatory submission requires CEO final sign-off on clinical claims.",
    summaryOverview: "Lumina\u2019s regulatory VP completed the FDA 510(k) pre-sub briefing book and needs Aria\u2019s sign-off on intended-use wording.",
    requests: ["Review Section 2.1 intended-use statement and approve submission"],
    deadlines: ["Tomorrow 5:00 PM PT"],
    suggestedAction: "Flag as top CEO priority with Section 2.1 excerpt.",
    priority: "URGENT",
    status: "OPEN",
    isImportant: true,
    isUnread: true,
    labels: ["Regulatory", "Clinical"],
    hoursOffset: 1.2,
    messages: [
      {
        fromName: "Dr. Priya Nair",
        fromEmail: "priya@luminahealth.ai",
        direction: "INBOUND",
        hoursOffset: 1.2,
        body: "Hi Aria,\n\nOur external regulatory counsel signed off on the 510(k) Pre-Sub briefing packet. Before Marcus coordinates eSTAR upload tomorrow afternoon, please confirm you approve the updated intended-use statement in Section 2.1."
      }
    ]
  },
  {
    id: "conv_22",
    clientId: SEED_IDS.clients.aria,
    accountId: SEED_IDS.accounts.ariaGmail,
    clientEmail: "aria@luminahealth.ai",
    clientName: "Aria Kapoor",
    assistantName: "Marcus Chen",
    subject: "Series B Partner Presentation \u2014 AV Check & Room Booking",
    senderName: "Hannah Park",
    senderEmail: "hpark@sequoia.com",
    classification: "ASSISTANT_TO_REPLY",
    confidence: 0.94,
    reason: "Meeting logistics, guest badges, and AV setup handled by assistant.",
    summaryOverview: "Sequoia partner assistant confirms Monday 1:30 PM PT pitch slot and asks for attendee names for Sand Hill security badges.",
    requests: ["Send full attendee list and confirm HDMI/Zoom setup"],
    deadlines: ["Friday 12:00 PM PT"],
    suggestedAction: "Send Lumina leadership badge list and confirm 1:15 PM AV check.",
    priority: "HIGH",
    status: "OPEN",
    isImportant: true,
    isUnread: true,
    labels: ["Fundraising", "Scheduling"],
    hoursOffset: 2.8,
    messages: [
      {
        fromName: "Hannah Park",
        fromEmail: "hpark@sequoia.com",
        direction: "INBOUND",
        hoursOffset: 2.8,
        body: "Hi Marcus,\n\nConfirming Aria\u2019s Series B partner meeting on Monday at 1:30 PM PT at 2800 Sand Hill Rd. Could you send over the names and emails of everyone joining from Lumina so we can pre-register visitor badges?"
      }
    ]
  },
  {
    id: "conv_23",
    clientId: SEED_IDS.clients.aria,
    accountId: SEED_IDS.accounts.ariaGmail,
    clientEmail: "aria@luminahealth.ai",
    clientName: "Aria Kapoor",
    assistantName: "Marcus Chen",
    subject: "Mayo Clinic Pilot MOU \u2014 IP Indemnity Clause Question",
    senderName: "Daniel Mercer",
    senderEmail: "mercer.daniel@mayo.edu",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.9,
    reason: "Strategic healthcare partnership IP clause needs founder judgment.",
    summaryOverview: "Mayo Clinic innovation team asks if Lumina accepts joint foreground IP licensing for the diagnostic workflow pilot.",
    requests: ["Decide on joint licensing vs Lumina-exclusive foreground IP"],
    deadlines: ["Nov 21"],
    suggestedAction: "Present two IP options to Aria for founder alignment.",
    priority: "HIGH",
    status: "OPEN",
    isImportant: true,
    isUnread: false,
    labels: ["Partnerships", "Legal"],
    hoursOffset: 6,
    messages: [
      {
        fromName: "Daniel Mercer",
        fromEmail: "mercer.daniel@mayo.edu",
        direction: "INBOUND",
        hoursOffset: 6,
        body: "Aria,\n\nOur tech transfer office reviewed the pilot MOU. Everything looks solid except Section 7 on model fine-tuning IP. Would Lumina agree to shared non-commercial research rights if we keep commercial exclusivity with Lumina?"
      }
    ]
  },
  {
    id: "conv_24",
    clientId: SEED_IDS.clients.aria,
    accountId: SEED_IDS.accounts.ariaGmail,
    clientEmail: "aria@luminahealth.ai",
    clientName: "Aria Kapoor",
    assistantName: "Marcus Chen",
    subject: "AWS Activate Credit Renewal & SOC2 Auditor Scheduling",
    senderName: "Devon Brooks",
    senderEmail: "devon@luminahealth.ai",
    classification: "ASSISTANT_TO_REPLY",
    confidence: 0.89,
    reason: "Operational vendor coordination and calendar booking.",
    summaryOverview: "Engineering VP needs 30 minutes on Aria\u2019s calendar next week for SOC2 Type II kickoff with Vanta auditors.",
    requests: ["Schedule 30-min SOC2 kickoff next Tuesday or Wednesday"],
    deadlines: [],
    suggestedAction: "Book Tuesday 11:00 AM PT and reply to Devon.",
    priority: "MEDIUM",
    status: "OPEN",
    isImportant: false,
    isUnread: false,
    labels: ["Operations"],
    hoursOffset: 10,
    messages: [
      {
        fromName: "Devon Brooks",
        fromEmail: "devon@luminahealth.ai",
        direction: "INBOUND",
        hoursOffset: 10,
        body: "Hey Marcus, can you slot 30 minutes with Aria next Tue/Wed for the Vanta SOC2 Type II kickoff? She only needs to join the first 10 minutes for executive sign-off."
      }
    ]
  },
  {
    id: "conv_25",
    clientId: SEED_IDS.clients.aria,
    accountId: SEED_IDS.accounts.ariaGmail,
    clientEmail: "aria@luminahealth.ai",
    clientName: "Aria Kapoor",
    assistantName: "Marcus Chen",
    subject: "Quick check on the Bay Area Summit thing",
    senderName: "Nina Patel",
    senderEmail: "nina@healthfounders.org",
    classification: "NEEDS_REVIEW",
    confidence: 0.52,
    reason: "Vague email without date, speaker format, or clear obligation.",
    summaryOverview: 'Nina asks informally about "the Bay Area Summit thing" without specifying whether Aria is speaking or attending.',
    requests: ["Clarify role, date, and time commitment"],
    deadlines: [],
    suggestedAction: "Reply asking for event brief or check Marcus\u2019s notes.",
    priority: "LOW",
    status: "OPEN",
    isImportant: false,
    isUnread: true,
    labels: ["Triage"],
    hoursOffset: 13,
    messages: [
      {
        fromName: "Nina Patel",
        fromEmail: "nina@healthfounders.org",
        direction: "INBOUND",
        hoursOffset: 13,
        body: "Hey Aria! Are you still thinking of doing the Bay Area Summit thing next month? Let me know soon!"
      }
    ]
  },
  {
    id: "conv_26",
    clientId: SEED_IDS.clients.aria,
    accountId: SEED_IDS.accounts.ariaGmail,
    clientEmail: "aria@luminahealth.ai",
    clientName: "Aria Kapoor",
    assistantName: "Marcus Chen",
    subject: "Rock Health Weekly Digital Health Funding Digest",
    senderName: "Rock Health Insights",
    senderEmail: "insights@rockhealth.org",
    classification: "NO_REPLY_NEEDED",
    confidence: 0.98,
    reason: "Automated industry newsletter.",
    summaryOverview: "Digital health Q4 funding metrics and clinical AI adoption roundup.",
    requests: [],
    deadlines: [],
    suggestedAction: "No reply needed.",
    priority: "LOW",
    status: "COMPLETED",
    isImportant: false,
    isUnread: false,
    labels: ["Newsletter"],
    hoursOffset: 19,
    messages: [
      {
        fromName: "Rock Health Insights",
        fromEmail: "insights@rockhealth.org",
        direction: "INBOUND",
        hoursOffset: 19,
        body: "Digital Health Weekly: Clinical workflow automation startups raised $1.1B across 28 deals in Q4."
      }
    ]
  },
  {
    id: "conv_27",
    clientId: SEED_IDS.clients.aria,
    accountId: SEED_IDS.accounts.ariaGmail,
    clientEmail: "aria@luminahealth.ai",
    clientName: "Aria Kapoor",
    assistantName: "Marcus Chen",
    subject: "Podcast Recording Reschedule \u2014 Founders in Health",
    senderName: "Liam O\u2019Connor",
    senderEmail: "liam@foundersinhealth.fm",
    classification: "ASSISTANT_TO_REPLY",
    confidence: 0.91,
    reason: "Media scheduling adjustment handled directly by assistant.",
    summaryOverview: "Podcast producer requests moving Friday\u2019s remote recording back by 60 minutes.",
    requests: ["Confirm 2:00 PM PT Friday works instead of 1:00 PM PT"],
    deadlines: [],
    suggestedAction: "Verify Friday 2:00 PM PT opening and confirm Riverside link.",
    priority: "MEDIUM",
    status: "WAITING_FOR_RESPONSE",
    isImportant: false,
    isUnread: false,
    labels: ["Press", "Scheduling"],
    hoursOffset: 24,
    messages: [
      {
        fromName: "Liam O\u2019Connor",
        fromEmail: "liam@foundersinhealth.fm",
        direction: "INBOUND",
        hoursOffset: 26,
        body: "Hi Marcus, can we shift Aria\u2019s Friday podcast taping from 1:00 PM PT to 2:00 PM PT?"
      },
      {
        fromName: "Marcus Chen",
        fromEmail: "marcus@relaydesk.ai",
        direction: "OUTBOUND",
        hoursOffset: 24,
        body: "Hi Liam, checking Aria\u2019s afternoon buffer and will confirm 2:00 PM PT shortly."
      }
    ]
  },
  {
    id: "conv_28",
    clientId: SEED_IDS.clients.aria,
    accountId: SEED_IDS.accounts.ariaGmail,
    clientEmail: "aria@luminahealth.ai",
    clientName: "Aria Kapoor",
    assistantName: "Marcus Chen",
    subject: "Stripe Atlas Tax Filing Receipt \u2014 Delaware Franchise Tax",
    senderName: "Stripe Billing",
    senderEmail: "receipts@stripe.com",
    classification: "NO_REPLY_NEEDED",
    confidence: 0.99,
    reason: "Automated billing receipt.",
    summaryOverview: "Receipt confirming annual Delaware Franchise Tax filing payment.",
    requests: [],
    deadlines: [],
    suggestedAction: "Archived in compliance folder.",
    priority: "LOW",
    status: "COMPLETED",
    isImportant: false,
    isUnread: false,
    isArchived: true,
    labels: ["Receipts"],
    hoursOffset: 50,
    messages: [
      {
        fromName: "Stripe Billing",
        fromEmail: "receipts@stripe.com",
        direction: "INBOUND",
        hoursOffset: 50,
        body: "Receipt #STR-99021: $450.00 paid for Delaware Franchise Tax filing."
      }
    ]
  },
  {
    id: "conv_29",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Approval requested: Meridian Bio board observer rights",
    senderName: "Clara Reynolds",
    senderEmail: "creynolds@meridianbio.com",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.93,
    reason: "Meridian Bio is asking Victoria to approve a material investor-rights change before the financing documents are finalized.",
    summaryOverview: "Meridian Bio requests Victoria's approval to add quarterly board observer access to the Series B side letter.",
    requests: ["Approve or decline quarterly board observer access"],
    deadlines: ["Before Friday's document circulation"],
    suggestedAction: "Review the proposed observer rights and tell counsel whether to include them.",
    priority: "HIGH",
    status: "OPEN",
    isImportant: true,
    isUnread: true,
    labels: ["Investments", "Approval"],
    hoursOffset: 7,
    messages: [{
      fromName: "Clara Reynolds",
      fromEmail: "creynolds@meridianbio.com",
      direction: "INBOUND",
      hoursOffset: 7,
      body: "Hi Victoria, the founders have asked to add quarterly board observer access to the Series B side letter. Would you approve this language before we circulate the final documents on Friday?"
    }]
  },
  {
    id: "conv_30",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Your decision: Summit keynote format and final remarks",
    senderName: "Margaret Okafor",
    senderEmail: "mokafor@calpers-summit.org",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.91,
    reason: "The event organizer needs Victoria's personal choice of keynote format and approval of her closing remarks.",
    summaryOverview: "The LP Summit organizer asks Victoria to choose a fireside chat or solo keynote and approve the closing remarks.",
    requests: ["Choose fireside chat or solo keynote", "Approve the closing remarks"],
    deadlines: ["Thursday afternoon"],
    suggestedAction: "Select the keynote format and review the final remarks.",
    priority: "MEDIUM",
    status: "OPEN",
    isImportant: false,
    isUnread: true,
    labels: ["Speaking", "Approval"],
    hoursOffset: 15,
    messages: [{
      fromName: "Margaret Okafor",
      fromEmail: "mokafor@calpers-summit.org",
      direction: "INBOUND",
      hoursOffset: 15,
      body: "Hello Victoria, could you confirm whether you prefer a fireside chat or a solo keynote? We have also attached the final closing remarks for your review before Thursday afternoon."
    }]
  },
  {
    id: "conv_31",
    clientId: SEED_IDS.clients.victoria,
    accountId: SEED_IDS.accounts.victoriaGmail,
    clientEmail: "victoria@sterlingventures.com",
    clientName: "Victoria Sterling",
    assistantName: "Elena Vance",
    subject: "Please confirm: Atlas Fund III allocation",
    senderName: "Nikhil Desai",
    senderEmail: "ndesai@sterlingventures.com",
    classification: "CLIENT_TO_REPLY",
    confidence: 0.9,
    reason: "The investment team needs Victoria's decision on a proposed fund allocation before submitting the committee memo.",
    summaryOverview: "The investment team requests Victoria's approval of a proposed $2.5M Atlas Fund III allocation.",
    requests: ["Approve or revise the proposed $2.5M allocation"],
    deadlines: ["Investment committee memo due Monday"],
    suggestedAction: "Review the allocation recommendation and confirm the amount for the committee memo.",
    priority: "HIGH",
    status: "OPEN",
    isImportant: true,
    isUnread: true,
    labels: ["Investments", "Decision"],
    hoursOffset: 22,
    messages: [{
      fromName: "Nikhil Desai",
      fromEmail: "ndesai@sterlingventures.com",
      direction: "INBOUND",
      hoursOffset: 22,
      body: "Victoria, the team recommends a $2.5M allocation to Atlas Fund III. Please confirm or suggest a different amount so we can finalize the investment committee memo on Monday."
    }]
  }
];
function buildSeedConversationsAndWork() {
  const conversations = [];
  const messages = [];
  for (const t of RAW_THREADS) {
    const lastTimestamp = hoursAgo(t.hoursOffset);
    const createdTimestamp = hoursAgo(t.hoursOffset + 4);
    const band = t.confidence >= 0.82 ? "HIGH" : t.confidence >= 0.6 ? "MEDIUM" : "LOW";
    const assignedTo = t.classification === "CLIENT_TO_REPLY" ? t.clientName : t.classification === "ASSISTANT_TO_REPLY" ? t.assistantName : t.classification === "NEEDS_REVIEW" ? t.assistantName : "None";
    conversations.push({
      id: t.id,
      emailAccountId: t.accountId,
      clientId: t.clientId,
      subject: t.subject,
      snippet: t.messages[t.messages.length - 1].body.slice(0, 145).replace(/\n+/g, " "),
      sender: { name: t.senderName, email: t.senderEmail },
      participants: [
        { name: t.senderName, email: t.senderEmail },
        { name: t.clientName, email: t.clientEmail }
      ],
      classification: t.classification,
      confidence: t.confidence,
      confidenceBand: band,
      classificationReason: t.reason,
      classificationSource: "AI_GEMINI",
      manualOverride: false,
      suggestedAction: t.suggestedAction,
      summary: {
        overview: t.summaryOverview,
        mainTopic: t.subject,
        importantInformation: [t.summaryOverview],
        decisions: t.classification === "CLIENT_TO_REPLY" ? [t.suggestedAction] : [],
        requests: t.requests,
        pendingActions: t.status === "COMPLETED" ? [] : [t.suggestedAction],
        deadlines: t.deadlines,
        nextSteps: [t.suggestedAction],
        generatedBy: "SEEDED",
        generatedAt: lastTimestamp
      },
      priority: t.priority,
      status: t.status,
      assignedTo,
      requiresResponse: t.classification !== "NO_REPLY_NEEDED" && t.status !== "COMPLETED",
      isImportant: t.isImportant,
      isUnread: t.isUnread,
      isArchived: Boolean(t.isArchived),
      labels: t.labels,
      classificationHistory: [
        {
          classification: t.classification,
          confidence: t.confidence,
          reason: t.reason,
          source: "AI_GEMINI",
          changedBy: "RelayDesk Triage Engine",
          changedAt: lastTimestamp
        }
      ],
      internalNotes: [],
      lastMessageAt: lastTimestamp,
      createdAt: createdTimestamp,
      updatedAt: lastTimestamp
    });
    t.messages.forEach((m, index) => {
      messages.push({
        id: `${t.id}_msg_${index + 1}`,
        conversationId: t.id,
        sender: { name: m.fromName, email: m.fromEmail },
        recipients: [
          m.direction === "INBOUND" ? { name: t.clientName, email: t.clientEmail } : { name: t.senderName, email: t.senderEmail }
        ],
        body: m.body,
        direction: m.direction,
        isSimulatedSend: m.direction === "OUTBOUND",
        receivedAt: hoursAgo(m.hoursOffset),
        attachments: []
      });
    });
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const actions = [
    {
      id: "act_01",
      conversationId: "conv_01",
      clientId: SEED_IDS.clients.victoria,
      title: "Obtain Victoria sign-off on Northstar Series A side letter",
      description: "Cooley needs signature authorization by 4:00 PM PT today.",
      dueDate: daysFromNow(0),
      priority: "URGENT",
      status: "PENDING",
      assignedTo: "Victoria Sterling",
      sourceType: "AI_EXTRACTED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "act_02",
      conversationId: "conv_04",
      clientId: SEED_IDS.clients.victoria,
      title: "Ticket BA284 SFO-LHR & guarantee Claridge\u2019s suite",
      description: "Courtesy fare hold expires today at 6:00 PM PT.",
      dueDate: daysFromNow(0),
      priority: "HIGH",
      status: "IN_PROGRESS",
      assignedTo: "Elena Vance",
      sourceType: "AI_EXTRACTED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "act_03",
      conversationId: "conv_02",
      clientId: SEED_IDS.clients.victoria,
      title: "Move Meridian Bio diligence sync to Thu 2:00 PM PT",
      description: "Update calendar invite and notify Clara Reynolds.",
      dueDate: daysFromNow(1),
      priority: "HIGH",
      status: "PENDING",
      assignedTo: "Elena Vance",
      sourceType: "AI_EXTRACTED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "act_04",
      conversationId: "conv_13",
      clientId: SEED_IDS.clients.david,
      title: "Deliver Deloitte FY26 ASC 820 valuation attestation",
      description: "David must confirm approval before tomorrow noon ET.",
      dueDate: daysFromNow(1),
      priority: "URGENT",
      status: "PENDING",
      assignedTo: "David Thorne",
      sourceType: "AI_EXTRACTED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "act_05",
      conversationId: "conv_14",
      clientId: SEED_IDS.clients.david,
      title: "Submit driver & security badge info to Goldman Sachs",
      description: "Send black-car plate and arrival window for 200 West St.",
      dueDate: daysFromNow(1),
      priority: "MEDIUM",
      status: "PENDING",
      assignedTo: "Elena Vance",
      sourceType: "AI_EXTRACTED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "act_06",
      conversationId: "conv_21",
      clientId: SEED_IDS.clients.aria,
      title: "Approve Section 2.1 FDA Pre-Sub intended-use wording",
      description: "Required prior to eSTAR briefing packet submission.",
      dueDate: daysFromNow(1),
      priority: "URGENT",
      status: "PENDING",
      assignedTo: "Aria Kapoor",
      sourceType: "AI_EXTRACTED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "act_07",
      conversationId: "conv_22",
      clientId: SEED_IDS.clients.aria,
      title: "Send Sequoia Sand Hill Road visitor badge list",
      description: "Provide Lumina executive team names for Monday 1:30 PM pitch.",
      dueDate: daysFromNow(2),
      priority: "HIGH",
      status: "PENDING",
      assignedTo: "Marcus Chen",
      sourceType: "AI_EXTRACTED",
      createdAt: now,
      updatedAt: now
    }
  ];
  const meetings = [
    {
      id: "mtg_01",
      conversationId: "conv_02",
      clientId: SEED_IDS.clients.victoria,
      title: "Meridian Bio Clinical Diligence Sync",
      date: dateFromNow(2),
      time: "02:00 PM",
      timezone: "America/Los_Angeles",
      durationMinutes: 45,
      participants: [
        { name: "Victoria Sterling", email: "victoria@sterlingventures.com" },
        { name: "Clara Reynolds", email: "creynolds@meridianbio.com" }
      ],
      location: "Zoom Video Conference",
      status: "RESCHEDULING",
      notes: "Requested move from tomorrow 10:00 AM PT.",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "mtg_02",
      conversationId: "conv_10",
      clientId: SEED_IDS.clients.victoria,
      title: "Helion Climate Intro & Unit Economics Review",
      date: dateFromNow(3),
      time: "11:00 AM",
      timezone: "America/Los_Angeles",
      durationMinutes: 30,
      participants: [
        { name: "Victoria Sterling", email: "victoria@sterlingventures.com" },
        { name: "Marcus Vance-White", email: "mwhite@helionclimate.co" }
      ],
      location: "Zoom Video Conference",
      status: "CONFIRMED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "mtg_03",
      conversationId: "conv_07",
      clientId: SEED_IDS.clients.victoria,
      title: "Founder & LP Private Dinner (10 Guests)",
      date: dateFromNow(4),
      time: "07:00 PM",
      timezone: "America/Los_Angeles",
      durationMinutes: 120,
      participants: [{ name: "Victoria Sterling", email: "victoria@sterlingventures.com" }],
      location: "Rosewood Sand Hill \u2014 Private Dining Room",
      status: "CONFIRMED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "mtg_04",
      conversationId: "conv_14",
      clientId: SEED_IDS.clients.david,
      title: "Goldman Sachs Private Credit Roundtable",
      date: dateFromNow(2),
      time: "06:30 PM",
      timezone: "America/New_York",
      durationMinutes: 90,
      participants: [
        { name: "David Thorne", email: "david@thornecapital.com" },
        { name: "Mateo Alvarez", email: "m.alvarez@goldmansachs.com" }
      ],
      location: "200 West St, New York",
      status: "CONFIRMED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "mtg_05",
      conversationId: "conv_16",
      clientId: SEED_IDS.clients.david,
      title: "Q4 Credit Fund Attribution Prep",
      date: dateFromNow(3),
      time: "10:00 AM",
      timezone: "America/New_York",
      durationMinutes: 45,
      participants: [
        { name: "David Thorne", email: "david@thornecapital.com" },
        { name: "Laura Jennings", email: "ljennings@thornecapital.com" }
      ],
      location: "Thorne Capital Boardroom / Teams",
      status: "PROPOSED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "mtg_06",
      conversationId: "conv_22",
      clientId: SEED_IDS.clients.aria,
      title: "Sequoia Series B Partner Presentation",
      date: dateFromNow(3),
      time: "01:30 PM",
      timezone: "America/Los_Angeles",
      durationMinutes: 60,
      participants: [
        { name: "Aria Kapoor", email: "aria@luminahealth.ai" },
        { name: "Hannah Park", email: "hpark@sequoia.com" }
      ],
      location: "2800 Sand Hill Rd, Menlo Park",
      status: "CONFIRMED",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "mtg_07",
      conversationId: "conv_24",
      clientId: SEED_IDS.clients.aria,
      title: "SOC2 Type II Kickoff with Vanta Auditors",
      date: dateFromNow(4),
      time: "11:00 AM",
      timezone: "America/Los_Angeles",
      durationMinutes: 30,
      participants: [
        { name: "Aria Kapoor", email: "aria@luminahealth.ai" },
        { name: "Devon Brooks", email: "devon@luminahealth.ai" }
      ],
      location: "Google Meet",
      status: "PROPOSED",
      createdAt: now,
      updatedAt: now
    }
  ];
  const activities = [
    {
      id: "log_01",
      userId: SEED_IDS.users.elena,
      userName: "Elena Vance",
      userRole: "ASSISTANT",
      clientId: SEED_IDS.clients.victoria,
      conversationId: "conv_01",
      action: "URGENT_FLAGGED",
      description: "Triage Engine flagged Northstar Series A Term Sheet for immediate client sign-off",
      timestamp: hoursAgo(1.4)
    },
    {
      id: "log_02",
      userId: SEED_IDS.users.elena,
      userName: "Elena Vance",
      userRole: "ASSISTANT",
      clientId: SEED_IDS.clients.david,
      conversationId: "conv_13",
      action: "URGENT_FLAGGED",
      description: "Deloitte FY26 Valuation Policy Sign-Off queued for David Thorne",
      timestamp: hoursAgo(1.7)
    },
    {
      id: "log_03",
      userId: SEED_IDS.users.marcus,
      userName: "Marcus Chen",
      userRole: "ASSISTANT",
      clientId: SEED_IDS.clients.aria,
      conversationId: "conv_22",
      action: "MEETING_CONFIRMED",
      description: "Confirmed Sequoia Series B Partner Presentation for Monday 1:30 PM PT",
      timestamp: hoursAgo(2.5)
    },
    {
      id: "log_04",
      userId: SEED_IDS.users.elena,
      userName: "Elena Vance",
      userRole: "ASSISTANT",
      clientId: SEED_IDS.clients.victoria,
      conversationId: "conv_08",
      action: "WAITING_ON_CLIENT",
      description: "Sent holding reply to Synthetix Bio regarding December board observer seat",
      timestamp: hoursAgo(14)
    }
  ];
  return { conversations, messages, actions, meetings, activities };
}
export {
  buildSeedConversationsAndWork
};

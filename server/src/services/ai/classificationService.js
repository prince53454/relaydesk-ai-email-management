import { Type } from "@google/genai";
import { aiProvider } from "./aiProvider.js";
import { CLASSIFICATION_SYSTEM_PROMPT, formatThreadForPrompt } from "./prompts.js";

function getConfidenceBand(confidence) {
  if (confidence >= 0.82) return "HIGH";
  if (confidence >= 0.6) return "MEDIUM";
  return "LOW";
}

function deterministicFallbackClassify(conversation, messages) {
  const latestMessage = messages.at(-1);
  const latestText = `${latestMessage?.body || ""} ${conversation.snippet || ""}`.toLowerCase();
  const combined = `${conversation.subject || ""} ${conversation.sender?.name || ""} ${conversation.sender?.email || ""} ${conversation.status || ""} ${conversation.snippet || ""} ${messages.map((message) => message.body || "").join(" ")}`.toLowerCase();
  const urgent = /\b(urgent|asap|today|by eod|end of day|deadline|overdue|tomorrow)\b/.test(combined);

  const latestHasOpenRequest = /\b(please (send|share|provide|confirm|reply|respond|approve|review|decide|let me know)|could you|can you|would you|please advise|request(?:ing)? (information|an update|a response)|need your (input|approval|decision|response)|awaiting your|waiting for your|(?<!no )action required|response requested)\b/.test(latestText);
  const resolvedSignal = /\b(resolved|taken care of|all set|no action required|no further action|nothing further needed|nothing you need to do|closing this out|case closed|completed successfully|thanks,? that answers|thank you,? resolved|we have what we need)\b/.test(latestText);
  if (!latestHasOpenRequest && (resolvedSignal || conversation.status === "COMPLETED")) {
    return {
      classification: "NO_REPLY_NEEDED", confidence: 0.86,
      reason: "The thread indicates the matter is resolved or no further action is needed.",
      summary: `The conversation "${conversation.subject || "(no subject)"}" appears resolved.`,
      suggestedAction: "No response needed; archive or retain for reference.", priority: "LOW", requiresResponse: false
    };
  }

  if (!latestHasOpenRequest && /\b(newsletter|weekly digest|unsubscribe|promotional email|verification code|one[- ]time password|automated notification|no[- ]?reply|do not reply|no action required|for your information|fyi only)\b/.test(combined)) {
    return {
      classification: "NO_REPLY_NEEDED", confidence: 0.9,
      reason: "This appears to be an automated or informational message without an open request for a response.",
      summary: `${conversation.subject || "This message"} is informational and does not appear to need a reply.`,
      suggestedAction: "Keep for reference or archive.", priority: "LOW", requiresResponse: false
    };
  }

  if (/\b(approve|approval|sign[- ]off|authorize|your decision|personal decision|what do you think|your opinion|your thoughts|your input|your perspective|weigh in|we need your guidance|please advise|choose between|select one|board vote|term sheet|investment decision|contract redline|legal advice|confidential|sensitive (business|matter|discussion|hr)|compensation decision|partnership terms|strategic (decision|choice|discussion)|merger|acquisition|high[- ]stakes|personal response|directly from you|in your own words)\b/.test(combined)) {
    return {
      classification: "CLIENT_TO_REPLY", confidence: 0.88,
      reason: "The message appears to need the client's judgment, personal voice, or approval.",
      summary: `${conversation.sender?.name || "The sender"} is asking for the client's input on "${conversation.subject || "this conversation"}".`,
      suggestedAction: "Brief the client and request their decision before replying.",
      priority: urgent ? "URGENT" : "HIGH", requiresResponse: true
    };
  }

  if (!latestHasOpenRequest && /\b(general update|status update|update|just to let you know|keeping you informed|sharing an update|no action (is )?needed|nothing you need to do|informational update|for your records|no response necessary|no reply necessary|no need to respond|fyi)\b/.test(latestText)) {
    return {
      classification: "NO_REPLY_NEEDED", confidence: 0.82,
      reason: "This is a general informational update without an unanswered request.",
      summary: `${conversation.subject || "This message"} shares information and does not request a response.`,
      suggestedAction: "No response needed; keep for reference or archive.", priority: "LOW", requiresResponse: false
    };
  }

  if (/\b(reschedul\w*|schedul\w*|appointment\w*|calendar|availability|available times|are you (available|free)|when can we meet|book (a|the)? ?(flight|hotel|room|table|meeting)|travel|itinerary|venue|logistics|coordinate|coordination|zoom link|meeting link|arrange (a )?(meeting|call)|send (over|along|through)|forward (the|a|this)? ?(document|file|attachment)|onboarding (docs|documents)|administrative|paperwork|expense report|reimbursement|vendor follow[- ]?up)\b/.test(combined)) {
    return {
      classification: "ASSISTANT_TO_REPLY", confidence: 0.87,
      reason: "The conversation concerns routine scheduling, logistics, or administrative coordination the assistant can handle.",
      summary: `An administrative request from ${conversation.sender?.name || "the sender"} concerns "${conversation.subject || "this conversation"}".`,
      suggestedAction: "Prepare a response or coordinate the requested next step on the client's behalf.",
      priority: urgent ? "HIGH" : "MEDIUM", requiresResponse: true
    };
  }

  if (/\b(follow(?:ing)? up|checking in|could you (please )?(send|share|provide|confirm|let me know)|please (send|share|provide|confirm|reply|respond|let me know)|request(?:ing)? (information|an update|a response)|can you (send|share|provide|confirm|arrange)|question about|inquiry|enquir|general question)\b/.test(combined)) {
    return {
      classification: "ASSISTANT_TO_REPLY", confidence: 0.79,
      reason: "The sender has made a routine request or follow-up that can normally be handled by the assistant.",
      summary: `A routine request from ${conversation.sender?.name || "the sender"} needs a response about "${conversation.subject || "this conversation"}".`,
      suggestedAction: "Review the request and prepare a routine response or follow-up.",
      priority: urgent ? "HIGH" : "MEDIUM", requiresResponse: true
    };
  }

  return {
    classification: "NEEDS_REVIEW", confidence: 0.56,
    reason: "The available thread context does not clearly establish who should respond.",
    summary: `Conversation "${conversation.subject || "(no subject)"}" needs ownership review.`,
    suggestedAction: "Review the full thread and assign it to the assistant or client.",
    priority: urgent ? "HIGH" : "MEDIUM", requiresResponse: true
  };
}

const VALID_CLASSES = ["ASSISTANT_TO_REPLY", "CLIENT_TO_REPLY", "NO_REPLY_NEEDED", "NEEDS_REVIEW"];
const VALID_PRIORITIES = ["URGENT", "HIGH", "MEDIUM", "LOW"];

async function classifyConversation(conversation, messages, client) {
  const prompt = formatThreadForPrompt(conversation, messages, client);
  const result = await aiProvider.generateStructured({
    systemInstruction: CLASSIFICATION_SYSTEM_PROMPT,
    prompt: `Classify this conversation:\n\n${prompt}`,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        classification: { type: Type.STRING, description: "One of ASSISTANT_TO_REPLY, CLIENT_TO_REPLY, NO_REPLY_NEEDED, NEEDS_REVIEW" },
        confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
        reason: { type: Type.STRING }, summary: { type: Type.STRING }, suggestedAction: { type: Type.STRING },
        priority: { type: Type.STRING, description: "One of URGENT, HIGH, MEDIUM, LOW" },
        requiresResponse: { type: Type.BOOLEAN }
      },
      required: ["classification", "confidence", "reason", "summary", "suggestedAction", "priority", "requiresResponse"]
    },
    fallback: () => deterministicFallbackClassify(conversation, messages)
  });
  const raw = result.data || {};
  const numericConfidence = Number(raw.confidence);
  const clampedConfidence = Math.min(1, Math.max(0, Number.isFinite(numericConfidence) ? numericConfidence : 0.5));
  let classification = VALID_CLASSES.includes(raw.classification) ? raw.classification : "NEEDS_REVIEW";
  const confidenceBand = getConfidenceBand(clampedConfidence);
  if (confidenceBand === "LOW") classification = "NEEDS_REVIEW";
  const priority = VALID_PRIORITIES.includes(raw.priority) ? raw.priority : "MEDIUM";
  const requiresResponse = classification === "ASSISTANT_TO_REPLY" || classification === "CLIENT_TO_REPLY"
    ? true
    : classification === "NO_REPLY_NEEDED" ? false : raw.requiresResponse === true;
  return {
    classification, confidence: Number(clampedConfidence.toFixed(2)), confidenceBand,
    reason: raw.reason || "Classified from the sender's request and thread context.",
    summary: raw.summary || conversation.snippet || conversation.subject,
    suggestedAction: raw.suggestedAction || "Review the thread and confirm the next step.",
    priority, requiresResponse, provider: result.provider, isFallback: result.isFallback, model: result.model
  };
}

export { classifyConversation, deterministicFallbackClassify, getConfidenceBand };

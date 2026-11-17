import { Type } from "@google/genai";
import { aiProvider } from "./aiProvider.js";
import { formatThreadForPrompt, SUMMARY_SYSTEM_PROMPT } from "./prompts.js";
function buildFallbackSummary(conversation, messages) {
  const latest = messages[messages.length - 1];
  const sentences = (latest?.body || conversation.snippet).split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 10);
  const requests = sentences.filter((s) => /\?|please|could you|need|approve|confirm|send/i.test(s));
  const deadlines = sentences.filter((s) => /today|tomorrow|monday|tuesday|wednesday|thursday|friday|eod|deadline|nov|dec|by \d/i.test(s));
  return {
    overview: `${conversation.sender.name} initiated or updated "${conversation.subject}". ${sentences[0] || conversation.snippet}`,
    mainTopic: conversation.subject,
    importantInformation: sentences.slice(0, 3),
    decisions: sentences.filter((s) => /approve|decided|agreed|sign/i.test(s)).slice(0, 2),
    requests: requests.slice(0, 3),
    pendingActions: conversation.suggestedAction ? [conversation.suggestedAction] : ["Review latest message and determine response owner"],
    deadlines: deadlines.slice(0, 2),
    nextSteps: [
      conversation.classification === "CLIENT_TO_REPLY" ? "Escalate to client with briefing note for personal decision" : "Prepare draft response for review"
    ]
  };
}
async function summarizeConversation(conversation, messages, client) {
  const prompt = formatThreadForPrompt(conversation, messages, client);
  const result = await aiProvider.generateStructured({
    systemInstruction: SUMMARY_SYSTEM_PROMPT,
    prompt: `Summarize this conversation:

${prompt}`,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        overview: { type: Type.STRING },
        mainTopic: { type: Type.STRING },
        importantInformation: { type: Type.ARRAY, items: { type: Type.STRING } },
        decisions: { type: Type.ARRAY, items: { type: Type.STRING } },
        requests: { type: Type.ARRAY, items: { type: Type.STRING } },
        pendingActions: { type: Type.ARRAY, items: { type: Type.STRING } },
        deadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
        nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: [
        "overview",
        "mainTopic",
        "importantInformation",
        "decisions",
        "requests",
        "pendingActions",
        "deadlines",
        "nextSteps"
      ]
    },
    fallback: () => buildFallbackSummary(conversation, messages)
  });
  const summary = {
    overview: result.data.overview || conversation.snippet,
    mainTopic: result.data.mainTopic || conversation.subject,
    importantInformation: result.data.importantInformation || [],
    decisions: result.data.decisions || [],
    requests: result.data.requests || [],
    pendingActions: result.data.pendingActions || [],
    deadlines: result.data.deadlines || [],
    nextSteps: result.data.nextSteps || [],
    generatedBy: result.provider,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return {
    summary,
    isFallback: result.isFallback,
    model: result.model
  };
}
export {
  summarizeConversation
};

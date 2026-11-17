import { aiProvider } from "./aiProvider.js";
import { formatThreadForPrompt, REPLY_SYSTEM_PROMPT } from "./prompts.js";
function buildFallbackReply(params) {
  const recipientFirst = params.conversation.sender.name.split(" ")[0] || "there";
  const clientName = params.client?.name || "our office";
  const draft = params.existingDraft?.trim();
  if (draft && params.mode === "SHORTER") {
    const sentences = draft.split(/(?<=[.!?])\s+/).slice(0, 3);
    return sentences.join(" ");
  }
  if (draft && params.mode === "FORMAL") {
    return `Dear ${recipientFirst},

Thank you for your correspondence regarding ${params.conversation.subject}.

${draft}

Best regards,
${params.senderName}
Office of ${clientName}`;
  }
  if (draft && params.mode === "FRIENDLIER") {
    return `Hi ${recipientFirst},

Thanks so much for reaching out! ${draft}

Warmly,
${params.senderName}`;
  }
  if (draft && (params.mode === "IMPROVE_GRAMMAR" || params.mode === "REWRITE")) {
    return draft.replace(/\bi\b/g, "I").replace(/\s{2,}/g, " ").trim();
  }
  if (params.conversation.classification === "CLIENT_TO_REPLY") {
    return `Hi ${recipientFirst},

Thank you for your note about ${params.conversation.subject}. I will review the details and follow up with you.

Best,
${clientName}`;
  }
  return `Hi ${recipientFirst},

Thank you for reaching out regarding ${params.conversation.subject}. I am coordinating this on behalf of ${clientName}.

We have noted your request and can confirm availability to proceed as outlined. Please let us know if you need any adjustments or calendar invites sent over.

Best regards,
${params.senderName}
Executive Assistant to ${clientName}`;
}
async function generateReplyDraft(params) {
  const context = formatThreadForPrompt(params.conversation, params.messages, params.client);
  const modeDirectives = {
    GENERATE: `Draft a clear, thoughtful reply on behalf of ${params.conversation.classification === "CLIENT_TO_REPLY" ? params.client?.name || "the client" : `${params.senderName} (Executive Assistant to ${params.client?.name || "the client"})`}.`,
    REWRITE: "Rewrite the existing draft for maximum clarity, executive polish, and structure.",
    SHORTER: "Condense the existing draft to be crisp and under 80 words while keeping every key commitment.",
    FORMAL: "Rewrite the existing draft in a polished, formal executive register.",
    FRIENDLIER: "Rewrite the existing draft in a warm, personable, collaborative tone.",
    IMPROVE_GRAMMAR: "Fix any grammar, punctuation, or phrasing issues in the existing draft without altering meaning.",
    CUSTOM: params.instruction || "Update the draft according to the user instruction."
  };
  const prompt = [
    `Mode: ${params.mode} \u2014 ${modeDirectives[params.mode]}`,
    params.tone ? `Preferred Tone: ${params.tone}` : "",
    params.instruction ? `Additional Instruction: ${params.instruction}` : "",
    params.existingDraft ? `Current Draft:
${params.existingDraft}` : "",
    `Email Thread Context:
${context}`
  ].filter(Boolean).join("\n\n");
  const result = await aiProvider.generateText({
    systemInstruction: REPLY_SYSTEM_PROMPT,
    prompt,
    fallback: () => buildFallbackReply({
      conversation: params.conversation,
      client: params.client,
      mode: params.mode,
      existingDraft: params.existingDraft,
      senderName: params.senderName
    })
  });
  return {
    draft: result.data,
    provider: result.provider,
    isFallback: result.isFallback,
    model: result.model
  };
}
export {
  generateReplyDraft
};

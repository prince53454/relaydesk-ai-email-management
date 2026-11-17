import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/environment.js";
import { logger } from "../../utils/logger.js";
let clientInstance = null;
function hasUsableApiKey() {
  const key = env.GEMINI_API_KEY?.trim();
  return Boolean(key && key !== "MY_GEMINI_API_KEY" && key.length > 10);
}
function getClient() {
  if (!hasUsableApiKey()) return null;
  if (!clientInstance) {
    clientInstance = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        },
        timeout: 20000,
        retryOptions: { attempts: 1 }
      }
    });
  }
  return clientInstance;
}
const aiProvider = {
  isLiveAIConfigured() {
    return env.AI_PROVIDER !== "fallback" && hasUsableApiKey();
  },
  async generateStructured(params) {
    const ai = this.isLiveAIConfigured() ? getClient() : null;
    if (!ai) {
      return {
        data: params.fallback(),
        provider: "AI_FALLBACK",
        isFallback: true,
        model: "deterministic-fallback-classifier"
      };
    }
    try {
      const response = await ai.models.generateContent({
        model: env.AI_MODEL || "gemini-4-hydrogen",
        contents: params.prompt,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: "application/json",
          responseSchema: params.responseSchema
        }
      });
      const rawText = response.text?.trim();
      if (!rawText) {
        throw new Error("Empty response from Gemini model");
      }
      const parsed = JSON.parse(rawText);
      return {
        data: parsed,
        provider: "AI_GEMINI",
        isFallback: false,
        model: env.AI_MODEL || "gemini-4-hydrogen"
      };
    } catch (error) {
      logger.warn("Gemini structured generation failed; invoking explicit fallback", error);
      return {
        data: params.fallback(),
        provider: "AI_FALLBACK",
        isFallback: true,
        model: "deterministic-fallback-classifier"
      };
    }
  },
  async generateText(params) {
    const ai = this.isLiveAIConfigured() ? getClient() : null;
    if (!ai) {
      return {
        data: params.fallback(),
        provider: "AI_FALLBACK",
        isFallback: true,
        model: "deterministic-fallback-assistant"
      };
    }
    try {
      const response = await ai.models.generateContent({
        model: env.AI_MODEL || "gemini-4-hydrogen",
        contents: params.prompt,
        config: {
          systemInstruction: params.systemInstruction
        }
      });
      const text = response.text?.trim();
      if (!text) {
        throw new Error("Empty text response from Gemini model");
      }
      return {
        data: text,
        provider: "AI_GEMINI",
        isFallback: false,
        model: env.AI_MODEL || "gemini-4-hydrogen"
      };
    } catch (error) {
      logger.warn("Gemini text generation failed; invoking explicit fallback", error);
      return {
        data: params.fallback(),
        provider: "AI_FALLBACK",
        isFallback: true,
        model: "deterministic-fallback-assistant"
      };
    }
  }
};
export {
  aiProvider
};

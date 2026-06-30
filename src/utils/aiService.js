import { ROOM_PERSONA, AI_COMMANDS } from './constants';

// The frontend NEVER talks to Groq's API directly — that requires an API
// key, which must never live in browser JS. Instead it calls our own
// backend (server/index.js), which holds the key and proxies the request.
// Override via REACT_APP_BACKEND_URL if deploying elsewhere.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

export class AIServiceError extends Error {
  constructor(message, kind = 'unknown') {
    super(message);
    this.kind = kind; // 'offline' | 'no-key' | 'api' | 'parse' | 'unknown'
  }
}

async function callBackend({ system, messages, maxTokens = 300 }) {
  let res;
  try {
    res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, messages, maxTokens }),
    });
  } catch (networkErr) {
    // fetch itself threw — backend isn't running / unreachable / CORS blocked
    throw new AIServiceError(
      `Can't reach the Chatapp backend at ${BACKEND_URL}. Make sure you ran "npm start" inside the /server folder.`,
      'offline'
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new AIServiceError('Backend returned an invalid response.', 'unknown');
  }

  if (!res.ok) {
    if (/GROQ_API_KEY/i.test(data?.error || '')) {
      throw new AIServiceError(
        'The backend has no GROQ_API_KEY configured. Get a free key at console.groq.com/keys, set it as an environment variable, and restart the server.',
        'no-key'
      );
    }
    throw new AIServiceError(data?.error || `Backend error (${res.status})`, 'api');
  }

  return data.text || '';
}

// Quick connectivity check the UI can use to show a banner
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { method: 'GET' });
    if (!res.ok) return { ok: false, reason: 'api' };
    const data = await res.json();
    if (!data.hasKey) return { ok: false, reason: 'no-key' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'offline' };
  }
}

function safeJsonParse(raw, fallback) {
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

export async function getChatReply({ roomId, history, userMessage, username }) {
  const system = ROOM_PERSONA[roomId] || ROOM_PERSONA.general;
  const messages = [
    ...history.slice(-10).map(m => ({
      role: m.sender === username ? 'user' : 'assistant',
      content: `${m.sender}: ${m.text}`,
    })),
    { role: 'user', content: `${username}: ${userMessage}` },
  ];
  return callBackend({ system, messages, maxTokens: 200 });
}

export async function runAICommand({ cmd, history, roomId }) {
  const recentMsgs = history.slice(-8).map(m => `${m.sender}: ${m.text}`).join('\n');
  const context = `Room: ${roomId}. Recent conversation:\n${recentMsgs}`;

  if (cmd === '/help') {
    return `**Available AI Commands:**\n\n${Object.entries(AI_COMMANDS).map(([c, d]) => `\`${c}\` — ${d}`).join('\n')}`;
  }

  const commandPrompts = {
    '/summarize': `${context}\n\nSummarize the above conversation in exactly 3 bullet points. Be concise.`,
    '/translate': `Take the last message in this conversation and translate it to Spanish, French, and Japanese. Format as:\n🇪🇸 Spanish: ...\n🇫🇷 French: ...\n🇯🇵 Japanese: ...\n\nConversation:\n${context}`,
    '/quiz': `Based on this conversation context: "${context}"\n\nCreate a fun 3-question trivia quiz related to the room topic. Format as:\n**Q1:** ...\nA) ... B) ... C) ... D) ...\n✅ Answer: ...\n\n(repeat for Q2, Q3)`,
    '/roast': `${context}\n\nRoast the last message in a playful, friendly, witty way. Keep it fun and not mean. 2-3 sentences.`,
    '/poem': `${context}\n\nWrite a short creative 4-line poem about what's being discussed. Make it clever and fun.`,
    '/tldr': `${context}\n\nGive a one-sentence TL;DR of this conversation. Be punchy.`,
    '/idea': `${context}\n\nGenerate exactly 3 creative, actionable ideas related to what's being discussed. Number them 1-3.`,
    '/fact': `${context}\n\nShare one surprising, interesting fact related to the current topic. Start with "🤓 Fun fact:"`,
  };

  const prompt = commandPrompts[cmd];
  if (!prompt) return null;

  return callBackend({
    system: 'You are a helpful AI assistant in a chat application. Be concise, clear, and engaging.',
    messages: [{ role: 'user', content: prompt }],
    maxTokens: 500,
  });
}

export async function getSmartReply({ messageText, username }) {
  const raw = await callBackend({
    system: 'Generate 3 short, natural reply suggestions for this chat message. Each should be different in tone. Return ONLY a JSON array of 3 strings, nothing else. Example: ["Sure!", "Sounds good 👍", "Let me think about that"]',
    messages: [{ role: 'user', content: `Message received: "${messageText}"\nUser: ${username}\nGenerate 3 reply options.` }],
    maxTokens: 150,
  });
  const parsed = safeJsonParse(raw, []);
  return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
}

export async function getMoodAnalysis({ messages }) {
  const text = messages.slice(-20).map(m => m.text).join(' ');
  const raw = await callBackend({
    system: 'Analyze the mood/sentiment of this conversation and return a JSON object with: { mood: string, emoji: string, score: number (0-100 positivity), summary: string (1 sentence) }. Return ONLY the JSON, nothing else.',
    messages: [{ role: 'user', content: `Conversation: ${text}` }],
    maxTokens: 150,
  });
  return safeJsonParse(raw, null);
}

export async function getTopicSuggestions({ roomId, history }) {
  const recent = history.slice(-5).map(m => m.text).join(' ');
  const raw = await callBackend({
    system: 'Suggest 3 interesting conversation starters or follow-up topics. Return ONLY a JSON array of 3 short strings. Example: ["What do you think about X?", "Have you tried Y?", "Fun fact: Z"]',
    messages: [{ role: 'user', content: `Room: ${roomId}. Recent messages: ${recent}` }],
    maxTokens: 150,
  });
  const parsed = safeJsonParse(raw, ['What are your thoughts?', 'Interesting topic!', 'Tell me more!']);
  return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
}

export async function translateMessage({ text, targetLang }) {
  return callBackend({
    system: `Translate the following message to ${targetLang}. Return ONLY the translation, nothing else.`,
    messages: [{ role: 'user', content: text }],
    maxTokens: 200,
  });
}

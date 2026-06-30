// Chatapp backend — proxies requests to Groq's API (free tier) so the API
// key never has to live in the browser. Run with: node server/index.js
// Requires: GROQ_API_KEY environment variable.
// Get a free key at: https://console.groq.com/keys

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;
const API_KEY = process.env.GROQ_API_KEY;

// Free, fast Llama 3.3 70B model on Groq. Other free options:
// "llama-3.1-8b-instant" (fastest), "mixtral-8x7b-32768", "gemma2-9b-it"
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

app.use(cors());
app.use(express.json({ limit: '2mb' }));

if (!API_KEY) {
  console.warn('\n⚠️  WARNING: GROQ_API_KEY is not set.');
  console.warn('   Get a FREE key at https://console.groq.com/keys then set it:');
  console.warn('   export GROQ_API_KEY=gsk_...   (Mac/Linux)');
  console.warn('   set GROQ_API_KEY=gsk_...      (Windows cmd)\n');
}

// Health check — the frontend pings this to show a connection banner
app.get('/api/health', (req, res) => {
  res.json({ ok: true, hasKey: Boolean(API_KEY), provider: 'groq', model: MODEL });
});

// Generic proxy endpoint used by all AI features in the app.
// Accepts the same { system, messages, maxTokens } shape the frontend
// already sends (Anthropic-style) and translates it to Groq's
// OpenAI-compatible chat completions format.
app.post('/api/chat', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({
      error: 'Server is missing GROQ_API_KEY. Get a free key at https://console.groq.com/keys, set it as an environment variable, and restart the server.',
    });
  }

  const { system, messages, maxTokens } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Request body must include a non-empty "messages" array.' });
  }

  // Groq uses OpenAI-style chat format: messages is [{role, content}, ...]
  // with system prompt as its own message at the start.
  const groqMessages = [
    ...(system ? [{ role: 'system', content: system }] : []),
    ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens || 300,
        messages: groqMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(response.status).json({
        error: data?.error?.message || 'Groq API request failed.',
      });
    }

    const text = data?.choices?.[0]?.message?.content || '';
    res.json({ text, raw: data });
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).json({ error: 'Failed to reach Groq API. Check your network connection.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Chatapp backend (Groq) running at http://localhost:${PORT}`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});

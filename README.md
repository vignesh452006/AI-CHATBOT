# 💬 Chatapp — AI-Powered Real-time Chat

A full-featured chat application built with React, Express, and **Groq AI (free tier)**.

## ⚠️ Why a backend is required

AI features call Groq's API, which requires a free API key. **API keys must never live in browser JavaScript** — exposing one in frontend code lets anyone steal it from your network tab. So this project ships with a tiny Express backend (`/server`) that holds the key and proxies requests. The React app only ever talks to your own backend, never to Groq directly.

If you only run `npm start` in the root folder and skip the server, the app still works for browsing/auth/UI, but AI replies will show a clear "🔌 Backend offline" message instead of crashing.

## 🆓 Get a free Groq API key

1. Go to **[console.groq.com/keys](https://console.groq.com/keys)**
2. Sign up (free, no credit card required)
3. Click "Create API Key", copy it (starts with `gsk_`)
4. Groq's free tier gives generous daily rate limits — plenty for a chat app like this

## 🚀 Quick Start (2 terminals)

### 1. Start the backend (handles AI requests)

```bash
cd server
npm install
export GROQ_API_KEY=gsk_your-key-here   # Mac/Linux
# set GROQ_API_KEY=gsk_your-key-here     # Windows cmd
# $env:GROQ_API_KEY="gsk_your-key-here"  # Windows PowerShell
npm start
```

You should see:
```
✅ Chatapp backend (Groq) running at http://localhost:5050
   Model: llama-3.3-70b-versatile
```

### 2. Start the frontend (in a new terminal, from the project root)

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

**Demo accounts:**
- Username: `alice` / Password: `1234`
- Username: `bob` / Password: `1234`

Or create your own account via Sign Up.

---

## 🩺 Troubleshooting "Can't reach the AI"

| Symptom | Fix |
|---|---|
| Banner says "🔌 Backend offline" | The server in `/server` isn't running. Open a terminal, `cd server && npm start`. |
| Banner says "🔑 No Groq API key configured" | You started the server without `GROQ_API_KEY` set. Stop it (Ctrl+C), export the key, restart. |
| Works on `localhost:3000` but not after deploying | Set `REACT_APP_BACKEND_URL` (see `.env.example`) to your deployed backend's URL, then rebuild the frontend. |
| `EADDRINUSE` when starting server | Port 5050 is taken. Set `PORT=5051 npm start` in `/server`, then add `REACT_APP_BACKEND_URL=http://localhost:5051` to a `.env` file in the root and restart the frontend. |
| Groq rate limit errors | Free tier has per-minute/per-day limits. Wait a moment, or switch `GROQ_MODEL` to a smaller/faster model like `llama-3.1-8b-instant`. |

Health check endpoint: `http://localhost:5050/api/health` — should return `{"ok":true,"hasKey":true,"provider":"groq","model":"llama-3.3-70b-versatile"}`.

### Swapping models

Groq offers several free models. Set `GROQ_MODEL` before starting the server to change it:

```bash
export GROQ_MODEL=llama-3.1-8b-instant   # fastest, lighter
# or: mixtral-8x7b-32768, gemma2-9b-it, llama-3.3-70b-versatile (default, best quality)
```

---

## ✨ Features

### Auth System
- Login & Sign Up with validation
- Password show/hide toggle
- Demo quick-access buttons
- Session-based auth (resets on refresh — add localStorage to persist)

### Chat Rooms
- 5 pre-built rooms: General, Dev Talk, Gaming, Music Vibes, AI Lab
- Create custom rooms with emoji icons + description + private toggle
- Room search/filter in sidebar
- Tabs: Channels | Direct Messages

### Messaging
- Real-time-style messaging with AI responses
- Message timestamps & sender avatars
- **Edit** your own messages (click ✏️ on hover)
- **Delete** your own messages (click 🗑 on hover)
- **Pin** messages (click 📌 on hover)
- **Emoji reactions** (click 😊 on hover → pick reaction)
- Read receipts (✓✓) on your messages
- Typing indicator with animated dots
- Message search within rooms

### 🤖 AI Features (powered by Groq's free Llama models, via your own backend)
1. **AI Chat Replies** — Each room has a distinct AI persona that responds in character
2. **Slash Commands** — Type `/` to access AI superpowers:
   - `/summarize` — Bullet-point summary of recent conversation
   - `/translate` — Translate last message to Spanish, French & Japanese
   - `/quiz` — Generate a trivia quiz about the room topic
   - `/roast` — Friendly roast of the last message
   - `/poem` — Write a creative poem about the discussion
   - `/tldr` — One-sentence summary
   - `/idea` — 3 creative ideas related to the topic
   - `/fact` — Interesting fact about the topic
   - `/help` — Show all commands
3. **Smart Replies** — AI suggests 3 reply options after each response
4. **Mood Analysis** — Click 🧠 to analyze room emotional vibe (score + summary)
5. **Topic Suggestions** — Click 💡 for AI conversation starters
6. **Live Translation** — Hover any message → click 🌐 to translate to Spanish
7. **Command Menu** — Auto-complete popup when typing `/`
8. **Connection status banner** — clear errors if the backend or API key isn't set up, instead of silent failures

### Right Panel
- Member list with online/away/offline status
- AI Features guide tab
- Media & shared files tab
- Pinned messages tab
- Room stats (message count, members, files)

### Profile
- Edit display name, bio, and status
- Click your avatar in the sidebar footer

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **CSS Modules** — Scoped styling
- **Express** — Backend proxy (keeps API key server-side)
- **Groq API** (`llama-3.3-70b-versatile`, free tier) — AI features
- **Syne + DM Sans** — Typography

## 📁 Project Structure

```
chatapp/
├── server/                 # Backend — REQUIRED for AI features
│   ├── index.js             # Express proxy to Groq API
│   └── package.json
├── public/
│   └── index.html
├── src/
│   ├── App.js               # Root component, state management
│   ├── index.js              # Entry point
│   ├── index.css              # CSS variables & animations
│   ├── components/
│   │   ├── Auth.jsx            # Login & Sign Up screens
│   │   ├── Auth.module.css
│   │   ├── Sidebar.jsx         # Room list, search, user footer
│   │   ├── Sidebar.module.css
│   │   ├── ChatArea.jsx        # Messages, input, AI commands, error banners
│   │   ├── ChatArea.module.css
│   │   ├── RightPanel.jsx      # Members, AI info, media tabs
│   │   ├── RightPanel.module.css
│   │   ├── Modals.jsx          # NewRoom + Profile modals
│   │   └── Modals.module.css
│   └── utils/
│       ├── constants.js        # Rooms, users, AI prompts
│       ├── helpers.js          # Utility functions
│       └── aiService.js        # Calls the local backend (not Groq directly)
├── .env.example             # Optional: override backend URL
└── package.json
```


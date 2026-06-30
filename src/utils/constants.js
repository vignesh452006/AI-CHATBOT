export const ROOM_EMOJIS = ["💬","🚀","🎮","🎵","📚","🌍","💡","🔥","🎨","⚡","🌙","☕","🏋️","🍕","🎬","🤖","🧠","🎯"];

export const AVATAR_COLORS = [
  "linear-gradient(135deg,#4f6ef7,#7c3aed)",
  "linear-gradient(135deg,#0ea5e9,#06b6d4)",
  "linear-gradient(135deg,#10b981,#059669)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#ec4899,#be185d)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#14b8a6,#0891b2)",
  "linear-gradient(135deg,#f97316,#dc2626)",
];

export const SOLID_COLORS = ["#4f6ef7","#0ea5e9","#10b981","#f59e0b","#ec4899","#8b5cf6","#14b8a6","#f97316"];

export const DEFAULT_ROOMS = [
  {
    id: "general", name: "General", emoji: "💬",
    desc: "Main hangout for everyone",
    members: ["Alice","Bob","Charlie","Diana"],
    topic: "Welcome to Chatapp! 🎉",
    pinned: ["Rules: Be kind, no spam!", "Weekly meetup every Friday 5PM"],
    ai: true,
  },
  {
    id: "dev", name: "Dev Talk", emoji: "💻",
    desc: "Code, tech & engineering discussions",
    members: ["Bob","Charlie"],
    topic: "Currently reading: Clean Code by Robert C. Martin",
    pinned: ["Standup: Mon-Fri 10AM","PR review queue: github.com/team/repo"],
    ai: true,
  },
  {
    id: "gaming", name: "Gaming", emoji: "🎮",
    desc: "Games, streams & esports",
    members: ["Charlie","Diana"],
    topic: "Game night this Saturday!",
    pinned: ["Tournament bracket: bit.ly/bracket"],
    ai: true,
  },
  {
    id: "music", name: "Music Vibes", emoji: "🎵",
    desc: "Beats, artists & playlists",
    members: ["Alice","Diana"],
    topic: "Playlist of the week: Lo-fi Chill Beats",
    pinned: ["Share your Spotify playlists here"],
    ai: true,
  },
  {
    id: "ai-lab", name: "AI Lab", emoji: "🤖",
    desc: "Experiment with AI features",
    members: ["Alice","Bob","Charlie","Diana"],
    topic: "Try the AI commands: /summarize /translate /quiz /roast",
    pinned: ["AI Lab: Use / commands to unlock AI superpowers!"],
    ai: true,
  },
];

export const DEMO_USERS = {
  Alice:  { color: SOLID_COLORS[0], gradient: AVATAR_COLORS[0], status: "online",  bio: "Product designer 🎨" },
  Bob:    { color: SOLID_COLORS[1], gradient: AVATAR_COLORS[1], status: "online",  bio: "Full-stack dev 🧑‍💻" },
  Charlie:{ color: SOLID_COLORS[2], gradient: AVATAR_COLORS[2], status: "away",    bio: "Gamer & streamer 🎮" },
  Diana:  { color: SOLID_COLORS[3], gradient: AVATAR_COLORS[3], status: "offline", bio: "Music producer 🎵" },
};

export const ROOM_PERSONA = {
  general: `You are a friendly, witty chat participant in a general chat room called "General". 
Be warm, casual, occasionally funny. React naturally to what's said. 1-2 sentences max.`,
  dev: `You are a senior software engineer in a dev chat. Give sharp, insightful responses about code and tech. 
Use technical terms naturally. Reference real tools/frameworks when relevant. 1-2 sentences max.`,
  gaming: `You are an enthusiastic gamer. React with hype and gaming references. 
Use gaming slang naturally (GG, W, no cap, etc). 1-2 sentences max.`,
  music: `You are a passionate music lover. Talk about artists, genres, vibes. 
Be expressive and emotional about music. 1-2 sentences max.`,
  "ai-lab": `You are an advanced AI assistant in an experimental AI lab chat. 
Be helpful, clever, and occasionally show off your capabilities. 1-2 sentences max.`,
};

export const AI_COMMANDS = {
  "/summarize": "Summarize the last few messages in this conversation in 3 bullet points.",
  "/translate": "Translate the last message to Spanish, French, and Japanese.",
  "/quiz":      "Create a fun 3-question trivia quiz related to the room's topic.",
  "/roast":     "Roast the last message sent in the chat in a playful, friendly way.",
  "/poem":      "Write a short creative poem about what's being discussed.",
  "/tldr":      "Give a one-sentence TL;DR of the current conversation.",
  "/idea":      "Generate 3 creative ideas related to what's being discussed.",
  "/fact":      "Share an interesting surprising fact related to the current topic.",
  "/help":      "List all available AI commands with descriptions.",
};

export const REACTIONS = ["👍","❤️","😂","😮","🔥","🎉","👏","💯"];

export const MESSAGE_STATUS = { sending: "sending", sent: "✓", delivered: "✓✓", read: "✓✓" };

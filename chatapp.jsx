import { useState, useEffect, useRef, useCallback } from "react";

// ─── Inline CSS ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #07080f;
    --surface:   #0e1120;
    --card:      #141728;
    --border:    #1e2340;
    --accent:    #4f6ef7;
    --accent2:   #7c3aed;
    --glow:      rgba(79,110,247,0.35);
    --text:      #e8eaf6;
    --muted:     #6b7280;
    --danger:    #ef4444;
    --success:   #22c55e;
    --online:    #22c55e;
    --msg-me:    #1e2d6b;
    --msg-them:  #141728;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html, body, #root { height: 100%; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.5;
    overflow: hidden;
  }

  /* ── Auth Screen ── */
  .auth-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: radial-gradient(ellipse 80% 60% at 50% -20%, #1a1f5e 0%, var(--bg) 65%);
  }
  .auth-stars {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      radial-gradient(1px 1px at 15% 20%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 35% 70%, #fff 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 60% 15%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 80% 55%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 90% 30%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 90%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 70% 85%, #fff 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 5% 50%, #fff 0%, transparent 100%);
    opacity: 0.6;
  }
  .auth-card {
    position: relative; z-index: 1;
    width: 420px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 0 60px rgba(79,110,247,0.15), 0 20px 60px rgba(0,0,0,0.5);
    animation: fadeUp .5s ease both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(20px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .auth-logo {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 28px; justify-content: center;
  }
  .auth-logo-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 20px var(--glow);
  }
  .auth-logo-name {
    font-family: var(--font-head);
    font-size: 26px; font-weight: 800; letter-spacing: -0.5px;
  }
  .auth-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; margin-bottom: 6px; }
  .auth-sub   { color: var(--muted); font-size: 14px; margin-bottom: 26px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 12px; font-weight: 500; color: var(--muted); margin-bottom: 6px; letter-spacing: .04em; text-transform: uppercase; }
  .field input {
    width: 100%; padding: 12px 14px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-family: var(--font-body); font-size: 15px;
    transition: border .2s, box-shadow .2s; outline: none;
  }
  .field input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,110,247,0.2); }
  .btn-primary {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none; border-radius: 10px;
    color: #fff; font-family: var(--font-head); font-size: 15px; font-weight: 700;
    cursor: pointer; transition: opacity .2s, transform .1s;
    letter-spacing: .02em; margin-top: 4px;
  }
  .btn-primary:hover  { opacity: .9; }
  .btn-primary:active { transform: scale(.98); }
  .btn-primary:disabled { opacity: .5; cursor: default; }
  .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: var(--muted); }
  .auth-footer a { color: var(--accent); cursor: pointer; text-decoration: none; }
  .auth-footer a:hover { text-decoration: underline; }
  .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #fca5a5; margin-bottom: 14px; }
  .terms-row { display: flex; align-items: center; gap: 8px; margin: 12px 0 4px; }
  .terms-row input[type=checkbox] { accent-color: var(--accent); width: 15px; height: 15px; }
  .terms-row label { font-size: 13px; color: var(--muted); }
  .terms-row a { color: var(--accent); cursor: pointer; }

  /* ── App Layout ── */
  .app { display: flex; height: 100vh; overflow: hidden; }

  /* ── Sidebar ── */
  .sidebar {
    width: 280px; min-width: 280px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .sidebar-header {
    padding: 18px 16px 14px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .sidebar-logo-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center; font-size: 15px;
    flex-shrink: 0;
  }
  .sidebar-logo-name { font-family: var(--font-head); font-weight: 800; font-size: 17px; letter-spacing: -0.3px; flex: 1; }
  .icon-btn {
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 18px; padding: 4px; border-radius: 6px;
    transition: color .15s, background .15s;
    display: flex; align-items: center; justify-content: center;
  }
  .icon-btn:hover { color: var(--text); background: var(--border); }

  .search-wrap { padding: 12px 14px; border-bottom: 1px solid var(--border); }
  .search-input {
    width: 100%; padding: 9px 12px 9px 34px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); font-family: var(--font-body); font-size: 13.5px;
    outline: none; transition: border .2s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: 10px center;
  }
  .search-input:focus { border-color: var(--accent); }

  .section-label { padding: 12px 16px 4px; font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; }

  .room-list { flex: 1; overflow-y: auto; padding: 4px 8px 8px; }
  .room-list::-webkit-scrollbar { width: 3px; }
  .room-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .room-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 10px; border-radius: 10px; cursor: pointer;
    transition: background .15s; margin-bottom: 2px;
  }
  .room-item:hover  { background: var(--card); }
  .room-item.active { background: rgba(79,110,247,0.15); }
  .room-icon {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; background: var(--card);
  }
  .room-item.active .room-icon { background: rgba(79,110,247,0.2); }
  .room-info { flex: 1; min-width: 0; }
  .room-name { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .room-last { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .room-badge {
    background: var(--accent); color: #fff; border-radius: 10px;
    font-size: 11px; font-weight: 700; padding: 2px 7px; min-width: 20px; text-align: center;
  }

  .sidebar-footer {
    padding: 12px 14px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .user-avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; color: #fff;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    position: relative;
  }
  .online-dot {
    position: absolute; bottom: 0; right: 0;
    width: 9px; height: 9px; border-radius: 50%; background: var(--online);
    border: 2px solid var(--surface);
  }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-weight: 600; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-status { font-size: 11.5px; color: var(--success); }

  /* ── Main Chat Area ── */
  .chat-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .chat-header {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
    background: var(--surface);
  }
  .chat-header-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; background: var(--card); flex-shrink: 0;
  }
  .chat-header-info { flex: 1; }
  .chat-header-name { font-family: var(--font-head); font-weight: 700; font-size: 16px; }
  .chat-header-sub  { font-size: 12px; color: var(--muted); }
  .chat-header-actions { display: flex; gap: 4px; }

  .messages-wrap {
    flex: 1; overflow-y: auto; padding: 20px 24px;
    display: flex; flex-direction: column; gap: 4px;
    background: var(--bg);
  }
  .messages-wrap::-webkit-scrollbar { width: 4px; }
  .messages-wrap::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .day-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 12px 0 8px; color: var(--muted); font-size: 12px;
  }
  .day-divider::before, .day-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .msg-group { display: flex; flex-direction: column; gap: 2px; margin-bottom: 10px; }
  .msg-row { display: flex; align-items: flex-end; gap: 8px; }
  .msg-row.me { flex-direction: row-reverse; }

  .msg-avatar {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff;
    background: linear-gradient(135deg, #4f6ef7, #7c3aed);
    align-self: flex-end; margin-bottom: 1px;
  }
  .msg-avatar.hidden { visibility: hidden; }

  .msg-bubble {
    max-width: 65%; padding: 10px 14px;
    border-radius: 16px; font-size: 14.5px; line-height: 1.55;
    position: relative; word-break: break-word;
  }
  .msg-row:not(.me) .msg-bubble {
    background: var(--msg-them); border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
  }
  .msg-row.me .msg-bubble {
    background: var(--msg-me); border: 1px solid rgba(79,110,247,0.3);
    border-bottom-right-radius: 4px; color: #dce3ff;
  }
  .msg-meta { font-size: 10.5px; color: var(--muted); margin-top: 3px; padding: 0 2px; }
  .msg-row.me .msg-meta { text-align: right; }
  .msg-sender { font-size: 11.5px; font-weight: 600; color: var(--accent); margin-bottom: 3px; }

  .typing-indicator { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 13px; padding: 6px 0; }
  .typing-dots { display: flex; gap: 3px; }
  .typing-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--muted); animation: bounce .9s infinite; }
  .typing-dot:nth-child(2) { animation-delay: .15s; }
  .typing-dot:nth-child(3) { animation-delay: .30s; }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }

  .msg-fade-in { animation: msgIn .25s ease both; }
  @keyframes msgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

  .input-bar {
    padding: 14px 20px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    display: flex; align-items: flex-end; gap: 10px;
  }
  .input-box {
    flex: 1; padding: 12px 14px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; color: var(--text); font-family: var(--font-body); font-size: 15px;
    resize: none; outline: none; max-height: 120px; transition: border .2s;
    line-height: 1.5;
  }
  .input-box:focus { border-color: var(--accent); }
  .input-box::placeholder { color: var(--muted); }
  .send-btn {
    width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none; color: #fff; font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: opacity .2s, transform .1s;
    box-shadow: 0 4px 15px var(--glow);
  }
  .send-btn:hover  { opacity: .9; }
  .send-btn:active { transform: scale(.93); }
  .send-btn:disabled { opacity: .35; cursor: default; }
  .input-actions { display: flex; gap: 4px; }

  /* ── Right Panel ── */
  .right-panel {
    width: 260px; min-width: 260px;
    background: var(--surface);
    border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    overflow-y: auto;
  }
  .right-panel::-webkit-scrollbar { width: 3px; }
  .right-panel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .rp-header { padding: 18px 16px 12px; font-family: var(--font-head); font-weight: 700; font-size: 15px; border-bottom: 1px solid var(--border); }
  .rp-section { padding: 14px 16px; border-bottom: 1px solid var(--border); }
  .rp-section-title { font-size: 11px; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; font-weight: 600; margin-bottom: 10px; }
  .member-item { display: flex; align-items: center; gap: 9px; margin-bottom: 10px; }
  .member-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0;
    position: relative;
  }
  .member-name { font-size: 13.5px; font-weight: 500; }
  .member-role { font-size: 11px; color: var(--muted); }
  .member-dot {
    position: absolute; bottom: 0; right: 0;
    width: 8px; height: 8px; border-radius: 50%;
    border: 2px solid var(--surface);
  }
  .dot-online  { background: var(--online); }
  .dot-offline { background: var(--muted); }
  .dot-away    { background: #f59e0b; }

  .media-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
  .media-thumb {
    aspect-ratio: 1; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; cursor: pointer; transition: transform .15s;
  }
  .media-thumb:hover { transform: scale(1.05); }

  /* ── Empty state ── */
  .empty-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    color: var(--muted);
  }
  .empty-icon { font-size: 52px; opacity: .4; }
  .empty-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; color: var(--text); }
  .empty-sub { font-size: 14px; text-align: center; max-width: 260px; }

  /* ── New Room Modal ── */
  .modal-backdrop {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,.6); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn .2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal-card {
    width: 380px; background: var(--card);
    border: 1px solid var(--border); border-radius: 16px; padding: 28px;
    animation: fadeUp .25s ease;
    box-shadow: 0 20px 60px rgba(0,0,0,.5);
  }
  .modal-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; margin-bottom: 18px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn-ghost {
    flex: 1; padding: 11px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 9px; color: var(--text); font-family: var(--font-body); font-size: 14px;
    cursor: pointer; transition: background .15s;
  }
  .btn-ghost:hover { background: var(--border); }
  .btn-accent {
    flex: 1; padding: 11px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none; border-radius: 9px; color: #fff;
    font-family: var(--font-head); font-size: 14px; font-weight: 700;
    cursor: pointer; transition: opacity .2s;
  }
  .btn-accent:hover { opacity: .9; }

  .emoji-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
  .emoji-opt { font-size: 22px; cursor: pointer; padding: 4px; border-radius: 6px; transition: background .15s; }
  .emoji-opt:hover, .emoji-opt.sel { background: rgba(79,110,247,0.2); }

  /* scrollbar minimal */
  * { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const ROOM_EMOJIS = ["💬","🚀","🎮","🎵","📚","🌍","💡","🔥","🎨","⚡","🌙","☕"];
const AVATAR_COLORS = ["#4f6ef7","#7c3aed","#0ea5e9","#10b981","#f59e0b","#ef4444","#ec4899","#14b8a6"];

const DEFAULT_ROOMS = [
  { id:"general", name:"General",    emoji:"💬", desc:"Main hangout", members:["Alice","Bob","Charlie","You"], ai:true },
  { id:"dev",     name:"Dev Talk",   emoji:"💻", desc:"Code & tech",  members:["Bob","You"],                  ai:true },
  { id:"gaming",  name:"Gaming",     emoji:"🎮", desc:"Games & fun",  members:["Charlie","You"],               ai:true },
  { id:"music",   name:"Music Vibes",emoji:"🎵", desc:"Beats & drops",members:["Alice","You"],                 ai:true },
];

const USERS = {
  Alice:   { color: AVATAR_COLORS[2] },
  Bob:     { color: AVATAR_COLORS[3] },
  Charlie: { color: AVATAR_COLORS[4] },
  You:     { color: AVATAR_COLORS[0] },
};

function initials(name) { return name.slice(0,2).toUpperCase(); }
function now() { return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}); }
function colorFor(name) { return USERS[name]?.color || AVATAR_COLORS[Math.abs(name.charCodeAt(0))%AVATAR_COLORS.length]; }

// ─── Fake AI personas per room ────────────────────────────────────────────────
const ROOM_PERSONA = {
  general: "You are a friendly, witty chat participant named 'Chatapp AI' in a general conversation room. Be casual, warm, occasionally funny. Keep replies 1-3 sentences.",
  dev:     "You are a senior developer participating in a tech chat. Give concise, insightful dev tips. Use occasional code terms. 1-3 sentences.",
  gaming:  "You are an enthusiastic gamer in a gaming chat room. Reference popular games, use gaming lingo, be hype. 1-3 sentences.",
  music:   "You are a music lover in a music chat room. Talk about vibes, artists, genres passionately. 1-3 sentences.",
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]         = useState("login"); // login | signup | app
  const [currentUser, setCurrentUser] = useState(null);
  const [accounts, setAccounts]     = useState({ alice:{ password:"1234", username:"Alice" } });

  const [rooms, setRooms]           = useState(DEFAULT_ROOMS);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages]     = useState({}); // roomId -> [{id,sender,text,time}]
  const [input, setInput]           = useState("");
  const [typing, setTyping]         = useState(false);
  const [search, setSearch]         = useState("");
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [newRoom, setNewRoom]       = useState({ name:"", emoji:"💬" });

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Init messages
  useEffect(() => {
    const init = {};
    DEFAULT_ROOMS.forEach(r => { init[r.id] = [
      { id: "s1", sender: "Alice",   text: `Hey everyone! Welcome to ${r.name} 👋`, time: "09:12", system: false },
      { id: "s2", sender: "Bob",     text: "Happy to be here!", time: "09:13", system: false },
      { id: "s3", sender: "Charlie", text: "Let's get started 🚀",time: "09:14", system: false },
    ]; });
    setMessages(init);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, activeRoom, typing]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const [loginForm,  setLoginForm]  = useState({ username:"", password:"" });
  const [signupForm, setSignupForm] = useState({ username:"", email:"", password:"", terms:false });
  const [authErr,    setAuthErr]    = useState("");

  function handleLogin(e) {
    e?.preventDefault();
    const u = loginForm.username.toLowerCase();
    if (accounts[u] && accounts[u].password === loginForm.password) {
      setCurrentUser({ username: accounts[u].username, email: accounts[u].email || "" });
      setScreen("app");
      setAuthErr("");
    } else { setAuthErr("Invalid username or password."); }
  }

  function handleSignup(e) {
    e?.preventDefault();
    if (!signupForm.username || !signupForm.password) return setAuthErr("All fields required.");
    if (!signupForm.terms) return setAuthErr("Please agree to the terms.");
    const key = signupForm.username.toLowerCase();
    if (accounts[key]) return setAuthErr("Username already taken.");
    setAccounts(p => ({ ...p, [key]: { password: signupForm.password, username: signupForm.username, email: signupForm.email } }));
    setCurrentUser({ username: signupForm.username, email: signupForm.email });
    // Add user to all rooms
    setRooms(prev => prev.map(r => ({ ...r, members: [...r.members.filter(m=>m!=="You"), signupForm.username, "You"] })));
    setScreen("app");
    setAuthErr("");
  }

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || !activeRoom) return;
    setInput("");

    const myMsg = { id: Date.now()+"u", sender: currentUser.username, text, time: now() };
    setMessages(p => ({ ...p, [activeRoom]: [...(p[activeRoom]||[]), myMsg] }));

    // Get AI reply
    const room = rooms.find(r => r.id === activeRoom);
    if (!room?.ai) return;

    setTyping(true);
    const history = (messages[activeRoom] || []).slice(-8).map(m => ({
      role: m.sender === currentUser.username ? "user" : "assistant",
      content: `${m.sender}: ${m.text}`
    }));
    history.push({ role:"user", content: `${currentUser.username}: ${text}` });

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          system: ROOM_PERSONA[activeRoom] || ROOM_PERSONA.general,
          messages: history
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "...";

      // Pick a random non-current-user member as the "speaker"
      const others = (room.members || []).filter(m => m !== currentUser.username && m !== "You");
      const speaker = others[Math.floor(Math.random()*others.length)] || "Chatapp AI";

      const aiMsg = { id: Date.now()+"a", sender: speaker, text: reply, time: now(), ai: true };
      setMessages(p => ({ ...p, [activeRoom]: [...(p[activeRoom]||[]), aiMsg] }));
    } catch {
      const errMsg = { id: Date.now()+"e", sender: "System", text: "⚠ Could not reach AI.", time: now(), system: true };
      setMessages(p => ({ ...p, [activeRoom]: [...(p[activeRoom]||[]), errMsg] }));
    } finally { setTyping(false); }
  }, [input, activeRoom, messages, currentUser, rooms]);

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  // ── New Room ──────────────────────────────────────────────────────────────
  function createRoom() {
    if (!newRoom.name.trim()) return;
    const id = newRoom.name.toLowerCase().replace(/\s+/g,"-") + "-" + Date.now();
    const r = { id, name: newRoom.name.trim(), emoji: newRoom.emoji, desc:"New room", members:["You", currentUser.username], ai:true };
    setRooms(p => [...p, r]);
    setMessages(p => ({ ...p, [id]: [] }));
    setActiveRoom(id);
    setShowNewRoom(false);
    setNewRoom({ name:"", emoji:"💬" });
  }

  const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: Auth
  if (screen === "login" || screen === "signup") {
    return (
      <>
        <style>{STYLES}</style>
        <div className="auth-wrap">
          <div className="auth-stars" />
          <div className="auth-card">
            <div className="auth-logo">
              <div className="auth-logo-icon">💬</div>
              <span className="auth-logo-name">Chatapp</span>
            </div>

            {screen === "login" ? (
              <>
                <div className="auth-title">Welcome back</div>
                <div className="auth-sub">Sign in to continue chatting</div>
                {authErr && <div className="error-msg">{authErr}</div>}
                <div className="field">
                  <label>Username</label>
                  <input placeholder="username" value={loginForm.username}
                    onChange={e => setLoginForm(p=>({...p, username:e.target.value}))}
                    onKeyDown={e => e.key==="Enter" && handleLogin()} />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={loginForm.password}
                    onChange={e => setLoginForm(p=>({...p, password:e.target.value}))}
                    onKeyDown={e => e.key==="Enter" && handleLogin()} />
                </div>
                <button className="btn-primary" onClick={handleLogin}>Sign in</button>
                <div className="auth-footer">
                  Don't have an account? <a onClick={()=>{setScreen("signup");setAuthErr("");}}>Sign up</a>
                </div>
                <div className="auth-footer" style={{marginTop:8,fontSize:12}}>
                  Demo: username <b>alice</b> / password <b>1234</b>
                </div>
              </>
            ) : (
              <>
                <div className="auth-title">Create account</div>
                <div className="auth-sub">Join the conversation today</div>
                {authErr && <div className="error-msg">{authErr}</div>}
                <div className="field">
                  <label>Username</label>
                  <input placeholder="username" value={signupForm.username}
                    onChange={e => setSignupForm(p=>({...p, username:e.target.value}))} />
                </div>
                <div className="field">
                  <label>Email address</label>
                  <input type="email" placeholder="you@example.com" value={signupForm.email}
                    onChange={e => setSignupForm(p=>({...p, email:e.target.value}))} />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={signupForm.password}
                    onChange={e => setSignupForm(p=>({...p, password:e.target.value}))} />
                </div>
                <div className="terms-row">
                  <input type="checkbox" checked={signupForm.terms}
                    onChange={e => setSignupForm(p=>({...p, terms:e.target.checked}))} />
                  <label>I agree to the <a>Terms of Use</a> &amp; <a>Privacy Policy</a></label>
                </div>
                <button className="btn-primary" onClick={handleSignup}>Create account</button>
                <div className="auth-footer">
                  Already have an account? <a onClick={()=>{setScreen("login");setAuthErr("");}}>Login here</a>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // RENDER: App
  const room = rooms.find(r => r.id === activeRoom);
  const msgs = (messages[activeRoom] || []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo-icon">💬</div>
            <span className="sidebar-logo-name">Chatapp</span>
            <button className="icon-btn" title="New Room" onClick={() => setShowNewRoom(true)}>＋</button>
          </div>

          <div className="search-wrap">
            <input className="search-input" placeholder="Search rooms…" value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="section-label">Rooms</div>
          <div className="room-list">
            {filteredRooms.map(r => {
              const unread = activeRoom === r.id ? 0 : (messages[r.id]?.length > 3 ? Math.floor(Math.random()*4) : 0);
              const last = messages[r.id]?.slice(-1)[0];
              return (
                <div key={r.id} className={`room-item${activeRoom===r.id?" active":""}`}
                  onClick={() => setActiveRoom(r.id)}>
                  <div className="room-icon">{r.emoji}</div>
                  <div className="room-info">
                    <div className="room-name">{r.name}</div>
                    <div className="room-last">{last ? `${last.sender}: ${last.text}` : r.desc}</div>
                  </div>
                  {unread > 0 && <span className="room-badge">{unread}</span>}
                </div>
              );
            })}
          </div>

          <div className="sidebar-footer">
            <div className="user-avatar">
              {initials(currentUser.username)}
              <div className="online-dot" />
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser.username}</div>
              <div className="user-status">● Online</div>
            </div>
            <button className="icon-btn" title="Sign out" onClick={() => { setScreen("login"); setCurrentUser(null); }}>⎋</button>
          </div>
        </aside>

        {/* ── Chat Area ── */}
        <main className="chat-area">
          {!room ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <div className="empty-title">Pick a room to chat</div>
              <div className="empty-sub">Select a room from the sidebar or create a new one to get started.</div>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-header-icon">{room.emoji}</div>
                <div className="chat-header-info">
                  <div className="chat-header-name">{room.name}</div>
                  <div className="chat-header-sub">{room.members?.length || 0} members · AI-enhanced</div>
                </div>
                <div className="chat-header-actions">
                  <button className="icon-btn" title="Members">👥</button>
                  <button className="icon-btn" title="Search">🔍</button>
                  <button className="icon-btn" title="Settings">⚙</button>
                </div>
              </div>

              <div className="messages-wrap">
                <div className="day-divider">Today</div>

                {msgs.map((m, i) => {
                  const isMe = m.sender === currentUser.username;
                  const prev = msgs[i-1];
                  const showAvatar = !isMe && (prev?.sender !== m.sender);
                  return (
                    <div key={m.id} className="msg-group msg-fade-in">
                      {!isMe && m.sender !== prev?.sender && (
                        <div style={{paddingLeft:36, marginBottom:1}}>
                          <span className="msg-sender">{m.sender}</span>
                        </div>
                      )}
                      <div className={`msg-row${isMe?" me":""}`}>
                        {!isMe && (
                          <div className="msg-avatar" style={{background: colorFor(m.sender), visibility: showAvatar?"visible":"hidden"}}>
                            {initials(m.sender)}
                          </div>
                        )}
                        <div>
                          <div className={`msg-bubble${m.system?" ":" "}`}
                            style={m.system?{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#fca5a5",fontStyle:"italic"}:{}}>
                            {m.text}
                          </div>
                          <div className="msg-meta">{m.time}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {typing && (
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
                    </div>
                    <span>AI is typing…</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="input-bar">
                <div className="input-actions">
                  <button className="icon-btn" title="Attach">📎</button>
                  <button className="icon-btn" title="Emoji">😊</button>
                </div>
                <textarea ref={inputRef} className="input-box" rows={1} value={input}
                  placeholder={`Message #${room.name.toLowerCase()}…`}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || typing}>
                  ➤
                </button>
              </div>
            </>
          )}
        </main>

        {/* ── Right Panel ── */}
        {room && (
          <aside className="right-panel">
            <div className="rp-header">Room Info</div>
            <div className="rp-section">
              <div className="rp-section-title">Members ({room.members?.length})</div>
              {(room.members || []).map((m,i) => (
                <div key={m} className="member-item">
                  <div className="member-avatar" style={{background: colorFor(m)}}>
                    {initials(m)}
                    <div className={`member-dot ${i%3===2?"dot-away":i%3===1?"dot-offline":"dot-online"}`} />
                  </div>
                  <div>
                    <div className="member-name">{m === "You" ? currentUser.username : m}</div>
                    <div className="member-role">{m === "You" || m === currentUser.username ? "You" : i===0?"Admin":"Member"}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rp-section">
              <div className="rp-section-title">About</div>
              <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>{room.desc}<br/>AI-enhanced conversations enabled ✨</div>
            </div>
            <div className="rp-section">
              <div className="rp-section-title">Media & Files</div>
              <div className="media-grid">
                {["🖼️","📄","🎵","🎥","📊","🗂️"].map((e,i)=>(
                  <div key={i} className="media-thumb" style={{background:"var(--card)"}}>{e}</div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* ── New Room Modal ── */}
        {showNewRoom && (
          <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && setShowNewRoom(false)}>
            <div className="modal-card">
              <div className="modal-title">Create New Room</div>
              <div style={{marginBottom:8, fontSize:12, color:"var(--muted)", textTransform:"uppercase", letterSpacing:".05em", fontWeight:600}}>Icon</div>
              <div className="emoji-row" style={{marginBottom:16}}>
                {ROOM_EMOJIS.map(e => (
                  <span key={e} className={`emoji-opt${newRoom.emoji===e?" sel":""}`}
                    onClick={()=>setNewRoom(p=>({...p,emoji:e}))}>{e}</span>
                ))}
              </div>
              <div className="field">
                <label>Room name</label>
                <input placeholder="e.g. Design Team" value={newRoom.name}
                  onChange={e => setNewRoom(p=>({...p,name:e.target.value}))}
                  onKeyDown={e => e.key==="Enter" && createRoom()} />
              </div>
              <div className="modal-actions">
                <button className="btn-ghost" onClick={()=>setShowNewRoom(false)}>Cancel</button>
                <button className="btn-accent" onClick={createRoom}>Create Room</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

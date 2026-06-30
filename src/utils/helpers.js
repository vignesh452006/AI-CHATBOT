import { AVATAR_COLORS, SOLID_COLORS, DEMO_USERS } from './constants';

export function initials(name = '') {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'long', day: 'numeric' });
}

export function colorFor(name) {
  if (DEMO_USERS[name]) return DEMO_USERS[name].color;
  const idx = Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % SOLID_COLORS.length;
  return SOLID_COLORS[idx];
}

export function gradientFor(name) {
  if (DEMO_USERS[name]) return DEMO_USERS[name].gradient;
  const idx = Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function statusFor(name) {
  return DEMO_USERS[name]?.status || 'offline';
}

export function bioFor(name) {
  return DEMO_USERS[name]?.bio || 'Chatapp user';
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function parseCommand(text) {
  const trimmed = text.trim();
  const cmd = trimmed.split(' ')[0].toLowerCase();
  const args = trimmed.slice(cmd.length).trim();
  return { cmd, args };
}

export function linkify(text) {
  return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function groupMessagesByDate(messages) {
  const groups = {};
  messages.forEach(m => {
    const key = m.date || 'Today';
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

export function getCommandHelp() {
  return [
    { cmd: '/summarize', desc: 'Summarize recent conversation' },
    { cmd: '/translate', desc: 'Translate last message to 3 languages' },
    { cmd: '/quiz',      desc: 'Generate a trivia quiz' },
    { cmd: '/roast',     desc: 'Roast the last message' },
    { cmd: '/poem',      desc: 'Write a poem about the topic' },
    { cmd: '/tldr',      desc: 'One-sentence summary' },
    { cmd: '/idea',      desc: 'Generate 3 creative ideas' },
    { cmd: '/fact',      desc: 'Share an interesting fact' },
    { cmd: '/help',      desc: 'Show all commands' },
  ];
}

import React, { useState, useEffect } from 'react';
import './index.css';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import RightPanel from './components/RightPanel';
import { NewRoomModal, ProfileModal } from './components/Modals';
import { DEFAULT_ROOMS, DEMO_USERS } from './utils/constants';
import { uid, now } from './utils/helpers';

// Seed demo accounts
const INITIAL_ACCOUNTS = {
  alice: { password: '1234', username: 'Alice', email: 'alice@chatapp.io', bio: 'Product designer 🎨', status: 'online' },
  bob:   { password: '1234', username: 'Bob',   email: 'bob@chatapp.io',   bio: 'Full-stack dev 🧑‍💻',  status: 'online' },
};

function seedMessages() {
  const seeds = {
    general: [
      { id: uid(), sender: 'Alice',   text: 'Hey team! Welcome to Chatapp 👋', time: '09:10', date: 'Today', reactions: {} },
      { id: uid(), sender: 'Bob',     text: 'Loving the new design! The AI features are 🔥', time: '09:11', date: 'Today', reactions: { '🔥': ['Alice'] } },
      { id: uid(), sender: 'Charlie', text: 'Try typing /quiz in the chat — so cool!', time: '09:12', date: 'Today', reactions: {} },
      { id: uid(), sender: 'Diana',   text: 'I used /poem and it wrote something beautiful 🎵', time: '09:13', date: 'Today', reactions: { '❤️': ['Bob', 'Alice'] } },
    ],
    dev: [
      { id: uid(), sender: 'Bob',     text: 'Pushed a big refactor to the auth module. PR is up!', time: '10:00', date: 'Today', reactions: {} },
      { id: uid(), sender: 'Charlie', text: 'Nice! I left some comments. Will review after standup', time: '10:04', date: 'Today', reactions: {} },
    ],
    gaming: [
      { id: uid(), sender: 'Charlie', text: 'Game night Saturday — who\'s in? 🎮', time: '11:30', date: 'Today', reactions: {} },
      { id: uid(), sender: 'Diana',   text: 'I\'m in! What are we playing?', time: '11:32', date: 'Today', reactions: {} },
    ],
    music: [
      { id: uid(), sender: 'Alice',   text: 'Found the most incredible lo-fi playlist 🎵', time: '08:45', date: 'Today', reactions: {} },
      { id: uid(), sender: 'Diana',   text: 'Drop the link! I need background music while coding', time: '08:47', date: 'Today', reactions: {} },
    ],
    'ai-lab': [
      { id: uid(), sender: 'Bob',     text: 'Try /summarize after chatting a bit — it\'s mind-blowing', time: '12:00', date: 'Today', reactions: {} },
      { id: uid(), sender: 'Alice',   text: 'The /roast command is hilarious 😂', time: '12:02', date: 'Today', reactions: { '😂': ['Bob', 'Charlie'] } },
    ],
  };
  return seeds;
}

export default function App() {
  const [screen, setScreen] = useState('auth'); // auth | app
  const [currentUser, setCurrentUser] = useState(null);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState(seedMessages);
  const [search, setSearch] = useState('');
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [dmRooms, setDmRooms] = useState([]);

  // Track unread counts
  useEffect(() => {
    if (!activeRoom) return;
    setUnreadCounts(p => ({ ...p, [activeRoom]: 0 }));
  }, [activeRoom, messages]);

  function handleLogin(username, password) {
    const key = username.toLowerCase().trim();
    const acc = accounts[key];
    if (!acc) return { ok: false, error: 'Username not found.' };
    if (acc.password !== password) return { ok: false, error: 'Incorrect password.' };
    setCurrentUser({ username: acc.username, email: acc.email, bio: acc.bio, status: acc.status });
    setScreen('app');
    setActiveRoom('general');
    return { ok: true };
  }

  function handleSignup(form) {
    const key = form.username.toLowerCase().trim();
    if (accounts[key]) return { ok: false, error: 'Username already taken. Try another.' };
    const newAcc = { password: form.password, username: form.username, email: form.email, bio: '', status: 'online' };
    setAccounts(p => ({ ...p, [key]: newAcc }));
    setCurrentUser({ username: form.username, email: form.email, bio: '', status: 'online' });
    // Add user to all public rooms
    setRooms(prev => prev.map(r => ({
      ...r, members: [...(r.members || []).filter(m => m !== form.username), form.username],
    })));
    setScreen('app');
    setActiveRoom('general');
    return { ok: true };
  }

  function handleLogout() {
    setScreen('auth');
    setCurrentUser(null);
    setActiveRoom(null);
    setSearch('');
  }

  function handleSelectRoom(id) {
    setActiveRoom(id);
    setUnreadCounts(p => ({ ...p, [id]: 0 }));
  }

  function handleNewRoom({ name, emoji, desc, isPrivate }) {
    const id = 'room-' + uid();
    const newRoom = {
      id, name, emoji, desc: desc || 'A new room',
      members: [currentUser.username, 'Alice', 'Bob'],
      topic: desc || '',
      pinned: [],
      ai: true,
      isPrivate,
    };
    setRooms(p => [...p, newRoom]);
    setMessages(p => ({ ...p, [id]: [
      { id: uid(), sender: 'System', text: `🎉 Room #${name} created by ${currentUser.username}`, time: now(), date: 'Today', reactions: {}, isSystem: true }
    ]}));
    setActiveRoom(id);
  }

  function handleSaveProfile(updates) {
    setCurrentUser(p => ({ ...p, ...updates }));
    setAccounts(p => {
      const key = currentUser.username.toLowerCase();
      return { ...p, [key]: { ...(p[key] || {}), ...updates } };
    });
  }

  const activeRoomObj = rooms.find(r => r.id === activeRoom) || null;

  if (screen === 'auth') {
    return <Auth onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        currentUser={currentUser}
        rooms={rooms}
        activeRoom={activeRoom}
        messages={messages}
        onSelectRoom={handleSelectRoom}
        onNewRoom={() => setShowNewRoom(true)}
        onLogout={handleLogout}
        onOpenProfile={() => setShowProfile(true)}
        search={search}
        setSearch={setSearch}
        unreadCounts={unreadCounts}
        dmRooms={dmRooms}
        onOpenDMs={() => {}}
      />

      <ChatArea
        room={activeRoomObj}
        messages={messages}
        setMessages={setMessages}
        currentUser={currentUser}
        allRooms={rooms}
      />

      <RightPanel
        room={activeRoomObj}
        currentUser={currentUser}
        allUsers={DEMO_USERS}
        messages={messages}
      />

      {showNewRoom && (
        <NewRoomModal
          onClose={() => setShowNewRoom(false)}
          onCreate={handleNewRoom}
        />
      )}

      {showProfile && currentUser && (
        <ProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfile(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}

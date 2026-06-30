import React, { useState, useRef, useEffect, useCallback } from 'react';
import { initials, colorFor, now, uid, parseCommand, getCommandHelp } from '../utils/helpers';
import { getChatReply, runAICommand, getSmartReply, getMoodAnalysis, getTopicSuggestions, translateMessage, checkBackendHealth, AIServiceError } from '../utils/aiService';
import { REACTIONS, DEMO_USERS } from '../utils/constants';
import styles from './ChatArea.module.css';

function errorBannerText(err) {
  if (err instanceof AIServiceError) {
    if (err.kind === 'offline') return '🔌 Backend offline — start it with "npm start" inside the /server folder, then refresh.';
    if (err.kind === 'no-key') return '🔑 No Groq API key configured. Get a free one at console.groq.com/keys, set GROQ_API_KEY, and restart the server.';
    if (err.kind === 'api') return `⚠ AI request failed: ${err.message}`;
  }
  return '⚠ Could not reach AI. Check your connection and that the backend is running.';
}

export default function ChatArea({ room, messages, setMessages, currentUser, allRooms }) {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [aiTypingLabel, setAiTypingLabel] = useState('AI is typing…');
  const [smartReplies, setSmartReplies] = useState([]);
  const [smartLoading, setSmartLoading] = useState(false);
  const [mood, setMood] = useState(null);
  const [moodLoading, setMoodLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cmdMenu, setCmdMenu] = useState(false);
  const [reactionTarget, setReactionTarget] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [msgSearch, setMsgSearch] = useState('');
  const [showPinned, setShowPinned] = useState(false);
  const [translatingId, setTranslatingId] = useState(null);
  const [translatedMsgs, setTranslatedMsgs] = useState({});
  const [backendStatus, setBackendStatus] = useState({ checked: false, ok: true });

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  const msgs = messages[room?.id] || [];
  const filteredMsgs = msgSearch
    ? msgs.filter(m => m.text?.toLowerCase().includes(msgSearch.toLowerCase()))
    : msgs;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    let cancelled = false;
    checkBackendHealth().then(res => { if (!cancelled) setBackendStatus({ checked: true, ...res }); });
    const interval = setInterval(() => {
      checkBackendHealth().then(res => { if (!cancelled) setBackendStatus({ checked: true, ...res }); });
    }, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  useEffect(() => {
    setSmartReplies([]);
    setSuggestions([]);
    setMood(null);
    setShowSuggestions(false);
  }, [room?.id]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const addMessage = useCallback((msg) => {
    setMessages(p => ({ ...p, [room.id]: [...(p[room.id] || []), msg] }));
  }, [room?.id, setMessages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || !room) return;
    setInput('');
    setSmartReplies([]);
    setCmdMenu(false);

    // Check for slash command
    const { cmd, args } = parseCommand(text);
    const isCmd = cmd.startsWith('/');

    const myMsg = {
      id: uid(), sender: currentUser.username,
      text, time: now(), date: 'Today', reactions: {},
    };
    addMessage(myMsg);

    const history = messages[room.id] || [];
    setTyping(true);

    try {
      if (isCmd) {
        setAiTypingLabel('🤖 AI processing command…');
        const result = await runAICommand({ cmd, args, history: [...history, myMsg], roomId: room.id, username: currentUser.username });
        if (result) {
          addMessage({ id: uid(), sender: '🤖 Chatapp AI', text: result, time: now(), date: 'Today', reactions: {}, isAI: true, isCmdResponse: true });
        }
      } else {
        // Pick a random other member to "respond"
        const others = (room.members || []).filter(m => m !== currentUser.username);
        const speaker = others[Math.floor(Math.random() * others.length)] || 'Chatapp AI';
        setAiTypingLabel(`${speaker} is typing…`);

        const reply = await getChatReply({
          roomId: room.id,
          history,
          userMessage: text,
          username: currentUser.username,
        });

        addMessage({ id: uid(), sender: speaker, text: reply, time: now(), date: 'Today', reactions: {}, isAI: true });

        // After reply, fetch smart replies for user
        fetchSmartReplies(reply);
      }
    } catch (e) {
      addMessage({ id: uid(), sender: 'System', text: errorBannerText(e), time: now(), date: 'Today', reactions: {}, isSystem: true });
    } finally {
      setTyping(false);
    }
  }, [input, room, messages, currentUser, addMessage]);

  async function fetchSmartReplies(lastMsg) {
    setSmartLoading(true);
    try {
      const parsed = await getSmartReply({ messageText: lastMsg, username: currentUser.username });
      setSmartReplies(parsed);
    } catch (e) {
      setSmartReplies([]);
    } finally { setSmartLoading(false); }
  }

  async function fetchMood() {
    if (msgs.length < 3) {
      addMessage({ id: uid(), sender: 'System', text: 'Need at least 3 messages in this room before analyzing mood.', time: now(), date: 'Today', reactions: {}, isSystem: true });
      return;
    }
    setMoodLoading(true);
    try {
      const parsed = await getMoodAnalysis({ messages: msgs });
      if (parsed) setMood(parsed);
      else addMessage({ id: uid(), sender: 'System', text: '⚠ Mood analysis failed to parse. Try again.', time: now(), date: 'Today', reactions: {}, isSystem: true });
    } catch (e) {
      addMessage({ id: uid(), sender: 'System', text: errorBannerText(e), time: now(), date: 'Today', reactions: {}, isSystem: true });
    } finally { setMoodLoading(false); }
  }

  async function fetchSuggestions() {
    setShowSuggestions(true);
    try {
      const parsed = await getTopicSuggestions({ roomId: room.id, history: msgs });
      setSuggestions(parsed);
    } catch (e) {
      setSuggestions([]);
      addMessage({ id: uid(), sender: 'System', text: errorBannerText(e), time: now(), date: 'Today', reactions: {}, isSystem: true });
    }
  }

  async function handleTranslate(msgId, text) {
    setTranslatingId(msgId);
    try {
      const translated = await translateMessage({ text, targetLang: 'Spanish' });
      setTranslatedMsgs(p => ({ ...p, [msgId]: translated }));
    } catch (e) {
      addMessage({ id: uid(), sender: 'System', text: errorBannerText(e), time: now(), date: 'Today', reactions: {}, isSystem: true });
    } finally { setTranslatingId(null); }
  }

  function handleReaction(msgId, emoji) {
    setMessages(p => {
      const roomMsgs = [...(p[room.id] || [])];
      const idx = roomMsgs.findIndex(m => m.id === msgId);
      if (idx < 0) return p;
      const msg = { ...roomMsgs[idx] };
      const reactions = { ...msg.reactions };
      if (reactions[emoji]?.includes(currentUser.username)) {
        reactions[emoji] = reactions[emoji].filter(u => u !== currentUser.username);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        reactions[emoji] = [...(reactions[emoji] || []), currentUser.username];
      }
      msg.reactions = reactions;
      roomMsgs[idx] = msg;
      return { ...p, [room.id]: roomMsgs };
    });
    setReactionTarget(null);
  }

  function handleEdit(msg) {
    setEditingId(msg.id);
    setEditText(msg.text);
  }

  function saveEdit(msgId) {
    setMessages(p => {
      const roomMsgs = (p[room.id] || []).map(m =>
        m.id === msgId ? { ...m, text: editText, edited: true } : m
      );
      return { ...p, [room.id]: roomMsgs };
    });
    setEditingId(null);
  }

  function deleteMsg(msgId) {
    setMessages(p => ({
      ...p,
      [room.id]: (p[room.id] || []).filter(m => m.id !== msgId),
    }));
  }

  function pinMessage(text) {
    // Visual feedback only
    addMessage({ id: uid(), sender: 'System', text: `📌 Pinned: "${text.slice(0, 40)}…"`, time: now(), date: 'Today', reactions: {}, isSystem: true });
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    if (e.key === 'Escape') { setInput(''); setCmdMenu(false); }
  }

  function handleInputChange(e) {
    const val = e.target.value;
    setInput(val);
    if (val.startsWith('/')) setCmdMenu(true);
    else setCmdMenu(false);
  }

  if (!room) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <div className={styles.emptyTitle}>Pick a room to start chatting</div>
        <div className={styles.emptySub}>Select a channel or direct message from the sidebar, or create a new room.</div>
        <div className={styles.emptyHint}>
          <span>💡 Tip:</span> Type <code>/help</code> in any room to see AI commands
        </div>
      </div>
    );
  }

  const onlineCount = (room.members || []).filter(m => DEMO_USERS[m]?.status === 'online' || m === currentUser.username).length;

  return (
    <div className={styles.area}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.roomIcon}>{room.emoji}</div>
          <div className={styles.headerInfo}>
            <div className={styles.roomName}>
              {room.isDM ? room.name : `# ${room.name}`}
              {room.ai && <span className={styles.aiBadge}>AI</span>}
            </div>
            <div className={styles.roomSub}>
              {room.topic || `${room.members?.length || 0} members · ${onlineCount} online`}
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.hBtn} title="Mood Analysis" onClick={fetchMood} disabled={moodLoading}>
            {moodLoading ? '⏳' : '🧠'}
          </button>
          <button className={styles.hBtn} title="Topic Suggestions" onClick={fetchSuggestions}>💡</button>
          <button className={styles.hBtn} title={showPinned ? 'Hide Pinned' : 'Pinned Messages'} onClick={() => setShowPinned(p => !p)}>📌</button>
          <button className={`${styles.hBtn}${showSearch ? ' ' + styles.hBtnActive : ''}`} title="Search Messages" onClick={() => setShowSearch(p => !p)}>🔍</button>
          <button className={styles.hBtn} title="Members">👥</button>
        </div>
      </div>

      {/* Backend connection banner */}
      {backendStatus.checked && !backendStatus.ok && (
        <div className={styles.offlineBanner}>
          {backendStatus.reason === 'no-key'
            ? '🔑 AI backend is running but missing GROQ_API_KEY. Get a free key at console.groq.com/keys, set it, and restart the server.'
            : '🔌 AI backend not reachable. Run "npm start" inside the /server folder, then refresh this page.'}
        </div>
      )}

      {/* Mood Banner */}
      {mood && (
        <div className={styles.moodBanner}>
          <span>{mood.emoji} <strong>Room mood:</strong> {mood.mood}</span>
          <span className={styles.moodScore}>Positivity: {mood.score}%</span>
          <span className={styles.moodSummary}>{mood.summary}</span>
          <button className={styles.moodClose} onClick={() => setMood(null)}>✕</button>
        </div>
      )}

      {/* Pinned messages */}
      {showPinned && room.pinned?.length > 0 && (
        <div className={styles.pinnedBar}>
          <span className={styles.pinnedIcon}>📌</span>
          <div className={styles.pinnedList}>
            {room.pinned.map((p, i) => <div key={i} className={styles.pinnedItem}>{p}</div>)}
          </div>
          <button className={styles.hBtn} onClick={() => setShowPinned(false)}>✕</button>
        </div>
      )}

      {/* Message search */}
      {showSearch && (
        <div className={styles.searchBar}>
          <input
            className={styles.searchInput}
            placeholder="Search messages in this room…"
            value={msgSearch}
            onChange={e => setMsgSearch(e.target.value)}
            autoFocus
          />
          {msgSearch && <span className={styles.searchCount}>{filteredMsgs.length} results</span>}
          <button className={styles.hBtn} onClick={() => { setShowSearch(false); setMsgSearch(''); }}>✕</button>
        </div>
      )}

      {/* Topic suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={styles.suggestions}>
          <span className={styles.suggestLabel}>💡 AI Suggestions:</span>
          {suggestions.map((s, i) => (
            <button key={i} className={styles.suggestChip} onClick={() => { setInput(s); setShowSuggestions(false); inputRef.current?.focus(); }}>
              {s}
            </button>
          ))}
          <button className={styles.hBtn} onClick={() => setShowSuggestions(false)}>✕</button>
        </div>
      )}

      {/* Messages */}
      <div className={styles.messages} onClick={() => { setReactionTarget(null); }}>
        {filteredMsgs.length === 0 && !msgSearch && (
          <div className={styles.roomWelcome}>
            <div className={styles.welcomeIcon}>{room.emoji}</div>
            <div className={styles.welcomeTitle}>Welcome to # {room.name}!</div>
            <div className={styles.welcomeSub}>{room.desc}</div>
            <div className={styles.commandHint}>
              Try AI commands: <code>/help</code> <code>/quiz</code> <code>/poem</code> <code>/fact</code>
            </div>
          </div>
        )}

        {filteredMsgs.map((m, i) => {
          const isMe = m.sender === currentUser.username;
          const prev = filteredMsgs[i - 1];
          const showSender = !isMe && prev?.sender !== m.sender;
          const isSystem = m.isSystem;
          const isCmdResponse = m.isCmdResponse;
          const hasReactions = Object.keys(m.reactions || {}).length > 0;
          const translated = translatedMsgs[m.id];

          if (isSystem) return (
            <div key={m.id} className={styles.systemMsg}>{m.text}</div>
          );

          return (
            <div key={m.id} className={`${styles.msgGroup} ${styles.msgFadeIn}`}>
              {showSender && !isMe && (
                <div className={styles.msgSenderRow}>
                  <div className={styles.msgAvatar} style={{ background: colorFor(m.sender) }}>
                    {initials(m.sender)}
                  </div>
                  <span className={styles.msgSender}>{m.sender}</span>
                  <span className={styles.msgTime}>{m.time}</span>
                </div>
              )}
              <div className={`${styles.msgRow}${isMe ? ' ' + styles.me : ''}`}>
                {!isMe && !showSender && <div className={styles.avatarSpacer} />}
                <div className={styles.msgWrap}>
                  {editingId === m.id ? (
                    <div className={styles.editWrap}>
                      <textarea
                        className={styles.editInput}
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(m.id); } if (e.key === 'Escape') setEditingId(null); }}
                        autoFocus
                      />
                      <div className={styles.editActions}>
                        <button className={styles.editSave} onClick={() => saveEdit(m.id)}>Save</button>
                        <button className={styles.editCancel} onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${styles.bubble}${isMe ? ' ' + styles.bubbleMe : ''}${isCmdResponse ? ' ' + styles.bubbleCmd : ''}`}
                      onMouseEnter={e => e.currentTarget.querySelector('.' + styles.msgActions)?.classList.add(styles.visible)}
                      onMouseLeave={e => e.currentTarget.querySelector('.' + styles.msgActions)?.classList.remove(styles.visible)}
                    >
                      {isCmdResponse && <div className={styles.cmdBadge}>🤖 AI Response</div>}
                      <div className={styles.bubbleText}>
                        {m.text.split('\n').map((line, li) => (
                          <React.Fragment key={li}>{line}{li < m.text.split('\n').length - 1 && <br />}</React.Fragment>
                        ))}
                        {m.edited && <span className={styles.editedLabel}> (edited)</span>}
                      </div>
                      {translated && (
                        <div className={styles.translation}>
                          🇪🇸 {translated}
                          <button className={styles.clearTranslate} onClick={() => setTranslatedMsgs(p => { const n = {...p}; delete n[m.id]; return n; })}>✕</button>
                        </div>
                      )}
                      {isMe && !isCmdResponse && (
                        <div className={styles.readReceipt}>✓✓</div>
                      )}
                      <div className={styles.msgActions}>
                        <button title="React" onClick={e => { e.stopPropagation(); setReactionTarget(reactionTarget === m.id ? null : m.id); }}>😊</button>
                        <button title="Translate to Spanish" onClick={() => handleTranslate(m.id, m.text)} disabled={translatingId === m.id}>
                          {translatingId === m.id ? '⏳' : '🌐'}
                        </button>
                        {isMe && <button title="Edit" onClick={() => handleEdit(m)}>✏️</button>}
                        <button title="Pin message" onClick={() => pinMessage(m.text)}>📌</button>
                        {isMe && <button title="Delete" onClick={() => deleteMsg(m.id)} className={styles.deleteBtn}>🗑</button>}
                      </div>
                    </div>
                  )}

                  {/* Reactions */}
                  {hasReactions && (
                    <div className={styles.reactionsBar}>
                      {Object.entries(m.reactions).map(([emoji, users]) => (
                        <button
                          key={emoji}
                          className={`${styles.reactionBadge}${users.includes(currentUser.username) ? ' ' + styles.reactionMine : ''}`}
                          onClick={() => handleReaction(m.id, emoji)}
                          title={users.join(', ')}
                        >
                          {emoji} {users.length}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Reaction picker */}
                  {reactionTarget === m.id && (
                    <div className={styles.reactionPicker} onClick={e => e.stopPropagation()}>
                      {REACTIONS.map(e => (
                        <button key={e} onClick={() => handleReaction(m.id, e)} className={styles.reactionOpt}>{e}</button>
                      ))}
                    </div>
                  )}
                </div>
                {isMe && !showSender && (
                  <div className={styles.avatarSpacer} />
                )}
              </div>
            </div>
          );
        })}

        {typing && (
          <div className={styles.typingRow}>
            <div className={styles.typingDots}>
              <span /><span /><span />
            </div>
            <span className={styles.typingLabel}>{aiTypingLabel}</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Smart replies */}
      {(smartReplies.length > 0 || smartLoading) && (
        <div className={styles.smartReplies}>
          <span className={styles.srLabel}>✨ Smart replies:</span>
          {smartLoading && <span className={styles.srLoading}>Loading…</span>}
          {smartReplies.map((r, i) => (
            <button key={i} className={styles.srChip} onClick={() => { setInput(r); inputRef.current?.focus(); setSmartReplies([]); }}>
              {r}
            </button>
          ))}
          <button className={styles.srClose} onClick={() => setSmartReplies([])}>✕</button>
        </div>
      )}

      {/* Command menu */}
      {cmdMenu && input.startsWith('/') && (
        <div className={styles.cmdMenu}>
          <div className={styles.cmdMenuTitle}>⚡ AI Commands</div>
          {getCommandHelp().filter(c => c.cmd.startsWith(input.split(' ')[0])).map(c => (
            <div key={c.cmd} className={styles.cmdItem} onClick={() => { setInput(c.cmd + ' '); inputRef.current?.focus(); setCmdMenu(false); }}>
              <code className={styles.cmdCode}>{c.cmd}</code>
              <span className={styles.cmdDesc}>{c.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className={styles.inputBar}>
        <button className={styles.inputBtn} title="Attach file">📎</button>
        <button className={styles.inputBtn} title="AI Commands" onClick={() => { setInput('/'); inputRef.current?.focus(); setCmdMenu(true); }}>⚡</button>
        <div className={styles.inputWrap}>
          <textarea
            ref={el => { textareaRef.current = el; inputRef.current = el; }}
            className={styles.inputBox}
            rows={1}
            value={input}
            placeholder={`Message # ${room.name}… (type / for AI commands)`}
            onChange={handleInputChange}
            onKeyDown={handleKey}
          />
        </div>
        <button className={styles.inputBtn} title="Emoji">😊</button>
        <button
          className={styles.sendBtn}
          onClick={sendMessage}
          disabled={!input.trim() || typing}
          title="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

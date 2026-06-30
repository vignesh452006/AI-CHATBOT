import React, { useState } from 'react';
import { initials, colorFor, statusFor, bioFor } from '../utils/helpers';
import styles from './RightPanel.module.css';

export default function RightPanel({ room, currentUser, allUsers, messages }) {
  const [tab, setTab] = useState('members'); // members | ai | media | pinned

  const msgs = messages[room?.id] || [];
  const mediaEmojis = ['🖼️','📄','🎵','🎥','📊','🗂️','📸','🎬'];

  if (!room) return null;

  const members = room.members || [];

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.roomEmoji}>{room.emoji}</div>
        <div className={styles.roomInfo}>
          <div className={styles.roomName}>{room.name}</div>
          <div className={styles.roomDesc}>{room.desc}</div>
        </div>
      </div>

      <div className={styles.tabs}>
        {['members','ai','media','pinned'].map(t => (
          <button key={t} className={`${styles.tab}${tab === t ? ' ' + styles.tabActive : ''}`} onClick={() => setTab(t)}>
            {t === 'members' ? '👥' : t === 'ai' ? '🤖' : t === 'media' ? '📁' : '📌'}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'members' && (
          <>
            <div className={styles.sectionTitle}>Members · {members.length}</div>
            {members.map((m, i) => {
              const isMe = m === currentUser.username;
              const status = isMe ? 'online' : statusFor(m);
              return (
                <div key={m} className={styles.memberItem}>
                  <div className={styles.memberAvatarWrap}>
                    <div className={styles.memberAvatar} style={{ background: colorFor(m) }}>
                      {initials(isMe ? currentUser.username : m)}
                    </div>
                    <div className={`${styles.statusDot} ${styles[status]}`} />
                  </div>
                  <div className={styles.memberInfo}>
                    <div className={styles.memberName}>
                      {isMe ? currentUser.username : m}
                      {isMe && <span className={styles.youBadge}>You</span>}
                      {i === 0 && !isMe && <span className={styles.adminBadge}>Admin</span>}
                    </div>
                    <div className={styles.memberBio}>{isMe ? (currentUser.bio || 'Chatapp user') : bioFor(m)}</div>
                    <div className={styles.memberStatus}>{status === 'online' ? '● Online' : status === 'away' ? '◑ Away' : '○ Offline'}</div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {tab === 'ai' && (
          <>
            <div className={styles.sectionTitle}>AI Features</div>
            <div className={styles.aiCard}>
              <div className={styles.aiCardTitle}>⚡ Slash Commands</div>
              <div className={styles.aiCardDesc}>Type / in the chat to use AI superpowers</div>
              <div className={styles.cmdList}>
                {[
                  ['/summarize','Summarize conversation'],
                  ['/translate','Translate last message'],
                  ['/quiz','Generate trivia quiz'],
                  ['/roast','Roast the last message'],
                  ['/poem','Write a poem'],
                  ['/tldr','One-sentence summary'],
                  ['/idea','Generate 3 ideas'],
                  ['/fact','Share a fun fact'],
                  ['/help','Show all commands'],
                ].map(([cmd, desc]) => (
                  <div key={cmd} className={styles.cmdRow}>
                    <code className={styles.cmdCode}>{cmd}</code>
                    <span className={styles.cmdDesc}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiCardTitle}>🧠 Mood Analysis</div>
              <div className={styles.aiCardDesc}>Click 🧠 in the header to analyze the room's emotional vibe</div>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiCardTitle}>✨ Smart Replies</div>
              <div className={styles.aiCardDesc}>AI suggests reply options after each message in the room</div>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiCardTitle}>💡 Topic Suggestions</div>
              <div className={styles.aiCardDesc}>Click 💡 to get AI-generated conversation starters</div>
            </div>
            <div className={styles.aiCard}>
              <div className={styles.aiCardTitle}>🌐 Live Translation</div>
              <div className={styles.aiCardDesc}>Hover any message → click 🌐 to translate to Spanish instantly</div>
            </div>
          </>
        )}

        {tab === 'media' && (
          <>
            <div className={styles.sectionTitle}>Shared Media</div>
            <div className={styles.mediaGrid}>
              {mediaEmojis.map((e, i) => (
                <div key={i} className={styles.mediaTile}>{e}</div>
              ))}
            </div>
            <div className={styles.sectionTitle} style={{ marginTop: 16 }}>Recent Links</div>
            {['https://github.com','https://docs.chatapp.io','https://chatapp.io'].map((l, i) => (
              <div key={i} className={styles.linkItem}>
                <span className={styles.linkIcon}>🔗</span>
                <span className={styles.linkUrl}>{l}</span>
              </div>
            ))}
            <div className={styles.sectionTitle} style={{ marginTop: 16 }}>Stats</div>
            <div className={styles.stats}>
              <div className={styles.statItem}><span className={styles.statNum}>{msgs.length}</span><span className={styles.statLabel}>Messages</span></div>
              <div className={styles.statItem}><span className={styles.statNum}>{members.length}</span><span className={styles.statLabel}>Members</span></div>
              <div className={styles.statItem}><span className={styles.statNum}>3</span><span className={styles.statLabel}>Files</span></div>
            </div>
          </>
        )}

        {tab === 'pinned' && (
          <>
            <div className={styles.sectionTitle}>Pinned Messages</div>
            {(room.pinned || []).length === 0 && (
              <div className={styles.emptyTab}>No pinned messages yet.<br />Hover a message and click 📌 to pin.</div>
            )}
            {(room.pinned || []).map((p, i) => (
              <div key={i} className={styles.pinnedItem}>
                <span className={styles.pinIcon}>📌</span>
                <span className={styles.pinText}>{p}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}

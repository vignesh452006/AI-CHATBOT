import React, { useState } from 'react';
import { initials, colorFor } from '../utils/helpers';
import styles from './Sidebar.module.css';

export default function Sidebar({
  currentUser, rooms, activeRoom, messages,
  onSelectRoom, onNewRoom, onLogout, onOpenProfile, search, setSearch,
  unreadCounts, onOpenDMs, dmRooms,
}) {
  const [section, setSection] = useState('rooms'); // rooms | dms

  const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>💬</div>
          <span className={styles.logoName}>Chatapp</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} title="New Room" onClick={onNewRoom}>＋</button>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search rooms, people…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* Section tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab}${section === 'rooms' ? ' ' + styles.tabActive : ''}`} onClick={() => setSection('rooms')}>
          Rooms
        </button>
        <button className={`${styles.tab}${section === 'dms' ? ' ' + styles.tabActive : ''}`} onClick={() => setSection('dms')}>
          Direct Messages
        </button>
      </div>

      {/* Room/DM List */}
      <div className={styles.list}>
        {section === 'rooms' && (
          <>
            <div className={styles.sectionLabel}>Channels</div>
            {filteredRooms.length === 0 && (
              <div className={styles.empty}>No rooms found</div>
            )}
            {filteredRooms.map(r => {
              const msgs = messages[r.id] || [];
              const last = msgs[msgs.length - 1];
              const unread = unreadCounts[r.id] || 0;
              return (
                <div
                  key={r.id}
                  className={`${styles.item}${activeRoom === r.id ? ' ' + styles.active : ''}`}
                  onClick={() => onSelectRoom(r.id)}
                >
                  <div className={styles.itemIcon}>{r.emoji}</div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}># {r.name}</div>
                    <div className={styles.itemLast}>
                      {last ? `${last.sender}: ${last.text.slice(0, 32)}${last.text.length > 32 ? '…' : ''}` : r.desc}
                    </div>
                  </div>
                  {unread > 0 && <span className={styles.badge}>{unread}</span>}
                </div>
              );
            })}

            <div className={styles.sectionLabel} style={{ marginTop: 12 }}>AI Spaces</div>
            <div
              className={`${styles.item}${activeRoom === 'ai-lab' ? ' ' + styles.active : ''}`}
              onClick={() => onSelectRoom('ai-lab')}
            >
              <div className={styles.itemIcon}>🤖</div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}># AI Lab</div>
                <div className={styles.itemLast}>Try /commands for AI features</div>
              </div>
              <span className={styles.aiBadge}>AI</span>
            </div>
          </>
        )}

        {section === 'dms' && (
          <>
            <div className={styles.sectionLabel}>Direct Messages</div>
            {dmRooms && dmRooms.map(dm => {
              const unread = unreadCounts[dm.id] || 0;
              const msgs = messages[dm.id] || [];
              const last = msgs[msgs.length - 1];
              return (
                <div
                  key={dm.id}
                  className={`${styles.item}${activeRoom === dm.id ? ' ' + styles.active : ''}`}
                  onClick={() => onSelectRoom(dm.id)}
                >
                  <div className={styles.dmAvatar} style={{ background: colorFor(dm.otherUser) }}>
                    {initials(dm.otherUser)}
                    <div className={`${styles.statusDot} ${styles[dm.status || 'offline']}`} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{dm.otherUser}</div>
                    <div className={styles.itemLast}>
                      {last ? last.text.slice(0, 35) + (last.text.length > 35 ? '…' : '') : 'No messages yet'}
                    </div>
                  </div>
                  {unread > 0 && <span className={styles.badge}>{unread}</span>}
                </div>
              );
            })}
            {(!dmRooms || dmRooms.length === 0) && (
              <div className={styles.empty}>No direct messages yet.<br />Start chatting in a room!</div>
            )}
          </>
        )}
      </div>

      {/* User Footer */}
      <div className={styles.footer}>
        <div className={styles.userInfo} onClick={onOpenProfile}>
          <div className={styles.avatar} style={{ background: colorFor(currentUser.username) }}>
            {initials(currentUser.username)}
            <div className={styles.onlineDot} />
          </div>
          <div className={styles.userText}>
            <div className={styles.userName}>{currentUser.username}</div>
            <div className={styles.userStatus}>● Online</div>
          </div>
        </div>
        <div className={styles.footerActions}>
          <button className={styles.iconBtn} title="Profile" onClick={onOpenProfile}>⚙</button>
          <button className={styles.iconBtn} title="Sign out" onClick={onLogout}>⎋</button>
        </div>
      </div>
    </aside>
  );
}

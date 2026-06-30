import React, { useState } from 'react';
import { ROOM_EMOJIS } from '../utils/constants';
import { initials, colorFor } from '../utils/helpers';
import styles from './Modals.module.css';

export function NewRoomModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💬');
  const [desc, setDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  function handleCreate() {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), emoji, desc, isPrivate });
    onClose();
  }

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create New Room</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.emojiLabel}>Room Icon</div>
        <div className={styles.emojiGrid}>
          {ROOM_EMOJIS.map(e => (
            <button key={e} className={`${styles.emojiBtn}${emoji === e ? ' ' + styles.emojiSel : ''}`} onClick={() => setEmoji(e)}>
              {e}
            </button>
          ))}
        </div>

        <div className={styles.field}>
          <label>Room Name</label>
          <input
            placeholder="e.g. design-team"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label>Description (optional)</label>
          <input
            placeholder="What's this room about?"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>Private Room</div>
            <div className={styles.toggleSub}>Only invited members can join</div>
          </div>
          <button
            className={`${styles.toggle}${isPrivate ? ' ' + styles.toggleOn : ''}`}
            onClick={() => setIsPrivate(p => !p)}
          >
            <div className={styles.toggleThumb} />
          </button>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button className={styles.btnAccent} onClick={handleCreate} disabled={!name.trim()}>
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfileModal({ currentUser, onClose, onSave }) {
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [status, setStatus] = useState(currentUser.status || 'online');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave({ username, bio, status });
    setSaved(true);
    setTimeout(() => { setSaved(false); }, 1500);
  }

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Profile</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.avatarSection}>
          <div className={styles.bigAvatar} style={{ background: colorFor(currentUser.username) }}>
            {initials(currentUser.username)}
          </div>
          <div className={styles.avatarInfo}>
            <div className={styles.avatarName}>{currentUser.username}</div>
            <div className={styles.avatarEmail}>{currentUser.email || 'user@chatapp.io'}</div>
          </div>
        </div>

        <div className={styles.field}>
          <label>Display Name</label>
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>Bio</label>
          <textarea
            className={styles.bioInput}
            value={bio}
            placeholder="Tell the room about yourself…"
            onChange={e => setBio(e.target.value)}
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <label>Status</label>
          <div className={styles.statusBtns}>
            {['online','away','offline'].map(s => (
              <button
                key={s}
                className={`${styles.statusBtn}${status === s ? ' ' + styles.statusSel : ''}`}
                onClick={() => setStatus(s)}
              >
                <span className={`${styles.dot} ${styles[s]}`} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button className={`${styles.btnAccent}${saved ? ' ' + styles.btnSaved : ''}`} onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

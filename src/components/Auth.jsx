import React, { useState } from 'react';
import styles from './Auth.module.css';

export default function Auth({ onLogin, onSignup }) {
  const [screen, setScreen] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '', confirm: '', terms: false });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  async function handleLogin(e) {
    e?.preventDefault();
    if (!loginForm.username || !loginForm.password) return setErr('Please fill in all fields.');
    setLoading(true); setErr('');
    setTimeout(() => {
      const result = onLogin(loginForm.username, loginForm.password);
      if (!result.ok) setErr(result.error);
      setLoading(false);
    }, 600);
  }

  async function handleSignup(e) {
    e?.preventDefault();
    if (!signupForm.username || !signupForm.email || !signupForm.password) return setErr('All fields are required.');
    if (signupForm.password !== signupForm.confirm) return setErr('Passwords do not match.');
    if (signupForm.password.length < 4) return setErr('Password must be at least 4 characters.');
    if (!signupForm.terms) return setErr('Please agree to the Terms & Privacy Policy.');
    setLoading(true); setErr('');
    setTimeout(() => {
      const result = onSignup(signupForm);
      if (!result.ok) setErr(result.error);
      setLoading(false);
    }, 700);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.stars} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>💬</div>
          <span className={styles.logoName}>Chatapp</span>
        </div>
        <div className={styles.tagline}>AI-Powered Real-time Chat</div>

        {screen === 'login' ? (
          <>
            <h2 className={styles.title}>Welcome back</h2>
            <p className={styles.sub}>Sign in to continue chatting</p>
            {err && <div className={styles.error}>⚠ {err}</div>}
            <div className={styles.field}>
              <label>Username</label>
              <input
                placeholder="Enter your username"
                value={loginForm.username}
                onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                autoComplete="username"
              />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.pwdWrap}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                />
                <button className={styles.eyeBtn} onClick={() => setShowPwd(p => !p)} type="button">
                  {showPwd ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <button className={styles.primary} onClick={handleLogin} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Sign in →'}
            </button>
            <div className={styles.divider}><span>or</span></div>
            <div className={styles.demo}>
              <span className={styles.demoLabel}>Quick demo access</span>
              <button className={styles.demoBtn} onClick={() => {
                setLoginForm({ username: 'alice', password: '1234' });
                setTimeout(() => onLogin('alice', '1234'), 100);
              }}>
                👤 Alice (alice / 1234)
              </button>
              <button className={styles.demoBtn} onClick={() => {
                setLoginForm({ username: 'bob', password: '1234' });
                setTimeout(() => onLogin('bob', '1234'), 100);
              }}>
                👤 Bob (bob / 1234)
              </button>
            </div>
            <p className={styles.footer}>
              No account? <a onClick={() => { setScreen('signup'); setErr(''); }}>Create one free →</a>
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Create account</h2>
            <p className={styles.sub}>Join the conversation today</p>
            {err && <div className={styles.error}>⚠ {err}</div>}
            <div className={styles.field}>
              <label>Username</label>
              <input placeholder="Pick a username" value={signupForm.username}
                onChange={e => setSignupForm(p => ({ ...p, username: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" value={signupForm.email}
                onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={signupForm.password}
                  onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label>Confirm</label>
                <input type="password" placeholder="••••••••" value={signupForm.confirm}
                  onChange={e => setSignupForm(p => ({ ...p, confirm: e.target.value }))} />
              </div>
            </div>
            <div className={styles.termsRow}>
              <input type="checkbox" id="terms" checked={signupForm.terms}
                onChange={e => setSignupForm(p => ({ ...p, terms: e.target.checked }))} />
              <label htmlFor="terms">I agree to the <a href="#">Terms of Use</a> &amp; <a href="#">Privacy Policy</a></label>
            </div>
            <button className={styles.primary} onClick={handleSignup} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Create account →'}
            </button>
            <p className={styles.footer}>
              Already have an account? <a onClick={() => { setScreen('login'); setErr(''); }}>Sign in →</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

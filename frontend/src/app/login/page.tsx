'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';

interface TokenResponse {
  access: string;
  refresh: string;
  is_superuser: boolean;
  username: string;
  email: string;
  must_change_password?: boolean;
  detail?: string;
}

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your email or username and password');
      return;
    }

    try {
      const res = await apiFetch('/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier.trim(), password }),
      });
      const data: TokenResponse = await res.json();

      if (res.ok && data.access && data.refresh) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('loggedIn', 'true');
        setErrorMsg('');

        // ✅ Notify other tabs and Header component
        try {
          const bc = new BroadcastChannel('auth');
          bc.postMessage({ type: 'login' });
          bc.close();
        } catch {}
        window.dispatchEvent(new Event('storage'));

        router.push(data.is_superuser ? '/admin' : '/');
      } else {
        setErrorMsg(data.detail || 'Invalid credentials');
      }
    } catch {
      setErrorMsg('Could not reach server. Try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome back</h1>
        <p className="login-subtitle">Please enter your details to sign in</p>
        
        {errorMsg && (
          <div className="error-banner">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} aria-label="Close">×</button>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier">Email or Username:</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Enter your email or username..."
              required
              autoFocus
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary">Sign in</button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account yet?{' '}
            <Link href="/signup" className="login-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

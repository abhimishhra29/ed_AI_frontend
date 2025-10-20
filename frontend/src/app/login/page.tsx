'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

// ============================================================================
// 🎭 NOTE: This login works with both MOCK MODE and REAL BACKEND
// - When MOCK_MODE = true in api.ts: ANY username/password will work
// - When MOCK_MODE = false: Only valid credentials will work
// - No changes needed here! The apiFetch function handles everything.
// ============================================================================

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both username and password');
      return;
    }

    try {
      // ========================================================================
      // 🔐 LOGIN REQUEST
      // - In MOCK MODE: This will accept ANY credentials and return fake tokens
      // - In REAL MODE: This will validate against actual backend
      // ========================================================================
      const res = await apiFetch('/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      const data: TokenResponse = await res.json();

      if (res.ok && data.access && data.refresh) {
        // ====================================================================
        // ✅ LOGIN SUCCESS: Store tokens in localStorage
        // - In MOCK MODE: These are fake tokens like "mock_access_token_123"
        // - In REAL MODE: These are real JWT tokens from backend
        // ====================================================================
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('loggedIn', 'true');

        // ✅ Notify other tabs and Header component that user logged in
        window.dispatchEvent(new Event('storage'));

        // Redirect to appropriate page
        router.push(data.is_superuser ? '/admin' : '/');
      } else {
        setErrorMsg(data.detail || 'Invalid credentials');
      }
    } catch {
      setErrorMsg('Could not reach server. Try again later.');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {errorMsg && (
        <div className="error-banner">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} aria-label="Close">×</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Username:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value.toLowerCase())}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

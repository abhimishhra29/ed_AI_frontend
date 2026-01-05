'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email address' });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Update this endpoint to match your actual API
      const res = await apiFetch('/api/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({
          type: 'success',
          message: 'If an account with that email exists, we\'ve sent you password reset instructions.',
        });
        setEmail('');
      } else {
        setStatus({
          type: 'error',
          message: data.detail || data.email?.[0] || 'Failed to send reset email. Please try again.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Could not reach server. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Forgot Password</h1>
        <p className="login-subtitle">
          Enter your email address and we will send you instructions to reset your password.
        </p>

        {status && (
          <div className={`error-banner ${status.type === 'success' ? 'success-banner' : ''}`}>
            <span>{status.message}</span>
            <button onClick={() => setStatus(null)} aria-label="Close">×</button>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">E-Mail Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value.toLowerCase())}
            placeholder="Enter your email..."
            required
            autoFocus
            autoComplete="email"
            disabled={isSubmitting}
          />

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Remember your password?{' '}
            <Link href="/login" className="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}













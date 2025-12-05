'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { apiFetch } from '../../lib/api';

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const captchaEnabled = Boolean(siteKey);

type FormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  institution: string;
  phone: string;
};

const initialState: FormState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  institution: '',
  phone: '',
};

export default function Signup(): JSX.Element {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const resetCaptcha = () => {
    if (captchaEnabled) {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  const handleChange = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setStatus(null);
  };

  const parseErrors = (payload: unknown): string => {
    if (!payload) return 'Signup failed. Please try again.';
    if (typeof payload === 'string') return payload;
    if (Array.isArray(payload)) {
      return payload.join(' ');
    }
    if (typeof payload === 'object') {
      const messages: string[] = [];
      Object.entries(payload as Record<string, unknown>).forEach(
        ([field, value]) => {
          const label = field === 'non_field_errors'
            ? 'Signup'
            : field.replace(/_/g, ' ');
          if (Array.isArray(value)) {
            value.forEach((entry) => {
              const text =
                typeof entry === 'string' ? entry : JSON.stringify(entry);
              messages.push(`${label}: ${text}`);
            });
          } else if (typeof value === 'string') {
            messages.push(`${label}: ${value}`);
          } else if (value) {
            messages.push(`${label}: ${JSON.stringify(value)}`);
          }
        },
      );
      return messages.join(' ');
    }
    return 'Signup failed. Please try again.';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);

    const trimmedUsername = form.username.trim();
    const trimmedEmail = form.email.trim();
    const trimmedInstitution = form.institution.trim();
    const trimmedPhone = form.phone.trim();

    const validationErrors: string[] = [];

    if (!trimmedUsername) {
      validationErrors.push('Username: please enter a username.');
    }

    if (!trimmedEmail) {
      validationErrors.push('Email: please enter an email address.');
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(trimmedEmail)) {
        validationErrors.push('Email: please enter a valid email address.');
      }
    }

    if (!form.password) {
      validationErrors.push('Password: please choose a password.');
    } else if (form.password.length < 8) {
      validationErrors.push('Password: must be at least 8 characters.');
    }

    if (form.password !== form.confirmPassword) {
      validationErrors.push('Confirm password: does not match the password.');
    }

    if (!trimmedInstitution) {
      validationErrors.push('Institution: please tell us your institution.');
    }

    if (trimmedPhone) {
      const phonePattern = /^[0-9()+\-\s]{6,}$/;
      if (!phonePattern.test(trimmedPhone)) {
        validationErrors.push(
          'Phone: please enter digits only (you can include spaces or +).',
        );
      }
    }

    if (captchaEnabled && !recaptchaToken) {
      validationErrors.push('CAPTCHA: please verify you are not a robot.');
    }

    if (validationErrors.length > 0) {
      setError(`❌ ${validationErrors.join(' ')}`);
      return;
    }

    setIsSubmitting(true);

    const payload: Record<string, string> = {
      username: trimmedUsername,
      email: trimmedEmail,
      password: form.password,
      institution: trimmedInstitution,
    };

    if (trimmedPhone) {
      payload.phone = trimmedPhone;
    }

    if (captchaEnabled && recaptchaToken) {
      payload['g-recaptcha-response'] = recaptchaToken;
    }

    try {
      const response = await apiFetch('/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response
        .json()
        .catch(() => ({}));

      if (response.ok) {
        setStatus('✅ Account created! You can sign in from the login page.');
        setForm(initialState);
        resetCaptcha();
      } else {
        setError(`❌ ${parseErrors(data)}`);
        resetCaptcha();
      }
    } catch (err) {
      console.error(err);
      setError('❌ Something went wrong. Please try again later.');
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create your account</h1>
        <p className="signup-subtitle">
          A single signup unlocks access to Auto Grade and Plan My Assignment.
        </p>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)} aria-label="Close">×</button>
          </div>
        )}

        {status && (
          <div className="error-banner success-banner">
            <span>{status}</span>
            <button onClick={() => setStatus(null)} aria-label="Close">×</button>
          </div>
        )}

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">
            Username <span className="required-asterisk">*</span>
          </label>
          <input
            id="username"
            type="text"
            name="username"
            required
            autoComplete="username"
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
            disabled={isSubmitting}
          />

          <label htmlFor="email">
            Email <span className="required-asterisk">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={isSubmitting}
          />

          <label htmlFor="password">
            Password <span className="required-asterisk">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isSubmitting}
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

          <label htmlFor="confirmPassword">
            Confirm password <span className="required-asterisk">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              disabled={isSubmitting}
            >
              {showConfirmPassword ? (
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

          <label htmlFor="institution">
            Institution <span className="required-asterisk">*</span>
          </label>
          <input
            id="institution"
            type="text"
            name="institution"
            required
            autoComplete="organization"
            value={form.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            disabled={isSubmitting}
          />

          <label htmlFor="phone">Phone (optional)</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={isSubmitting}
          />

          {captchaEnabled && (
            <div className="captcha-wrapper">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey ?? ''}
                onChange={(token) => {
                  setRecaptchaToken(token);
                  setError(null);
                }}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="signup-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

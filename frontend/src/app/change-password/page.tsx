'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = '';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setStatus('❗ Both fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus('❗ Passwords do not match');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setStatus('❗ Not logged in');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (res.ok) {
        setStatus('✅ Password changed. Please log in again.');
        localStorage.clear();
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const data = await res.json();
        setStatus(`❌ ${JSON.stringify(data)}`);
      }
    } catch {
      setStatus('❌ Could not reach server');
    }
  };

  return (
    <div className="change-password">
      <h2>Change Password</h2>
      {status && <p className="status">{status}</p>}
      <form onSubmit={handleChange}>
        <div className="field">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

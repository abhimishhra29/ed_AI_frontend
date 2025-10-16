'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '../../lib/api';

export default function AdminPanel() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [delUser, setDelUser] = useState('');
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      if (!payload.is_superuser) {
        setStatus('⛔ Access denied: admins only');
      } else {
        fetchUsers();
      }
    } catch {
      setStatus('⛔ Invalid session. Please log in again.');
      router.replace('/login');
    }
  }, [router]);

  const fetchUsers = async () => {
    setStatus('');
    try {
      const res = await apiFetch('/api/admin/users/');
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setStatus('❌ Failed to load users');
      }
    } catch {
      setStatus('❌ Could not fetch users');
    }
  };

  const createUser = async () => {
    setStatus('Creating user…');
    const res = await apiFetch('/api/admin/users/create_user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(`✅ Created user ${data.username}`);
      setUsername(''); setEmail(''); setPassword('');
      fetchUsers();
    } else {
      setStatus(`❌ ${JSON.stringify(data)}`);
    }
  };

  const deleteUser = async () => {
    setStatus('Deleting user…');
    const res = await apiFetch('/api/admin/users/delete_user/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: delUser }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(`🗑️ Deleted ${delUser}`);
      setDelUser('');
      fetchUsers();
    } else {
      setStatus(`❌ ${JSON.stringify(data)}`);
    }
  };

  const handleDelete = async (username: string) => {
    const res = await apiFetch('/api/admin/users/delete_user/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(`🗑️ Deleted ${username}`);
      fetchUsers();
    } else {
      setStatus(`❌ ${JSON.stringify(data)}`);
    }
  };

  const handleEditIterations = async (username: string, current: number) => {
    const input = prompt(`Set grading iterations for ${username}:`, current.toString());
    if (input === null) return;  // cancelled
    const newVal = parseInt(input, 10);
    if (isNaN(newVal) || newVal < 1) {
      setStatus('❌ Invalid number');
      return;
    }

    setStatus('Updating iterations…');
    const res = await apiFetch(`/api/admin/users/${username}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grading_iterations: newVal }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(`✅ ${username} → iterations set to ${newVal}`);
      fetchUsers();
    } else {
      setStatus(`❌ ${JSON.stringify(data)}`);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {status && <p className="status">{status}</p>}

      <section className="admin-section">
        <h3>Create New User</h3>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={createUser}>Create</button>
      </section>

      <section className="admin-section">
        <h3>Delete User</h3>
        <input
          placeholder="Username"
          value={delUser}
          onChange={e => setDelUser(e.target.value)}
        />
        <button onClick={deleteUser}>Delete</button>
      </section>

      <section className="admin-section">
        <h3>All Users</h3>
        {users.length === 0 && <p>No users found.</p>}
        <ul>
          {users.map(user => (
            <li
              key={user.username}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span>
                {user.username}
                {user.is_superuser && ' (admin)'} – Iterations: {user.grading_iterations}
              </span>
              <div>
                <button onClick={() => handleDelete(user.username)}>
                  Delete
                </button>{' '}
                <button
                  onClick={() =>
                    handleEditIterations(user.username, user.grading_iterations)
                  }
                >
                  Edit Iterations
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

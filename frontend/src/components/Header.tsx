'use client';

// Header.tsx
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import logo from './logo.png';
import { apiFetch } from '../lib/api';

interface JwtPayload {
  exp?: number;
}

const Header: FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    setLoggedIn(localStorage.getItem('loggedIn') === 'true');
  }, []);

  // helper: parse exp from a JWT
  function parseJwt(token: string): JwtPayload | null {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  // Try to extend session instead of immediately logging out when exp hits.
  async function onAccessTokenExpiry() {
    try {
      await apiFetch("/api/activity/", { method: "POST" });
      setSessionExpired(false);
    } catch {
      setSessionExpired(true);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      try {
        new BroadcastChannel("auth").postMessage({ type: "logout" });
      } catch {}
      window.dispatchEvent(new Event("storage"));
    }
  }

  // Whenever the accessToken changes, schedule a check at its exp.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const payload = parseJwt(token);
    if (!payload?.exp) return;

    const expiresAt = payload.exp * 1000;
    const now = Date.now();

    if (expiresAt <= now) {
      onAccessTokenExpiry();
    } else {
      const msUntilExpiry = expiresAt - now;
      const timer = window.setTimeout(onAccessTokenExpiry, msUntilExpiry);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem('loggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    try {
      new BroadcastChannel('auth').postMessage({ type: 'logout' });
    } catch {}
    window.dispatchEvent(new Event('storage'));
    setLoggedIn(false);
    setSessionExpired(false);
    router.push('/login');
  }

  // Sync login state across tabs + listen for auth channel updates
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storageHandler = () =>
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    window.addEventListener('storage', storageHandler);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('auth');
      bc.onmessage = (e) => {
        if (e?.data?.type === 'logout') setLoggedIn(false);
        if (e?.data?.type === 'login' || e?.data?.type === 'access-updated') setLoggedIn(true);
      };
    } catch {
      // ignore if BroadcastChannel unsupported
    }

    return () => {
      window.removeEventListener('storage', storageHandler);
      if (bc) bc.close();
    };
  }, []);

  const closeMenus = () => setOpenMenu(null);
  const closeAll = () => {
    closeMenus();
    setMobileOpen(false);
  };

  return (
    <>
      {sessionExpired && loggedIn && (
        <div className="session-expired-banner">
          Your session has expired. Please{' '}
          <Link
            href="/login"
            onClick={() => {
              setSessionExpired(false);
              handleLogout();
            }}
          >
            Log in
          </Link>{' '}
          again.
        </div>
      )}

      <div style={{ paddingTop: sessionExpired && loggedIn ? 48 : 0 }} />

      <header className="header" onMouseLeave={closeMenus}>
        <Link href="/" className="logo">
          <img src={logo.src} alt="EdGenAI" />
        </Link>

        <button
          className="hamburger"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {mobileOpen && (
          <div className="nav-overlay open" onClick={() => setMobileOpen(false)} />
        )}

        <nav className={`nav ${mobileOpen ? "open" : ""}`}>
          <Link href="/" className="nav-link" onClick={closeAll}>
            Home
          </Link>

          {/* Products dropdown always visible */}
          <div
            className="nav-item"
            onMouseEnter={() => setOpenMenu("products")}
          >
            <Link href="/" className="nav-link" onClick={closeAll}>
              Products
            </Link>
            <div className={`dropdown ${openMenu === "products" ? "open" : ""}`}>
              <Link
                href={loggedIn ? '/auto-grading-wizard' : '/auto-grade'}
                onClick={closeAll}
              >
                Auto Grade
              </Link>
              <Link
                href={loggedIn ? '/plan-my-assignment' : '/plan-my-assignment-wizard'}
                onClick={closeAll}
              >
                Plan My Assignment
              </Link>
            </div>
          </div>

          <div className="nav-item" onMouseEnter={() => setOpenMenu("services")}>
            <Link href="/services" className="nav-link" onClick={closeAll}>
              Services
            </Link>
          </div>

          <div className="nav-item" onMouseEnter={() => setOpenMenu("success")}>
            <Link href="/success-stories" className="nav-link" onClick={closeAll}>
              Success Stories
            </Link>
          </div>

          <Link href="/contact" className="nav-link" onClick={closeAll}>
            Contact Us
          </Link>

          {!loggedIn && (
            <>
              <Link href="/login" className="nav-link" onClick={closeAll}>
                Login
              </Link>
              <Link href="/signup" className="signup-button" onClick={closeAll}>
                Sign Up
              </Link>
            </>
          )}

          {loggedIn && (
            <button
              className="nav-link"
              onClick={() => {
                handleLogout();
                closeAll();
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;

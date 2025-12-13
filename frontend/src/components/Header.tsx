'use client';

// Header.tsx
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const autoGradeHref = loggedIn ? '/auto-grading-wizard' : '/auto-grade';
  const planAssignmentHref = loggedIn ? '/plan-my-assignment' : '/plan-my-assignment-wizard';

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
      setLoggedIn(false);
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      try {
        const bc = new BroadcastChannel("auth");
        bc.postMessage({ type: "logout" });
        bc.close();
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
      const bc = new BroadcastChannel('auth');
      bc.postMessage({ type: 'logout' });
      bc.close();
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

    const storageHandler = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      setLoggedIn(isLoggedIn);
      if (isLoggedIn) {
        setSessionExpired(false);
      }
    };
    window.addEventListener('storage', storageHandler);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('auth');
      bc.onmessage = (e) => {
        if (e?.data?.type === 'logout') {
          setLoggedIn(false);
        }
        if (e?.data?.type === 'login' || e?.data?.type === 'access-updated') {
          setLoggedIn(true);
          setSessionExpired(false);
        }
      };
    } catch {
      // ignore if BroadcastChannel unsupported
    }

    return () => {
      window.removeEventListener('storage', storageHandler);
      if (bc) bc.close();
    };
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setSessionExpired(false);
    }
  }, [loggedIn]);

  const closeMenus = () => setOpenMenu(null);
  const closeAll = () => {
    closeMenus();
    setMobileOpen(false);
  };

  return (
    <>
      {sessionExpired && (
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

      <div style={{ paddingTop: sessionExpired ? 48 : 0 }} />

      <header
        className="header"
        style={{ top: sessionExpired ? 48 : 0 }}
        onMouseLeave={closeMenus}
      >
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
          <div className="mobile-menu-overlay">
            <div className="mobile-menu-content">
              {/* Top section with logo and close button */}
              <div className="mobile-menu-header">
                <Link href="/" className="mobile-menu-logo" onClick={closeAll}>
                  <img src={logo.src} alt="EdGenAI" />
                  <span className="mobile-menu-logo-text">EdGenAI</span>
                </Link>
                <button
                  className="mobile-menu-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Navigation links */}
              <nav className="mobile-menu-nav">
                <Link href="/" className="mobile-menu-link" onClick={closeAll}>
                  Home
                </Link>

                <div className="mobile-menu-item">
                  <Link href={autoGradeHref} className="mobile-menu-link" onClick={closeAll}>
                    Products
                  </Link>
                  <div className="mobile-menu-dropdown">
                    <Link
                      href={autoGradeHref}
                      className="mobile-menu-link mobile-menu-sublink"
                      onClick={closeAll}
                    >
                      Auto Grade
                    </Link>
                    <Link
                      href={planAssignmentHref}
                      className="mobile-menu-link mobile-menu-sublink"
                      onClick={closeAll}
                    >
                      Plan My Assignment
                    </Link>
                  </div>
                </div>

                <Link href="/services" className="mobile-menu-link" onClick={closeAll}>
                  Consultancy
                </Link>

                {!loggedIn && (
                  <Link href="/login" className="mobile-menu-link" onClick={closeAll}>
                    Login
                  </Link>
                )}

                <Link href="/contact" className="mobile-menu-link book-demo-btn-mobile" onClick={closeAll}>
                  Book a Demo
                </Link>
              </nav>

              {/* Bottom Login/Logout button */}
              <div className="mobile-menu-footer">
                {loggedIn && (
                  <button
                    className="mobile-menu-login-btn"
                    onClick={() => {
                      handleLogout();
                      closeAll();
                    }}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <nav className={`nav ${mobileOpen ? "open" : ""}`}>
          <Link href="/" className="nav-link" onClick={closeAll}>
            Home
          </Link>

          {/* Products dropdown always visible */}
          <div
            className="nav-item"
            onMouseEnter={() => setOpenMenu("products")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link 
              href={autoGradeHref}
              className="nav-link"
              onClick={closeAll}
            >
              Products
            </Link>
            <div className={`dropdown ${openMenu === "products" ? "open" : ""}`}>
              <Link
                href={autoGradeHref}
                onClick={closeAll}
              >
                Auto Grade
              </Link>
              <Link
                href={planAssignmentHref}
                onClick={closeAll}
              >
                Plan My Assignment
              </Link>
            </div>
          </div>

          <div className="nav-item" onMouseEnter={() => setOpenMenu("services")}>
            <Link href="/services" className="nav-link" onClick={closeAll}>
              Consultancy
            </Link>
          </div>

          {!loggedIn && (
            <Link href="/login" className="nav-link" onClick={closeAll}>
              Login
            </Link>
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

          <Link href="/contact" className="nav-link book-demo-btn" onClick={closeAll}>
            Book a Demo
          </Link>
        </nav>
      </header>
      <div
        className="header-spacer"
        aria-hidden="true"
        style={{ height: sessionExpired ? '128px' : '80px' }}
      />
    </>
  );
};

export default Header;

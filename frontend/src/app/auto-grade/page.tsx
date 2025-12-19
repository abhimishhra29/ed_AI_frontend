'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { apiFetch } from '../../lib/api';

export default function AutoGradeLanding(): JSX.Element {
  const [loggedIn, setLoggedIn] = useState(false);

  // Keep in sync across tabs + validate/extend session once on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onStorage = () =>
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    window.addEventListener("storage", onStorage);

    // Optional: cross-tab channel for auth updates
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("auth");
      bc.onmessage = (e) => {
        if (e?.data?.type === "logout") setLoggedIn(false);
        if (e?.data?.type === "login" || e?.data?.type === "access-updated") {
          setLoggedIn(true);
        }
      };
    } catch {
      // BroadcastChannel not available; storage event will still work
    }

    // One-time lightweight session check/extend if a refresh token exists
    (async () => {
      try {
        if (localStorage.getItem('refreshToken')) {
          const res = await apiFetch('/api/activity/', { method: 'POST' });
          if (res.ok) setLoggedIn(true);
        }
      } catch {
        setLoggedIn(false);
      }
    })();

    return () => {
      window.removeEventListener("storage", onStorage);
      if (bc) bc.close();
    };
  }, []);

  return (
    <div className="autograd-landing-page">
      {/* --- Hero Section with New Design --- */}
      <header className="hero-section autograde-hero-new">
        <div className="container hero-container-new">
          {/* Left Side - Text and CTA */}
          <div className="hero-content-new">
            <h1 className="hero-title-new">
              <span>Grade Student</span>
              <span className="title-accent-blue">Submissions</span>
              <span>With AI</span>
            </h1>
            <p className="hero-subtitle-new">
              Automatically evaluate student submissions with AI-powered grading that delivers consistent, fair, and constructive feedback.
            </p>
            
            <div className="hero-cta-new">
              <Link
                href={loggedIn ? '/auto-grading-wizard' : '/signup'}
                className="btn btn-primary"
              >
                {loggedIn ? 'Try Me' : 'Sign Up'}
              </Link>
            </div>
          </div>

          {/* Right Side - YouTube Video */}
          <div className="hero-video-container-new">
            <div className="hero-video-wrapper-new">
              <iframe
                src="https://www.youtube.com/embed/PBtyISfftTc"
                title="AutoGrade Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* --- Why Autograde is Better Choice Section --- */}
        <section className="why-autograde-section">
          <div className="container why-autograde-container">
            {/* Left Side - Title, Description, and Button */}
            <div className="why-autograde-left">
              <h2 className="why-autograde-title">
                <span>Why Autograde</span>
                <span>is Better Choice</span>
              </h2>
            </div>

            {/* Right Side - Statistics Cards */}
            <div className="why-autograde-right">
              <div className="stat-card stat-card-1">
                <div className="stat-accent-bar"></div>
                <div className="stat-quote-marks">&quot;</div>
                <p className="stat-text">
                  Up to ~9 hours/week spent on marking &amp; assessment alone.
                </p>
              </div>
              <div className="stat-card stat-card-2">
                <div className="stat-accent-bar"></div>
                <div className="stat-quote-marks">&quot;</div>
                <p className="stat-text">
                  ~25% of secondary teachers spend 10+ hours per week grading student work.
                </p>
              </div>
              <div className="stat-card stat-card-3">
                <div className="stat-accent-bar"></div>
                <div className="stat-quote-marks">&quot;</div>
                <p className="stat-text">
                  50% of teachers report grading as a major source of stress.
                </p>
              </div>
              <div className="stat-card stat-card-4">
                <div className="stat-accent-bar"></div>
                <div className="stat-quote-marks">&quot;</div>
                <p className="stat-text">
                  Marking is one of the highest workload contributors in Australian classrooms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">A New Era of Assessment</h2>
            <p className="section-subtitle">
              AutoGrade is more than just a product; it&apos;s a complete grading
              partner designed for performance and trust.
            </p>
            <div className="features-grid">
              {/* Feature Cards */}
              <div className="feature-card feature-card-1">
                <div className="feature-card-overlay"></div>
                <div className="feature-card-content">
                  <h3>SUPPORTS ALL ASSIGNMENT TYPES</h3>
                  <p>
                    Evaluates reports, essays, Q&amp;A, multimodal inputs, and
                    even handwritten scans with precision.
                  </p>
                </div>
              </div>
              <div className="feature-card feature-card-2">
                <div className="feature-card-overlay"></div>
                <div className="feature-card-content">
                  <h3>AGENTIC AI ARCHITECTURE</h3>
                  <p>
                    Modular AI agents handle similarity checks, grading, and
                    analytics for scalable performance.
                  </p>
                </div>
              </div>
              <div className="feature-card feature-card-3">
                <div className="feature-card-overlay"></div>
                <div className="feature-card-content">
                  <h3>PRECISION GRADING</h3>
                  <p>
                    Delivers high-accuracy grading and flags low-confidence cases
                    for optional human review.
                  </p>
                </div>
              </div>
              <div className="feature-card feature-card-4">
                <div className="feature-card-overlay"></div>
                <div className="feature-card-content">
                  <h3>HANDWRITTEN SCRIPT SUPPORT</h3>
                  <p>
                    Our advanced OCR accurately reads and processes scanned
                    handwritten answer sheets in PDF format.
                  </p>
                </div>
              </div>
              <div className="feature-card feature-card-5">
                <div className="feature-card-overlay"></div>
                <div className="feature-card-content">
                  <h3>RUBRIC-ALIGNED SCORING</h3>
                  <p>
                    Grades are grounded in your custom marking rubrics, no
                    black-box magic, just transparent evaluation.
                  </p>
                </div>
              </div>
              <div className="feature-card feature-card-6">
                <div className="feature-card-overlay"></div>
                <div className="feature-card-content">
                  <h3>RATIONALES FOR EVERY GRADE</h3>
                  <p>
                    Every score comes with a natural language explanation that you
                    and your students can understand and trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
                
      </main>
    </div>
  );
}

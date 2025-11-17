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
      {/* --- Hero Section --- */}
      <header className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Smarter, Faster, and Fairer Grading</h1>
            <p className="hero-subtitle">
              Powered by Agentic AI, AutoGrade evaluates student work, from typed
              essays to handwritten scans, using your rubric for objective,
              consistent, and explainable results.
            </p>
            <div className="hero-cta">
              <Link
                href={loggedIn ? '/auto-grading-wizard' : '/signup'}
                className="btn btn-primary"
              >
                {loggedIn ? 'Try Me' : 'Sign Up'}
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"
              alt="Abstract illustration of AI and education"
              className="hero-image"
            />
          </div>
        </div>
      </header>

      <main>
        {/* --- Features Section --- */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">A New Era of Assessment</h2>
            <p className="section-subtitle">
              AutoGrade is more than just a tool; it&apos;s a complete grading
              partner designed for performance and trust.
            </p>
            <div className="features-grid">
              {/* Feature Cards */}
              <div className="feature-card">
                <img
                  src="https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="A collection of different assignment types"
                  className="feature-icon"
                />
                <h3>Supports All Assignment Types</h3>
                <p>
                  Evaluates reports, essays, Q&amp;A, multimodal inputs, and
                  even handwritten scans with precision.
                </p>
              </div>
              <div className="feature-card">
                <img
                  src="https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Abstract agentic AI illustration"
                  className="feature-icon"
                />
                <h3>Agentic AI Architecture</h3>
                <p>
                  Modular AI agents handle similarity checks, grading, and
                  analytics for scalable performance.
                </p>
              </div>
              <div className="feature-card">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="A target with an arrow in the bullseye"
                  className="feature-icon"
                />
                <h3>Precision Grading</h3>
                <p>
                  Delivers high-accuracy grading and flags low-confidence cases
                  for optional human review.
                </p>
              </div>
              <div className="feature-card">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="A scanned document being digitized"
                  className="feature-icon"
                />
                <h3>Handwritten Script Support</h3>
                <p>
                  Our advanced OCR accurately reads and processes scanned
                  handwritten answer sheets in PDF format.
                </p>
              </div>
              <div className="feature-card">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="A checklist with green checkmarks"
                  className="feature-icon"
                />
                <h3>Rubric-Aligned Scoring</h3>
                <p>
                  Grades are grounded in your custom marking rubrics, no
                  black-box magic, just transparent evaluation.
                </p>
              </div>
              <div className="feature-card">
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
                  alt="A report card with an explanation"
                  className="feature-icon"
                />
                <h3>Rationales for Every Grade</h3>
                <p>
                  Every score comes with a natural language explanation that you
                  and your students can understand and trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Demo Video Section --- */}
        <section className="demo-section">
          <div className="container">
            <h2 className="section-title">See AutoGrade in Action 🚀</h2>
          <p className="section-subtitle">
              Watch this short demo to see how AI-powered grading can save you
              time and enhance feedback.
            </p>
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/0zdvedRBcyk"
                title="Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section className="faq-section">
          <div className="container faq-container">
            <h2 className="section-title">❓ Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Can I upload handwritten answers?</h3>
                <p>
                  Yes! Just scan them and upload as a PDF. Our OCR technology
                  reads and grades them accurately.
                </p>
              </div>
              <div className="faq-item">
                <h3>Do you support DOCX or image uploads?</h3>
                <p>
                  Not yet. We&apos;re working on supporting Word files and various
                  image formats, coming soon!
                </p>
              </div>
              <div className="faq-item">
                <h3>Is the grading process explainable?</h3>
                <p>
                  Absolutely. Every score includes a detailed rationale that is
                  directly aligned with your rubric&apos;s criteria.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I adjust or override a grade?</h3>
                <p>
                  Yes, AutoGrade is designed to support human-in-the-loop review
                  for any flagged or edge cases.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

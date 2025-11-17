'use client';

// src/app/plan-my-assignment-wizard/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';

export default function PlanMyAssignmentLanding(): JSX.Element {
  const [loggedIn, setLoggedIn] = useState(false);

  // Sync across tabs + validate session on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onStorage = () =>
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    window.addEventListener("storage", onStorage);

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
      // ignore
    }

    (async () => {
      try {
        if (localStorage.getItem("refreshToken")) {
          const res = await apiFetch("/api/activity/", { method: "POST" });
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
    <div className="plan-landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Plan Your Assignment with Confidence 🎯</h1>
            <p className="hero-subtitle">
              Break down any project into manageable tasks, milestones, and timelines,
              powered by intelligent AI-driven planning.
            </p>
            <div className="hero-cta">
              <Link
                href={loggedIn ? '/plan-my-assignment-wizard' : '/signup'}
                className="btn btn-primary"
              >
                {loggedIn ? "Get Started" : "Sign Up"}
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
"
              alt="Illustration of project planning"
              className="hero-image"
            />
          </div>
        </div>
      </header>

      <main>
        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Plan My Assignment?</h2>
            <p className="section-subtitle">
              Smart planning helps you stay on track, meet deadlines, and deliver
              your best work every time.
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Automated Task Breakdown</h3>
                <p>
                  AI analyzes your assignment prompt and creates a detailed
                  work breakdown structure with tasks and subtasks.
                </p>
              </div>
              <div className="feature-card">
                <h3>Custom Milestones & Deadlines</h3>
                <p>
                  Set due dates, receive reminders, and visualize progress
                  on an intuitive timeline.
                </p>
              </div>


            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="demo-section">
          <div className="container">
            <h2 className="section-title">See the Planner in Action</h2>
            <p className="section-subtitle">
              Watch a quick demo and learn how Plan My Assignment can
              transform your workflow.
            </p>
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/GOOGLE_DEMO_VIDEO_ID"
                title="Planner Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container faq-container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>How does AI generate tasks?</h3>
                <p>
                  Our models parse your assignment description and identify
                  key deliverables, then create actionable subtasks.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I edit the plan?</h3>
                <p>
                  Absolutely, add, remove, or adjust any task or deadline
                  to fit your needs.
                </p>
              </div>


            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

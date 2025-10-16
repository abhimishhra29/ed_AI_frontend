'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Products() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncLogin = () => {
      setIsLoggedIn(localStorage.getItem('loggedIn') === 'true');
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'loggedIn') {
        syncLogin();
      }
    };

    syncLogin();
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <div className="container products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p className="subtitle">Purpose-built AI tools for modern education.</p>
      </div>

      {/* --- Auto Grade --- */}
      <div className="product-row">
        <div className="product-info">
          <h2>Auto Grade: AI Grading Assistant</h2>
          <p className="subtitle">An Agentic AI based grading system to provide feedback.</p>
          <div className="product-features">
            <span className="feature-tag">AI-powered Grading</span>
            <span className="feature-tag">Transparent Feedback</span>
            <span className="feature-tag">Rubric Validation</span>
            <span className="feature-tag">Human-in-the-Loop</span>
          </div>
          <div className="product-actions">
            {isLoggedIn ? (
              <Link href="/auto-grading-wizard" className="btn-primary">
                Try Me
              </Link>
            ) : (
              <Link href="/signup" className="btn-primary">
                Sign Up
              </Link>
            )}
          </div>
        </div>
        <div className="product-video">
          <iframe
            src="https://www.youtube.com/embed/sample_video1"
            title="Auto Grade Demo"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>

      {/* --- Plan My Assignments --- */}
      <div className="product-row">
        <div className="product-info">
          <h2>Plan My Assessment</h2>
          <p className="subtitle">
            An AI helper for students to plan and organize project and assessment tasks.
          </p>
          <div className="product-features">
            <span className="feature-tag">Task Identification</span>
            <span className="feature-tag">Learning Outcome Mapping</span>
            <span className="feature-tag">AI-generated Scaffolding</span>
            <span className="feature-tag">Meeting Deadlines</span>
          </div>
          <div className="product-actions">
            {isLoggedIn ? (
              <Link href="/plan-my-assignment" className="btn-primary">
                Try Me
              </Link>
            ) : (
              <Link href="/signup" className="btn-primary">
                Sign Up
              </Link>
            )}
          </div>
        </div>
        <div className="product-video">
          <iframe
            src="https://www.youtube.com/embed/sample_video3"
            title="Plan My Assignment Demo"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

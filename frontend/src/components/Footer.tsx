'use client';

import Link from 'next/link';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      {/* Watermark Background */}
      <div className="footer-watermark">EDGEN AI</div>
      
      {/* CTA Section */}
      <div className="footer-cta">
        <div className="footer-cta-content">
          <p className="footer-cta-label">START YOUR JOURNEY</p>
          <h2 className="footer-cta-heading">Step into the future of learning</h2>
          <Link href="/contact" className="footer-cta-button">Book a Demo</Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-main-content">
          {/* Brand Column */}
          <div className="footer-column footer-brand">
            <div className="footer-brand-header">

              <h3 className="footer-brand-title">edgen AI</h3>
            </div>
            <p className="footer-brand-description">
                            EdGenAI helps institutions adopt AI with clarity, confidence, and responsibility.

            </p>
            <button onClick={scrollToTop} className="footer-back-to-top">
              Back to top
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </button>
          </div>

          {/* Useful Links Column */}
          <div className="footer-column">
            <h4 className="footer-column-title">Useful</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://www.linkedin.com/company/edgenaiau/jobs/" target="_blank" rel="noopener noreferrer">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Updates Links Column */}
          <div className="footer-column">
            <h4 className="footer-column-title">Updates</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://www.linkedin.com/company/edgenaiau" target="_blank" rel="noopener noreferrer">
                  Linkedin
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © 2025 EdGenAI Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

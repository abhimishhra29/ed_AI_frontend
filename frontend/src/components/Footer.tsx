'use client';

import Link from 'next/link';
import Image from 'next/image';

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
              EdGenAI is the home you've been searching for. We bring clarity to AI adoption so your teams can move faster and teach better.
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
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>

          {/* Updates Links Column */}
          <div className="footer-column">
            <h4 className="footer-column-title">Updates</h4>
            <ul className="footer-links-list">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>

          {/* Legal Links Column */}
          <div className="footer-column">
            <h4 className="footer-column-title">Legal</h4>
            <ul className="footer-links-list">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © 2025 EdGen AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


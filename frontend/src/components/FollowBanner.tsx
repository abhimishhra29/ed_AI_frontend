'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './FollowBanner.css';

export default function FollowBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // TEMPORARY: Force show for testing - remove localStorage check
    // Check if user has dismissed the banner before
    if (typeof window !== 'undefined') {
      // Uncomment below to enable localStorage check
      // const dismissed = localStorage.getItem('followBannerDismissed');
      // if (dismissed === 'true') {
      //   setIsDismissed(true);
      //   setIsVisible(false);
      //   return;
      // }
      // Show banner immediately
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Add exit animation
    setTimeout(() => {
      setIsDismissed(true);
      localStorage.setItem('followBannerDismissed', 'true');
    }, 300);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className={`follow-banner ${!isVisible ? 'exiting' : ''}`}>
      {/* Geometric Pattern Overlay */}
      <div className="follow-banner-pattern" />
      
      {/* Content */}
      <div className="follow-banner-content">
        <h3 className="follow-banner-title">Do not miss out. Follow us & stay updated!</h3>
        <p className="follow-banner-description">
          Get the latest updates, insights, and exclusive content delivered straight to your inbox. 
          Join our community and be part of the future of education.
        </p>
        <p className="follow-banner-url">www.edgenai.com</p>
        <p className="follow-banner-privacy">We respect your privacy. Unsubscribe anytime.</p>
      </div>

      {/* Close Button */}
      <button 
        className="follow-banner-close" 
        onClick={handleClose}
        aria-label="Close banner"
      >
        <X size={20} />
      </button>
    </div>
  );
}


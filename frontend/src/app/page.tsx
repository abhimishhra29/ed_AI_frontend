'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import FeatureCards from '../components/FeatureCards';
import FeatureGrid from '../components/FeatureGrid';
import ServicesGrid from '../components/ServicesGrid';
import { apiFetch } from '../lib/api';

export default function HomePage(): JSX.Element {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Check localStorage immediately
    const checkLogin = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      setLoggedIn(isLoggedIn);
      setIsChecking(false);
      return isLoggedIn;
    };

    // Initial check
    checkLogin();

    // Listen for storage changes
    const onStorage = () => checkLogin();
    window.addEventListener('storage', onStorage);

    // Listen for BroadcastChannel messages
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('auth');
      bc.onmessage = (e) => {
        if (e?.data?.type === 'logout') {
          setLoggedIn(false);
          setIsChecking(false);
        }
        if (e?.data?.type === 'login' || e?.data?.type === 'access-updated') {
          setLoggedIn(true);
          setIsChecking(false);
        }
      };
    } catch {
      // ignore
    }

    // Optional API verification
    (async () => {
      try {
        if (localStorage.getItem('refreshToken')) {
          const res = await apiFetch('/api/activity/', { method: 'POST' });
          if (res.ok) {
            setLoggedIn(true);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsChecking(false);
      }
    })();

    return () => {
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  // Show nothing while checking
  if (isChecking) {
    return <div style={{ display: 'none' }}></div>;
  }

  // If logged in, show dashboard
  if (loggedIn) {
    return (
      <div className="dashboard-layout">
        <div className="dashboard-left">
          <div className="assignments-header">
            <h2>Assignments</h2>
            <span className="assignment-count-badge">10</span>
          </div>
          <div className="assignments-list">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <Link key={num} href={`/assignment/${num}`} className="assignment-item">
                <svg className="assignment-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="assignment-content">
                  <span className="assignment-label">Assignment {num}</span>
                  <span className="assignment-number">#{num}</span>
                </div>
                <svg className="assignment-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
        <div className="dashboard-divider"></div>
        <div className="dashboard-right">
          <div className="workspace-header">
            <h2>Workspace</h2>
          </div>
          <div className="workspace-content">
            <div className="workspace-empty">
              <svg className="workspace-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="workspace-empty-text">Select an assignment to view details</p>
              <p className="workspace-empty-subtext">Content will appear here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, show the current landing page
  return (
    <div className="home-page">
      <main className="container">
          <section className="flex flex-col text-center mx-auto items-center justify-center gap-8 max-w-4xl px-4 sm:px-6 py-16 sm:py-20 md:py-24">
            <h1 className="hero-title-animated">
              <div className="hero-title-line">
                {"Empowering Education with".split(" ").map((word, index) => (
                  <motion.span
                    key={`line1-${index}`}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="hero-title-line">
                {"Generative AI".split(" ").map((word, index) => (
                  <motion.span
                    key={`line2-${index}`}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: (4 + index) * 0.06, duration: 0.3 }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="hero-description"
            >
              EdGenAI provides intelligent products and expert guidance to integrate generative AI into your institution.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.28, duration: 0.3 }}
              className="hero-tagline text-center w-full mt-2"
              style={{ textAlign: 'center', marginTop: '1rem' }}
            >
              <strong className="block text-center w-full">Reclaim Your Time. Revolutionize Your Classroom.</strong>
            </motion.p>
            
            <div className="hero-logos">
              {[
                { src: "/logos/the-university-of-melbourne-logo-png-transparent.png", alt: "University of Melbourne" },
                { src: "/logos/rmit.svg", alt: "RMIT University" },
              ].map((logo, index) => (
                <motion.div
                  key={logo.src}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                  className="flex items-center px-2"
                >
                  <Image 
                    src={logo.src} 
                    alt={logo.alt} 
                    width={140} 
                    height={44} 
                    className="h-auto w-24 sm:w-28 object-contain" 
                  />
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.32, duration: 0.3 }}
              className="hero-logos-caption"
            >
              Supported by leading universities
            </motion.p>
          </section>

          {/* Feature Cards Section */}
          <FeatureCards />

          {/* Feature Grid Section */}
          <FeatureGrid />

          {/* Services Grid Section */}
          <ServicesGrid />

          <section id="why-us" className="page-section">
            <div className="why-us-header">
              <div className="why-us-title-wrapper">
                <h2>Why Partner with EdGenAI?</h2>
                <p className="why-us-intro">
                  We&apos;re more than a vendor, we&apos;re your dedicated partner in educational innovation.
                </p>
              </div>
            </div>
            <div className="service-cards">
              <div className="service-card">
                <div className="service-card-image-wrapper">
                  <Image 
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
                    alt="Education Experts"
                    width={400}
                    height={300}
                    className="service-card-image"
                  />
                  <div className="service-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="service-card-content">
                  <h3>Education Experts</h3>
                  <p>Our team blends seasoned educators and AI researchers for unmatched insight.</p>
                </div>
              </div>
              <div className="service-card">
                <div className="service-card-image-wrapper">
                  <Image 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                    alt="Transparent Collaboration"
                    width={400}
                    height={300}
                    className="service-card-image"
                  />
                  <div className="service-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3V21H21" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 16L12 11L16 15L21 10" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 10V3H14" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="service-card-content">
                  <h3>Transparent Collaboration</h3>
                  <p>Agile, co-creative processes keep you in control every step of the way.</p>
                </div>
              </div>
              <div className="service-card">
                <div className="service-card-image-wrapper">
                  <Image 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                    alt="Ethical & Secure"
                    width={400}
                    height={300}
                    className="service-card-image"
                  />
                  <div className="service-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8V12" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16H12.01" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="service-card-content">
                  <h3>Ethical &amp; Secure</h3>
                  <p>Committed to the highest standards of data privacy and responsible AI.</p>
                </div>
              </div>
            </div>
          </section>
      </main>
    </div>
  );
}

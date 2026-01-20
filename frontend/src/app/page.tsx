'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FileText, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

import FeatureCards from '../components/FeatureCards';
import FeatureGrid from '../components/FeatureGrid';
import ServicesGrid from '../components/ServicesGrid';
import { apiFetch } from '../lib/api';
import { Layers } from '@/components/animate-ui/icons/layers';
import PillButton from '../components/PillButton';

// ============================================
// DASHBOARD VIEW COMPONENT
// Premium workspace with collapsible sidebar
// ============================================

interface AssignmentItemProps {
  num: number;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const AssignmentItem: React.FC<AssignmentItemProps> = ({ num, index, isSelected, onSelect }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onSelect();
    router.push(`/assignment/${num}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 12, filter: 'blur(4px)' }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <Link
        ref={ref}
        href={`/assignment/${num}`}
        className={`assignment-item ${isSelected ? 'assignment-item--selected' : ''}`}
        onClick={handleClick}
      >
        <div className="assignment-icon-wrapper">
          <FileText className="assignment-icon" size={18} strokeWidth={1.5} />
        </div>
        <div className="assignment-content">
          <span className="assignment-label">Assignment {num}</span>
        </div>
        <ChevronRight className="assignment-arrow" size={16} strokeWidth={2} />
      </Link>
    </motion.div>
  );
};

function DashboardView(): JSX.Element {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  const assignments = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  return (
    <motion.div
      className={`dashboard-layout ${sidebarCollapsed ? 'dashboard-layout--collapsed' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Collapsible Sidebar */}
      <motion.div
        className="dashboard-left"
        animate={{
          width: sidebarCollapsed ? '60px' : '280px',
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="assignments-header">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                className="assignments-header-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <h2>Assignments</h2>
                <span className="assignment-count-badge">{assignments.length}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.div
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </motion.div>
          </button>
        </div>

        <div className="assignments-list-container">
          <div
            ref={listRef}
            className="assignments-list"
            onScroll={handleScroll}
          >
            <AnimatePresence>
              {!sidebarCollapsed ? (
                assignments.map((num, index) => (
                  <AssignmentItem
                    key={num}
                    num={num}
                    index={index}
                    isSelected={selectedAssignment === num}
                    onSelect={() => setSelectedAssignment(num)}
                  />
                ))
              ) : (
                assignments.map((num, index) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.03 }}
                    className="assignment-mini"
                    onClick={() => {
                      setSelectedAssignment(num);
                      router.push(`/assignment/${num}`);
                    }}
                  >
                    <div className={`assignment-mini-dot ${selectedAssignment === num ? 'assignment-mini-dot--active' : ''}`}>
                      {num}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Scroll gradients */}
          {!sidebarCollapsed && (
            <>
              <div
                className="scroll-gradient scroll-gradient--top"
                style={{ opacity: topGradientOpacity }}
              />
              <div
                className="scroll-gradient scroll-gradient--bottom"
                style={{ opacity: bottomGradientOpacity }}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Divider with gradient */}
      <div className="dashboard-divider" />

      {/* Workspace Area */}
      <div className="dashboard-right">
        <div className="workspace-content">
          <AnimatePresence mode="wait">
            {!selectedAssignment ? (
              <motion.div
                key="empty"
                className="workspace-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="workspace-icon-wrapper"
                  animate={{
                    scale: [1, 1.03, 1],
                    opacity: [0.5, 0.7, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <Layers
                    className="workspace-icon"
                    size={64}
                    animation="default-loop"
                    animate={true}
                    loop={true}
                  />
                </motion.div>
                <p className="workspace-empty-text">Select an assignment to view details</p>
                <p className="workspace-empty-subtext">Content will appear here</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

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
    return <DashboardView />;
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
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                    <path d="M3 3V21H21" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 16L12 11L16 15L21 10" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 10V3H14" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 8V12" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16H12.01" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

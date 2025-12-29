'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '../../lib/api';

export default function AutoGradeLanding(): JSX.Element {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const features = [
    {
      title: 'Before Using Autograde',
      description: 'Reclaim your time with AutoGrade. Our AI-powered products automate repetitive tasks so you can stay focused on meaningful work, we handle the rest.',
      bulletPoints: [
        'Teachers spent up to ~9 hours per week marking assignments',
        'Feedback was often delayed due to workload',
        'Grading consistency varied across classes and markers',
        'Writing detailed feedback for every student was difficult',
        'Progress tracking required additional manual effort',
        'Marking contributed significantly to workload stress and burnout'
      ],
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80',
      href: '#feature-grid',
    },
    {
      title: 'After Using Autograde',
      description: 'Curriculum design, faculty training, and strategic AI implementation to integrate generative AI responsibly.',
      bulletPoints: [
        'Marking time is significantly reduced',
        'Feedback is generated instantly and remains meaningful',
        'All submissions are evaluated using consistent rubrics',
        'Students receive clear, actionable guidance',
        'Writing progress is tracked automatically over time',
        'Teachers regain time to focus on teaching and student support'
      ],
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
      href: '#services-grid',
    },
  ];

  const scrollToSection = (href: string) => {
    if (typeof window === 'undefined') return;

    const [, hash] = href.split('#');
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        const headerOffset = 100;
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
    }

    router.push(href);
  };

  const handleCardClick = (event: MouseEvent<HTMLElement>, href: string, index: number) => {
    event.preventDefault();
    setActiveIndex(index);
    scrollToSection(href);
  };

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>, href: string, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex(index);
    scrollToSection(href);
  };

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
            {/* Statistic Card 1 */}
            <div className="why-autograde-card">
              <div className="why-autograde-card-header">
                <div className="why-autograde-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <h3 className="why-autograde-card-title">Time Investment</h3>
              </div>
              <p className="why-autograde-card-description">
                Up to ~9 hours per week are spent on marking and assessment alone.
              </p>
              <button className="why-autograde-card-button" aria-label="Learn more">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l8-8M12 4H4v8"/>
                </svg>
              </button>
            </div>

            {/* Statistic Card 2 */}
            <div className="why-autograde-card">
              <div className="why-autograde-card-header">
                <div className="why-autograde-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 className="why-autograde-card-title">Teacher Workload</h3>
              </div>
              <p className="why-autograde-card-description">
                ~25% of secondary teachers spend 10+ hours per week grading student work.
              </p>
              <button className="why-autograde-card-button" aria-label="Learn more">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l8-8M12 4H4v8"/>
                </svg>
              </button>
            </div>

            {/* Statistic Card 3 */}
            <div className="why-autograde-card">
              <div className="why-autograde-card-header">
                <div className="why-autograde-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3 className="why-autograde-card-title">Stress Factor</h3>
              </div>
              <p className="why-autograde-card-description">
                50% of teachers report grading as a major source of stress.
              </p>
              <button className="why-autograde-card-button" aria-label="Learn more">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l8-8M12 4H4v8"/>
                </svg>
              </button>
            </div>

            {/* Statistic Card 4 */}
            <div className="why-autograde-card">
              <div className="why-autograde-card-header">
                <div className="why-autograde-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3 className="why-autograde-card-title">Workload Impact</h3>
              </div>
              <p className="why-autograde-card-description">
                Marking is one of the highest workload contributors in Australian classrooms.
              </p>
              <button className="why-autograde-card-button" aria-label="Learn more">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l8-8M12 4H4v8"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* --- Feature Cards Section (Same as Home Page) --- */}
        <section
          id="features"
          className="features-section"
        >
          <div className="features-container">
            {features.map((feature, index) => {
              const isActive = index === activeIndex;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={(event) => handleCardClick(event, feature.href, index)}
                  className={`feature-card ${isActive ? 'active' : ''}`}
                >
                  <div className="card-inner">
                    {/* Background Image */}
                    <div className="card-image">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={2000}
                        height={2000}
                        className="card-image-img"
                        priority={index === 0}
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="card-content">
                      {/* Gradient Overlay - EXACT MATCH */}
                      <div className="card-gradient" />

                      {/* Title */}
                      <h3>{feature.title}</h3>

                      {/* Show bullet points right after heading for first card (Before Using Autograde) */}
                      {feature.bulletPoints && feature.bulletPoints.length > 0 && (
                        <ul className="feature-bullet-list">
                          {feature.bulletPoints.map((point, pointIndex) => (
                            <li key={pointIndex} className="feature-bullet-item">
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Bottom Section: Description + Button */}
                      <div className="card-bottom">
                        <div className="card-description">
                          {/* Mobile Description - Always Visible */}
                          {!feature.bulletPoints && (
                            <p className="mobile-description">
                              {feature.description}
                            </p>
                          )}

                          {/* Desktop Description - Fades In/Out */}
                          {!feature.bulletPoints && (
                            <p
                              className={`desktop-description ${isActive ? 'active' : ''}`}
                            >
                              {feature.description}
                            </p>
                          )}
                        </div>

                        {/* Circular Button - Bottom Right */}
                        <button
                          className="card-button"
                          aria-label={`Explore ${feature.title}`}
                          onClick={(event) => handleButtonClick(event, feature.href, index)}
                        >
                          <ArrowDown />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* --- Features Grid Section --- */}
        <section className="features-grid-section">
          <div className="features-grid-container">
            {[
              {
                number: '01',
                category: 'AI ASSESSMENT',
                title: 'AI-Powered Writing Assessment',
                description: 'Autograde uses artificial intelligence to analyse student essays and written responses based on educator-defined marking criteria. Instead of relying on generic rules, it evaluates writing against the specific rubric provided by the teacher, considering elements such as structure, clarity, argument development, evidence, and language use. This ensures that every submission is assessed fairly, consistently, and in line with classroom expectations.',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
                imagePosition: 'left'
              },
              {
                number: '02',
                category: 'FEEDBACK',
                title: 'High-Quality, Contextual Feedback',
                description: 'Autograde generates clear and meaningful feedback that directly relates to the student\'s own writing. Comments are specific, actionable, and focused on helping students understand what they did well and how they can improve. Rather than vague statements, students receive guidance that supports learning and skill development, making feedback more effective and easier to act upon.',
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
                imagePosition: 'right'
              },
              {
                number: '03',
                category: 'SCORING',
                title: 'Rubric-Based & Consistent Scoring',
                description: 'All assessments are scored using custom rubrics created by educators, ensuring consistency across classes, subjects, and cohorts. This approach reduces variation in marking and supports fair, objective assessment, especially in large classes or when multiple teachers are involved. Rubric-based scoring also helps maintain alignment with curriculum standards and assessment goals.',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
                imagePosition: 'left'
              },
              {
                number: '04',
                category: 'MONITORING',
                title: 'Student Progress Monitoring',
                description: 'Autograde tracks student performance across multiple writing tasks over time. Educators can easily observe patterns, strengths, and areas that require further support, helping them understand how each student\'s writing skills are developing. This long-term view supports data-informed teaching and allows timely intervention when needed.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                imagePosition: 'right'
              },
              {
                number: '05',
                category: 'FLEXIBILITY',
                title: 'Support for Handwritten & Typed Work',
                description: 'Autograde is designed for real classroom environments. It accepts typed submissions, as well as scanned or photographed handwritten work, allowing teachers to assess student writing without changing existing workflows. This flexibility makes Autograde suitable for both digital and traditional classroom settings.',
                image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
                imagePosition: 'left'
              },
              {
                number: '06',
                category: 'ANALYTICS',
                title: 'Analytics & Performance Insights',
                description: 'Autograde provides clear, easy-to-understand insights through structured dashboards and reports. Educators can view individual and cohort-level performance trends, identify common skill gaps, and monitor overall writing development. These insights support better instructional planning, curriculum alignment, and evidence-based decision-making.',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                imagePosition: 'right'
              }
            ].map((item, index) => (
              <div key={index} className={`feature-grid-item ${item.imagePosition === 'left' ? 'image-left' : 'image-right'}`}>
                {item.imagePosition === 'left' && (
                  <div className="feature-grid-image">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="feature-grid-img"
                    />
                  </div>
                )}
                <div className="feature-grid-content">
                  <h3 className="feature-grid-title">{item.title}</h3>
                  <p className="feature-grid-description">{item.description}</p>
                </div>
                {item.imagePosition === 'right' && (
                  <div className="feature-grid-image">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="feature-grid-img"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
                
      </main>
    </div>
  );
}

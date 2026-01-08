'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FeatureGrid() {
  const router = useRouter();
  const demoVideoHref = 'https://www.youtube.com/watch?v=PBtyISfftTc&t=8s';
  const demoVideoEmbedUrl = 'https://www.youtube.com/embed/PBtyISfftTc?start=8';
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    if (!isDemoOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDemoOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isDemoOpen]);

  const features = [
    {
      title: 'AutoGrade: AI-Powered Grading',
      description: 'Evaluate submissions against your rubrics and deliver fair grades with consistent, constructive feedback in minutes.',
      image: 'https://images.unsplash.com/photo-1631557777232-a2632ae3c67d?auto=format&fit=crop&w=1600&q=80', // AutoGrade workspace (selected)
      href: '/auto-grade',
      size: 'large' as const,
    },
    {
      title: 'View Demo of AutoGrade',
      description: 'Watch a quick walkthrough of AutoGrade evaluating a submission in real time.',
      image: '/backgrounds/Screenshot%202025-12-11%20at%206.09.10%E2%80%AFPM.png', // Provided demo screenshot
      href: demoVideoHref,
      size: 'small' as const,
      isDemo: true,
    },
    {
      title: 'Plan My Assignment: Student Planner',
      description: 'Help students actively plan assignments, manage deadlines, and track progress with AI support.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80', // Organized study planner
      href: '/plan-my-assignment-wizard',
      size: 'small' as const,
    },
  ];

  return (
    <section
      id="feature-grid"
      className="feature-grid-section"
    >
      <div className="feature-grid-header">
        <h2 className="feature-grid-title">Products</h2>
        <p className="feature-grid-subtitle text-primary">
          AutoGrade and Plan My Assignment bring AI-powered grading and planning products to your classroom.
        </p>
      </div>
      <div className="feature-grid-container">
        {features.map((feature, index) => (
          <Link
            key={feature.title}
            href={feature.href}
            onClick={(event) => {
              if (!feature.isDemo) return;
              event.preventDefault();
              setIsDemoOpen(true);
            }}
            className={`feature-grid-card ${feature.size === 'large' ? 'large' : 'small'}`}
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
                {/* Gradient Overlay */}
                <div className="card-gradient" />

                {/* Title */}
                <h3>{feature.title}</h3>

                {/* Bottom Section: Description + Button */}
                <div className="card-bottom">
                  <div className="card-description">
                    <p>{feature.description}</p>
                  </div>

                  {/* Circular Button - Bottom Right */}
                  <button
                    className="card-button"
                    aria-label={feature.isDemo ? 'Open demo video' : `Explore ${feature.title}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (feature.isDemo) {
                        setIsDemoOpen(true);
                        return;
                      }
                      router.push(feature.href);
                    }}
                  >
                    <ArrowUpRight />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {isDemoOpen && (
        <div className="demo-overlay" role="dialog" aria-modal="true" aria-label="AutoGrade demo video">
          <div className="demo-backdrop" onClick={() => setIsDemoOpen(false)} />
          <div className="demo-content">
            <button
              type="button"
              className="demo-close"
              aria-label="Close demo video"
              onClick={() => setIsDemoOpen(false)}
            >
              &times;
            </button>
            <div className="demo-iframe-wrapper">
              <iframe
                src={demoVideoEmbedUrl}
                title="AutoGrade demo video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

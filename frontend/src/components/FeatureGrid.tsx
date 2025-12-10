'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FeatureGrid() {
  const router = useRouter();

  const features = [
    {
      title: 'Automated Grading',
      description: 'Reduce marking time with AI that scores rubrics, drafts feedback, and flags outliers.',
      image: '/backgrounds/bg2.png', // Sky/clouds background
      href: '/auto-grade',
      size: 'large' as const,
    },
    {
      title: 'Auto Grading',
      description: 'Build pathways for every learner with tailored tasks, pacing, and AI-created resources.',
      image: '/backgrounds/bg1.png', // Blurred flowers background
      href: '/auto-grade',
      size: 'small' as const,
    },
    {
      title: 'Plan My Assignment',
      description: 'Surface lesson ideas, examples, and formative checks tailored to each cohort in seconds.',
      image: '/backgrounds/bg3.webp', // Castle/moat background
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
        <h2 className="feature-grid-title">Tools</h2>
        <p className="feature-grid-subtitle text-primary">
          An Education partner for universities, TAFEs, and schools looking to integrate AI into their teaching and learning processes.
        </p>
      </div>
      <div className="feature-grid-container">
        {features.map((feature, index) => (
          <Link
            key={feature.title}
            href={feature.href}
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
                    aria-label={`Explore ${feature.title}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
    </section>
  );
}


'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FeatureCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const features = [
    {
      title: 'Automated Grading',
      description: 'Reduce marking time with AI that scores rubrics, drafts feedback, and flags outliers.',
      image: '/backgrounds/bg2.png', // Sky/clouds background
      href: '/auto-grade',
    },
    {
      title: 'Personalized Study Plans',
      description: 'Build pathways for every learner with tailored tasks, pacing, and AI-created resources.',
      image: '/backgrounds/bg1.png', // Blurred flowers background
      href: '/plan-my-assignment-wizard', // Links to plan my assignment wizard page
    },
  ];

  return (
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
              onClick={() => setActiveIndex(index)}
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

                  {/* Bottom Section: Description + Button */}
                  <div className="card-bottom">
                    <div className="card-description">
                      {/* Mobile Description - Always Visible */}
                      <p className="mobile-description">
                        {feature.description}
                      </p>

                      {/* Desktop Description - Fades In/Out */}
                      <p
                        className={`desktop-description ${isActive ? 'active' : ''}`}
                      >
                        {feature.description}
                      </p>
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
          );
        })}
      </div>
    </section>
  );
}


'use client';

import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FeatureCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const features = [
    {
      title: 'Tools',
      description: 'Reclaim your time with EdGenAI. Our AI-powered tools automate repetitive tasks so you can stay focused on meaningful work, we handle the rest.',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80', // Productive desk with laptop and sticky-notes for AI tools in action
      href: '#feature-grid',
    },
    {
      title: 'Consultancy',
      description: 'Curriculum design, faculty training, and strategic AI implementation to integrate generative AI responsibly.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80', // Consultancy workshop with projector (requested)
      href: '#services-grid', // Scroll to services section
    },
  ];

  const scrollToSection = (href: string) => {
    if (typeof window === 'undefined') return;

    const [, hash] = href.split('#');
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        const headerOffset = 100; // account for fixed header
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
  );
}

'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ServicesGrid() {
  const router = useRouter();

  const services = [
    {
      title: 'Curriculum & Assessment Design',
      description: 'Co-design AI-infused learning modules, authentic assessments, and course materials that prepare students for an AI-driven world.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80', // Educator outlining curriculum plans on paper and laptop
      href: '/services#curriculum-design',
      position: 'top-left' as const, // Large card, spans 2 rows
    },
    {
      title: 'Faculty Training Workshops',
      description: 'Hands-on workshops that build practical AI literacy so educators can teach, streamline workflows, and guide students ethically.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80', // Facilitator leading an interactive training session
      href: '/services#faculty-training',
      position: 'top-right' as const, // Small card
    },
    {
      title: 'Strategic AI Implementation',
      description: 'Develop a comprehensive AI strategy across policy, infrastructure, and pedagogy to integrate AI smoothly at scale.',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80', // Leadership team in a strategy workshop
      href: '/services#strategic-implementation',
      position: 'middle-right' as const, // Small card
    },

  ];

  return (
    <section
      id="services-grid"
      className="services-grid-section"
    >
      <div className="services-grid-header">
        <h2 className="services-grid-title">Services</h2>
        <p className="services-grid-subtitle text-primary">
          Integrate AI into your curriculum, train faculty, and build a sustainable strategy with a trusted partner.
        </p>
      </div>
      <div className="services-grid-container">
        {services.map((service, index) => (
          <Link
            key={service.title}
            href={service.href}
            className={`services-grid-card ${service.position}`}
          >
            <div className="card-inner">
              {/* Background Image */}
              <div className="card-image">
                <Image
                  src={service.image}
                  alt={service.title}
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
                <h3>{service.title}</h3>

                {/* Bottom Section: Description + Button */}
                <div className="card-bottom">
                  <div className="card-description">
                    <p>{service.description}</p>
                  </div>

                  {/* Circular Button - Bottom Right */}
                  <button
                    className="card-button"
                    aria-label={`Explore ${service.title}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (service.href.includes('#')) {
                        const [path, hash] = service.href.split('#');
                        router.push(path);
                        setTimeout(() => {
                          const element = document.getElementById(hash);
                          if (element) {
                            const serviceItem = element.closest('.service-item');
                            if (serviceItem) {
                              // Use the same scroll logic as the services page
                              // Scroll to position the horizontal divider line at the top
                              const yOffset = -170; // Same offset as services page
                              const y = (serviceItem as HTMLElement).getBoundingClientRect().top + window.pageYOffset + yOffset;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                          }
                        }, 100);
                      } else {
                        router.push(service.href);
                      }
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

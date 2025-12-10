'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ServicesGrid() {
  const router = useRouter();

  const services = [
    {
      title: 'Business Automation',
      description: 'We help education providers streamline complex administrative processes using secure, reliable GenAI solutions.',
      image: '/backgrounds/bg2.png', // Sky/clouds background
      href: '/services#service-0',
      position: 'top-left' as const, // Large card, spans 2 rows
    },
    {
      title: 'Professional Development and Training',
      description: 'We provide hands-on, evidence-based training tailored for educators, support staff, and leadership teams looking to implement GenAI in teaching, operations, and student engagement.',
      image: '/backgrounds/bg1.png', // Blurred flowers background
      href: '/services#service-1',
      position: 'top-right' as const, // Small card
    },
    {
      title: 'Course Design',
      description: 'We support educators in creating courses that leverage AI to improve engagement, clarity, and student outcomes without sacrificing academic integrity.',
      image: '/backgrounds/bg3.webp', // Castle/moat background
      href: '/services#service-3',
      position: 'middle-right' as const, // Small card
    },
    {
      title: 'Security and Data Governance',
      description: 'Education institutions face strict data and policy requirements. We help you deploy AI safely, ensuring governance is built-in from day one.',
      image: '/backgrounds/bg2.png', // Sky/clouds background
      href: '/services#service-2',
      position: 'bottom-left' as const, // Large card, spans 2 columns
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
          End-to-end AI solutions that transform business operations to enhance administrative, teaching, and learning experiences.
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


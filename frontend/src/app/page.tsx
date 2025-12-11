'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import FeatureCards from '../components/FeatureCards';
import FeatureGrid from '../components/FeatureGrid';
import ServicesGrid from '../components/ServicesGrid';

export default function HomePage(): JSX.Element {


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
              EdGenAI provides intelligent tools and expert guidance to integrate generative AI into your institution.
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

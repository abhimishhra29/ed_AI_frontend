'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import FeatureCards from '../components/FeatureCards';

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
              EdGenAI provides intelligent tools and expert guidance to automate grading, streamline student planning, and integrate generative AI into your institution.
            </motion.p>
            <div className="hero-logos">
              {[
                { src: "/logos/Uni-Mel.jpg", alt: "University of Melbourne" },
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

          <section id="why-us" className="page-section">
            <h2>Why Partner with EdGenAI?</h2>
            <p className="subheading">
              We&apos;re more than a vendor; we&apos;re your dedicated partner in educational innovation.
            </p>
            <div className="cards">
              <div className="card">
                <h3>Education Experts</h3>
                <p>Our team blends seasoned educators and AI researchers for unmatched insight.</p>
              </div>
              <div className="card">
                <h3>Transparent Collaboration</h3>
                <p>Agile, co-creative processes keep you in control every step of the way.</p>
              </div>
              <div className="card">
                <h3>Ethical &amp; Secure</h3>
                <p>Committed to the highest standards of data privacy and responsible AI.</p>
              </div>
            </div>
          </section>

          <section id="contact" className="page-section final-cta">
            <h2>Ready to Transform Your Institution?</h2>
            <p className="subheading">
              Schedule a free consultation with our team today and start your AI journey.
            </p>
            <Link href="/contact" className="btn-primary">
              Get Started for Free
            </Link>
          </section>
      </main>
    </div>
  );
}

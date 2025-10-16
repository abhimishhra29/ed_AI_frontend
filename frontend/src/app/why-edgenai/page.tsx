'use client';

import { useEffect } from 'react';

export default function WhyEdGenAI() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const scrollToSection = () => {
      const params = new URLSearchParams(window.location.search);
      const sectionParam = params.get('section');
      if (!sectionParam) return;

      const element = document.getElementById(sectionParam);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    scrollToSection();
    window.addEventListener('popstate', scrollToSection);
    return () => {
      window.removeEventListener('popstate', scrollToSection);
    };
  }, []);

  return (
    <div className="container why-page page-section">
      <h1>Why Choose Us?</h1>

      <section id="mission" className="page-section">
        <h2>GenAI Experts for Authentic Learning</h2>
        <p>
          We specialize in building GenAI tools that align with authentic, outcomes-based education. Our mission is
          to support deeper learning through thoughtfully designed AI that scaffolds reflection,
          encourages critical thinking, and empowers educators to deliver the best.
        </p>
        <p>
          Every solution we build reflects deep collaboration with the education community, ensuring our tools
          enhance—not disrupt—the integrity of the learning process.
        </p>
      </section>

      <section id="how-we-work" className="page-section">
        <h2>Transparency and Agility</h2>
        <p>
          We work side-by-side with educators, academic leaders, and instructional designers to co-create AI solutions
          that are practical, modular, and pedagogically grounded. Every feature is pilot-tested and refined based on real
          classroom use.
        </p>
        <p>
          Our agile approach allows us to quickly respond to feedback and ensure our tools evolve with your needs—always
          with full transparency into how they work and why they’re designed the way they are.
        </p>
      </section>

      <section id="ai-principles" className="page-section">
        <h2>Privacy and Security Focus</h2>
        <p>
          We treat educational data with the sensitivity it deserves. Our systems are designed with
          <strong> privacy-first architecture</strong>, complying with institutional and regional policies, and offering clear
          control over how data is used.
        </p>
        <p>
          Whether you&apos;re an educator, student, or administrator, you can trust that EdGenAI’s tools protect what matters
          most: learner integrity, data ownership, and ethical application of AI in education.
        </p>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import heroImage from '../../assets/images/hero_section.jpg';

function ServiceCard({ service, index }: { service: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      key={index} 
      className={`service-content-wrapper ${isExpanded ? 'expanded' : ''}`}
    >
      <h3 className="service-headline">{service.headline}</h3>
      <p className="service-subhead">{service.subhead}</p>
      
        <button 
          className="service-learn-more-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Show Less' : 'Learn More'}
          <span className={`service-arrow ${isExpanded ? 'expanded' : ''}`}>↓</span>
        </button>
      
      <div className={`service-expandable-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="service-deliverables">
          <h4 className="service-deliverables-title">What we deliver:</h4>
          <ul className="service-deliverables-list">
            {service.deliverables.map((item: string, idx: number) => (
              <li key={idx} className="service-deliverable-item">
                <span className="service-deliverable-bullet"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="service-why-matters">
          <h4 className="service-why-matters-label">Why it matters:</h4>
          <ul className="service-why-matters-list">
            <li className="service-why-matters-item">
              <span className="service-deliverable-bullet"></span>
              <span>{service.whyItMatters}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const timelineSteps = [
    {
      number: '1',
      title: 'Explore',
      subhead: 'Set Direction & Standards'
    },
    {
      number: '2',
      title: 'Design',
      subhead: 'Build a Clear Blueprint'
    },
    {
      number: '3',
      title: 'Trial',
      subhead: 'Test with Evidence'
    },
    {
      number: '4',
      title: 'Launch',
      subhead: 'Enable at Scale'
    },
    {
      number: '5',
      title: 'Measure',
      subhead: 'Make Impact Visible'
    }
  ];

  const services = [
    {
      icon: 'A',
      headline: 'AI-Assisted Content & Assessment',
      subhead: 'Faster feedback. Fairer assessment.',
      description: 'AI-ready rubrics, autograding with human review, and student-friendly feedback.',
      deliverables: [
        'Rubric engineering aligned to prompts and scoring bands',
        'Autograding workflows with reviewer checkpoints & sampling rules',
        'Plain-English feedback templates (tone control, EAL support)',
        'Optional OCR for handwritten work with quality thresholds'
      ],
      whyItMatters: 'Marking time drops, turnaround accelerates, and rubric consistency improves—without losing teacher judgement.'
    },
    {
      icon: 'T',
      headline: 'Gen-AI Training for Educators',
      subhead: 'Hands-on PD teachers use tomorrow.',
      description: 'Prompt patterns, integrity-aware assessment design, and ready-to-run templates.',
      deliverables: [
        'Live workshops (primer, intensive, or cohort) with real tasks',
        'Subject-ready prompt libraries and exemplar generators',
        'Assessment-integrity techniques that still drive learning',
        'Slides, prompt packs, recordings, and office hours'
      ],
      whyItMatters: 'Confidence and adoption go up; each attendee leaves with a lesson or assessment they can run next week.'
    },
    {
      icon: 'D',
      headline: 'Digital Transformation & Custom Solutions',
      subhead: 'Roadmaps, guardrails, and tools that fit your stack.',
      description: 'Policy-aligned strategy plus pilots and lightweight custom apps.',
      deliverables: [
        'AI roadmap, governance, and DPIA support',
        'Buy-vs-build advice, vendor shortlist, and pilot design',
        'Lightweight custom apps (autograder, planner, feedback bot)',
        'Role-based access, audit trails, and data-flow mapping'
      ],
      whyItMatters: 'Faster, safer adoption with board-ready reporting—and you only build what you truly need.'
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero" style={{ backgroundImage: `url(${heroImage.src || heroImage})` }}>
        <div className="services-hero-overlay"></div>
        <div className="services-hero-content">
          <h1 className="services-hero-title">EdGenAI Services</h1>
          <p className="services-hero-subtitle">Practical GenAI for education—faster feedback, fairer assessment, and confident rollouts.</p>
        </div>
        
        {/* Timeline Boxes Container - positioned to be half in hero, half below */}
        <div className="timeline-container">
          {timelineSteps.map((step, index) => (
            <div key={index} className="timeline-box">
              <div className="timeline-icon">
                <span className="timeline-number">{step.number}</span>
              </div>
              <h3 className="timeline-title">{step.title}</h3>
              <p className="timeline-subhead">{step.subhead}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Cards Section - Option 3: Progressive Disclosure */}
      <section className="services-cards-section">
        <div className="services-cards-container">
          <div className="services-cards-title-wrapper">
            <h2 className="services-cards-title">
              <span className="services-gradient-text">Our </span>
              <span className="services-number-text">Services</span>
            </h2>
            <div className="services-title-indicator">
              <div className="services-indicator-line"></div>
              <div className="services-indicator-dot"></div>
            </div>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

import training from '../../components/training.png';
import assessment from '../../components/assessment.png';
import transform from '../../components/transform.png';

export default function Services() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const scrollToSection = () => {
      const params = new URLSearchParams(window.location.search);
      const sectionParam = params.get('section');

      if (sectionParam === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (sectionParam) {
        const el = document.getElementById(sectionParam);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    scrollToSection();
    window.addEventListener('popstate', scrollToSection);
    return () => {
      window.removeEventListener('popstate', scrollToSection);
    };
  }, []);

  return (
    <div className="container services-page">

      {/* ----------------------- Header ----------------------- */}
      <header className="services-header">
        <h1>Gen AI Consultancy</h1>
        <p className="lead">
          EdGenAI helps educational institutions integrate Generative AI—
          from strategy to course design—so your staff and learners can work
          smarter.
        </p>
        <p className="lead small">
          We bring proven frameworks, ready‑to‑use tools, and practitioner
          know‑how to accelerate adoption while keeping ethics and data
          privacy front‑of‑mind.
        </p>
      </header>

    {/* -------- Content & Assessment -------- */}
      <section id="course-design" className="service-row even">
        <div className="service-text">
          <h2>AI‑Assisted Content &amp; Assessment</h2>
          <p className="sub">
            Smarter courses and assessments that adapt, personalise, and scale.
          </p>
          <ul className="chip-list">
            <li>Modular, AI‑enhanced lesson and assessment design aligned to learning outcomes.</li>
            <li>Adaptive content pathways that respond to learner progress and engagement signals.</li>
            <li>Automated generation of lessons, quizzes, assignments, and supporting resources.</li>
            <li>Instant, personalized feedback for formative and summative tasks at scale.</li>
          </ul>
        </div>
        <img src={assessment.src} alt="AI‑assisted content and assessment" />
      </section>


      {/* -------- Training -------- */}
      <section id="genai-training" className="service-row">
        <div className="service-text">
          <h2>GenAI Training for Educators</h2>
          <p className="sub">
            Empower educators with the skills, strategies, and tools to harness Generative AI responsibly in teaching and assessment..
          </p>
          <ul className="chip-list">
            <li>Hands-on workshops with practical GenAI use cases in curriculum and assessment design.</li>
            <li>Ready-to-use prompt templates and lesson “recipes” for classroom integration.</li>
            <li>Techniques for designing AI‑assisted assessments with rubric alignment.</li>
            <li>Strategies for delivering AI-generated, personalized feedback at scale.</li>
            <li>Guidance on ethical use, bias mitigation, and responsible AI adoption in education.</li>
          </ul>
        </div>
        <img src={training.src} alt="GenAI training and workshop" />
      </section>


      {/* -------- Consultancy -------- */}
      <section id="genai-consultancy" className="service-row">
        <div className="service-text">
          <h2>Digital Transformation and Custom Solution</h2>
          <p className="sub">
            Transform your institution with tailored GenAI strategies, custom tools, and ethical, measurable deployment.
          </p>
          <ul className="chip-list">
            <li>Custom GenAI playbooks aligned to institutional priorities and workflows.</li>
            <li>Privacy-first and policy-compliant AI adoption strategies.</li>
            <li>KPI-driven implementation with impact monitoring and optimization.</li>
            <li>Co-designed pilot programs fort educators and support staff.</li>
            <li>Bespoke GenAI tools and point solutions built to meet local needs.</li>
          </ul>
        </div>
        <img src={transform.src} alt="Digital Transformation" />
      </section>



    </div>
  );
}

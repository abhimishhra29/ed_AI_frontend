'use client';

import { MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowDown, FileSearch } from 'lucide-react';

import educatorsImg from '../components/educators.jpeg';
import studentsImg from '../components/students.jpeg';
import leadersImg from '../components/leaders.jpeg';

export default function HomePage(): JSX.Element {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncLogin = () => {
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    };

    syncLogin();
    window.addEventListener('storage', syncLogin);

    return () => {
      window.removeEventListener('storage', syncLogin);
    };
  }, []);

  const handleAutoGradeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!loggedIn) {
      return;
    }
    event.preventDefault();
    router.push('/auto-grade');
  };

  const handlePlanAssignmentClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!loggedIn) {
      return;
    }
    event.preventDefault();
    router.push('/plan-my-assignment');
  };

  return (
    <div className="home-page">
      <main className="container">
          <header id="hero" className="hero" role="banner">
            <h1>Empowering <span className="education-highlight">Education</span> with Generative AI</h1>
            <p>
              EdGenAI provides intelligent tools and expert guidance to automate grading, streamline student planning, and integrate generative AI into your institution.
            </p>
            <p className="hero-tagline">
              Reclaim Your Time. Revolutionize Your Classroom.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn-primary">
                Explore Our AI Tools
                <ArrowDown size={24} />
              </Link>
              <Link href="/services" className="btn-primary btn-secondary">
                Learn About Consultancy
                <FileSearch size={24} />
              </Link>
            </div>
          </header>

          <section id="personas" className="page-section">
            <h2>Who We Help</h2>
            <p className="subheading">
              We empower every member of the academic community to overcome their most pressing challenges.
            </p>
            <div className="persona-grid">
              <div className="persona-card">
                <Link
                  href="/auto-grade"
                  className="product-card link-card"
                  onClick={handleAutoGradeClick}
                >
                  <div className="persona-image-wrapper">
                    <Image
                      src={educatorsImg}
                      alt="Educator collaborating with students"
                      sizes="(max-width: 1024px) 100vw, 320px"
                      className="persona-image"
                      priority
                    />
                  </div>
                  <div className="persona-content">
                    <h3>For Educators</h3>
                    <p>Focus on teaching, leave the grading to AI.</p>
                    <div className="feature-item">
                      <div className="icon-wrapper">
                        <CheckCircle className="icon" size={20} />
                      </div>
                      <div className="feature-text">
                        <strong>Automate Grading:</strong> Instantly grade assignments based on your custom rubrics.
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="icon-wrapper">
                        <CheckCircle className="icon" size={20} />
                      </div>
                      <div className="feature-text">
                        <strong>Personalize Feedback:</strong> Generate meaningful feedback tailored to each student.
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="persona-card">
                <Link
                  href="/products#plan-my-assignments"
                  className="product-card link-card"
                  onClick={handlePlanAssignmentClick}
                >
                  <div className="persona-image-wrapper">
                    <Image
                      src={studentsImg}
                      alt="Student studying with a laptop"
                      sizes="(max-width: 1024px) 100vw, 320px"
                      className="persona-image"
                      priority
                    />
                  </div>
                  <div className="persona-content">
                    <h3>For Students</h3>
                    <p>Gain clarity and confidence in your academic journey.</p>
                    <div className="feature-item">
                      <div className="icon-wrapper">
                        <CheckCircle className="icon" size={20} />
                      </div>
                      <div className="feature-text">
                        <strong>Deconstruct Assignments:</strong> Break down complex projects into clear, manageable steps.
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="icon-wrapper">
                        <CheckCircle className="icon" size={20} />
                      </div>
                      <div className="feature-text">
                        <strong>Plan Your Workload:</strong> Intelligently organize tasks and meet deadlines with ease.
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="persona-card">
                <Link
                  href="/services#curriculum-design"
                  className="service-card link-card"
                >
                  <div className="persona-image-wrapper">
                    <Image
                      src={leadersImg}
                      alt="Academic leader in a meeting"
                      sizes="(max-width: 1024px) 100vw, 320px"
                      className="persona-image"
                    />
                  </div>
                  <div className="persona-content">
                    <h3>For Academic Leaders</h3>
                    <p>Lead educational innovation with a trusted AI partner.</p>
                    <div className="feature-item">
                      <div className="icon-wrapper">
                        <CheckCircle className="icon" size={20} />
                      </div>
                      <div className="feature-text">
                        <strong>Build Expertise:</strong> Equip your faculty with cutting-edge GenAI training.
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="icon-wrapper">
                        <CheckCircle className="icon" size={20} />
                      </div>
                      <div className="feature-text">
                        <strong>Drive Transformation:</strong> Get strategic guidance to implement AI at scale.
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          <section id="autograding" className="page-section">
            <div className="solution-container">
              <div className="solution-text">
                <h3>AutoGrade: AI-Powered Grading</h3>
                <p className="subheading">
                  Reclaim your time and deliver consistent, high-quality feedback.
                </p>
                <p className="details">
                  Our AutoGrade tool revolutionizes the grading process by using advanced AI to evaluate student submissions against your specific rubrics. It eliminates unconscious bias and ensures every student receives fair, consistent, and constructive feedback in a fraction of the time. Move beyond tedious marking and focus on what truly matters: teaching.
                </p>
                <Link
                  href="/auto-grade"
                  className="btn btn-primary"
                  onClick={handleAutoGradeClick}
                >
                  Learn More
                </Link>
              </div>
              <div className="solution-image">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="A teacher reviewing insightful analytics about student performance on a laptop."
                />
              </div>
            </div>
          </section>

          <section id="assignment-planning" className="page-section">
            <div className="solution-container reverse">
              <div className="solution-image">
                <img
                  src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600"
                  alt="A student organizing project tasks on a digital planner."
                />
              </div>
              <div className="solution-text">
                <h3>Plan My Assignment: Scaffold for Success</h3>
                <p className="subheading">
                  Empower students to tackle complex projects with confidence.
                </p>
                <p className="details">
                  Large assignments can be overwhelming for students. Plan My Assignment breaks down any project into a manageable, step-by-step timeline. The tool helps students organize their thoughts, set realistic deadlines for each phase, and track their progress, building crucial executive functioning skills and reducing procrastination.
                </p>
                <Link
                  href="/products#plan-my-assignments"
                  className="btn btn-primary"
                  onClick={handlePlanAssignmentClick}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </section>

          <section id="curriculum-design" className="page-section">
            <div className="solution-container">
              <div className="solution-text">
                <h3>Curriculum &amp; Assessment Design</h3>
                <p className="subheading">
                  Integrate AI into the core of your learning experience.
                </p>
                <p className="details">
                  We partner with your faculty to co-design the next generation of academic content. Together, we&apos;ll develop AI-infused learning modules, create authentic assessments that leverage AI tools, and build dynamic course materials that prepare students for an AI-driven world.
                </p>
                <Link href="/services#curriculum-design" className="btn btn-primary">
                  Explore Curriculum Design
                </Link>
              </div>
              <div className="solution-image">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600"
                  alt="A team collaboratively planning a new curriculum on a whiteboard."
                />
              </div>
            </div>
          </section>

          <section id="faculty-training" className="page-section">
            <div className="solution-container reverse">
              <div className="solution-image">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600"
                  alt="An engaging faculty training workshop in a modern lecture hall."
                />
              </div>
              <div className="solution-text">
                <h3>Faculty Training Workshops</h3>
                <p className="subheading">
                  Empower your educators with essential GenAI skills.
                </p>
                <p className="details">
                  Our hands-on workshops are designed to move beyond theory and build practical AI literacy. We equip your faculty with the confidence and competence to use generative AI for enhancing their teaching, streamlining their workflow, and guiding their students ethically and effectively.
                </p>
                <Link href="/services#faculty-training" className="btn btn-primary">
                  View Workshop Options
                </Link>
              </div>
            </div>
          </section>

          <section id="strategic-implementation" className="page-section">
            <div className="solution-container">
              <div className="solution-text">
                <h3>Strategic AI Implementation</h3>
                <p className="subheading">
                  Build a sustainable roadmap for digital transformation.
                </p>
                <p className="details">
                  Successfully adopting AI requires more than just tools, it requires a vision. We work with your leadership to develop a comprehensive AI strategy, addressing policy, infrastructure, and pedagogical goals to ensure a smooth and impactful integration across your institution.
                </p>
                <Link href="/services#strategic-implementation" className="btn btn-primary">
                  Plan Your Strategy
                </Link>
              </div>
              <div className="solution-image">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600"
                  alt="Leaders discussing a strategic roadmap for implementation."
                />
              </div>
            </div>
          </section>

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

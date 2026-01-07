'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';

const planTypes = [
  {
    title: 'Research Essays',
    description: 'Turn complex prompts into structured outlines and source plans.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <path d="M4 5h10a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3V5z" />
        <circle cx="17.5" cy="16.5" r="3" />
        <path d="M20 19l2 2" />
      </svg>
    ),
  },
  {
    title: 'Presentations',
    description: 'Sequence slides, scripts, and practice sessions in one plan.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <path d="M4 5h16v10H4z" />
        <path d="M8 19h8" />
        <path d="M12 15v4" />
      </svg>
    ),
  },
  {
    title: 'Lab Reports',
    description: 'Map hypotheses, data collection, and analysis checkpoints.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <path d="M9 3h6" />
        <path d="M10 3v5l-4 7a4 4 0 0 0 3.5 6h5a4 4 0 0 0 3.5-6l-4-7V3" />
      </svg>
    ),
  },
  {
    title: 'Group Projects',
    description: 'Assign roles, align milestones, and keep everyone on schedule.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <circle cx="8" cy="9" r="3" />
        <circle cx="16" cy="9" r="3" />
        <path d="M3 21a5 5 0 0 1 10 0" />
        <path d="M11 21a5 5 0 0 1 10 0" />
      </svg>
    ),
  },
  {
    title: 'Design Portfolios',
    description: 'Track iterations, critiques, and final polish tasks.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M8 16l5-5 3 3-5 5H8z" />
      </svg>
    ),
  },
  {
    title: 'Exam Prep',
    description: 'Balance revision, practice, and reflection with clear pacing.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 9v6" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
];

const painPoints = [
  {
    stat: '3-5',
    suffix: 'hrs',
    label: 'Planning overload',
    description:
      'Students often lose hours just figuring out where to start and what matters most.',
    caption: 'Common in week one',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    stat: '2x',
    suffix: 'rework',
    label: 'Scope creep',
    description:
      'Plans change midstream when the prompt is not broken down early.',
    caption: 'Late-stage pivot risk',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <path d="M4 7l6 6 4-4 6 6" />
        <path d="M20 13v6h-6" />
      </svg>
    ),
  },
  {
    stat: 'Late',
    suffix: 'nights',
    label: 'Deadline crunch',
    description:
      'Without a schedule, drafting and editing collide at the end of the term.',
    caption: 'Typical final week',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <path d="M4 6h16v9H8l-4 4z" />
        <path d="M9 10h6" />
      </svg>
    ),
  },
  {
    stat: 'Low',
    suffix: 'confidence',
    label: 'Unclear expectations',
    description:
      'Students often wait for feedback before they feel confident moving ahead.',
    caption: 'Guidance gap',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <path d="M12 2a6 6 0 0 0-3 11v3h6v-3a6 6 0 0 0-3-11z" />
        <path d="M9 18h6" />
      </svg>
    ),
  },
];

const painHighlights = [
  {
    stat: 'Day 1',
    text: 'Get a roadmap immediately instead of waiting for guidance.',
  },
  {
    stat: 'Week 2',
    text: 'Lock in milestones before workloads spike.',
  },
  {
    stat: 'Finals',
    text: 'Reduce last-minute stress with smart checkpoints.',
  },
];

const timeComparison = [
  { label: 'Manual planning', hours: '5 hrs', width: '100%', tone: 'muted' },
  {
    label: 'Plan My Assignment',
    hours: '1.2 hrs',
    width: '24%',
    tone: 'primary',
  },
];

const timeSavings = [
  { task: 'Prompt analysis', before: 90, after: 20 },
  { task: 'Research plan', before: 70, after: 20 },
  { task: 'Outline build', before: 60, after: 15 },
  { task: 'Revision schedule', before: 50, after: 12 },
];

const controlPoints = [
  'Edit tasks, dates, and workload instantly.',
  'Sync milestones with your calendar and reminders.',
  'Balance group roles and individual responsibilities.',
  'Export the plan to PDF or task apps.',
];

const steps = [
  {
    step: '01',
    title: 'Paste the assignment brief',
    description:
      'Share the prompt, rubric, and due date to set the context.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <path d="M7 4h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="M14 4v5h5" />
        <path d="M9 14h6" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Set your availability',
    description: 'Tell us how many hours per week you can commit.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Get an AI roadmap',
    description: 'Receive milestones, tasks, and resource checkpoints.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Track and adjust',
    description: 'Update progress and refine the plan as you go.',
    icon: (
      <svg viewBox="0 0 24 24" className="pma-icon" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.5 2.5L16 9" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: 'Can I edit the tasks and deadlines?',
    answer:
      'Yes. Every task is editable, and you can move deadlines to fit your schedule.',
  },
  {
    question: 'Does it work for group projects?',
    answer:
      'Plan roles, shared milestones, and individual task lists in one view.',
  },
  {
    question: 'What if my prompt changes?',
    answer:
      'Update the brief and regenerate the roadmap while keeping your completed work.',
  },
  {
    question: 'Can I export the plan?',
    answer:
      'Export to PDF or CSV and sync with calendar tools.',
  },
  {
    question: 'Is it really free to start?',
    answer:
      'Yes! Sign up is completely free with no credit card required. Start planning your assignments right away.',
  },
];

const previewTasks = [
  {
    title: 'Decode the prompt',
    time: 'Day 1',
    hours: '30 min',
    status: 'complete',
  },
  {
    title: 'Collect 6 sources',
    time: 'Day 3',
    hours: '2 hrs',
    status: 'active',
  },
  {
    title: 'Draft outline',
    time: 'Day 5',
    hours: '45 min',
    status: 'upcoming',
  },
  {
    title: 'Write section one',
    time: 'Week 2',
    hours: '3 hrs',
    status: 'upcoming',
  },
];

const MAX_MINUTES = 100;

export default function PlanMyAssignmentLanding(): JSX.Element {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onStorage = () =>
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    window.addEventListener('storage', onStorage);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('auth');
      bc.onmessage = (e) => {
        if (e?.data?.type === 'logout') setLoggedIn(false);
        if (e?.data?.type === 'login' || e?.data?.type === 'access-updated') {
          setLoggedIn(true);
        }
      };
    } catch {
      // ignore
    }

    (async () => {
      try {
        if (localStorage.getItem('refreshToken')) {
          const res = await apiFetch('/api/activity/', { method: 'POST' });
          if (res.ok) setLoggedIn(true);
        }
      } catch {
        setLoggedIn(false);
      }
    })();

    return () => {
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  return (
    <div className="plan-assignment-page">
      <section className="pma-hero">
        <div className="pma-container">
          <div className="pma-hero-grid">
            <div className="pma-hero-content">
              <h1 className="pma-hero-title">
                A Structured Path to On-Time Submissions
              </h1>

              <span className="pma-hero-brand">Plan My Assignment</span>

              <p className="pma-hero-text">
                Turn any assignment brief into a structured, week-by-week roadmap
                with milestones, tasks, and deadlines. Get started in minutes—no credit card required.
              </p>

              <div className="pma-hero-actions">
                <Link
                  className="pma-button pma-button-primary"
                  href={loggedIn ? '/plan-my-assignment' : '/signup'}
                >
                  {loggedIn ? 'Build Your Plan' : 'Start Free Trial'}
                  <svg
                    viewBox="0 0 24 24"
                    className="pma-button-icon pma-button-icon-stroke"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="pma-hero-media">
              <div className="pma-plan-preview">
                <div className="pma-plan-header">
                  <div>
                    <p className="pma-plan-title">Civics Research Essay</p>
                    <span className="pma-plan-subtitle">Due in 21 days</span>
                  </div>
                  <span className="pma-plan-chip">AI roadmap</span>
                </div>

                <div className="pma-plan-tasks">
                  {previewTasks.map((task) => (
                    <div className="pma-plan-task" key={task.title}>
                      <span
                        className={`pma-task-status pma-task-status--${task.status}`}
                      />
                      <div>
                        <p>{task.title}</p>
                        <span className="pma-plan-time">{task.time}</span>
                      </div>
                      <span className="pma-plan-hours">{task.hours}</span>
                    </div>
                  ))}
                </div>

                <div className="pma-plan-footer">
                  <div className="pma-plan-progress">
                    <span style={{ width: '45%' }} />
                  </div>
                  <div className="pma-plan-footer-meta">
                    <span>Plan confidence</span>
                    <strong>High</strong>
                  </div>
                </div>
              </div>

              <div className="pma-floating-card">
                <div className="pma-icon-shell pma-icon-shell--accent">
                  <svg
                    viewBox="0 0 24 24"
                    className="pma-icon pma-icon--sm"
                    aria-hidden="true"
                  >
                    <path d="M4 16l6-6 4 4 6-6" />
                    <path d="M14 8h6v6" />
                  </svg>
                </div>
                <div>
                  <p className="pma-floating-stat">14</p>
                  <p className="pma-floating-label">Milestones auto-built</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pain-points" className="pma-pain">
        <div className="pma-container">
          <div className="pma-section-header">
            <h2 className="pma-heading pma-heading--inverse">
              Assignment planning feels harder than it should.
            </h2>
            <p className="pma-lead pma-lead--inverse">
              Students lose momentum when the work starts without a roadmap.
              Plan My Assignment turns every brief into a structured, week-by-week
              path.
            </p>
          </div>

          <div className="pma-pain-grid">
            {painPoints.map((point) => (
              <div className="pma-pain-card" key={point.label}>
                <div className="pma-icon-shell pma-icon-shell--inverse">
                  {point.icon}
                </div>
                <div className="pma-pain-stat">
                  {point.stat}
                  <span>{point.suffix}</span>
                </div>
                <h3>{point.label}</h3>
                <p>{point.description}</p>
                <span className="pma-pain-caption">{point.caption}</span>
              </div>
            ))}
          </div>

          <div className="pma-pain-band">
            {painHighlights.map((highlight) => (
              <div className="pma-pain-band-item" key={highlight.stat}>
                <span>{highlight.stat}</span>
                <p>{highlight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="pma-impact">
        <div className="pma-container">
          <div className="pma-section-header">
            <h2 className="pma-heading">Plan once, move faster every week</h2>
            <p className="pma-lead">
              A clear plan saves time early so students can focus on research,
              drafting, and polishing instead of guessing what comes next.
            </p>
          </div>

          <div className="pma-impact-grid">
            <div className="pma-card">
              <h3 className="pma-card-title">Time to create a plan</h3>
              <p className="pma-card-subtitle">Typical assignment setup time</p>
              <div className="pma-bar-chart">
                {timeComparison.map((item) => (
                  <div className="pma-bar-row" key={item.label}>
                    <span>{item.label}</span>
                    <div className="pma-bar-track">
                      <span
                        className={`pma-bar-fill pma-bar-fill--${item.tone}`}
                        style={{ width: item.width }}
                      />
                    </div>
                    <span className="pma-bar-value">{item.hours}</span>
                  </div>
                ))}
              </div>
              <div className="pma-stat-callout">
                <span>Save up to</span>
                <strong>75%</strong>
                <span>of planning time</span>
              </div>
            </div>

            <div className="pma-card">
              <h3 className="pma-card-title">Minutes per planning task</h3>
              <p className="pma-card-subtitle">Manual vs Plan My Assignment</p>
              <div className="pma-breakdown">
                {timeSavings.map((item) => {
                  const beforeWidth = `${(item.before / MAX_MINUTES) * 100}%`;
                  const afterWidth = `${(item.after / MAX_MINUTES) * 100}%`;
                  return (
                    <div className="pma-breakdown-row" key={item.task}>
                      <div className="pma-breakdown-labels">
                        <span>{item.task}</span>
                        <span>
                          {item.before} min to {item.after} min
                        </span>
                      </div>
                      <div className="pma-progress">
                        <span
                          className="pma-progress-before"
                          style={{ width: beforeWidth }}
                        />
                        <span
                          className="pma-progress-after"
                          style={{ width: afterWidth }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pma-legend">
                <span>
                  <i className="pma-legend-dot pma-legend-dot--muted" />
                  Manual
                </span>
                <span>
                  <i className="pma-legend-dot pma-legend-dot--primary" />
                  With Plan My Assignment
                </span>
              </div>
            </div>
          </div>

          <div className="pma-impact-cards">
            <div className="pma-stat-card">
              <span>7 days</span>
              <p>Typical timeline built in minutes</p>
            </div>
            <div className="pma-stat-card">
              <span>4x</span>
              <p>More checkpoints to stay on track</p>
            </div>
            <div className="pma-stat-card">
              <span>1 view</span>
              <p>Tasks, milestones, and deadlines together</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="pma-features">
        <div className="pma-container">
          <div className="pma-section-header">
            <h2 className="pma-heading">Plan any assignment type</h2>
            <p className="pma-lead">
              Whether it is a research paper or a group project, Plan My
              Assignment builds a tailored roadmap that fits your course and
              pace.
            </p>
          </div>

          <div className="pma-control">
            <div className="pma-control-grid">
              <div>
                <h3 className="pma-subheading">You stay in control, always</h3>
                <p className="pma-lead">
                  Use the AI plan as a starting point, then customize it to
                  match your schedule, workload, and priorities.
                </p>
                <ul className="pma-checklist">
                  {controlPoints.map((item) => (
                    <li key={item}>
                      <span className="pma-check">
                        <svg
                          viewBox="0 0 24 24"
                          className="pma-icon pma-icon--sm"
                          aria-hidden="true"
                        >
                          <path d="M5 12l4 4 10-10" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pma-snapshot-card">
                <div className="pma-snapshot-header">
                  <div className="pma-icon-shell pma-icon-shell--accent">
                    <span className="pma-ai-tag">AI</span>
                  </div>
                  <div>
                    <p>Planner Snapshot</p>
                    <span>Week 2 check-in</span>
                  </div>
                </div>
                <div className="pma-snapshot-rows">
                  <div className="pma-snapshot-row">
                    <span>Research synthesis</span>
                    <strong>Complete</strong>
                  </div>
                  <div className="pma-snapshot-row">
                    <span>Outline section drafts</span>
                    <strong>In progress</strong>
                  </div>
                  <div className="pma-snapshot-row">
                    <span>Supervisor feedback</span>
                    <strong>Scheduled</strong>
                  </div>
                </div>
                <div className="pma-snapshot-note">
                  &quot;Everything is scoped and ready for drafting. Next milestone
                  is the annotated bibliography.&quot;
                </div>
                <div className="pma-snapshot-actions">
                  <button type="button">Open plan</button>
                  <button type="button" className="is-ghost">
                    Adjust timeline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="pma-steps">
        <div className="pma-container">
          <div className="pma-section-header">
            <h2 className="pma-heading">How Plan My Assignment works</h2>
            <p className="pma-lead">
              Four steps to turn any assignment brief into a realistic,
              trackable plan.
            </p>
          </div>

          <div className="pma-steps-grid">
            {steps.map((step) => (
              <div className="pma-step-card" key={step.step}>
                <div className="pma-step-icon">
                  {step.icon}
                  <span className="pma-step-number">{step.step}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="pma-faq">
        <div className="pma-container">
          <div className="pma-section-header">
            <h2 className="pma-heading">FAQ</h2>
          </div>

          <div className="pma-faq-list">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="pma-faq-item"
                open={index === 0}
              >
                <summary>
                  <span>{faq.question}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="pma-faq-icon"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="pma-faq-content">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

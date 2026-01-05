const assignmentTypes = [
  {
    title: 'Handwritten',
    description: 'AI-powered OCR reads handwriting with high accuracy.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M12 20l7-7-4-4-7 7-1 5z" />
        <path d="M14 6l4 4" />
        <path d="M3 21h6" />
      </svg>
    ),
  },
  {
    title: 'Word Documents',
    description: 'Seamlessly process .docx files with formatting intact.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M7 4h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="M14 4v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h6" />
      </svg>
    ),
  },
  {
    title: 'PDFs',
    description: 'Handle scanned and digital PDFs with ease.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M7 3h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M14 3v5h5" />
        <path d="M9 11h6" />
        <path d="M9 14h6" />
        <path d="M9 17h6" />
      </svg>
    ),
  },
  {
    title: 'Essays',
    description: 'Evaluate long-form writing against your rubric criteria.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M4 5h7a3 3 0 0 1 3 3v13H7a3 3 0 0 0-3 3V5z" />
        <path d="M20 5h-7a3 3 0 0 0-3 3v13h7a3 3 0 0 1 3 3V5z" />
      </svg>
    ),
  },
  {
    title: 'Reports',
    description: 'Grade structured reports and research papers.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M9 4h6v3H9z" />
        <path d="M9 11h6" />
        <path d="M9 15h6" />
      </svg>
    ),
  },
  {
    title: 'Q&A Assignments',
    description: 'Efficiently mark question-answer format work.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M4 6h16v9H8l-4 4z" />
        <path d="M10 9a2 2 0 1 1 3 2c0 1-1 1.5-1 2" />
        <circle cx="12" cy="17" r="0.7" />
      </svg>
    ),
  },
];

const painPoints = [
  {
    stat: '5.7',
    suffix: 'hrs/wk',
    label: 'Grading workload',
    description:
      'Teachers spend about 5.7 hours a week on marking, above the OECD average. Many secondary teachers report 10+ hours.',
    source: 'OECD, AITSL',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    stat: '50',
    suffix: '%',
    label: 'Stress from grading',
    description:
      'Up to half of teachers say too much marking drives stress, alongside admin work and tight timelines.',
    source: 'Pearls and Irritations, acer.org',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M4 7l6 6 4-4 6 6" />
        <path d="M20 13v6h-6" />
      </svg>
    ),
  },
  {
    stat: 'Bias',
    suffix: 'risk',
    label: 'Bias, inconsistency & feedback quality',
    description:
      'Human grading can be inconsistent and subjective. Tailored feedback takes time and can be uneven.',
    source: 'arXiv',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a6 6 0 0 0-3 11v3h6v-3a6 6 0 0 0-3-11z" />
      </svg>
    ),
  },
  {
    stat: '46.5',
    suffix: 'hrs/wk',
    label: 'Work beyond standard hours',
    description:
      'Australian teachers work some of the longest OECD hours. Marking and paperwork spill into nights and weekends.',
    source: 'OECD, Deakin University',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M4 5h16v10H8l-4 4z" />
      </svg>
    ),
  },
];

const painHighlights = [
  {
    stat: '10+ hrs',
    text: '10+ hours on marking is common for secondary teachers.',
  },
  {
    stat: '1 in 4',
    text: 'Secondary teachers report 10+ hours of marking weekly.',
  },
  {
    stat: 'After-hours',
    text: 'Grading and paperwork often spill into personal time.',
  },
];

const timeComparison = [
  { label: 'Manual', hours: '10 hrs', width: '100%', tone: 'muted' },
  { label: 'AutoGrade', hours: '1.5 hrs', width: '15%', tone: 'primary' },
];

const timeSavings = [
  { task: 'Essay Marking', before: 45, after: 8 },
  { task: 'Q&A Grading', before: 30, after: 5 },
  { task: 'Report Review', before: 40, after: 7 },
  { task: 'Feedback Writing', before: 25, after: 4 },
];

const controlPoints = [
  'Review AI suggestions before finalising grades.',
  'Customise feedback tone and detail level.',
  'Apply your professional judgement at every step.',
  'Maintain complete transparency with students.',
];

const steps = [
  {
    step: '01',
    title: 'Upload Assignments',
    description:
      'Drag and drop student work in any format, including handwritten scans, PDFs, Word docs, or images.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M12 3v12" />
        <path d="M7 8l5-5 5 5" />
        <path d="M4 21h16" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Set Your Rubric',
    description:
      'Define your grading criteria or use template libraries. AutoGrade learns your standards.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
        <circle cx="8" cy="6" r="2" />
        <circle cx="16" cy="12" r="2" />
        <circle cx="10" cy="18" r="2" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'AI Grades & Suggests',
    description:
      'Our AI analyses each submission against your rubric, generating grades and personalised feedback.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Review & Approve',
    description:
      'Review suggestions, make adjustments, and finalise with confidence. Export or integrate with your LMS.',
    icon: (
      <svg viewBox="0 0 24 24" className="ag-icon" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.5 2.5L16 9" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: 'How does AutoGrade handle handwritten assignments?',
    answer:
      'AutoGrade uses advanced OCR technology trained on handwritten text. Scan or photograph work and the AI digitises and analyses it against your rubric.',
  },
  {
    question: 'Can I customise the grading rubric?',
    answer:
      'Absolutely. You control the rubric criteria. Create from scratch, modify templates, or import your school standards.',
  },
  {
    question: "What if I disagree with the AI's assessment?",
    answer:
      'You are always in control. Every AI-generated grade and feedback item is a suggestion you can revise or override.',
  },
  // {
  //   question: 'Is student data secure?',
  //   answer:
  //     'Yes. Data is encrypted in transit and at rest, with compliance aligned to Australian Privacy Principles and education data standards.',
  // },
  // {
  //   question: 'Does it integrate with our LMS?',
  //   answer:
  //     'AutoGrade integrates with popular LMS platforms including Canvas, Moodle, and Google Classroom for seamless import and export.',
  // },
  {
    question: 'How much time can I really save?',
    answer:
      'Australian educators using AutoGrade save an average of 7+ hours per week on marking tasks, turning 10-hour workloads into under 2 hours.',
  },
];

const trustLetters = ['A', 'B', 'C', 'D', 'E'];
const MAX_MINUTES = 50;

export default function AutoGradePage() {
  return (
    <div className="autograde-page">
      <section className="autograde-hero">
        <div className="autograde-container">
          <div className="autograde-hero-grid">
            <div className="autograde-hero-content">
              <h1 className="autograde-hero-title">
                Grade Smarter,
                <br />
                <span>Not Harder</span>
              </h1>

              <span className="autograde-hero-brand">AutoGrade</span>

              <p className="autograde-hero-text">
                Transform hours of marking into minutes. AutoGrade uses AI to
                provide consistent, rubric-aligned feedback while keeping you in
                complete control.
              </p>

              <div className="autograde-hero-actions">
                <a className="ag-button ag-button-primary" href="/signup">
                  Start Free Trial
                  <svg
                    viewBox="0 0 24 24"
                    className="ag-button-icon ag-button-icon-stroke"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </a>

              </div>

              <div className="autograde-hero-proof">
                <div className="autograde-avatar-stack">
                  {/* {trustLetters.map((letter) => (
                    <span key={letter} className="autograde-avatar">
                      {letter}
                    </span>
                  ))} */}
                </div>
                {/* <p>
                  <strong>500+</strong> Australian educators already saving time
                </p> */}
              </div>
            </div>

            <div className="autograde-hero-media" id="demo">
              <div className="autograde-video">
                <iframe
                  src="https://www.youtube.com/embed/PBtyISfftTc?start=7"
                  title="AutoGrade Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="autograde-floating-card">
                <div className="autograde-icon-shell">
                  <svg viewBox="0 0 24 24" className="ag-icon ag-icon--sm" aria-hidden="true">
                    <path d="M4 16l6-6 4 4 6-6" />
                    <path d="M14 8h6v6" />
                  </svg>
                </div>
                <div>
                  <p className="autograde-floating-stat">85%</p>
                  <p className="autograde-floating-label">Less time grading</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pain-points" className="autograde-pain">
        <div className="autograde-container">
          <div className="autograde-section-header">

            <h2 className="autograde-heading autograde-heading--inverse">
              Assessment Was Never Meant to Be This Hard
            </h2>
            <p className="autograde-lead autograde-lead--inverse">
              What should support learning has become a weekly burden of
              exhausting marking, rushed feedback, and lost personal time.
            </p>
          </div>

          <div className="autograde-pain-grid">
            {painPoints.map((point) => (
              <div className="autograde-pain-card" key={point.label}>
                <div className="autograde-icon-shell autograde-icon-shell--inverse">
                  {point.icon}
                </div>
                <div className="autograde-pain-stat">
                  {point.stat}
                  <span>{point.suffix}</span>
                </div>
                <h3>{point.label}</h3>
                <p>{point.description}</p>
                <span className="autograde-pain-source">
                  Source: {point.source}
                </span>
              </div>
            ))}
          </div>

          <div className="autograde-pain-band">
            {painHighlights.map((highlight) => (
              <div className="autograde-pain-band-item" key={highlight.stat}>
                <span>{highlight.stat}</span>
                <p>{highlight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="autograde-impact">
        <div className="autograde-container">
          <div className="autograde-section-header">
            
            <h2 className="autograde-heading">Time saved, life reclaimed</h2>
            <p className="autograde-lead">
              See how AutoGrade transforms hours of marking into minutes, giving
              you back the time that matters.
            </p>
          </div>

          <div className="autograde-impact-grid">
            <div className="autograde-card">
              <h3 className="autograde-card-title">
                Average time per assignment batch
              </h3>
              <p className="autograde-card-subtitle">
                Class of 30 students, essay assignment
              </p>
              <div className="ag-bar-chart">
                {timeComparison.map((item) => (
                  <div className="ag-bar-row" key={item.label}>
                    <span>{item.label}</span>
                    <div className="ag-bar-track">
                      <span
                        className={`ag-bar-fill ag-bar-fill--${item.tone}`}
                        style={{ width: item.width }}
                      />
                    </div>
                    <span className="ag-bar-value">{item.hours}</span>
                  </div>
                ))}
              </div>
              <div className="ag-stat-callout">
                <span>Save up to</span>
                <strong>85%</strong>
                <span>of your marking time</span>
              </div>
            </div>

            <div className="autograde-card">
              <h3 className="autograde-card-title">
                Minutes per task comparison
              </h3>
              <p className="autograde-card-subtitle">
                Traditional vs AutoGrade-assisted
              </p>
              <div className="autograde-breakdown">
                {timeSavings.map((item) => {
                  const beforeWidth = `${(item.before / MAX_MINUTES) * 100}%`;
                  const afterWidth = `${(item.after / MAX_MINUTES) * 100}%`;
                  return (
                    <div className="autograde-breakdown-row" key={item.task}>
                      <div className="autograde-breakdown-labels">
                        <span>{item.task}</span>
                        <span>
                          {item.before} min to {item.after} min
                        </span>
                      </div>
                      <div className="autograde-progress">
                        <span
                          className="autograde-progress-before"
                          style={{ width: beforeWidth }}
                        />
                        <span
                          className="autograde-progress-after"
                          style={{ width: afterWidth }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="autograde-legend">
                <span>
                  <i className="autograde-legend-dot autograde-legend-dot--muted" />
                  Traditional
                </span>
                <span>
                  <i className="autograde-legend-dot autograde-legend-dot--primary" />
                  With AutoGrade
                </span>
              </div>
            </div>
          </div>

          <div className="autograde-impact-cards">
            <div className="autograde-stat-card">
              <span>7+ hrs</span>
              <p>Hours saved weekly per full-time teacher</p>
            </div>
            <div className="autograde-stat-card">
              <span>98%</span>
              <p>Consistency rate for rubric-aligned grading</p>
            </div>
            <div className="autograde-stat-card">
              <span>3x</span>
              <p>More detailed feedback for every student</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="autograde-features">
        <div className="autograde-container">
          <div className="autograde-section-header">
            <h2 className="autograde-heading">Grade any assignment type</h2>
            <p className="autograde-lead">
              From handwritten work to digital documents, AutoGrade handles it
              all while maintaining the quality feedback your students deserve.
            </p>
          </div>

          <div className="autograde-feature-grid">
            {assignmentTypes.map((type) => (
              <div className="autograde-feature-card" key={type.title}>
                <div className="autograde-icon-shell">{type.icon}</div>
                <h3>{type.title}</h3>
                <p>{type.description}</p>
              </div>
            ))}
          </div>

          <div className="autograde-control">
            <div className="autograde-control-grid">
              <div>
                <h3 className="autograde-subheading">
                  You stay in control, always
                </h3>
                <p className="autograde-lead">
                  AutoGrade is your assistant, not your replacement. Review,
                  modify, or override any feedback before it reaches students.
                </p>
                <ul className="autograde-checklist">
                  {controlPoints.map((item) => (
                    <li key={item}>
                      <span className="autograde-check">
                        <svg
                          viewBox="0 0 24 24"
                          className="ag-icon ag-icon--sm"
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

              <div className="autograde-suggestion-card">
                <div className="autograde-suggestion-header">
                  <div>
                    <p className="autograde-suggestion-filename">Example: Student Submission</p>
                    <span className="autograde-suggestion-meta">See how AI analyzes each section</span>
                  </div>
                  <div className="autograde-suggestion-score">
                    <span className="autograde-suggestion-score-value">24.5</span>
                    <span className="autograde-suggestion-score-label">Total Score</span>
                  </div>
                </div>
                <div className="autograde-suggestion-breakdown">
                  <div className="autograde-suggestion-breakdown-title">Section Breakdown</div>
                  <div className="autograde-suggestion-table">
                    <div className="autograde-suggestion-table-header">
                      <div className="autograde-suggestion-table-cell">Section</div>
                      <div className="autograde-suggestion-table-cell autograde-suggestion-table-cell--score">Score</div>
                      <div className="autograde-suggestion-table-cell">Comments</div>
                      <div className="autograde-suggestion-table-cell autograde-suggestion-table-cell--action">
                        <button type="button" className="autograde-suggestion-edit-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                    <div className="autograde-suggestion-table-row">
                      <div className="autograde-suggestion-table-cell">Introduction & Thesis</div>
                      <div className="autograde-suggestion-table-cell autograde-suggestion-table-cell--score">
                        <span className="autograde-suggestion-score-pill autograde-suggestion-score-pill--high">8 / 10</span>
                      </div>
                      <div className="autograde-suggestion-table-cell">
                        <div className="autograde-suggestion-comment-list">
                          <div className="autograde-suggestion-comment-line">
                            <span className="autograde-suggestion-comment-bullet">•</span>
                            <span className="autograde-suggestion-comment-text">Clear thesis statement with strong introduction</span>
                          </div>
                          <div className="autograde-suggestion-comment-line">
                            <span className="autograde-suggestion-comment-bullet">•</span>
                            <span className="autograde-suggestion-comment-text">Could benefit from more transitional phrases</span>
                          </div>
                        </div>
                      </div>
                      <div className="autograde-suggestion-table-cell autograde-suggestion-table-cell--action"></div>
                    </div>
                    <div className="autograde-suggestion-table-row">
                      <div className="autograde-suggestion-table-cell">Evidence & Analysis</div>
                      <div className="autograde-suggestion-table-cell autograde-suggestion-table-cell--score">
                        <span className="autograde-suggestion-score-pill autograde-suggestion-score-pill--medium">7.5 / 10</span>
                      </div>
                      <div className="autograde-suggestion-table-cell">
                        <div className="autograde-suggestion-comment-list">
                          <div className="autograde-suggestion-comment-line">
                            <span className="autograde-suggestion-comment-bullet">•</span>
                            <span className="autograde-suggestion-comment-text">Good use of evidence with adequate analysis</span>
                          </div>
                          <div className="autograde-suggestion-comment-line">
                            <span className="autograde-suggestion-comment-bullet">•</span>
                            <span className="autograde-suggestion-comment-text">Some sources could be integrated more effectively</span>
                          </div>
                        </div>
                      </div>
                      <div className="autograde-suggestion-table-cell autograde-suggestion-table-cell--action"></div>
                    </div>
                    <div className="autograde-suggestion-table-row">
                      <div className="autograde-suggestion-table-cell">Structure & Organization</div>
                      <div className="autograde-suggestion-table-cell autograde-suggestion-table-cell--score">
                        <span className="autograde-suggestion-score-pill autograde-suggestion-score-pill--high">9 / 10</span>
                      </div>
                      <div className="autograde-suggestion-table-cell">
                        <div className="autograde-suggestion-comment-list">
                          <div className="autograde-suggestion-comment-line">
                            <span className="autograde-suggestion-comment-bullet">•</span>
                            <span className="autograde-suggestion-comment-text">Well-organized with logical flow between paragraphs</span>
                          </div>
                        </div>
                      </div>
                      <div className="autograde-suggestion-table-cell autograde-suggestion-table-cell--action"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="autograde-steps">
        <div className="autograde-container">
          <div className="autograde-section-header">
            <h2 className="autograde-heading">How AutoGrade works</h2>
            <p className="autograde-lead">
              Four simple steps to transform your grading workflow and reclaim
              your evenings.
            </p>
          </div>

          <div className="autograde-steps-grid">
            {steps.map((step) => (
              <div className="autograde-step-card" key={step.step}>
                <div className="autograde-step-icon">
                  {step.icon}
                  <span className="autograde-step-number">{step.step}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="autograde-faq">
        <div className="autograde-container">
          <div className="autograde-section-header">
            <h2 className="autograde-heading">FAQ</h2>
 
          </div>

          <div className="autograde-faq-list">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="autograde-faq-item"
                open={index === 0}
              >
                <summary>
                  <span>{faq.question}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="autograde-faq-icon"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="autograde-faq-content">
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

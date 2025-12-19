'use client';

import { type ReactNode, useEffect, useRef, useState, FormEvent } from 'react';
import Link from 'next/link';
import { Upload, FileText, Clock, CheckCircle2, Download, AlertCircle, X } from 'lucide-react';

import { apiFetch } from '../../lib/api';

const TIMEOUT_SECONDS = 600;

export default function GradingToolPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [workflow, setWorkflow] = useState('');
  const [workflows, setWorkflows] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outputItems, setOutputItems] = useState<JSX.Element[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<ReactNode>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const API_BASE = '';

  const WORKFLOW_LABELS: Record<string, string> = {
    auto_grade: "Typed Assignment",
    handwritten_ocr: "Handwritten Exam",
    test_view: "Test Workflow"
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncLogin = () => {
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    };

    syncLogin();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'loggedIn') {
        syncLogin();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    let alive = true;

  (async () => {
      try {
        const res = await apiFetch("/api/v1/workflow/list/grade");
        if (!res.ok) throw new Error(`Failed to load workflows: ${res.status}`);
        const data: { workflows?: string[] } = await res.json();

        const workflowList = data.workflows ?? [];
        if (alive && Array.isArray(workflowList) && workflowList.length > 0) {
          setWorkflows(workflowList);
          setWorkflow(
            workflowList.includes("auto_grade") ? "auto_grade" : workflowList[0]
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const renderResult = (result: any, filename?: string) => {
    let parsed = result;
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        setOutputItems([<div key="parse-error" className="error-block"><p>❌ Failed to parse JSON.</p><pre>{result}</pre></div>]);
        return;
      }
    }

    if (typeof parsed.rationale === 'string') {
      try {
        parsed.rationale = JSON.parse(parsed.rationale);
      } catch {
        setOutputItems([<div key="fallback" className="error-block"><p>📄 Raw Rationale:</p><pre>{parsed.rationale}</pre></div>]);
        return;
      }
    }

    const tasks = parsed.rationale?.tasks;
    if (!tasks || typeof tasks !== 'object') {
      setOutputItems([<pre key="no-tasks">{JSON.stringify(parsed, null, 2)}</pre>]);
      return;
    }

    const taskEntries = Object.entries(tasks).map(
      ([qid, [max, awarded, feedback]]: any) => [qid, max, awarded, feedback]
    );

    setResults(prev => [...prev, {
      filename: filename || 'Anonymous',
      tasks: taskEntries,
      total: parsed.grade || parsed.rationale.total_score,
    }]);

    const resultBlocks = taskEntries.map(([qid, max, awarded, feedback], idx) => (
      <div className="result-task-card" key={idx}>
        <div className="result-task-header">
          <div className="result-task-title">
            <FileText size={18} />
            <span>{qid}</span>
          </div>
          <div className="result-task-score">
            <span className="score-awarded">{awarded}</span>
            <span className="score-separator">/</span>
            <span className="score-max">{max}</span>
            <span className="score-label">marks</span>
          </div>
        </div>
        <div className="result-task-feedback">
          <p>{feedback}</p>
        </div>
      </div>
    ));

    setOutputItems(prev => [
      ...prev,
      <div className="grading-result-card" key={filename || 'result'}>
        <div className="result-card-header">
          <div className="result-card-title">
            <CheckCircle2 size={24} />
            <h3>Grading Results {filename ? `for ${filename}` : ''}</h3>
          </div>
        </div>
        <div className="result-tasks-container">
          {resultBlocks}
        </div>
        <div className="result-summary">
          <div className="summary-score-card">
            <div className="summary-label">Total Score</div>
            <div className="summary-value">{parsed.grade || parsed.rationale.total_score}</div>
          </div>
          {parsed.similarity_score !== undefined && (
            <div className="summary-similarity-card">
              <div className="summary-label">Similarity</div>
              <div className="summary-value">{(parsed.similarity_score * 100).toFixed(1)}%</div>
            </div>
          )}
        </div>
      </div>
    ]);
  };

  const handleExport = () => {
    const csvRows = ['Filename,Question,Max Marks,Awarded Marks,Feedback'];

    results.forEach(({ filename, tasks }) => {
      tasks.forEach(
        ([qid, max, awarded, feedback]: [string, number, number, string]) => {
          csvRows.push(`${filename},${qid},${max},${awarded},"${feedback.replace(/"/g, '""')}"`);
        }
      );
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grading_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loggedIn) {
      setErrorMsg(
        <>You must be logged in to submit. Please <Link href="/login" style={{ color: '#4E6F8A', textDecoration: 'underline', fontWeight: 600 }}>log in</Link> or <Link href="/signup" style={{ color: '#4E6F8A', textDecoration: 'underline', fontWeight: 600 }}>sign up</Link>.
        </>
      );
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    setOutputItems([<div key="loading" className="loading-state"><div className="loading-spinner"></div><p>Evaluation in progress...</p></div>]);
    setTimeLeft(TIMEOUT_SECONDS);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => (prev && prev > 1 ? prev - 1 : 0));
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      clearInterval(timerIntervalRef.current!);
      alert('⏳ Timeout! Reloading');
      window.location.reload();
    }, (TIMEOUT_SECONDS *1000));

    const form = formRef.current;
    if (!form) {
      setIsSubmitting(false);
      setErrorMsg('Form is not available. Please refresh and try again.');
      return;
    }

    const base = new FormData(form);
    const graderName = base.get('graderName');
    const assignmentFile = base.get('assignmentFile') as File;
    const sampleFile = base.get('sampleFile') as File;
    const rubricsFile = base.get('rubricsFile') as File;
    const studentFiles = (form.elements.namedItem('solutionFile') as HTMLInputElement)?.files;

    const files = Array.from(studentFiles || []);
    await Promise.all(files.map(async file => {
      const fd = new FormData();
      fd.append('graderName', graderName as string);
      fd.append('workflow', workflow);
      fd.append('assignmentFile', assignmentFile);
      fd.append('sampleFile', sampleFile);
      fd.append('rubricsFile', rubricsFile);
      fd.append('solutionFile', file);

      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setErrorMsg('Please log in again.');
          localStorage.removeItem('loggedIn');
          return;
        }
        const resp = await fetch(`${API_BASE}/api/v1/grade`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: fd
        });
        const result = await resp.json();
        if (resp.status === 401 && result?.code === "token_not_valid") {
          setErrorMsg("⛔ Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("loggedIn");
          return;
        }
        renderResult(result, file.name);
      } catch (err: any) {
        renderResult({ error: `❌ Request failed for ${file.name}: ${err.message}` });
      }
    }));

    clearTimeout(timeoutRef.current!);
    clearInterval(timerIntervalRef.current!);
    setTimeLeft(null);
    setIsSubmitting(false);
  };

  return (
    <div className="autograde-page">
      {/* Hero Section with Split Layout */}
      <section className="autograde-hero">
        <div className="autograde-hero-container">
          {/* Left Side - Text and Form */}
          <div className="autograde-hero-left">
            <h1 className="autograde-hero-title">
              <span>Grade Student</span>
              <span className="title-accent">Submissions</span>
              <span>With AI</span>
            </h1>
            <p className="autograde-hero-subtitle">
              Automatically evaluate student submissions with AI-powered grading that delivers consistent, fair, and constructive feedback.
            </p>
            
            {/* Decorative Arrow */}
            <div className="hero-arrow">
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 40 Q30 20, 50 40 T90 40" stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M85 35 L90 40 L85 45" stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Form in Hero */}
            <div className="hero-form-card">
              {errorMsg && (
                <div className="autograde-error-banner">
                  <div className="error-banner-content">
                    <AlertCircle size={18} />
                    <span>{errorMsg}</span>
                  </div>
                  <button onClick={() => setErrorMsg('')} aria-label="Close" className="error-close-btn">
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data" className="autograde-form">
                <div className="form-group">
                  <label htmlFor="graderName">
                    <span>Grader Name</span>
                  </label>
                  <input 
                    type="text" 
                    id="graderName"
                    name="graderName" 
                    placeholder="Enter grader name"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="workflow">
                    <span>Workflow Type</span>
                  </label>
                  <div className="select-wrapper">
                    <select 
                      id="workflow"
                      name="workflow" 
                      value={workflow} 
                      onChange={e => setWorkflow(e.target.value)}
                    >
                      {workflows.map(wf => (
                        <option key={wf} value={wf}>{WORKFLOW_LABELS[wf] || wf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="assignmentFile">
                    <Upload size={18} />
                    <span>Assignment File (PDF)</span>
                  </label>
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      id="assignmentFile"
                      name="assignmentFile" 
                      accept=".pdf"
                      required 
                    />
                    <span className="file-input-label">Choose PDF file</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="solutionFile">
                    <Upload size={18} />
                    <span>Student Solutions (PDF)</span>
                  </label>
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      id="solutionFile"
                      name="solutionFile" 
                      accept=".pdf"
                      multiple 
                      required 
                    />
                    <span className="file-input-label">Choose PDF file(s)</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="sampleFile">
                    <Upload size={18} />
                    <span>Sample Solution (PDF)</span>
                  </label>
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      id="sampleFile"
                      name="sampleFile" 
                      accept=".pdf"
                      required 
                    />
                    <span className="file-input-label">Choose PDF file</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="rubricsFile">
                    <Upload size={18} />
                    <span>Marking Rubric (PDF)</span>
                  </label>
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      id="rubricsFile"
                      name="rubricsFile" 
                      accept=".pdf"
                      required 
                    />
                    <span className="file-input-label">Choose PDF file</span>
                  </div>
                </div>

                {timeLeft !== null && (
                  <div className="timer-card">
                    <Clock size={20} />
                    <div className="timer-content">
                      <span className="timer-label">Time Remaining</span>
                      <span className="timer-value">{timeLeft}s</span>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="submit-button">
                  {isSubmitting ? (
                    <>
                      <div className="button-spinner"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Image Collage */}
          <div className="autograde-hero-right">
            <div className="hero-image-collage">
              <div className="collage-image collage-image-1">
                <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop" alt="Education" />
              </div>
              <div className="collage-image collage-image-2">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop" alt="Grading" />
              </div>
              <div className="collage-image collage-image-3">
                <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop" alt="Students" />
              </div>
              <div className="collage-image collage-image-4">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop" alt="Learning" />
              </div>
              <div className="collage-image collage-image-5">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop" alt="Academic" />
              </div>
            </div>
            {/* Decorative Lines */}
            <svg className="collage-lines" width="100%" height="100%" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice">
              <path d="M100 150 Q200 100, 300 150 T500 150" stroke="#4E6F8A" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.3"/>
              <path d="M150 250 Q250 200, 350 250 T550 250" stroke="#4E6F8A" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.3"/>
              <path d="M200 350 Q300 300, 400 350 T600 350" stroke="#4E6F8A" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.3"/>
            </svg>
            {/* Yellow Wavy Graphic */}
            <div className="hero-wavy-graphic"></div>
          </div>
        </div>
      </section>

      {/* Results Section Below Hero */}
      <div className="autograde-container">
        <div className="autograde-results-wrapper">
            <div className="results-header">
              <h2>Grading Results</h2>
              {outputItems.length > 0 && (
                <button className="export-button" onClick={handleExport}>
                  <Download size={18} />
                  <span>Export CSV</span>
                </button>
              )}
            </div>
            
            <div className="results-container">
              {outputItems.length === 0 ? (
                <div className="empty-state">
                  <FileText size={48} />
                  <h3>No results yet</h3>
                  <p>Submit files above to see grading results here</p>
                </div>
              ) : (
                <div className="results-content">
                  {outputItems.map((el, idx) => (
                    <div key={idx}>{el}</div>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>

      {!loggedIn && (
        <Link href="/products" className="floating-demo-button">
          <span>👉</span>
          <span>Check out Demo</span>
        </Link>
      )}
    </div>
  );
}

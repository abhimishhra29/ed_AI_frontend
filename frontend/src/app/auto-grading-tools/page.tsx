'use client';

import { type ReactNode, useEffect, useRef, useState, FormEvent } from 'react';
import Link from 'next/link';

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
    auto_grade: "Assignment",
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
        const res = await apiFetch("/api/v1/workflow/list/grade"); // GET by default
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
        // optionally set an error state here
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
      <div className="task-block" key={idx}>
        <div className="task-header">
          <strong>🧾 {qid}</strong>: {awarded} / {max} marks
        </div>
        <div className="task-feedback">
          <em>💬 {feedback}</em>
        </div>
      </div>
    ));

    setOutputItems(prev => [
      ...prev,
      <div className="grading-result-block" key={filename || 'result'}>
        <h2>📝 Grading Results {filename ? `for ${filename}` : ''}</h2>
        {resultBlocks}
        <p className="total-score">✅ <strong>Total Score:</strong> {parsed.grade || parsed.rationale.total_score}</p>
        {parsed.similarity_score !== undefined && (
          <p className="similarity-score">📊 <strong>Similarity Score:</strong> {(parsed.similarity_score * 100).toFixed(2)}%</p>
        )}
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
        <>You must be logged in to submit. Please log in or&nbsp;
          <Link href="/signup" style={{ color: '#ad1a1a', textDecoration: 'underline' }}>
            sign up
          </Link>.
        </>
      );
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    setOutputItems([<b key="loading">Evaluation in progress...</b>]);
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
    <>
      <div className="container tools">
        <h1 className="tool-title">Auto Grade</h1>

        {errorMsg && (
          <div className="error-banner">
            <span style={{ flex: 1 }}>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} aria-label="Close">×</button>
          </div>
        )}

        <div className="tools-layout">
          <div className="form-section">
            <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
              <label>Grader Name:</label>
              <input type="text" name="graderName" required />

              <label>Workflow:</label>
              <select name="workflow" value={workflow} onChange={e => setWorkflow(e.target.value)}>
                {workflows.map(wf => (
                  <option key={wf} value={wf}>{WORKFLOW_LABELS[wf] || wf}</option>
                ))}
              </select>

              <label>Assignment File (PDF):</label>
              <input type="file" name="assignmentFile" required />

              <label>Student Solutions (PDF):</label>
              <input type="file" name="solutionFile" multiple required />

              <label>Sample Solution (PDF):</label>
              <input type="file" name="sampleFile" required />

              <label>Marking Rubric (PDF):</label>
              <input type="file" name="rubricsFile" required />

              {timeLeft !== null && (
                <div className="timer-badge">⏳ Time Remaining: {timeLeft}s</div>
              )}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>

          <div className="output-container">
            <div className="output-section">
              <div id="output">
                {outputItems.map((el, idx) => (
                  <div key={idx}>{el}</div>
                ))}
              </div>
            </div>

            {outputItems.length > 0 && (
              <div className="export-wrapper">
                <button className="export-btn" onClick={handleExport}>
                  📁 Export to CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!loggedIn && (
        <Link href="/products" className="floating-demo-btn">
          👉 Check out Demo
        </Link>
      )}
    </>
  );
}

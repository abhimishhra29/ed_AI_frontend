'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

import { apiFetch } from '../../lib/api';

const WORKFLOW_FRIENDLY_NAMES: Record<string, string> = {
  project_planner: 'Project Planner',
  test_view: 'Test Workflow'
};

export default function PlannerToolPage() {
  /* ----------------------------- Refs & State ----------------------------- */
  const formRef = useRef<HTMLFormElement>(null);
  const [workflow, setWorkflow] = useState("");
  const [workflows, setWorkflows] = useState<string[]>([]);
  const [workflowNameMap, setWorkflowNameMap] = useState<Record<string, string>>(
    {}
  );
  const [outputItems, setOutputItems] = useState<JSX.Element[]>([]);
  const [tasksData, setTasksData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  /* --------------------------- Load workflows ----------------------------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiFetch("/api/v1/workflow/list/project");
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const response = await res.json();
        const list = response.workflows;
        if (alive && Array.isArray(list)) {
          setWorkflows(list);
          const map = list.reduce((acc: Record<string, string>, name: string) => {
            acc[name] = WORKFLOW_FRIENDLY_NAMES[name] ?? name;
            return acc;
          }, {});
          setWorkflowNameMap(map);
          setWorkflow(
            list.includes("project_planner") ? "project_planner" : list[0] || ""
          );
        }
      } catch (e) {
        console.error("Failed to fetch workflows:", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* -------------------------- CSV export helper --------------------------- */
  const exportCSV = () => {
    if (!tasksData.length) return;

    // Flatten each task into a single-row object
    const flattened = tasksData.map((t) => ({
      task_id: t.task_id,
      task_name: t.task_name,
      effort: t.efforts ?? "",
      deadline: t.deadline ?? "",
      steps: Array.isArray(t.steps)
        ? t.steps.map((s: any) => s.step_description).join(" | ")
        : "",
    }));

    const keys = Object.keys(flattened[0]);
    const header = keys.join(",");
    const rows = flattened.map((row) =>
      keys.map((k) => `"${String((row as any)[k]).replace(/"/g, '""')}"`).join(",")
    );
    const csv = [header, ...rows].join("\r\n");

    const dataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", "planner_tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* --------------------------- Render UI --------------------------- */
  const renderResult = (result: any) => {
    if (!Array.isArray(result.tasks)) {
      setTasksData([]);
      setOutputItems([
        <div className="error-block" key="err">
          <p>⚠️ Unexpected structure</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>,
      ]);
      return;
    }

    setTasksData(result.tasks);

    const blocks = result.tasks.map((t: any, i: number) => (
      <div className="task-block" key={i}>
        <div className="task-header">
          <strong>
            {t.task_id}. {t.task_name}
          </strong>
        </div>
        {t.efforts != null && <div className="task-effort">Effort: {t.efforts}</div>}
        {t.deadline && <div className="task-deadline">Deadline: {t.deadline}</div>}
        <ul>
          {Array.isArray(t.steps) &&
            t.steps.map((s: any, idx: number) => (
              <li key={idx}>{s.step_description}</li>
            ))}
        </ul>
      </div>
    ));

    setOutputItems([
      <div className="grading-result-block" key="out">
        <div className="results-header">
          <h2>📋 Work Breakdown Structure</h2>
          {result.tasks.length > 0 && (
            <button
              type="button" // ← explicitly non-submit
              className="export-btn"
              onClick={exportCSV}
            >
              Export CSV
            </button>
          )}
        </div>
        {blocks}
      </div>,
    ]);
  };

  /* ------------------------------- Submit --------------------------------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setOutputItems([<b key="load">Generating Plan...</b>]);
    setTasksData([]);

    const data = new FormData(formRef.current!);
    const fd = new FormData();
    fd.append("graderName", data.get("graderName") as string);
    fd.append("workflow", workflow);
    fd.append("assignmentFile", data.get("assignmentFile") as File);

    try {
      if (!localStorage.getItem("refreshToken")) {
        throw new Error("Session expired");
      }
      const resp = await apiFetch("/api/v1/grade", {
        method: "POST",
        body: fd,
      });
      // Handle HTTP errors explicitly
      if (!resp.ok) {
        if (resp.status === 401) {
          setErrorMsg("⛔ Session expired. Please log in again.");
          localStorage.clear();
          return;
        }
        const txt = await resp.text();
        setErrorMsg(txt || `Request failed (HTTP ${resp.status}).`);
        return;
      }
      const result = await resp.json();
      renderResult(result);
    } catch (err: any) {
      // apiFetch throws on refresh denial with "Session expired"
      setErrorMsg(err?.message || "Network error");
      renderResult({ error: `❌ ${err?.message || "Network error"}` });
    }
  };

  /* --------------------------------- JSX --------------------------------- */
  return (
    <div className="container tools">
      <h1>Assignment Planner</h1>
      {errorMsg && (
        <div className="error-banner">
          <span style={{ flex: 1 }}>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} aria-label="Close">
            ×
          </button>
        </div>
      )}
      <div className="tools-layout">
        <div className="form-section">
          <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
            <label>Assignment Name:</label>
            <input type="text" name="graderName" required />
            <label>Workflow:</label>
            <select
              name="workflow"
              value={workflow}
              onChange={(e) => setWorkflow(e.target.value)}
            >
              {workflows.map((wf) => (
                <option key={wf} value={wf}>
                  {workflowNameMap[wf]}
                </option>
              ))}
            </select>
            <label>Assignment File (PDF):</label>
            <input type="file" name="assignmentFile" accept="application/pdf" required />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="output-container">
          <div className="output-section" id="output">
            {outputItems.map((el, idx) => (
              <div key={idx}>{el}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

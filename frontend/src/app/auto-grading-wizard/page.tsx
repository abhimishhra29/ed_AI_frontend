'use client';

import { useEffect, useState, FormEvent, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Step pages (presentational-only)
import StepOne from '../../components/autograding-wizard/StepOne';
import StepTwo from '../../components/autograding-wizard/StepTwo';
import StepThree from '../../components/autograding-wizard/StepThree';
import StepFour from '../../components/autograding-wizard/StepFour';

// API wrapper
import { apiFetch } from '../../lib/api'; // adjust to "@/lib/api" if you use path aliases

import {
  AutoGradingWizardContext,
  AutoGradingWizardContextType,
} from './useAutoGradingWizard';

// ---------------------------------------------------------------------------
// 🛠 Context -----------------------------------------------------------------
// ---------------------------------------------------------------------------

const TIMEOUT_SECONDS = 600;

// ---------------------------------------------------------------------------
// 🎩 Main container component ------------------------------------------------
// ---------------------------------------------------------------------------
function CombinedAutoGradingWizard() {
  // ----- Navigation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

  // ----- File pickers
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);

  // ----- Grading
  const [assignmentName, setAssignmentName] = useState<string>("");
  const [workflows, setWorkflows] = useState<string[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("Assignment_grader");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [rawOutputs, setRawOutputs] = useState<{ filename: string; data: any }[]>(
    []
  );
  const [solutionFilesSelected, setSolutionFilesSelected] = useState<File[]>([]);

  // ----- Rubric generation -----
  const [generatedRubric, setGeneratedRubric] = useState<any | null>(null);
  const [extractedQuestions, setExtractedQuestions] = useState<any[] | null>(null);
  const [isGeneratingRubric, setIsGeneratingRubric] = useState(false);
  const [rubricGenerationError, setRubricGenerationError] = useState<string | null>(
    null
  );

  const WORKFLOW_LABELS: Record<string, string> = {
    Assignment_grader: "Report/Essay/General Assignment",
    auto_grade: "Q/A Assignment (Formatted)",
    handwritten_ocr: "Handwritten Exam",
    test_view: "Test Workflow",
    rubric_generation: "Rubric Generation",
  };

  // -----------------------------------------------------------------------
  // Effect: Load available workflows once user is logged in.
  // -----------------------------------------------------------------------
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!localStorage.getItem("refreshToken")) return; // not logged in
      try {
        const resp = await apiFetch("/api/v1/workflow/list/grade");
        if (!resp.ok) return;
        const data = await resp.json();
        if (alive && Array.isArray(data.workflows)) {
          setWorkflows(data.workflows);
          const preferredOrder = [
            "Assignment_grader",
            "auto_grade",
            "handwritten_ocr",
          ];
          const nextWorkflow =
            preferredOrder.find((wf) => data.workflows.includes(wf)) ??
            data.workflows[0];
          if (nextWorkflow) setSelectedWorkflow(nextWorkflow);
        }
      } catch {
        // ignore; StepOne can surface errors later if needed
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setGeneratedRubric(null);
    setExtractedQuestions(null);
    setRubricGenerationError(null);
    setIsGeneratingRubric(false);
  }, [assignmentFile]);

  // -----------------------------------------------------------------------
  // Handlers ----------------------------------------------------------------
  // -----------------------------------------------------------------------
  const generateRubric = useCallback(async () => {
    if (!assignmentFile) {
      setRubricGenerationError("Upload an assignment PDF before generating a rubric.");
      return;
    }

    setIsGeneratingRubric(true);
    setRubricGenerationError(null);

    const fd = new FormData();
    fd.append("assignmentFile", assignmentFile);
    if (assignmentName) {
      fd.append("assignmentName", assignmentName);
    }

    try {
      const resp = await apiFetch("/api/v2/rubric", {
        method: "POST",
        body: fd,
      });

      if (!resp.ok) {
        let message = `Rubric generation failed (HTTP ${resp.status}).`;
        try {
          const errorJson = await resp.json();
          message =
            errorJson?.message ||
            errorJson?.detail ||
            errorJson?.error ||
            message;
        } catch {
          try {
            const text = await resp.text();
            if (text) message = text;
          } catch {}
        }
        throw new Error(message);
      }

      const json = await resp.json();
      const rubricPayload = json?.rubric ?? json?.generated_rubric ?? json;
      setGeneratedRubric(rubricPayload);
      const questionPayload = json?.questions;
      setExtractedQuestions(
        Array.isArray(questionPayload) ? questionPayload : null
      );
    } catch (err: any) {
      setGeneratedRubric(null);
      setExtractedQuestions(null);
      setRubricGenerationError(err?.message || "Rubric generation failed.");
    } finally {
      setIsGeneratingRubric(false);
    }
  }, [assignmentFile, assignmentName]);

  async function handleGrade(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGradingError(null);

    if (!localStorage.getItem("refreshToken")) {
      setGradingError("You must be logged in.");
      return;
    }
    if (!assignmentFile) {
      setGradingError("Upload the assignment before grading.");
      return;
    }
    if (!generatedRubric) {
      setGradingError("Generate a rubric before grading.");
      return;
    }
    if (solutionFilesSelected.length === 0) {
      setGradingError("Pick at least one submission file.");
      return;
    }

    setIsSubmitting(true);
    setTimeLeft(TIMEOUT_SECONDS);
    setRawOutputs([]);

    const interval = setInterval(() => {
      setTimeLeft((t) => (t && t > 1 ? t - 1 : 0));
    }, 1000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      alert("Timeout");
    }, TIMEOUT_SECONDS * 1000);

    try {
      for (const file of solutionFilesSelected) {
        const fd = new FormData();
        fd.append("graderName", assignmentName);
        fd.append("assignmentName", assignmentName);
        const workflowToUse = selectedWorkflow || "auto_grade";
        fd.append("workflow", workflowToUse);
        fd.append("assignmentFile", assignmentFile as File);
        fd.append("rubricJson", JSON.stringify(generatedRubric));
        fd.append("solutionFile", file);

        const resp = await apiFetch("/api/v1/grade", {
          method: "POST",
          body: fd,
        });

        if (!resp.ok) {
          if (resp.status === 401) {
            setGradingError("Session expired. Please log in again.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            break;
          }
          const text = await resp.text();
          setGradingError(text || `Grade request failed (HTTP ${resp.status}).`);
          continue;
        }

        const data = await resp.json();
        setRawOutputs((o) => [...o, { filename: file.name, data }]);
      }
    } catch (err: any) {
      setGradingError(err?.message || "Network error");
    } finally {
      clearTimeout(timeout);
      clearInterval(interval);
      setIsSubmitting(false);
    }
  }

  // -----------------------------------------------------------------------
  // Context object ---------------------------------------------------------
  // -----------------------------------------------------------------------
  const ctx: AutoGradingWizardContextType = {
    step,
    setStep,

    assignmentFile,
    setAssignmentFile,

    assignmentName,
    setAssignmentName,
    workflows,
    selectedWorkflow,
    setSelectedWorkflow,
    isSubmitting,
    gradingError,
    timeLeft,
    rawOutputs,
    solutionFilesSelected,
    setSolutionFilesSelected,

    generatedRubric,
    extractedQuestions,
    isGeneratingRubric,
    rubricGenerationError,
    generateRubric,
    setGeneratedRubric,
    setExtractedQuestions,
    setRubricGenerationError,

    handleGrade,
  };

  // -----------------------------------------------------------------------
  // Render -----------------------------------------------------------------
  // -----------------------------------------------------------------------
  return (
    <AutoGradingWizardContext.Provider value={ctx}>
      <div className="auto-grading-wizard">
        <Header step={step} />
        {/* Top navigation buttons */}
        <div className="wizard-top-buttons">
          <button
            onClick={() => {
              if (step === 1) {
                window.location.href = '/';
              } else {
                setStep((prevStep) => (prevStep - 1) as 1 | 2 | 3 | 4);
              }
            }}
            className="back-button"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          
        </div>
        {step === 1 && <StepOne WORKFLOW_LABELS={WORKFLOW_LABELS} />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour />}
        
        {/* Click-based Expanding Info Panel */}
        <div className={`click-info-panel ${isInfoPanelOpen ? 'open' : ''}`}>
          <div className="info-panel-header" onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}>
            <div className="info-icon"></div>
            <span className="info-text">Information</span>
          </div>
          <div className="info-panel-content">
            <p>This is the information panel content.</p>
            <p>You can add helpful information here for users.</p>
            <p>Click the icon to toggle the panel.</p>
            {/* Content will be added here */}
          </div>
        </div>
      </div>
    </AutoGradingWizardContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// 🖼 Header (local, no import) ----------------------------------------------
// ---------------------------------------------------------------------------
function Header({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <div className="wizard-header">
      <h1>AutoGrade</h1>
    </div>
  );
}

export default CombinedAutoGradingWizard;
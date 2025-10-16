'use client';

import { useEffect, useState, FormEvent, useCallback } from "react";

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
export default function CombinedAutoGradingWizard() {
  // ----- Navigation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // ----- Validation
  const [feedback, setFeedback] = useState<string[] | null>(null);
  const [rawValidate, setRawValidate] = useState<any | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // ----- File pickers
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [rubricsFile, setRubricsFile] = useState<File | null>(null);
  const [validatedFiles, setValidatedFiles] = useState<{
    assignmentFile: File;
    rubricsFile: File;
  } | null>(null);

  // ----- Grading
  const [assignmentName, setAssignmentName] = useState<string>("");
  const [workflows, setWorkflows] = useState<string[]>([]);
  // Default to Assignment_grader
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("auto_grade");
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
          if (data.workflows.includes("auto_grade")) {
            setSelectedWorkflow("auto_grade");
          } else if (data.workflows.length) {
            setSelectedWorkflow(data.workflows[0]);
          }
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

  useEffect(() => {
    if (!generatedRubric) {
      return;
    }
    const preferredWorkflow =
      generatedRubric?.rubric_type === "assignment"
        ? "Assignment_grader"
        : "auto_grade";
    if (workflows.includes(preferredWorkflow)) {
      setSelectedWorkflow(preferredWorkflow);
    }
  }, [generatedRubric, workflows]);

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

    const runWorkflow = async (workflowName: string) => {
      const fd = new FormData();
      fd.append("workflow", workflowName);
      fd.append("assignmentFile", assignmentFile);
      if (assignmentName) {
        fd.append("assignmentName", assignmentName);
      }

      const resp = await apiFetch("/api/v2/workflow", {
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

      return resp.json();
    };

    const mapRubricPayload = (json: any) =>
      json?.rubric ??
      json?.generated_rubric ??
      json?.generated_assignment_rubric ??
      json;

    const shouldFallbackToAssignment = (message?: string) => {
      if (!message) return false;
      const normalized = message.toLowerCase();
      return (
        normalized.includes("no questions available") ||
        normalized.includes("failed to parse question") ||
        normalized.includes("question extraction") ||
        normalized.includes("could not detect any questions")
      );
    };

    try {
      const primaryJson = await runWorkflow("rubric_generation");
      const rubricPayload = mapRubricPayload(primaryJson);
      setGeneratedRubric(rubricPayload);
      const questionPayload = primaryJson?.questions;
      setExtractedQuestions(
        Array.isArray(questionPayload) && questionPayload.length
          ? questionPayload
          : null
      );
    } catch (primaryError: any) {
      if (!shouldFallbackToAssignment(primaryError?.message)) {
        setGeneratedRubric(null);
        setExtractedQuestions(null);
        setRubricGenerationError(
          primaryError?.message || "Rubric generation failed."
        );
        return;
      }

      try {
        const assignmentJson = await runWorkflow(
          "assignment_rubric_generation"
        );
        const rubricPayload = mapRubricPayload(assignmentJson);
        setGeneratedRubric(rubricPayload);
        setExtractedQuestions(null);
      } catch (secondaryError: any) {
        setGeneratedRubric(null);
        setExtractedQuestions(null);
        setRubricGenerationError(
          secondaryError?.message ||
            primaryError?.message ||
            "Rubric generation failed."
        );
      }
    } finally {
      setIsGeneratingRubric(false);
    }
  }, [
    assignmentFile,
    assignmentName,
    setGeneratedRubric,
    setExtractedQuestions,
    setRubricGenerationError,
  ]);

  async function handleValidate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationError(null);
    setLoading(true);

    if (!localStorage.getItem("refreshToken")) {
      setValidationError("You must be logged in.");
      setLoading(false);
      return;
    }
    if (!assignmentFile || !rubricsFile) {
      setValidationError("Please pick both PDFs.");
      setLoading(false);
      return;
    }

    const fd = new FormData();
    fd.append("workflow", selectedWorkflow);
    fd.append("graderName", assignmentName);
    fd.append("assignmentName", assignmentName);
    fd.append("assignmentFile", assignmentFile);
    fd.append("rubricsFile", rubricsFile);

    try {
      const res = await apiFetch("/api/validate", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        if (res.status === 401) {
          setValidationError("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } else {
          const text = await res.text();
          setValidationError(
            text || `Validation failed (HTTP ${res.status}).`
          );
        }
        return;
      }
      const json = await res.json();
      setRawValidate(json);
      setFeedback(
        Array.isArray(json.validation_feedback) ? json.validation_feedback : []
      );
      setToken(json.token ?? null);
      setValidatedFiles({ assignmentFile, rubricsFile });
    } catch (err: any) {
      // apiFetch throws on refresh denial with "Session expired"
      setValidationError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleGrade(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGradingError(null);

    if (!localStorage.getItem("refreshToken")) {
      setGradingError("You must be logged in.");
      return;
    }
    const usingGeneratedRubric = Boolean(generatedRubric);
    if (!usingGeneratedRubric && !validatedFiles) {
      setGradingError("Complete validation first.");
      return;
    }
    if (usingGeneratedRubric && !assignmentFile) {
      setGradingError("Upload the assignment before grading.");
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
        const workflowToUse = usingGeneratedRubric
          ? generatedRubric?.rubric_type === "assignment"
            ? "Assignment_grader"
            : "auto_grade"
          : selectedWorkflow;
        fd.append("workflow", workflowToUse);
        if (usingGeneratedRubric) {
          fd.append("assignmentFile", assignmentFile as File);
          fd.append("rubricJson", JSON.stringify(generatedRubric));
        } else if (validatedFiles) {
          fd.append("assignmentFile", validatedFiles.assignmentFile);
          fd.append("rubricsFile", validatedFiles.rubricsFile);
        }
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

    feedback,
    setFeedback,
    rawValidate,
    setRawValidate,
    validationError,
    loading,
    token,
    setToken,

    assignmentFile,
    setAssignmentFile,
    rubricsFile,
    setRubricsFile,
    validatedFiles,
    setValidatedFiles,

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

    handleValidate,
    handleGrade,
  };

  // -----------------------------------------------------------------------
  // Render -----------------------------------------------------------------
  // -----------------------------------------------------------------------
  return (
    <AutoGradingWizardContext.Provider value={ctx}>
      <div className="auto-grading-wizard">
        <Header step={step} />
        {step === 1 && <StepOne WORKFLOW_LABELS={WORKFLOW_LABELS} />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour />}
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
      <div className="wizard-step-indicator">Step {step}/4</div>
    </div>
  );
}

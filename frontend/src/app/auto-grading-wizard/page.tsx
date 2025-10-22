'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

// Step pages (presentational-only)
import StepOne from "../../components/autograding-wizard/StepOne";
import StepTwo from "../../components/autograding-wizard/StepTwo";
import StepThree from "../../components/autograding-wizard/StepThree";
import StepFour from "../../components/autograding-wizard/StepFour";

// API wrapper
import { apiFetch } from "../../lib/api"; // adjust to "@/lib/api" if you use path aliases

import {
  AutoGradingWizardContext,
  AutoGradingWizardContextType,
} from "./useAutoGradingWizard";

const TIMEOUT_SECONDS = 600;

type WizardStep = 1 | 2 | 3 | 4;

function CombinedAutoGradingWizard() {
  const [step, setStep] = useState<WizardStep>(1);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);

  const [assignmentName, setAssignmentName] = useState<string>("");
  const [workflows, setWorkflows] = useState<string[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<string>("Assignment_grader");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [rawOutputs, setRawOutputs] = useState<
    { filename: string; data: any }[]
  >([]);
  const [solutionFilesSelected, setSolutionFilesSelected] = useState<File[]>(
    []
  );

  const [generatedRubric, setGeneratedRubric] = useState<any | null>(null);
  const [extractedQuestions, setExtractedQuestions] = useState<any[] | null>(
    null
  );
  const [isGeneratingRubric, setIsGeneratingRubric] = useState(false);
  const [rubricGenerationError, setRubricGenerationError] = useState<
    string | null
  >(null);

  const WORKFLOW_LABELS: Record<string, string> = {
    Assignment_grader: "Report/Essay/General Assignment",
    auto_grade: "Q/A Assignment (Formatted)",
    handwritten_ocr: "Handwritten Exam",
    test_view: "Test Workflow",
    rubric_generation: "Rubric Generation",
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!localStorage.getItem("refreshToken")) return;

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

          if (nextWorkflow) {
            setSelectedWorkflow(nextWorkflow);
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

  const generateRubric = useCallback(async () => {
    if (!assignmentFile) {
      setRubricGenerationError(
        "Upload an assignment PDF before generating a rubric."
      );
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

  const handleGrade = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
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

      const tick = setInterval(() => {
        setTimeLeft((time) => (time && time > 1 ? time - 1 : 0));
      }, 1000);

      const timer = setTimeout(() => {
        clearInterval(tick);
        alert("Timeout");
      }, TIMEOUT_SECONDS * 1000);

      try {
        const assignmentSource = assignmentFile as File;
        const rubricPayload = JSON.stringify(generatedRubric);
        const workflowToUse = selectedWorkflow || "auto_grade";

        for (const file of solutionFilesSelected) {
          const formData = new FormData();
          formData.append("graderName", assignmentName);
          formData.append("assignmentName", assignmentName);
          formData.append("workflow", workflowToUse);
          formData.append("assignmentFile", assignmentSource);
          formData.append("rubricJson", rubricPayload);
          formData.append("solutionFile", file);

          const response = await apiFetch("/api/v1/grade", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            if (response.status === 401) {
              setGradingError("Session expired. Please log in again.");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              break;
            }

            const text = await response.text();
            setGradingError(
              text || `Grade request failed (HTTP ${response.status}).`
            );
            continue;
          }

          const data = await response.json();
          setRawOutputs((existing) => [
            ...existing,
            { filename: file.name, data },
          ]);
        }
      } catch (error: any) {
        setGradingError(error?.message || "Network error");
      } finally {
        clearTimeout(timer);
        clearInterval(tick);
        setIsSubmitting(false);
      }
    },
    [
      assignmentFile,
      assignmentName,
      generatedRubric,
      selectedWorkflow,
      solutionFilesSelected,
    ]
  );

  const ctx = useMemo<AutoGradingWizardContextType>(
    () => ({
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
    }),
    [
      assignmentFile,
      assignmentName,
      extractedQuestions,
      generatedRubric,
      generateRubric,
      gradingError,
      handleGrade,
      isGeneratingRubric,
      isSubmitting,
      rawOutputs,
      rubricGenerationError,
      selectedWorkflow,
      solutionFilesSelected,
      step,
      timeLeft,
      workflows,
    ]
  );

  const handleBack = useCallback(() => {
    if (step === 1) {
      window.location.href = "/";
      return;
    }

    setStep((previous) => (previous - 1) as WizardStep);
  }, [step]);

  const toggleInfoPanel = useCallback(() => {
    setIsInfoPanelOpen((open) => !open);
  }, []);

  return (
    <AutoGradingWizardContext.Provider value={ctx}>
      <div className="auto-grading-wizard">
        <Header step={step} />

        <div className="wizard-top-buttons">
          <button type="button" onClick={handleBack} className="back-button">
            <ChevronLeft size={18} />
            Back
          </button>
        </div>

        <main className="wizard-stage" aria-live="polite">
          {step === 1 && <StepOne WORKFLOW_LABELS={WORKFLOW_LABELS} />}
          {step === 2 && <StepTwo />}
          {step === 3 && <StepThree />}
          {step === 4 && <StepFour />}
        </main>

        <InfoPanel isOpen={isInfoPanelOpen} onToggle={toggleInfoPanel} />
      </div>
    </AutoGradingWizardContext.Provider>
  );
}

function Header({ step }: { step: WizardStep }) {
  return (
    <header className="wizard-header">
      <h1>AutoGrade</h1>
      <span className="wizard-step-count">Step {step} of 4</span>
    </header>
  );
}

type InfoPanelProps = {
  isOpen: boolean;
  onToggle: () => void;
};

function InfoPanel({ isOpen, onToggle }: InfoPanelProps) {
  const titleId = "auto-grading-info-panel-title";
  const contentId = "auto-grading-info-panel-content";
  const tips = [
    "Upload the full assignment brief before generating your rubric so the context is complete.",
    "Preview the rubric once it’s created and tweak any criteria before you start grading files.",
    "Keep the assignment name consistent—support can resolve questions faster when they see the exact title.",
  ];

  return (
    <aside
      className={`click-info-panel ${isOpen ? "open" : ""}`}
      role="complementary"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="info-panel-toggle"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
      >
        <span className="toggle-icon" aria-hidden="true">
          <Info size={20} />
        </span>
        <span className="toggle-label">Helper</span>
        {isOpen ? (
          <ChevronRight className="toggle-chevron" aria-hidden="true" />
        ) : (
          <ChevronLeft className="toggle-chevron" aria-hidden="true" />
        )}
      </button>
      <div className="info-panel-inner">
        <div className="info-panel-header">
          <h2 className="info-panel-title" id={titleId}>
            Helper Tips
          </h2>
          <p className="info-panel-subtitle">
            Quick reminders while you guide submissions.
          </p>
        </div>
        <div
          className="info-panel-content"
          id={contentId}
          aria-hidden={!isOpen}
        >
          <div className="info-panel-tips">
            {tips.map((tip) => (
              <div key={tip} className="info-panel-tip">
                <span className="info-panel-tip-dot" aria-hidden="true" />
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CombinedAutoGradingWizard;

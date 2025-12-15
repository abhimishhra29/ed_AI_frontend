'use client';

import {
  FormEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
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
  WorkflowOption,
  AssignmentStructureOption,
} from "./useAutoGradingWizard";

const TIMEOUT_SECONDS = 600;
const ALLOWED_WORKFLOWS: WorkflowOption[] = [
  "Assignment_grader",
  "handwritten_ocr",
];
const DEFAULT_WORKFLOW: WorkflowOption = ALLOWED_WORKFLOWS[0];

type WizardStep = 1 | 2 | 3 | 4;

function CombinedAutoGradingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>(1);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isInfoPanelHovering, setIsInfoPanelHovering] = useState(false);

  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);

  const [assignmentName, setAssignmentName] = useState<string>("");
  const [assignmentStructure, setAssignmentStructure] =
    useState<AssignmentStructureOption>("question_based");
  const [workflows, setWorkflows] = useState<WorkflowOption[]>([
    ...ALLOWED_WORKFLOWS,
  ]);
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<WorkflowOption>(DEFAULT_WORKFLOW);
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

  const WORKFLOW_LABELS: Record<WorkflowOption, string> = {
    Assignment_grader: "Typed Assignment",
    handwritten_ocr: "Handwritten Assignment",
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      const applyDefaultWorkflows = () => {
        setWorkflows([...ALLOWED_WORKFLOWS]);
        setSelectedWorkflow(DEFAULT_WORKFLOW);
      };

      if (!localStorage.getItem("refreshToken")) {
        applyDefaultWorkflows();
        return;
      }

      try {
        const resp = await apiFetch("/api/v1/workflow/list/grade");
        if (!resp.ok) {
          applyDefaultWorkflows();
          return;
        }

        const data = await resp.json();
        if (!alive) {
          return;
        }

        if (Array.isArray(data.workflows)) {
          const filtered = data.workflows.filter((wf: string): wf is WorkflowOption =>
            ALLOWED_WORKFLOWS.includes(wf as WorkflowOption)
          );
          const nextWorkflows = filtered.length
            ? filtered
            : [...ALLOWED_WORKFLOWS];
          setWorkflows(nextWorkflows);
          setSelectedWorkflow((current) =>
            nextWorkflows.includes(current) ? current : DEFAULT_WORKFLOW
          );
        } else {
          applyDefaultWorkflows();
        }
      } catch {
        applyDefaultWorkflows();
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
    fd.append("assignmentStructure", assignmentStructure);

    try {
      const resp = await apiFetch("/api/v2/rubric", {
        method: "POST",
        body: fd,
      });

      if (!resp.ok) {
        if (resp.status === 401) {
          // Clear authentication tokens
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("loggedIn");
          // Notify other tabs about logout
          try {
            const bc = new BroadcastChannel("auth");
            bc.postMessage({ type: "logout" });
            bc.close();
          } catch {}
          window.dispatchEvent(new Event("storage"));
          // Redirect to login page
          router.push("/login");
          return;
        }
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
      // Check if it's a session expiration error
      if (err?.message === "Session expired" || err?.message?.includes("Session expired")) {
        // Clear authentication tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("loggedIn");
        // Notify other tabs about logout
        try {
          const bc = new BroadcastChannel("auth");
          bc.postMessage({ type: "logout" });
          bc.close();
        } catch {}
        window.dispatchEvent(new Event("storage"));
        // Redirect to login page
        router.push("/login");
      } else {
        setGeneratedRubric(null);
        setExtractedQuestions(null);
        setRubricGenerationError(err?.message || "Rubric generation failed.");
      }
    } finally {
      setIsGeneratingRubric(false);
    }
  }, [assignmentFile, assignmentName, assignmentStructure, router]);

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
        // Clear authentication tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("loggedIn");
        // Notify other tabs about logout
        try {
          const bc = new BroadcastChannel("auth");
          bc.postMessage({ type: "logout" });
          bc.close();
        } catch {}
        window.dispatchEvent(new Event("storage"));
        // Redirect to login page
        router.push("/login");
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
          formData.append("assignmentStructure", assignmentStructure);

          const response = await apiFetch("/api/v1/grade", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            if (response.status === 401) {
              // Clear authentication tokens
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("loggedIn");
              // Notify other tabs about logout
              try {
                const bc = new BroadcastChannel("auth");
                bc.postMessage({ type: "logout" });
                bc.close();
              } catch {}
              window.dispatchEvent(new Event("storage"));
              // Redirect to login page
              router.push("/login");
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
        // Check if it's a session expiration error
        if (error?.message === "Session expired" || error?.message?.includes("Session expired")) {
          // Clear authentication tokens
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("loggedIn");
          // Notify other tabs about logout
          try {
            const bc = new BroadcastChannel("auth");
            bc.postMessage({ type: "logout" });
            bc.close();
          } catch {}
          window.dispatchEvent(new Event("storage"));
          // Redirect to login page
          router.push("/login");
        } else {
          setGradingError(error?.message || "Network error");
        }
      } finally {
        clearTimeout(timer);
        clearInterval(tick);
        setIsSubmitting(false);
      }
    },
    [
      assignmentFile,
      assignmentName,
      assignmentStructure,
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
      assignmentStructure,
      setAssignmentStructure,
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
      assignmentStructure,
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

  const handleInfoPanelHoverChange = useCallback((hovering: boolean) => {
    setIsInfoPanelHovering(hovering);
  }, []);

  const handleContinueFromStep3 = useCallback(() => {
    // Validate that no subsection has max_score <= 0 or missing
    if (generatedRubric && Array.isArray((generatedRubric as any).rubric)) {
      const hasZero = (generatedRubric as any).rubric.some((q: any) =>
        Array.isArray(q.subsections) && q.subsections.some((s: any) => {
          const raw = s?.max_score;
          const val = typeof raw === 'string' ? parseFloat(raw) : raw;
          return val === 0 || isNaN(val) || val === null || val === undefined;
        })
      );
      if (hasZero) {
        setRubricGenerationError?.('Max Score cannot be 0 or empty. Please update all subsections before continuing.');
        return;
      }
    }
    setRubricGenerationError?.(null);
    setStep(4);
  }, [generatedRubric, setRubricGenerationError, setStep]);

  return (
    <AutoGradingWizardContext.Provider value={ctx}>
      <div className="auto-grading-wizard">
        <Header step={step} />

        <div className={`wizard-top-buttons ${step === 2 ? 'wizard-top-buttons-step-two' : ''}`}>
          {step !== 1 && (
            <button type="button" onClick={handleBack} className="back-button">
              <ChevronLeft size={18} />
              Back
            </button>
          )}
          {step === 3 && (
            <>
              <div className="wizard-step-title-container">
                <h2 className="wizard-step-title">AI Generated Rubric</h2>
                <div className="wizard-step-info">
                  <span className="step-indicator">Step 3/4</span>
                  <span className="assignment-info">
                    {assignmentFile
                      ? `Using assignment: ${assignmentFile.name}`
                      : "Upload an assignment in the previous step to generate a rubric."}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="continue-button"
                onClick={handleContinueFromStep3}
                disabled={!generatedRubric || isGeneratingRubric}
              >
                Continue
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        <main className="wizard-stage" aria-live="polite">
          {step === 1 && <StepOne WORKFLOW_LABELS={WORKFLOW_LABELS} />}
          {step === 2 && <StepTwo />}
          {step === 3 && <StepThree />}
          {step === 4 && <StepFour />}
        </main>

        <InfoPanel
          isOpen={isInfoPanelOpen || isInfoPanelHovering}
          onToggle={toggleInfoPanel}
          onHoverChange={handleInfoPanelHoverChange}
          step={step}
        />
      </div>
    </AutoGradingWizardContext.Provider>
  );
}

function Header({ step }: { step: WizardStep }) {
  return (
    <header className={`wizard-header ${step === 1 || step === 2 ? 'wizard-header-step-one' : ''} ${step === 2 ? 'wizard-header-step-two' : ''}`}>
      <h1>AutoGrade</h1>
    </header>
  );
}

type InfoPanelProps = {
  isOpen: boolean;
  onToggle: () => void;
  onHoverChange?: (hovering: boolean) => void;
  step: WizardStep;
};

function InfoPanel({
  isOpen,
  onToggle,
  onHoverChange,
  step,
}: InfoPanelProps) {
  const titleId = "auto-grading-info-panel-title";
  const contentId = "auto-grading-info-panel-content";
  
  const stepOneTips = [
    "Pick the Assignment Type that matches the submission format before moving on.",
    "Typed Assignment handles Word/Google Docs style PDFs, Handwritten Assignment is tuned for scanned pen-and-paper uploads.",
    "Set the Question Paper Type to 'Q/A Based' when the Assignment has numbered questions or MCQs.",
    "Switch it to 'Report Based' for essays, case studies",
  ];
  
  const stepTwoTips = [
    "Accepts Reports, Essays, and Q&A assignments.",
    "Format: PDF files only.",
    "File size: Up to 20 Pages per file.",
  ];
  
  const stepThreeTips = [
    "Open 'Edit Rubrics' to refine criterion descriptions, thresholds, or maximum scores.",
    "Align subsection IDs and numbering with the assignment structure before saving.",
    "Use '+ Add Penalty' to capture recurring deductions; set the amount to zero to remove it.",
    "Confirm percentage ranges reflect the intended grade bands for each level.",
    "Select 'Save All Changes' to apply updates or 'Cancel' to restore the previous rubric.",
  ];
  
  const stepFourTips = [
    "Click 'Edit' to update earned scores or comments while maximum scores remain locked.",
    "Ensure each earned score stays at or below the value displayed after the slash.",
    "Provide concise, actionable comments for every graded section.",
    "Verify that the recalculated totals match your expectations prior to saving.",
    "Export the CSV only after every submission has been reviewed and finalized.",
  ];
  
  const defaultTips = [
    "Upload the full assignment brief before generating your rubric so the context is complete.",
    "Preview the rubric once it's created and tweak any criteria before you start grading files.",
    "Keep the assignment name consistent, support can resolve questions faster when they see the exact title.",
  ];
  
  const tips = step === 1 ? stepOneTips : step === 2 ? stepTwoTips : step === 3 ? stepThreeTips : step === 4 ? stepFourTips : defaultTips;

  const handleMouseEnter = () => onHoverChange?.(true);
  const handleMouseLeave = () => onHoverChange?.(false);
  const handleBlurCapture = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (!event.currentTarget.contains(nextTarget)) {
      onHoverChange?.(false);
    }
  };
  const handleFocusCapture = () => onHoverChange?.(true);

  return (
    <aside
      className={`click-info-panel ${isOpen ? "open" : ""}`}
      role="complementary"
      aria-labelledby={titleId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
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

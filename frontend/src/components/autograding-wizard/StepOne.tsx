'use client';

import { FC, FormEvent } from "react";
import { ChevronRight } from "lucide-react";
import {
  useAutoGradingWizard,
  WorkflowOption,
} from "../../app/auto-grading-wizard/useAutoGradingWizard";

interface StepOneProps {
  /** Human-readable labels for workflow slugs */
  WORKFLOW_LABELS: Record<WorkflowOption, string>;
}

const StepOne: FC<StepOneProps> = ({ WORKFLOW_LABELS }) => {
  const {
    setStep,
    assignmentName,
    setAssignmentName,
    workflows,
    selectedWorkflow,
    setSelectedWorkflow,
    setGeneratedRubric,
    setRubricGenerationError,
    setExtractedQuestions,
  } = useAutoGradingWizard();

  const workflowOptions: WorkflowOption[] =
    workflows.length > 0
      ? workflows
      : (Object.keys(WORKFLOW_LABELS) as WorkflowOption[]);

  const resetWizardState = () => {
    setGeneratedRubric(null);
    setRubricGenerationError(null);
    setExtractedQuestions(null);
  };

  const handleWorkflowChange = (value: WorkflowOption) => {
    setSelectedWorkflow(value);
    resetWizardState();
  };

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assignmentName) return;
    setStep(2);
  };

  const handleContinue = () => {
    if (!assignmentName || !selectedWorkflow) return;
    setStep(2);
  };

  return (
    <div className="wizard-step wizard-step-one">
      <div className="wizard-content">
        <div className="assignment-details-box">
          <h2>Assignment Details</h2>
          <div className="step-indicator">Step 1/4</div>
          <form className="validation-form" onSubmit={handleNext}>
            <div className="form-fields-container">
              <div className="form-field">
                <label htmlFor="assignment-name" className="workflow-label">Assignment Name:</label>
                <input
                  id="assignment-name"
                  type="text"
                  value={assignmentName}
                  onChange={(e) => {
                    setAssignmentName(e.target.value);
                    resetWizardState();
                  }}
                  placeholder="e.g., Research Essay on GenAI"
                  required
                  className="text-input"
                />
              </div>

              <div className="form-field">
                <span className="workflow-label">Assignment Type:</span>
                <div
                  className="workflow-toggle"
                  role="radiogroup"
                  aria-label="Assignment Type"
                >
                  {workflowOptions.map((workflow) => {
                    const label = WORKFLOW_LABELS[workflow] ?? workflow;
                    const isActive = workflow === selectedWorkflow;
                    return (
                      <button
                        type="button"
                        key={workflow}
                        className={`workflow-toggle__option${
                          isActive ? " workflow-toggle__option--active" : ""
                        }`}
                        onClick={() => handleWorkflowChange(workflow)}
                        aria-pressed={isActive}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {workflowOptions.length === 0 && (
                  <div className="validation-error">
                    Sign in to load available assignment types.
                  </div>
                )}
              </div>

              <div className="form-field">
                <button
                  onClick={handleContinue}
                  disabled={
                    !assignmentName ||
                    workflowOptions.length === 0 ||
                    !selectedWorkflow
                  }
                  className="step-one-continue-button"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StepOne;

'use client';

import { FC, FormEvent } from "react";
import { ChevronRight } from "lucide-react";
import { useAutoGradingWizard } from '../../app/auto-grading-wizard/useAutoGradingWizard';

interface StepOneProps {
  /** Human-readable labels for workflow slugs */
  WORKFLOW_LABELS: Record<string, string>;
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

  const workflowOptions =
    workflows.length > 0 ? workflows : Object.keys(WORKFLOW_LABELS);

  const resetWizardState = () => {
    setGeneratedRubric(null);
    setRubricGenerationError(null);
    setExtractedQuestions(null);
  };

  const handleWorkflowChange = (value: string) => {
    setSelectedWorkflow(value);
    resetWizardState();
  };

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assignmentName) return;
    setStep(2);
  };

  const handleBack = () => {
    // Go back to home page
    window.location.href = '/';
  };

  const handleContinue = () => {
    if (!assignmentName) return;
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
                <label htmlFor="assignment-name">Assignment Name:</label>
                <input
                  id="assignment-name"
                  type="text"
                  value={assignmentName}
                  onChange={(e) => {
                    setAssignmentName(e.target.value);
                    resetWizardState();
                  }}
                  placeholder="e.g., Research Essay on Climate Change"
                  required
                  className="text-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="workflow-select">Assignment Type:</label>
                <select
                  id="workflow-select"
                  value={selectedWorkflow}
                  onChange={(e) => handleWorkflowChange(e.target.value)}
                  disabled={workflowOptions.length === 0}
                  className="workflow-select"
                >
                  {workflowOptions.map((w) => (
                    <option key={w} value={w}>
                      {WORKFLOW_LABELS[w] || w}
                    </option>
                  ))}
                </select>

                {workflowOptions.length === 0 && (
                  <div className="validation-error">
                    Sign in to load available assignment types.
                  </div>
                )}
              </div>
              
              {/* Continue button below assignment type */}
              <div className="form-field">
                <button
                  onClick={handleContinue}
                  disabled={!assignmentName || workflows.length === 0}
                  className="step-one-continue-button"
                >
                  Continue
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

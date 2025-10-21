'use client';

import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";
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

  const [showHelp, setShowHelp] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!showHelp) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        setShowHelp(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHelp]);

  return (
    <div className="wizard-step wizard-step-one">
      <div className="wizard-content">
        <div className="form-column">
          <h2>Assignment Details</h2>
          <form className="validation-form" onSubmit={handleNext}>
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

            <label htmlFor="workflow-select">Assignment Type:</label>
            <div className="workflow-input-wrapper">
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
              <HelpCircle
                className="help-icon"
                onClick={() => setShowHelp(true)}
              />
            </div>

            {workflowOptions.length === 0 && (
              <div className="validation-error">
                Sign in to load available assignment types.
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn primary"
                disabled={!assignmentName || workflowOptions.length === 0}
              >
                Continue
              </button>
            </div>
          </form>
        </div>

        <div className="right-column">
          <div className="validation-section">
            <h3>What you’ll need next</h3>
            <p>Prepare these files before continuing:</p>
            <ul>
              <li>Assignment questions PDF (Step 2)</li>
              <li>Optional exemplar solution PDF</li>
              <li>Student submissions for grading</li>
            </ul>
          </div>
        </div>
      </div>

      {showHelp && (
        <div className="help-overlay">
          <div className="help-modal" ref={overlayRef}>
            <button
              className="help-close-button"
              onClick={() => setShowHelp(false)}
            >
              ×
            </button>
            <div className="help-content">
              <h3>Workflow Selection Help</h3>
              <p className="help-description">
                Choose the workflow that best matches your assignment type.
              </p>
              <div className="help-instructions">
                <h4>Instructions:</h4>
                <ul>
                  <li>
                    <strong>Assignment / Report / Essay:</strong> General purpose
                    grading with no special formatting.
                  </li>
                  <li>
                    <strong>Q/A Assignment:</strong> Optimized for question and
                    answer layouts, one question per section.
                  </li>
                  <li>
                    <strong>Handwritten Exams:</strong> Designed for scanned or
                    photographed handwritten responses.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepOne;

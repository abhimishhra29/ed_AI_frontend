'use client';

import { FC, useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import { HelpCircle } from "lucide-react";
import { useAutoGradingWizard } from '../../app/auto-grading-wizard/useAutoGradingWizard';

import questionsImage from '../../assets/images/Questions.png';

const StepTwo: FC = () => {
  const {
    setStep,
    assignmentFile,
    setAssignmentFile,
    setGeneratedRubric,
    setRubricGenerationError,
    setExtractedQuestions,
  } = useAutoGradingWizard();

  const [showHelp, setShowHelp] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const helpContent = {
    title: "Assignment Question Help",
    description:
      "Upload the PDF containing every question students need to answer.",
    imagePath: questionsImage.src,
    instructions: [
      "Upload a single PDF file containing all questions.",
      "Each question should clearly identify its number (e.g., “Question 1”).",
      "Include supporting context directly beneath each question header.",
    ],
  };

  const resetWizardState = () => {
    setGeneratedRubric(null);
    setRubricGenerationError(null);
    setExtractedQuestions(null);
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

  const handleAssignmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAssignmentFile(file);
    resetWizardState();
  };

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assignmentFile) return;
    setStep(3);
  };

  return (
    <div className="wizard-step wizard-step-two">
      <div className="wizard-content">
        <div className="form-column">
          <h2>Upload Assignment Question</h2>
          <form className="validation-form" onSubmit={handleNext}>
            <label>Assignment Question:</label>
            <div
              className={`file-input-wrapper ${
                assignmentFile ? "has-file" : ""
              }`}
            >
              <label htmlFor="assignmentInput" className="file-input-button">
                {assignmentFile ? "Change PDF" : "Choose PDF"}
              </label>
              <span className="file-input-filename">
                {assignmentFile?.name || "No file selected"}
              </span>
              <HelpCircle
                className="help-icon"
                onClick={() => setShowHelp(true)}
              />
              <input
                id="assignmentInput"
                type="file"
                accept="application/pdf"
                className="file-input-input"
                onChange={handleAssignmentChange}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn primary"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn primary"
                disabled={!assignmentFile}
              >
                Continue
              </button>
            </div>
          </form>
        </div>

        <div className="right-column">
          <div className="templates-section">
            <details className="template-dropdown">
              <summary className="template-dropdown-trigger">
                <span>Download Templates</span>
                <svg
                  className="dropdown-icon"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <div className="template-dropdown-content">
                <a
                  href={`/downloads/Questions_Template.docx`}
                  download
                  className="template-link"
                  target="_blank"
                  rel="noopener"
                >
                  <span>Questions Template</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1V11M8 11L11 8M8 11L5 8M2 13H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </details>
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
              <h3>{helpContent.title}</h3>
              <p className="help-description">{helpContent.description}</p>

              <div className="help-image-container">
                <h4>Reference Image:</h4>
                <img
                  src={helpContent.imagePath}
                  alt={`${helpContent.title} reference`}
                  className="help-image-preview"
                />
                <a
                  href={helpContent.imagePath}
                  download
                  className="help-download-link"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M8 1V11M8 11L11 8M8 11L5 8M2 13H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download Reference Image
                </a>
              </div>

              <div className="help-instructions">
                <h4>Instructions:</h4>
                <ul>
                  {helpContent.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepTwo;

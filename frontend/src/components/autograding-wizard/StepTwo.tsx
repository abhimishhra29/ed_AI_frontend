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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleContinue = () => {
    if (!assignmentFile) return;
    setStep(3);
  };

  return (
    <div className="wizard-step wizard-step-two">
      <div className="wizard-content">
        <div className="assignment-details-box">
          <h2>Upload Assignment Question</h2>
          <div className="step-indicator">Step 2/4</div>
          <form className="validation-form" onSubmit={handleNext}>
            <div className="form-fields-container">
              <div className="form-field">
                <label>Assignment Question:</label>
                <div
                  className={`upload-pdf-box ${assignmentFile ? "has-file" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label={assignmentFile ? `Selected file ${assignmentFile.name}` : 'Upload PDF'}
                >
                  <div className="upload-pdf-icon" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="#111827" strokeWidth="1.5"/>
                      <path d="M13 2v5h5" stroke="#111827" strokeWidth="1.5"/>
                      <circle cx="18" cy="18" r="4.5" fill="#ef4444"/>
                      <path d="M18 15v4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M16.5 17H19.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="upload-pdf-text">
                    {assignmentFile?.name || 'Upload PDF'}
                  </div>
                  <input
                    id="assignmentInput"
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="file-input-input"
                    onChange={handleAssignmentChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <button
                  onClick={handleContinue}
                  disabled={!assignmentFile}
                  className="step-one-continue-button"
                >
                  Continue
                </button>
              </div>
            </div>
          </form>
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

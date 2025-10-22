'use client';

import { FC, useEffect } from "react";
import { useAutoGradingWizard } from '../../app/auto-grading-wizard/useAutoGradingWizard';

const StepThree: FC = () => {
  const {
    setStep,
    assignmentFile,
    generateRubric,
    generatedRubric,
    extractedQuestions,
    isGeneratingRubric,
    rubricGenerationError,
  } = useAutoGradingWizard();

  useEffect(() => {
    if (!assignmentFile) {
      setStep(2);
      return;
    }

    if (!generatedRubric && !isGeneratingRubric) {
      generateRubric();
    }
  }, [assignmentFile, generatedRubric, isGeneratingRubric, generateRubric, setStep]);

  return (
    <div className="wizard-step wizard-step-three">
      <div className="wizard-content">
        <div className="assignment-details-box">
          <h2>AI Generated Rubric</h2>
          <div className="step-indicator">Step 3/4</div>
          <p className="rubric-summary">
            {assignmentFile
              ? `Using assignment: ${assignmentFile.name}`
              : "Upload an assignment in the previous step to generate a rubric."}
          </p>

          <div className="form-fields-container">
            <div className="form-field">
              <button
                type="button"
                className="btn primary"
                onClick={() => setStep(2)}
                disabled={isGeneratingRubric}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={generateRubric}
                disabled={isGeneratingRubric || !assignmentFile}
              >
                {isGeneratingRubric ? "Generating…" : "Regenerate"}
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => setStep(4)}
                disabled={!generatedRubric || isGeneratingRubric}
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        <div className="right-column">
          {rubricGenerationError && (
            <div className="validation-error">{rubricGenerationError}</div>
          )}

          {isGeneratingRubric && (
            <div className="loading-indicator">Generating rubric…</div>
          )}

          {!isGeneratingRubric && extractedQuestions && (
            <div className="question-preview">
              <h3>Detected Questions</h3>
              <ol>
                {extractedQuestions.map((q: any) => (
                  <li key={q.question_id}>
                    <strong>{q.question_id}:</strong> {q.title || q.prompt}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {!isGeneratingRubric && generatedRubric && (
            <div className="rubric-json-preview">
              <pre>{JSON.stringify(generatedRubric, null, 2)}</pre>
            </div>
          )}

          {!isGeneratingRubric && !generatedRubric && !rubricGenerationError && (
            <div className="no-feedback">No rubric generated yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepThree;

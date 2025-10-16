'use client';

import { ChangeEvent, FC, Fragment, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { useAutoGradingWizard } from '../../app/auto-grading-wizard/useAutoGradingWizard';

const MAX_PAGES = 40;

const StepFour: FC = () => {
  const {
    /* navigation */
    setStep,

    /* grading state */
    isSubmitting,
    gradingError,
    timeLeft,
    rawOutputs,
    solutionFilesSelected,
    setSolutionFilesSelected,

    /* actions */
    handleGrade,
  } = useAutoGradingWizard();

  const [pageError, setPageError] = useState<string | null>(null);

  /**
   * Validate each PDF’s page count before accepting.
   */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setPageError(null);
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      if (file.type !== "application/pdf") continue;

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();

        if (pageCount > MAX_PAGES) {
          setPageError(
            `"${file.name}" has ${pageCount} pages (max ${MAX_PAGES}).`
          );
        } else {
          validFiles.push(file);
        }
      } catch {
        setPageError(`Could not read "${file.name}" – please re-upload.`);
      }
    }

    setSolutionFilesSelected(validFiles);
  };

  /**
   * Build & download a CSV containing the visible grading results,
   * without similarity score.
   */
  const exportToCSV = () => {
    if (!rawOutputs.length) return;

    const allQuestions = Array.from(
      new Set(
        rawOutputs.flatMap(({ data }) => {
          try {
            const tasks = JSON.parse(data.rationale).tasks || {};
            return Object.keys(tasks);
          } catch {
            return [];
          }
        })
      )
    );

    const header = ["Filename", "Student ID", "Total Score", ...allQuestions];

    const rows = rawOutputs.map(({ filename, data }) => {
      let tasksMap: Record<string, [number, number, string]> = {};
      try {
        tasksMap = JSON.parse(data.rationale).tasks || {};
      } catch {}

      return [
        filename,
        data.student_id,
        data.total_score ?? data.grade,
        ...allQuestions.map((q) => {
          const entry = tasksMap[q];
          if (!entry) return "";
          const [max, got, comment] = entry;
          return `${got}/${max} – ${comment.replace(/\n/g, " ")}`;
        }),
      ];
    });

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => String(cell).replace(/"/g, '""'))
          .map((cell) => `"${cell}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "grading_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="wizard-step-four">
      <div className="wizard-content">
        {/* ─────────────────── Left column – form ─────────────────── */}
        <div className="form-column">
          <h2>Grade Submissions</h2>
          <form
            onSubmit={handleGrade}
            encType="multipart/form-data"
            className="grading-form"
          >
            {/* Solution PDFs */}
            <label>Attach Submission:</label>
            <div
              className={
                "file-input-wrapper " +
                (solutionFilesSelected.length > 0 ? "has-file" : "")
              }
            >
              <label htmlFor="solutionInput" className="file-input-button">
                {solutionFilesSelected.length > 0
                  ? "Change Files…"
                  : "Choose Files…"}
              </label>
              <span className="file-input-filename">
                {solutionFilesSelected.length > 0
                  ? solutionFilesSelected.map((f) => f.name).join(", ")
                  : "No file selected"}
              </span>
              <input
                id="solutionInput"
                type="file"
                accept="application/pdf"
                multiple
                className="file-input-input"
                disabled={isSubmitting}
                onChange={handleFileChange}
              />
            </div>

            {/* Page-limit error message */}
            {pageError && (
              <div className="file-error">
                {pageError} Please upload PDFs of up to {MAX_PAGES} pages.
              </div>
            )}

            {/* Countdown timer */}
            <div className="timer">
              Time left: {timeLeft !== null ? `${timeLeft}s` : "--"}
            </div>

            {/* Submit button */}
            <div className="btn-row">
              <button
                type="button"
                className="btn primary"
                onClick={() => setStep(3)}
                disabled={isSubmitting}
              >
                ← Back to Validation
              </button>
              <button
                type="submit"
                className="btn primary"
                disabled={isSubmitting || !!pageError}
              >
                {isSubmitting ? "Grading…" : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* ─────────────────── Right column – results ─────────────────── */}
        <div className="results-column">
          <div className="results-header">
            <h2>Grading Results</h2>
            {rawOutputs.length > 0 && (
              <button className="btn primary" onClick={exportToCSV}>
                Export CSV
              </button>
            )}
          </div>

          {gradingError && (
            <div className="grading-error">{gradingError}</div>
          )}

          {rawOutputs.length ? (
            rawOutputs.map(({ filename, data }, i) => {
              let rationaleObj: any = null;
              try {
                rationaleObj = JSON.parse(data.rationale);
              } catch {
                /* ignore */
              }

              return (
                <div key={i} className="grading-result-card">
                  <h3 className="grading-result-filename">{filename}</h3>
                  <hr />
                  <div className="total-score">
                    Total Score: {data.grade}
                  </div>

                  {rationaleObj?.tasks ? (
                    <div className="rationale">
                      <h4>Comments and Section Marks</h4>
                      {Object.entries(rationaleObj.tasks).map(
                        ([q, val]: any) => (
                          <div key={q} className="rationale-item">
                            <strong>{q}</strong>: {val[1]}/{val[0]} –{" "}
                            {val[2].split("\n").map(
                              (line: string, idx: number) => (
                                <Fragment key={idx}>
                                  {line}
                                  <br />
                                </Fragment>
                              )
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rationale-raw">
                      <pre className="rationale-raw__pre">{data.rationale}</pre>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-results">No results yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepFour;

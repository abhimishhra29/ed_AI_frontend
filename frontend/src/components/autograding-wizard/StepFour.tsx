'use client';

import { ChangeEvent, FC, useState } from "react";
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

    const columnLabels: string[] = [];

    rawOutputs.forEach(({ data }) => {
      try {
        const parsed = JSON.parse(data.rationale);

        if (parsed?.tasks && typeof parsed.tasks === "object") {
          Object.keys(parsed.tasks).forEach((label) => {
            if (!columnLabels.includes(label)) {
              columnLabels.push(label);
            }
          });
        }

        if (Array.isArray(parsed?.sections)) {
          parsed.sections.forEach((section: any, idx: number) => {
            const label =
              section?.section_label ||
              section?.section_id ||
              `Section ${idx + 1}`;

            if (label && !columnLabels.includes(label)) {
              columnLabels.push(String(label));
            }
          });
        }
      } catch {
        /* ignore malformed rationale */
      }
    });

    const header = ["Filename", "Student ID", "Total Score", ...columnLabels];

    const rows = rawOutputs.map(({ filename, data }) => {
      const columnMap: Record<string, string> = {};

      const toScoreString = (value: unknown) => {
        if (value === null || value === undefined) return "-";
        const stringValue = String(value).trim();
        return stringValue.length ? stringValue : "-";
      };

      const sanitizeComment = (value: unknown) =>
        String(value ?? "")
          .replace(/\n+/g, " ")
          .trim();

      try {
        const parsed = JSON.parse(data.rationale);

        if (parsed?.tasks && typeof parsed.tasks === "object") {
          Object.entries(parsed.tasks).forEach(
            ([label, rawValue]: [string, any]) => {
              const values = Array.isArray(rawValue) ? rawValue : [];
              const max = toScoreString(values[0]);
              const earned = toScoreString(values[1]);
              const commentText = sanitizeComment(values[2]);
              columnMap[label] = commentText
                ? `${earned}/${max} – ${commentText}`
                : `${earned}/${max}`;
            }
          );
        }

        if (Array.isArray(parsed?.sections)) {
          parsed.sections.forEach((section: any, idx: number) => {
            const labelRaw =
              section?.section_label ||
              section?.section_id ||
              `Section ${idx + 1}`;
            const label = String(labelRaw);
            const max = toScoreString(
              section?.max_score ?? section?.total_points ?? section?.possible_score
            );
            const earned = toScoreString(
              section?.awarded_score ?? section?.score ?? section?.earned_score
            );
            const feedbackItems = Array.isArray(section?.feedback)
              ? section.feedback
              : section?.feedback !== undefined
              ? [section.feedback]
              : section?.comments !== undefined
              ? [section.comments]
              : [];
            const feedback = feedbackItems
              .filter((item: any) => item !== null && item !== undefined)
              .map((item: any) => sanitizeComment(item))
              .filter(Boolean)
              .join(" | ");

            columnMap[label] = feedback
              ? `${earned}/${max} – ${feedback}`
              : `${earned}/${max}`;
          });
        }
      } catch {
        /* ignore malformed rationale */
      }

      return [
        filename,
        data.student_id,
        data.total_score ?? data.grade,
        ...columnLabels.map((label) => columnMap[label] ?? ""),
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
        <div className="assignment-details-box">
          <div className="assignment-details-box__header">
            <h2>Grade Submissions</h2>
            <div className="step-indicator">Step 4/4</div>
          </div>
          <form
            onSubmit={handleGrade}
            encType="multipart/form-data"
            className="grading-form"
          >
            <div className="form-fields-container">
              <div className="form-field">
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
              </div>

              <div className="form-field">
                <button
                  type="submit"
                  className="step-four-submit-button"
                  disabled={isSubmitting || !!pageError}
                >
                  {isSubmitting ? "Grading…" : "Submit"}
                </button>
              </div>
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

              const toScorePart = (value: unknown) => {
                if (value === null || value === undefined) return "-";
                const stringValue = String(value).trim();
                return stringValue.length ? stringValue : "-";
              };

              const toCommentList = (value: unknown) => {
                if (value === null || value === undefined) return [] as string[];
                const parts = Array.isArray(value) ? value : [value];
                return parts
                  .filter((part) => part !== null && part !== undefined)
                  .flatMap((part) =>
                    String(part)
                      .split(/\n+/)
                      .map((line) => line.trim())
                      .filter(Boolean)
                  );
              };

              const sections = Array.isArray(rationaleObj?.sections)
                ? rationaleObj.sections
                : null;
              const taskEntries =
                rationaleObj?.tasks && typeof rationaleObj.tasks === "object"
                  ? Object.entries(rationaleObj.tasks)
                  : null;

              const breakdownRows = sections
                ? sections
                    .map((section: any, idx: number) => {
                      const labelRaw =
                        section?.section_label ||
                        section?.title ||
                        section?.name ||
                        section?.section_id ||
                        `Section ${idx + 1}`;
                      const label = String(labelRaw).trim();
                      const earned = toScorePart(
                        section?.awarded_score ??
                          section?.score ??
                          section?.earned_score
                      );
                      const max = toScorePart(
                        section?.max_score ??
                          section?.total_points ??
                          section?.possible_score
                      );
                      const comments = toCommentList(
                        section?.feedback ?? section?.comments
                      );

                      return {
                        key: String(section?.section_id ?? `${idx}-${label}`),
                        label,
                        earned,
                        max,
                        comments,
                      };
                    })
                    .filter((row: any) => row.label)
                : taskEntries
                ? taskEntries.map(([label, rawVal]: [string, any], idx) => {
                    const values = Array.isArray(rawVal) ? rawVal : [];
                    return {
                      key: `${label}-${idx}`,
                      label,
                      earned: toScorePart(values[1]),
                      max: toScorePart(values[0]),
                      comments: toCommentList(values[2]),
                    };
                  })
                : [];

              const hasBreakdown = breakdownRows.length > 0;
              const breakdownTitle = sections
                ? "Section Breakdown"
                : "Question Breakdown";
              const primaryColumnLabel = sections ? "Section" : "Question";

              return (
                <div key={i} className="grading-result-card">
                  <div className="grading-result-card__header">
                    <div>
                      <h3 className="grading-result-filename">{filename}</h3>
                      {data.student_id && (
                        <div className="grading-result-meta">
                          Student ID: {data.student_id}
                        </div>
                      )}
                    </div>
                    <div className="grading-result-score">
                      <span className="score-value">
                        {data.total_score ?? data.grade}
                      </span>
                      <span className="score-label">Total Score</span>
                    </div>
                  </div>

                  {hasBreakdown ? (
                    <div className="rationale">
                      <div className="rationale-title">{breakdownTitle}</div>
                      <div className="rationale-table" role="table">
                        <div className="rationale-row rationale-row--head" role="row">
                          <div className="rationale-cell" role="columnheader">
                            {primaryColumnLabel}
                          </div>
                          <div
                            className="rationale-cell rationale-cell--score"
                            role="columnheader"
                          >
                            Score
                          </div>
                          <div className="rationale-cell" role="columnheader">
                            Comments
                          </div>
                        </div>

                        {breakdownRows.map((row) => (
                          <div key={row.key} className="rationale-row" role="row">
                            <div
                              className="rationale-cell"
                              role="cell"
                              data-label={primaryColumnLabel}
                            >
                              {row.label}
                            </div>
                            <div
                              className="rationale-cell rationale-cell--score"
                              role="cell"
                              data-label="Score"
                            >
                              <span className="score-pill">
                                {row.earned}
                                <span className="score-pill__divider">/</span>
                                {row.max}
                              </span>
                            </div>
                            <div
                              className="rationale-cell"
                              role="cell"
                              data-label="Comments"
                            >
                              {row.comments.length ? (
                                row.comments.map((line, idx) => (
                                  <div key={`${row.key}-comment-${idx}`} className="comment-line">
                                    {line}
                                  </div>
                                ))
                              ) : (
                                <span className="no-comment">No comments</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
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

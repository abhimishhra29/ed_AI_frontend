'use client';

import { ChangeEvent, FC, useState, useRef, useEffect } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedResults, setEditedResults] = useState<Record<string, {
    sections?: Record<string, { earned?: string; max?: string; comments?: string[] }>;
    tasks?: Record<string, { earned?: string; max?: string; comments?: string[] }>;
    totalScore?: string;
  }>>({});
  
  // Local state to store updated outputs that reflect edits
  const [displayOutputs, setDisplayOutputs] = useState<typeof rawOutputs>([]);
  
  // Sync displayOutputs with rawOutputs when rawOutputs changes
  useEffect(() => {
    setDisplayOutputs(rawOutputs);
  }, [rawOutputs]);
  
  // Toggle edit mode
  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Save changes - use displayOutputs (which has previous saves) not rawOutputs
      const updatedOutputs = displayOutputs.map(({ filename, data }) => {
        const edits = editedResults[filename];
        if (!edits) return { filename, data };
        
        try {
          const rationaleObj = JSON.parse(data.rationale);
          let updatedRationale = { ...rationaleObj };
          
                  // Update sections if they exist
          if (updatedRationale.sections && edits.sections !== undefined && edits.sections) {
            updatedRationale.sections = updatedRationale.sections.map((section: any, idx: number) => {
              const sectionLabel = section?.section_label || section?.title || section?.name || section?.section_id || `Section ${idx + 1}`;
              const sectionKey = String(section?.section_id ?? `${idx}-${sectionLabel}`);
              const sectionEdit = edits.sections?.[sectionKey];
              if (sectionEdit) {
                // Preserve existing comments if not all comments were edited
                let commentsValue = section.feedback ?? section.comments;
                if (sectionEdit.comments !== undefined) {
                  // If comments were edited, use the edited array
                  if (Array.isArray(sectionEdit.comments)) {
                    commentsValue = sectionEdit.comments.join('\n');
                  } else if (typeof sectionEdit.comments === 'string') {
                    commentsValue = sectionEdit.comments;
                  }
                }
                
                return {
                  ...section,
                  awarded_score: sectionEdit.earned !== undefined ? sectionEdit.earned : section.awarded_score,
                  score: sectionEdit.earned !== undefined ? sectionEdit.earned : section.score,
                  earned_score: sectionEdit.earned !== undefined ? sectionEdit.earned : section.earned_score,
                  max_score: sectionEdit.max !== undefined ? sectionEdit.max : section.max_score,
                  total_points: sectionEdit.max !== undefined ? sectionEdit.max : section.total_points,
                  possible_score: sectionEdit.max !== undefined ? sectionEdit.max : section.possible_score,
                  feedback: commentsValue,
                  comments: commentsValue,
                };
              }
              return section;
            });
          }
          
          // Update tasks if they exist
          if (updatedRationale.tasks && edits.tasks) {
            Object.entries(edits.tasks).forEach(([taskKey, taskEdit]) => {
              if (updatedRationale.tasks[taskKey] && Array.isArray(updatedRationale.tasks[taskKey])) {
                const taskArray = [...updatedRationale.tasks[taskKey]];
                if (taskEdit.earned !== undefined) taskArray[1] = taskEdit.earned;
                if (taskEdit.max !== undefined) taskArray[0] = taskEdit.max;
                if (taskEdit.comments !== undefined) taskArray[2] = taskEdit.comments.join('\n');
                updatedRationale.tasks[taskKey] = taskArray;
              }
            });
          }
          
          // Recalculate total score from updated sections/tasks
          // This MUST happen after all sections/tasks are updated with edits
          let totalScore = 0;
          if (updatedRationale.sections && Array.isArray(updatedRationale.sections)) {
            updatedRationale.sections.forEach((section: any) => {
              // Try multiple fields to get the earned score
              const earnedStr = section.awarded_score ?? section.score ?? section.earned_score ?? '0';
              const earned = parseFloat(String(earnedStr));
              if (!isNaN(earned) && isFinite(earned)) {
                totalScore += earned;
              }
            });
          } else if (updatedRationale.tasks && typeof updatedRationale.tasks === 'object') {
            Object.values(updatedRationale.tasks).forEach((taskValue: any) => {
              if (Array.isArray(taskValue) && taskValue.length > 1) {
                const earnedStr = taskValue[1] ?? '0';
                const earned = parseFloat(String(earnedStr));
                if (!isNaN(earned) && isFinite(earned)) {
                  totalScore += earned;
                }
              }
            });
          }
          
          // Always use calculated total score (from edited section scores)
          // This ensures the total reflects all edited individual scores
          data.total_score = totalScore;
          data.grade = totalScore;
          
          return {
            filename,
            data: {
              ...data,
              rationale: JSON.stringify(updatedRationale),
            }
          };
        } catch (e) {
          return { filename, data };
        }
      });
      
      // Update the display outputs with the edited data
      setDisplayOutputs([...updatedOutputs]); // Create new array to trigger re-render
      setEditedResults({});
      setIsEditMode(false);
    } else {
      // Enter edit mode
      setIsEditMode(true);
    }
  };
  
  // Handle score change
  const handleScoreChange = (filename: string, rowKey: string, type: 'sections' | 'tasks', field: 'earned' | 'max', value: string, maxScore?: string, index?: number) => {
    // Validation: earned score should not exceed max score
    if (field === 'earned' && maxScore) {
      const earnedNum = parseFloat(value);
      const maxNum = parseFloat(maxScore);
      if (!isNaN(earnedNum) && !isNaN(maxNum) && earnedNum > maxNum) {
        // Don't allow values greater than max
        return;
      }
    }
    
    setEditedResults(prev => {
      const fileEdits = prev[filename] || {};
      const typeEdits = fileEdits[type] || {};
      
      if (type === 'sections') {
        const sectionEdits = { ...typeEdits };
        const sectionKey = rowKey;
        sectionEdits[sectionKey] = {
          ...sectionEdits[sectionKey],
          [field]: value,
        };
        return {
          ...prev,
          [filename]: {
            ...fileEdits,
            sections: sectionEdits,
          }
        };
      } else {
        const taskEdits = { ...typeEdits };
        taskEdits[rowKey] = {
          ...taskEdits[rowKey],
          [field]: value,
        };
        return {
          ...prev,
          [filename]: {
            ...fileEdits,
            tasks: taskEdits,
          }
        };
      }
    });
  };
  
  // Handle comment change
  const handleCommentChange = (filename: string, rowKey: string, type: 'sections' | 'tasks', commentIndex: number, value: string, originalComments?: string[]) => {
    setEditedResults(prev => {
      const fileEdits = prev[filename] || {};
      const typeEdits = fileEdits[type] || {};
      
      if (type === 'sections') {
        const sectionEdits = { ...typeEdits };
        const sectionKey = rowKey;
        
        // Get current edited comments or start with original comments
        let currentComments: string[] = sectionEdits[sectionKey]?.comments || [];
        if (!currentComments || currentComments.length === 0) {
          // If no edited comments exist, start with original comments
          currentComments = originalComments ? [...originalComments] : [];
        }
        
        // Ensure array is large enough
        while (currentComments.length <= commentIndex) {
          currentComments.push('');
        }
        
        // Update the specific comment
        const newComments = [...currentComments];
        newComments[commentIndex] = value;
        
        sectionEdits[sectionKey] = {
          ...sectionEdits[sectionKey],
          comments: newComments,
        };
        return {
          ...prev,
          [filename]: {
            ...fileEdits,
            sections: sectionEdits,
          }
        };
      } else {
        const taskEdits = { ...typeEdits };
        
        // Get current edited comments or start with original comments
        let currentComments: string[] = taskEdits[rowKey]?.comments || [];
        if (!currentComments || currentComments.length === 0) {
          currentComments = originalComments ? [...originalComments] : [];
        }
        
        // Ensure array is large enough
        while (currentComments.length <= commentIndex) {
          currentComments.push('');
        }
        
        // Update the specific comment
        const newComments = [...currentComments];
        newComments[commentIndex] = value;
        
        taskEdits[rowKey] = {
          ...taskEdits[rowKey],
          comments: newComments,
        };
        return {
          ...prev,
          [filename]: {
            ...fileEdits,
            tasks: taskEdits,
          }
        };
      }
    });
  };

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
        setPageError(`Could not read "${file.name}", please re-upload.`);
      }
    }

    setSolutionFilesSelected(validFiles);
  };

  /**
   * Build & download a CSV containing the visible grading results,
   * without similarity score.
   */
  const exportToCSV = () => {
    if (!displayOutputs.length) return;

    const columnLabels: string[] = [];

    displayOutputs.forEach(({ data }) => {
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

    const rows = displayOutputs.map(({ filename, data }) => {
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
                ? `${earned}/${max}, ${commentText}`
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
              ? `${earned}/${max}, ${feedback}`
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
        {/* ─────────────────── Unified Container with Divider ─────────────────── */}
        <div className="step-four-unified-container">
          {/* ─────────────────── Left side – Grade Submissions ─────────────────── */}
          <div className="step-four-left-section">
            <div className="assignment-details-box">
              <h2>Grade Submissions</h2>
              <div className="step-indicator">Step 4/4</div>
              <form
                onSubmit={handleGrade}
                encType="multipart/form-data"
                className="grading-form"
              >
                <div className="form-fields-container">
                  <div className="form-field">
                    <label>Attach Submission:</label>
                    <div
                      className={`upload-pdf-box ${solutionFilesSelected.length > 0 ? "has-file" : ""}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                      aria-label={solutionFilesSelected.length > 0 ? `${solutionFilesSelected.length} file(s) selected` : 'Upload PDF'}
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
                        {solutionFilesSelected.length > 0
                          ? solutionFilesSelected.length === 1
                            ? solutionFilesSelected[0].name
                            : `${solutionFilesSelected.length} file(s) selected`
                          : 'Upload PDF'}
                      </div>
                      <input
                        id="solutionInput"
                        ref={fileInputRef}
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
          </div>

          {/* ─────────────────── Vertical Divider ─────────────────── */}
          <div className="step-four-divider"></div>

          {/* ─────────────────── Right side – Grading Results ─────────────────── */}
          <div className="step-four-right-section">
            <div className="results-column">
          <div className="results-header">
            <h2>Grading Results</h2>
            {displayOutputs.length > 0 && (
              <button className="btn primary" onClick={exportToCSV}>
                Export CSV
              </button>
            )}
          </div>

          {gradingError && (
            <div className="grading-error">{gradingError}</div>
          )}

          {displayOutputs.length ? (
            displayOutputs.map(({ filename, data }, i) => {
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

                      // Calculate percentage for color coding
                      const earnedStr = String(earned).trim();
                      const maxStr = String(max).trim();
                      const earnedNum = (earnedStr === '-' || earnedStr === '') ? 0 : parseFloat(earnedStr) || 0;
                      const maxNum = (maxStr === '-' || maxStr === '') ? 1 : parseFloat(maxStr) || 1;
                      const percentage = maxNum > 0 ? (earnedNum / maxNum) * 100 : 0;

                      const sectionKey = String(section?.section_id ?? `${idx}-${label}`);
                      return {
                        key: sectionKey,
                        label,
                        earned,
                        max,
                        comments,
                        percentage,
                      };
                    })
                    .filter((row: any) => row.label)
                : taskEntries
                ? taskEntries.map(([label, rawVal]: [string, any], idx) => {
                    const values = Array.isArray(rawVal) ? rawVal : [];
                    const earned = toScorePart(values[1]);
                    const max = toScorePart(values[0]);
                    
                    // Calculate percentage for color coding
                    const earnedStr = String(earned).trim();
                    const maxStr = String(max).trim();
                    const earnedNum = (earnedStr === '-' || earnedStr === '') ? 0 : parseFloat(earnedStr) || 0;
                    const maxNum = (maxStr === '-' || maxStr === '') ? 1 : parseFloat(maxStr) || 1;
                    const percentage = maxNum > 0 ? (earnedNum / maxNum) * 100 : 0;
                    
                    return {
                      key: `${label}-${idx}`,
                      label,
                      earned,
                      max,
                      comments: toCommentList(values[2]),
                      percentage,
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
                          <div className="rationale-cell rationale-cell--action" role="columnheader">
                            <button 
                              type="button"
                              className="edit-results-button"
                              onClick={handleToggleEditMode}
                              aria-label={isEditMode ? "Save changes" : "Edit results"}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>{isEditMode ? 'Save' : 'Edit'}</span>
                            </button>
                          </div>
                        </div>

                        {breakdownRows.map((row: { key: string; label: string; earned: string; max: string; comments: string[]; percentage: number }) => {
                          // In edit mode, use editedResults; otherwise use row data (which comes from saved displayOutputs)
                          let displayEarned = row.earned;
                          let displayMax = row.max;
                          let displayComments = row.comments;
                          
                          if (isEditMode) {
                            // Get edited values from temporary edits
                            const fileEdits = editedResults[filename] || {};
                            const typeEdits = sections ? fileEdits.sections : fileEdits.tasks;
                            const rowEdits = typeEdits?.[row.key] || {};
                            
                            displayEarned = rowEdits.earned !== undefined ? rowEdits.earned : row.earned;
                            displayMax = rowEdits.max !== undefined ? rowEdits.max : row.max;
                            displayComments = rowEdits.comments !== undefined && rowEdits.comments.length > 0 ? rowEdits.comments : row.comments;
                          }
                          
                          // Recalculate percentage for color coding
                          const earnedStr = String(displayEarned).trim();
                          const maxStr = String(displayMax).trim();
                          const earnedNum = (earnedStr === '-' || earnedStr === '') ? 0 : parseFloat(earnedStr) || 0;
                          const maxNum = (maxStr === '-' || maxStr === '') ? 1 : parseFloat(maxStr) || 1;
                          const displayPercentage = maxNum > 0 ? (earnedNum / maxNum) * 100 : 0;
                          
                          return (
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
                                {isEditMode ? (
                                  <div className="score-edit-container">
                                    <input
                                      type="number"
                                      className="score-input score-input--earned"
                                      value={displayEarned}
                                      max={displayMax !== '-' && displayMax !== '' ? parseFloat(String(displayMax)) : undefined}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow empty string for clearing, or validate numeric input
                                        if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                                          handleScoreChange(filename, row.key, sections ? 'sections' : 'tasks', 'earned', value, displayMax);
                                        }
                                      }}
                                      placeholder="Earned"
                                    />
                                    <span className="score-pill__divider">/</span>
                                    <input
                                      type="text"
                                      className="score-input score-input--max"
                                      value={displayMax}
                                      readOnly
                                      disabled
                                      placeholder="Max"
                                    />
                                  </div>
                                ) : (
                                  <span 
                                    className={`score-pill score-pill--${
                                      displayPercentage >= 80 ? 'high' :
                                      displayPercentage >= 50 ? 'medium' :
                                      displayPercentage > 0 ? 'low' : 'neutral'
                                    }`}
                                    data-percentage={displayPercentage}
                                  >
                                    {displayEarned}
                                    <span className="score-pill__divider">/</span>
                                    {displayMax}
                                  </span>
                                )}
                              </div>
                              <div
                                className="rationale-cell"
                                role="cell"
                                data-label="Comments"
                              >
                                {isEditMode ? (
                                  <div className="comment-edit-container">
                                    {displayComments.length > 0 ? (
                                      displayComments.map((line: string, idx: number) => (
                                        <textarea
                                          key={`${row.key}-comment-${idx}`}
                                          className="comment-input"
                                          value={line || ''}
                                          onChange={(e) => handleCommentChange(filename, row.key, sections ? 'sections' : 'tasks', idx, e.target.value, row.comments)}
                                          rows={2}
                                          placeholder="Enter comment..."
                                        />
                                      ))
                                    ) : (
                                      <textarea
                                        className="comment-input"
                                        value={(() => {
                                          const fileEdits = editedResults[filename] || {};
                                          const typeEdits = sections ? fileEdits.sections : fileEdits.tasks;
                                          const rowEdits = typeEdits?.[row.key];
                                          return rowEdits?.comments?.[0] || '';
                                        })()}
                                        onChange={(e) => {
                                          handleCommentChange(filename, row.key, sections ? 'sections' : 'tasks', 0, e.target.value, row.comments);
                                        }}
                                        rows={2}
                                        placeholder="Add a comment..."
                                      />
                                    )}
                                  </div>
                                ) : (
                                  displayComments.length ? (
                                    <div className="comment-list">
                                      {displayComments.map((line: string, idx: number) => (
                                        <div key={`${row.key}-comment-${idx}`} className="comment-line">
                                          <span className="comment-bullet" aria-hidden="true">•</span>
                                          <span className="comment-text">{line}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="no-comment">No comments</span>
                                  )
                                )}
                              </div>
                              <div className="rationale-cell rationale-cell--action" role="cell">
                                {/* Empty cell to match grid layout */}
                              </div>
                            </div>
                          );
                        })}
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
      </div>
    </div>
  );
};

export default StepFour;

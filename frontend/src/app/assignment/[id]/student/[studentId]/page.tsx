'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { apiFetch } from '../../../../../lib/api';
import '../../../../../styles/pages/Dashboard.css';
import '../../../../../styles/pages/AutoGradingWizard.css';

export default function StudentDetailPage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id ? parseInt(params.id as string, 10) : null;
  const studentId = params?.studentId as string;

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedResults, setEditedResults] = useState<Record<string, {
    sections?: Record<string, { earned?: string; max?: string; comments?: string[] }>;
    tasks?: Record<string, { earned?: string; max?: string; comments?: string[] }>;
    totalScore?: string;
  }>>({});
  
  // Mock grading data - in real app, this would come from API
  const mockGradingData = {
    filename: `${studentId}_submission.pdf`,
    student_id: studentId,
    total_score: 85,
    grade: 85,
    rationale: JSON.stringify({
      sections: [
        {
          section_id: 'Q1',
          section_label: 'Question 1',
          awarded_score: 18,
          max_score: 20,
          feedback: ['Good understanding of concepts', 'Minor calculation error']
        },
        {
          section_id: 'Q2',
          section_label: 'Question 2',
          awarded_score: 15,
          max_score: 20,
          feedback: ['Correct approach but incomplete solution']
        },
        {
          section_id: 'Q3',
          section_label: 'Question 3',
          awarded_score: 22,
          max_score: 25,
          feedback: ['Excellent work', 'Well-structured answer']
        },
        {
          section_id: 'Q4',
          section_label: 'Question 4',
          awarded_score: 20,
          max_score: 25,
          feedback: ['Good attempt', 'Could improve clarity']
        },
        {
          section_id: 'Q5',
          section_label: 'Question 5',
          awarded_score: 10,
          max_score: 10,
          feedback: ['Perfect answer']
        }
      ]
    })
  };

  // Check login status
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkLogin = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      setLoggedIn(isLoggedIn);
      setIsChecking(false);
      return isLoggedIn;
    };

    checkLogin();

    const onStorage = () => checkLogin();
    window.addEventListener('storage', onStorage);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('auth');
      bc.onmessage = (e) => {
        if (e?.data?.type === 'logout') {
          setLoggedIn(false);
          setIsChecking(false);
        }
        if (e?.data?.type === 'login' || e?.data?.type === 'access-updated') {
          setLoggedIn(true);
          setIsChecking(false);
        }
      };
    } catch {
      // ignore
    }

    (async () => {
      try {
        if (localStorage.getItem('refreshToken')) {
          const res = await apiFetch('/api/activity/', { method: 'POST' });
          if (res.ok) {
            setLoggedIn(true);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsChecking(false);
      }
    })();

    return () => {
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  // Show nothing while checking
  if (isChecking) {
    return <div style={{ display: 'none' }}></div>;
  }

  // Redirect to home if not logged in
  if (!loggedIn) {
    router.push('/');
    return <div style={{ display: 'none' }}></div>;
  }

  const handleBack = () => {
    if (assignmentId) {
      router.push(`/assignment/${assignmentId}`);
    } else {
      router.push('/');
    }
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleScoreChange = (filename: string, rowKey: string, type: 'sections' | 'tasks', field: 'earned' | 'max', value: string, maxValue?: string) => {
    setEditedResults(prev => {
      const fileEdits = prev[filename] || {};
      const typeEdits = type === 'sections' 
        ? (fileEdits.sections || {})
        : (fileEdits.tasks || {});
      
      const rowEdits = typeEdits[rowKey] || {};
      
      if (field === 'earned') {
        const earnedNum = value === '' ? 0 : parseFloat(value) || 0;
        const maxNum = maxValue && maxValue !== '-' ? parseFloat(maxValue) : 0;
        if (maxNum > 0 && earnedNum > maxNum) {
          return prev; // Don't update if earned exceeds max
        }
      }
      
      const updatedRowEdits = {
        ...rowEdits,
        [field]: value,
      };
      
      return {
        ...prev,
        [filename]: {
          ...fileEdits,
          [type]: {
            ...typeEdits,
            [rowKey]: updatedRowEdits,
          },
        },
      };
    });
  };

  const handleCommentChange = (filename: string, rowKey: string, type: 'sections' | 'tasks', commentIndex: number, value: string, originalComments?: string[]) => {
    setEditedResults(prev => {
      const fileEdits = prev[filename] || {};
      const typeEdits = type === 'sections' 
        ? (fileEdits.sections || {})
        : (fileEdits.tasks || {});
      
      const rowEdits = typeEdits[rowKey] || {};
      let currentComments: string[] = rowEdits.comments || [];
      
      if (!currentComments || currentComments.length === 0) {
        currentComments = originalComments ? [...originalComments] : [];
      }
      
      while (currentComments.length <= commentIndex) {
        currentComments.push('');
      }
      
      const newComments = [...currentComments];
      newComments[commentIndex] = value;
      
      return {
        ...prev,
        [filename]: {
          ...fileEdits,
          [type]: {
            ...typeEdits,
            [rowKey]: {
              ...rowEdits,
              comments: newComments,
            },
          },
        },
      };
    });
  };

  return (
    <motion.div
      className="assignment-page-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="assignment-page-header">
        <button
          onClick={handleBack}
          className="assignment-back-button"
          aria-label="Back"
        >
          <ArrowLeft size={18} strokeWidth={2} />
          <span>Back</span>
        </button>
        {assignmentId && studentId && (
          <h1 className="assignment-page-title">
            Assignment {assignmentId} - {studentId}
          </h1>
        )}
      </div>

      {/* Student Detail Content */}
      <div className="assignment-table-container" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="wizard-step-four" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="wizard-content" style={{ margin: 0, padding: 0, width: '100%', maxWidth: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="step-four-right-section" style={{ padding: '2rem', flex: 1, width: '100%', overflowY: 'auto' }}>
              <div className="results-column">
                <div className="results-header" style={{ background: 'transparent' }}>
                  <h2>Grading Results</h2>
                </div>

                {(() => {
                  const { filename, data } = { filename: mockGradingData.filename, data: mockGradingData };
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
                    <div className="grading-result-card">
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
                              // In edit mode, use editedResults; otherwise use row data
                              let displayEarned = row.earned;
                              let displayMax = row.max;
                              let displayComments = row.comments;
                              
                              if (isEditMode) {
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
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

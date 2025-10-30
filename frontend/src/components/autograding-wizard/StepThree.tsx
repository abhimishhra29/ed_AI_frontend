'use client';

import { FC, useEffect, useState } from "react";
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
    setGeneratedRubric,
  } = useAutoGradingWizard();

  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [isEditingRubric, setIsEditingRubric] = useState(false);
  const [editedRubric, setEditedRubric] = useState<any>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRubrics, setEditedRubrics] = useState<Record<string, string>>({});
  const [originalRubricBackup, setOriginalRubricBackup] = useState<any>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // Default to first question when questions are available
  useEffect(() => {
    if (!selectedQuestionId && Array.isArray(extractedQuestions) && extractedQuestions.length > 0) {
      setSelectedQuestionId(extractedQuestions[0]?.question_id || null);
    }
  }, [extractedQuestions, selectedQuestionId]);
  

  useEffect(() => {
    if (!assignmentFile) {
      setStep(2);
      return;
    }

    if (!generatedRubric && !isGeneratingRubric) {
      generateRubric();
    }
  }, [assignmentFile, generatedRubric, isGeneratingRubric, generateRubric, setStep]);

  const handleQuestionClick = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  // Calculate percentage from a level's own marks range using the upper bound as base
  // Examples: "3-4" => 75% - 100%, "5" => 100%, "0" => 0%
  const calculatePercentageFromMarks = (scoreRange: string, _maxScore: string | number): string => {
    if (!scoreRange || scoreRange === 'N/A') {
      return 'N/A';
    }

    // Range like "a-b"
    const rangeMatch = scoreRange.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
    if (rangeMatch) {
      const minScore = parseFloat(rangeMatch[1]);
      const topScore = parseFloat(rangeMatch[2]);
      if (isNaN(minScore) || isNaN(topScore) || topScore <= 0) return 'N/A';
      const minPercent = Math.round((minScore / topScore) * 100);
      return `${minPercent}% - 100%`;
    }

    // Single value like "5" or "0"
    const single = parseFloat(scoreRange);
    if (isNaN(single)) return 'N/A';
    if (single <= 0) return '0%';
    return '100%';
  };

  const handleEditRubric = (questionId: string) => {
    setIsEditingRubric(true);
    setEditingQuestionId(questionId);
    const questionRubric = getQuestionRubric(questionId);
    const plainTextRubric = formatRubricToPlainText(questionRubric);
    setEditedRubric(plainTextRubric);
  };

  const handleEditRubrics = () => {
    // Save a backup of the original rubric before editing
    if (extractedQuestions && generatedRubric && generatedRubric.rubric) {
      // Create a deep copy of the current rubric
      setOriginalRubricBackup(JSON.parse(JSON.stringify(generatedRubric)));
      setIsEditMode(true);
    }
  };

  const handleSaveAllRubrics = () => {
    // Since we're directly updating generatedRubric in the new edit mode,
    // we just need to exit edit mode. The changes are already saved in state.
    setIsEditMode(false);
    setEditedRubrics({});
    setOriginalRubricBackup(null);
  };

  const handleCancelAllEditing = () => {
    // Restore the original rubric from backup
    if (originalRubricBackup) {
      setGeneratedRubric(JSON.parse(JSON.stringify(originalRubricBackup)));
    }
    setIsEditMode(false);
    setEditedRubrics({});
    setOriginalRubricBackup(null);
  };

  const handleSaveRubric = () => {
    if (editingQuestionId && editedRubric) {
      // Get the original rubric to preserve all its structure
      const originalRubric = getQuestionRubric(editingQuestionId);
      
      if (originalRubric) {
        // Convert plain text back to JSON format
        const parsedRubric = parsePlainTextToRubricImproved(editedRubric);
        
        // Preserve ALL original fields and only update the parsed content
        const updatedRubric = {
          ...originalRubric, // Keep all original fields (canonical_id, subquestion_id, etc.)
          ...parsedRubric,   // Override with parsed content
          question_id: editingQuestionId // Ensure question_id is preserved
        };
        
        // Update the specific question's rubric in the generated rubric
        const updatedGeneratedRubric = { ...generatedRubric };
        const rubricIndex = updatedGeneratedRubric.rubric.findIndex((item: any) => item.question_id === editingQuestionId);
        if (rubricIndex !== -1) {
          updatedGeneratedRubric.rubric[rubricIndex] = updatedRubric;
          setGeneratedRubric(updatedGeneratedRubric);
        }
      }
    }
    setIsEditingRubric(false);
    setEditedRubric(null);
    setEditingQuestionId(null);
  };

  const handleCancelEdit = () => {
    setIsEditingRubric(false);
    setEditedRubric(null);
    setEditingQuestionId(null);
  };

  const formatRubricToPlainText = (rubricItem: any) => {
    if (!rubricItem) return "No rubric data available.";
    
    // Debug: Log the actual structure (remove in production)
    // console.log("Raw rubric item:", rubricItem);
    // console.log("Rubric item keys:", Object.keys(rubricItem));
    // console.log("Rubric item values:", Object.values(rubricItem));
    // console.log("Full rubric structure:", JSON.stringify(rubricItem, null, 2));

    let text = "";

    // Add title if available
    if (rubricItem.title) {
      text += `Title: ${rubricItem.title}\n\n`;
    }

    // Handle AI-generated rubric structure with subsections and performance_levels
    if (rubricItem.subsections && Array.isArray(rubricItem.subsections)) {
      text += "Grading Criteria:\n";
      
      rubricItem.subsections.forEach((subsection: any, sectionIndex: number) => {
        // Use label, title, or canonical_id for subsection name
        const subsectionName = subsection.label || subsection.title || subsection.canonical_id || `Section ${sectionIndex + 1}`;
        if (subsectionName) {
          text += `\n${subsectionName}:\n`;
        }
        
        // Add subsection ID and max score
        const subsectionId = subsection.canonical_id || subsection.subquestion_id || 'N/A';
        const subsectionMaxScore = subsection.max_score || 'N/A';
        if (subsectionId !== 'N/A' || subsectionMaxScore !== 'N/A') {
          text += `Subsection ID: ${subsectionId}, Max Score: ${subsectionMaxScore}\n`;
        }
        
        if (subsection.performance_levels && Array.isArray(subsection.performance_levels)) {
          subsection.performance_levels.forEach((level: any, levelIndex: number) => {
            const levelName = level.level || level.name || level.title || `Level ${levelIndex + 1}`;
            const score = level.score_range || level.score || level.points || level.value;
            const threshold = level.threshold || level.percentage || 'N/A';
            const description = level.description || level.criteria || level.text || 'No description provided';
            const scoreText = score ? ` (${score} points)` : '';
            const thresholdText = threshold && threshold !== 'N/A' ? ` [Threshold: ${threshold}]` : '';
            text += `• ${levelName}${scoreText}${thresholdText}: ${description}\n`;
          });
        }
        
        // Add subsection-level deductions/penalties
        const subsectionDeductions = subsection.deductions || subsection.penalties;
        if (subsectionDeductions && Array.isArray(subsectionDeductions) && subsectionDeductions.length > 0) {
          text += `\n  Deductions:\n`;
          subsectionDeductions.forEach((deduction: any) => {
            const area = deduction.reason || deduction.area || deduction.category || 'Deduction';
            const penalty = deduction.penalty || deduction.amount || deduction.score || '-1 point';
            const description = deduction.description || deduction.text || 'No description provided';
            text += `  • ${area} (${penalty}): ${description}\n`;
          });
        }
      });
      text += "\n";
    }

    // Add max score if available (try multiple possible keys)
    const maxScore = rubricItem.max_score || rubricItem.maxScore || rubricItem.total_points || rubricItem.maximum_score || rubricItem.totalScore;
    if (maxScore) {
      text += `Maximum Score: ${maxScore} points\n\n`;
    }

    // Add deductions if available (try multiple possible keys)
    const deductions = rubricItem.deductions || rubricItem.penalties || rubricItem.deduction_rules || rubricItem.penalty_rules;
    if (deductions && Array.isArray(deductions) && deductions.length > 0) {
      text += "Deductions:\n";
      deductions.forEach((deduction: any) => {
        const area = deduction.area || deduction.category || deduction.type || deduction.name || deduction.title || 'General';
        const penalty = deduction.penalty || deduction.amount || deduction.score || deduction.points || deduction.value || '-1 point';
        const description = deduction.description || deduction.reason || deduction.text || deduction.details || deduction;
        text += `• ${area} (${penalty}): ${description}\n`;
      });
      text += "\n";
    }

    // Fallback: try other possible structures
    if (text === "" || text.trim() === "Title:") {
      // Try legacy criteria structure
      const criteria = rubricItem.criteria || rubricItem.grading_criteria || rubricItem.levels || rubricItem.rubric_criteria || rubricItem.scoring_criteria;
      if (criteria && Array.isArray(criteria) && criteria.length > 0) {
        text += "Grading Criteria:\n";
        criteria.forEach((criterion: any, index: number) => {
          const level = criterion.level || criterion.range || criterion.grade || criterion.name || criterion.title || `Level ${index + 1}`;
          const score = criterion.score || criterion.points || criterion.value || criterion.max_score;
          const scoreText = score ? ` (${score} points)` : '';
          const description = criterion.description || criterion.text || criterion.criteria || criterion.details || 'No description provided';
          text += `• ${level}${scoreText}: ${description}\n`;
        });
        text += "\n";
      }

      // Add description if available (try multiple possible keys)
      const description = rubricItem.description || rubricItem.desc || rubricItem.summary || rubricItem.overview || rubricItem.intro;
      if (description) {
        text += `Description: ${description}\n\n`;
      }
    }

    // If still no structured data, convert JSON to readable text
    if (text === "" || text.trim() === "Title:") {
      // console.log("No structured data found, converting JSON to plain text");
      text = convertJsonToPlainText(rubricItem);
    }

    return text.trim();
  };

  const convertJsonToPlainText = (obj: any, indent = 0): string => {
    if (obj === null || obj === undefined) return "";
    
    if (typeof obj === "string") return obj;
    if (typeof obj === "number" || typeof obj === "boolean") return obj.toString();
    
    if (Array.isArray(obj)) {
      return obj.map((item, index) => {
        const prefix = `${index + 1}. `;
        return prefix + convertJsonToPlainText(item, indent + 1);
      }).join("\n");
    }
    
    if (typeof obj === "object") {
      let result = "";
      for (const [key, value] of Object.entries(obj)) {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (typeof value === "object" && value !== null) {
          result += `${formattedKey}:\n${convertJsonToPlainText(value, indent + 1)}\n`;
        } else {
          result += `${formattedKey}: ${value}\n`;
        }
      }
      return result;
    }
    
    return obj.toString();
  };


  const parsePlainTextToRubricImproved = (plainText: string): any => {
    const lines = plainText.split('\n').filter(line => line.trim() !== '');
    const rubric: any = {};
    
    let currentSection = '';
    let criteria: any[] = [];
    let deductions: any[] = [];
    let subsections: any[] = [];
    let currentSubsection: any = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('Title:')) {
        rubric.title = trimmedLine.replace('Title:', '').trim();
      } else if (trimmedLine.startsWith('Description:')) {
        rubric.description = trimmedLine.replace('Description:', '').trim();
      } else if (trimmedLine.startsWith('Grading Criteria:')) {
        currentSection = 'criteria';
        criteria = [];
      } else if (trimmedLine.startsWith('Maximum Score:')) {
        const scoreMatch = trimmedLine.match(/(\d+)/);
        if (scoreMatch) {
          rubric.max_score = parseInt(scoreMatch[1]);
        }
        currentSection = '';
      } else if (trimmedLine.startsWith('Deductions:') && currentSection !== 'subsection' && currentSection !== 'subsection-deductions') {
        // Global deductions (not within a subsection)
        currentSection = 'deductions';
        deductions = [];
      } else if (trimmedLine.startsWith('•') && currentSection === 'criteria') {
        const criterionText = trimmedLine.replace('•', '').trim();
        const scoreMatch = criterionText.match(/\((\d+(?:\.\d+)?)\s*points?\)/);
        const levelMatch = criterionText.match(/^([^(]+)/);
        
        if (levelMatch) {
          const level = levelMatch[1].trim();
          const description = criterionText.replace(/^[^(]+\([^)]*\):\s*/, '').trim();
          
          criteria.push({
            level: level,
            score: scoreMatch ? parseFloat(scoreMatch[1]) : null,
            description: description
          });
        }
      } else if (trimmedLine.startsWith('•') && currentSection === 'deductions') {
        const deductionText = trimmedLine.replace('•', '').trim();
        const penaltyMatch = deductionText.match(/\(([^)]+)\)/);
        const areaMatch = deductionText.match(/^([^(]+)/);
        
        if (areaMatch) {
          const area = areaMatch[1].trim();
          const description = deductionText.replace(/^[^(]+\([^)]*\):\s*/, '').trim();
          
          deductions.push({
            area: area,
            penalty: penaltyMatch ? penaltyMatch[1] : '-1 point',
            description: description
          });
        }
      } else if (trimmedLine.toLowerCase().startsWith('deductions:') && currentSection === 'subsection' && currentSubsection) {
        // Handle subsection Deductions: header
        if (!currentSubsection.deductions) {
          currentSubsection.deductions = [];
        }
        currentSection = 'subsection-deductions';
      } else if (trimmedLine.toLowerCase().startsWith('subsection id:') && currentSection === 'subsection' && currentSubsection) {
        // Parse Subsection ID and Max Score line
        const idMatch = trimmedLine.match(/subsection id:\s*([^,]+)/i);
        const scoreMatch = trimmedLine.match(/max score:\s*([^,]+)/i);
        if (idMatch) currentSubsection.canonical_id = idMatch[1].trim();
        if (scoreMatch && scoreMatch[1].trim() !== 'N/A') {
          currentSubsection.max_score = parseFloat(scoreMatch[1].trim());
        }
      } else if (trimmedLine.endsWith(':') && !trimmedLine.startsWith('•') && trimmedLine.split(':').length === 2 && !trimmedLine.toLowerCase().includes('deductions')) {
        // This is likely a subsection title
        if (currentSubsection) {
          subsections.push(currentSubsection);
        }
        const subsectionName = trimmedLine.replace(':', '').trim();
        currentSubsection = {
          label: subsectionName,
          title: subsectionName,
          performance_levels: []
        };
        currentSection = 'subsection';
      } else if (trimmedLine.startsWith('•') && currentSection === 'subsection' && currentSubsection) {
        const criterionText = trimmedLine.replace('•', '').trim();
        // Updated regex to handle both single numbers and ranges (e.g., "5", "3-4", "1.5-2.5")
        const scoreMatch = criterionText.match(/\(([^)]+)\s*points?\)/);
        const levelMatch = criterionText.match(/^([^(]+)/);
        
        if (levelMatch) {
          const level = levelMatch[1].trim();
          
          // Extract threshold if present [Threshold: 90% - 100%]
          const thresholdMatch = criterionText.match(/\[threshold:\s*([^\]]+)\]/i);
          const threshold = thresholdMatch ? thresholdMatch[1].trim() : null;
          
          // Extract description (everything after the last ] or after points)
          let description = criterionText;
          if (thresholdMatch) {
            // Remove threshold part to get description
            description = criterionText.replace(/\[threshold:[^\]]+\]/i, '').replace(/^[^(]+\([^)]*\):/, '').trim();
          } else {
            description = criterionText.replace(/^[^(]+\([^)]*\):\s*/, '').trim();
          }
          
          // Extract score range (could be "5", "3-4", etc.)
          let scoreValue = null;
          let scoreRange = null;
          
          if (scoreMatch) {
            const scoreText = scoreMatch[1].trim();
            scoreRange = scoreText;
            // Try to parse as single number first
            const singleNum = scoreText.match(/^(\d+(?:\.\d+)?)$/);
            if (singleNum) {
              scoreValue = parseFloat(singleNum[1]);
            } else {
              // For ranges like "3-4", use null as score (range representation)
              scoreValue = null;
            }
          }
          
          currentSubsection.performance_levels.push({
            level: level,
            name: level,
            score_range: scoreRange,
            score: scoreValue,
            threshold: threshold,
            description: description
          });
        }
      } else if (trimmedLine.startsWith('•') && currentSection === 'subsection-deductions' && currentSubsection) {
        const deductionText = trimmedLine.replace('•', '').trim();
        const penaltyMatch = deductionText.match(/\(([^)]+)\)/);
        const areaMatch = deductionText.match(/^([^(]+)/);
        
        if (areaMatch && penaltyMatch && currentSubsection.deductions) {
          const area = areaMatch[1].trim();
          const description = deductionText.replace(/^[^(]+\([^)]*\):\s*/, '').trim();
          
          currentSubsection.deductions.push({
            reason: area,
            area: area,
            penalty: penaltyMatch[1],
            description: description
          });
        }
      }
    }
    
    // Add the last subsection if it exists
    if (currentSubsection) {
      subsections.push(currentSubsection);
    }
    
    if (subsections.length > 0) {
      rubric.subsections = subsections;
    } else if (criteria.length > 0) {
      rubric.criteria = criteria;
    }
    if (deductions.length > 0) {
      rubric.deductions = deductions;
    }
    
    return rubric;
  };

  const getQuestionRubric = (questionId: string) => {
    if (!generatedRubric || !generatedRubric.rubric) return null;
    
    // Debug logs (remove in production)
    // console.log(`Looking for rubric for question ID: ${questionId}`);
    // console.log(`Available rubric question IDs:`, generatedRubric.rubric.map((item: any) => item.question_id));
    
    const rubricItem = generatedRubric.rubric.find((item: any) => item.question_id === questionId);
    // console.log(`Found rubric item:`, rubricItem);
    
    return rubricItem;
  };

  const formatRubricForDisplay = (rubricItem: any) => {
    if (!rubricItem) return null;
    
    // Debug logs (remove in production)
    // console.log('Raw rubric item:', rubricItem);
    
    // Extract the actual AI-generated criteria
    const scoreRanges = [];
    
    // console.log('Score ranges found:', scoreRanges.length);
    
    // Handle AI-generated rubric structure with subsections and performance_levels
    if (rubricItem.subsections && Array.isArray(rubricItem.subsections)) {
      // console.log('Found subsections structure');
      // console.log('Number of subsections:', rubricItem.subsections.length);
      
      rubricItem.subsections.forEach((subsection: any, index: number) => {
        // console.log(`Subsection ${index}:`, subsection);
        // console.log('Has performance_levels:', !!subsection.performance_levels);
        // console.log('Performance levels array:', subsection.performance_levels);
        
        if (subsection.performance_levels && Array.isArray(subsection.performance_levels)) {
          // console.log('Processing performance levels:', subsection.performance_levels.length);
          
          subsection.performance_levels.forEach((level: any, levelIndex: number) => {
            // console.log(`Level ${levelIndex}:`, level);
            
            const levelName = level.level || level.name || level.title || `Level ${scoreRanges.length + 1}`;
            const scoreRange = level.score_range || level.score || level.points || level.value;
            const description = level.description || level.criteria || level.text || 'No description provided';
            
            // console.log('Extracted:', { levelName, scoreRange, description });
            
            scoreRanges.push({
              range: levelName,
              description: description,
              score: scoreRange
            });
          });
        } else {
          // console.log('No performance_levels found in subsection');
        }
      });
      
      // console.log('Total score ranges after processing subsections:', scoreRanges.length);
    }
    // Try different possible structures from AI response
    else if (rubricItem.criteria && Array.isArray(rubricItem.criteria)) {
      // console.log('Found criteria structure');
      // console.log('Number of criteria:', rubricItem.criteria.length);
      
      // Structure: { criteria: [{ level: "9-10", description: "...", score: 10 }] }
      rubricItem.criteria.forEach((criterion: any, index: number) => {
        // console.log(`Criterion ${index}:`, criterion);
        
        const range = criterion.level || criterion.score_range || criterion.grade || `Level ${scoreRanges.length + 1}`;
        const description = criterion.description || criterion.criteria || criterion.text || criterion.details;
        const score = criterion.score || criterion.points || criterion.max_score;
        
        // console.log('Extracted criterion:', { range, description, score });
        
        scoreRanges.push({
          range: range,
          description: description,
          score: score
        });
      });
      
      // console.log('Total score ranges after processing criteria:', scoreRanges.length);
    } else if (rubricItem.grading_criteria && Array.isArray(rubricItem.grading_criteria)) {
      // Structure: { grading_criteria: [...] }
      rubricItem.grading_criteria.forEach((criterion: any) => {
        scoreRanges.push({
          range: criterion.level || criterion.score_range || criterion.grade,
          description: criterion.description || criterion.criteria || criterion.text,
          score: criterion.score || criterion.points
        });
      });
    } else if (rubricItem.score_bands && Array.isArray(rubricItem.score_bands)) {
      // Structure: { score_bands: [...] }
      rubricItem.score_bands.forEach((band: any) => {
        scoreRanges.push({
          range: band.range || band.level || band.score_range,
          description: band.description || band.criteria || band.text,
          score: band.score || band.points || band.max_score
        });
      });
    } else if (rubricItem.levels && Array.isArray(rubricItem.levels)) {
      // Structure: { levels: [...] }
      rubricItem.levels.forEach((level: any) => {
        scoreRanges.push({
          range: level.level || level.range || level.score_range,
          description: level.description || level.criteria || level.text,
          score: level.score || level.points
        });
      });
    } else if (rubricItem.description) {
      // Try to parse from description text
      const desc = rubricItem.description;
      
      // Look for patterns like "9-10 marks if:", "A+ if:", etc.
      const patterns = [
        /(\d+(?:\.\d+)?)\s*to\s*(\d+(?:\.\d+)?)\s*marks?\s*if:?\s*([^0-9]+?)(?=\d+\s*to|\d+\s*marks?|$)/gi,
        /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*marks?\s*if:?\s*([^0-9]+?)(?=\d+\s*-\s*\d+\s*marks?|$)/gi,
        /(\d+(?:\.\d+)?)\s*to\s*(\d+(?:\.\d+)?)\s*if:?\s*([^0-9]+?)(?=\d+\s*to|$)/gi,
        /([A-F][+-]?)\s*if:?\s*([^A-F]+?)(?=[A-F][+-]?|$)/gi
      ];
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(desc)) !== null) {
          const range = match[2] ? `${match[1]}-${match[2]}` : match[1];
          const description = match[3] || match[2];
          scoreRanges.push({
            range: range,
            description: description.trim(),
            score: match[2] ? parseFloat(match[2]) : parseFloat(match[1])
          });
        }
      });
    }
    
    // If still no ranges found, try to extract from other fields
    if (scoreRanges.length === 0) {
      // Check for nested structures
      const possibleFields = ['rubric', 'criteria', 'grading', 'assessment', 'evaluation'];
      possibleFields.forEach(field => {
        if (rubricItem[field] && Array.isArray(rubricItem[field])) {
          rubricItem[field].forEach((item: any) => {
            if (item.level || item.range || item.score_range) {
              scoreRanges.push({
                range: item.level || item.range || item.score_range,
                description: item.description || item.criteria || item.text,
                score: item.score || item.points
              });
            }
          });
        }
      });
    }
    
    // If still no ranges found, try to parse the entire rubric structure
    if (scoreRanges.length === 0) {
      // Look for any field that might contain the rubric data
      Object.keys(rubricItem).forEach(key => {
        const value = rubricItem[key];
        if (typeof value === 'string' && value.length > 50) {
          // Try to parse long text fields for rubric content
          const textPatterns = [
            /(\d+(?:\.\d+)?)\s*to\s*(\d+(?:\.\d+)?)\s*marks?\s*if:?\s*([^0-9]+?)(?=\d+\s*to|\d+\s*marks?|$)/gi,
            /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*marks?\s*if:?\s*([^0-9]+?)(?=\d+\s*-\s*\d+\s*marks?|$)/gi,
            /(\d+(?:\.\d+)?)\s*to\s*(\d+(?:\.\d+)?)\s*if:?\s*([^0-9]+?)(?=\d+\s*to|$)/gi
          ];
          
          textPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(value)) !== null) {
              const range = match[2] ? `${match[1]}-${match[2]}` : match[1];
              const description = match[3] || match[2];
              scoreRanges.push({
                range: range,
                description: description.trim(),
                score: match[2] ? parseFloat(match[2]) : parseFloat(match[1])
              });
            }
          });
        }
      });
    }
    
    // Only create generic ranges as absolute last resort
    if (scoreRanges.length === 0 && rubricItem.max_score) {
      // console.warn('No AI-generated rubric criteria found, using generic ranges');
      const maxScore = rubricItem.max_score;
      const ranges = [
        { range: `${maxScore * 0.9}-${maxScore}`, description: 'Excellent performance', score: maxScore },
        { range: `${maxScore * 0.7}-${maxScore * 0.89}`, description: 'Good performance', score: maxScore * 0.8 },
        { range: `${maxScore * 0.4}-${maxScore * 0.69}`, description: 'Fair performance', score: maxScore * 0.5 },
        { range: `Below ${maxScore * 0.4}`, description: 'Needs improvement', score: maxScore * 0.3 }
      ];
      scoreRanges.push(...ranges);
    }
    
    // Parse deductions with area information
    const deductions: any[] = [];
    const rawDeductions = rubricItem.deductions || rubricItem.penalties || [];
    
    if (Array.isArray(rawDeductions)) {
      rawDeductions.forEach(deduction => {
        if (typeof deduction === 'string') {
          // Parse string deductions like "-1 mark per missing component"
          const penaltyMatch = deduction.match(/(-?\d+(?:\.\d+)?)\s*(mark|point|score)/i);
          const areaMatch = deduction.match(/per\s+(.+?)(?:\s|$)/i);
          
          deductions.push({
            area: areaMatch ? areaMatch[1] : 'General',
            penalty: penaltyMatch ? `${penaltyMatch[1]} ${penaltyMatch[2]}${penaltyMatch[1] !== '1' ? 's' : ''}` : '-1 mark',
            description: deduction,
            examples: deduction.includes('example') ? deduction.split('example')[1] : null
          });
        } else if (typeof deduction === 'object') {
          deductions.push({
            area: deduction.area || deduction.category || deduction.type || 'General',
            penalty: deduction.penalty || deduction.amount || deduction.score || '-1 mark',
            description: deduction.description || deduction.reason || deduction.text || 'Penalty applied',
            examples: deduction.examples || deduction.example || null
          });
        }
      });
    }
    
    // Debug log (remove in production)
    // console.log('Final formatted rubric:', {
    //   title: rubricItem.title || rubricItem.question_id || rubricItem.name,
    //   maxScore: rubricItem.max_score || rubricItem.total_score || 10,
    //   scoreRanges: scoreRanges,
    //   deductions: deductions
    // });
    
    return {
      title: rubricItem.title || rubricItem.question_id || rubricItem.name,
      maxScore: rubricItem.max_score || rubricItem.total_score || 10,
      scoreRanges: scoreRanges,
      description: rubricItem.description || rubricItem.overview || '',
      deductions: deductions
    };
  };

  return (
    <div className="wizard-step wizard-step-three">
      <div className="wizard-content">
        <div className="assignment-details-box">
        </div>

        <div className="questions-section">
          {rubricGenerationError && (
            <div className="validation-error">{rubricGenerationError}</div>
          )}

          {isGeneratingRubric && (
            <div className="loading-indicator">Generating rubric…</div>
          )}

          {!isGeneratingRubric && extractedQuestions && (
            <div className="question-preview">
              <div className="questions-header-row">
                <h3>Detected Questions</h3>
                {isEditMode ? (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      type="button" 
                      className="edit-rubric-button"
                      onClick={handleSaveAllRubrics}
                    >
                      Save All Changes
                    </button>
                    <button 
                      type="button" 
                      className="edit-rubric-button"
                      onClick={handleCancelAllEditing}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className="edit-rubric-button"
                    onClick={handleEditRubrics}
                  >
                    Edit Rubrics
                  </button>
                )}
              </div>
              <div className="questions-container">
                <aside className="side-nav">
                  <ul className="side-nav-list">
                    {Array.isArray(extractedQuestions) && extractedQuestions.length > 0 ? (
                      extractedQuestions.map((q: any, idx: number) => {
                        const id = q.question_id || `Q${idx + 1}`;
                        const isActive = selectedQuestionId === id;
                        const fullTitle = ((q.title || q.prompt || '').replace(/^:\s*/, '')).trim();
                        const words = fullTitle.split(/\s+/).filter(Boolean);
                        const truncated = words.length > 1 ? `${words[0]}...` : (words[0] || '');
                  return (
                          <li
                            key={id}
                            className={`side-nav-item${isActive ? ' active' : ''}`}
                            onClick={() => setSelectedQuestionId(id)}
                            title={fullTitle}
                          >
                            {(id.endsWith(':') ? id : `${id}:`)} {truncated}
                          </li>
                        );
                      })
                    ) : (
                      <li className="side-nav-item">No questions detected</li>
                    )}
                  </ul>
                </aside>
                <div className="side-nav-content">
                  {selectedQuestionId ? (
                    (() => {
                      const rubricItem = getQuestionRubric(selectedQuestionId);
                      const selectedQuestion = Array.isArray(extractedQuestions)
                        ? extractedQuestions.find((q: any) => (q.question_id || '') === selectedQuestionId)
                        : null;
                      const fullQuestionText = selectedQuestion
                        ? `${selectedQuestion.question_id?.endsWith(':') ? selectedQuestion.question_id : `${selectedQuestion.question_id}:`} ${(selectedQuestion.title || selectedQuestion.prompt || '').replace(/^:\s*/, '')}`.trim()
                        : selectedQuestionId;
                      if (!rubricItem) {
                        return <div className="no-rubric-data"><em>No rubric data available for this question.</em></div>;
                      }
                      return (
                        <div className="structured-rubric">
                          <h3 style={{ marginTop: 0 }}>{fullQuestionText}</h3>
                          {isEditMode ? (
                            <div className="structured-rubric edit-mode">
                              {rubricItem.subsections && rubricItem.subsections.length > 0 && (
                                <div className="subsections">
                                  <h4>Subsections:</h4>
                                  {rubricItem.subsections.map((subsection: any, index: number) => (
                                    <div key={index} className="subsection">
                                      <div className="subsection-header">
                                        <strong className="subsection-label">
                                          {subsection.label || subsection.title || `Subsection ${index + 1}`}
                                        </strong>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                          <input
                                            type="text"
                                            className="editable-field subsection-id"
                                            value={(subsection.canonical_id ?? subsection.subquestion_id ?? '') + ''}
                                            placeholder="N/A"
                                            onChange={(e) => {
                                              const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                              const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                              if (rubricIndex !== -1) {
                                                updatedRubric.rubric[rubricIndex].subsections[index].canonical_id = e.target.value;
                                                updatedRubric.rubric[rubricIndex].subsections[index].subquestion_id = e.target.value;
                                                setGeneratedRubric(updatedRubric);
                                              }
                                            }}
                                          />
                                          <input
                                            type="text"
                                            className="editable-field subsection-score"
                                            value={
                                              (subsection.max_score === undefined || subsection.max_score === null)
                                                ? ''
                                                : String(subsection.max_score)
                                            }
                                            placeholder="N/A"
                                            onChange={(e) => {
                                              const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                              const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                              if (rubricIndex !== -1) {
                                                updatedRubric.rubric[rubricIndex].subsections[index].max_score = e.target.value;
                                                const newMaxScore = e.target.value;
                                                if (updatedRubric.rubric[rubricIndex].subsections[index].performance_levels) {
                                                  updatedRubric.rubric[rubricIndex].subsections[index].performance_levels.forEach((level: any) => {
                                                    if (level.score_range) {
                                                      const calculatedPercentage = calculatePercentageFromMarks(level.score_range, newMaxScore);
                                                      level.threshold = calculatedPercentage;
                                                    }
                                                  });
                                                }
                                                setGeneratedRubric(updatedRubric);
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                      {subsection.performance_levels && subsection.performance_levels.length > 0 && (
                                        <div className="performance-levels">
                                          <h5>Performance Levels:</h5>
                                          {subsection.performance_levels.map((level: any, levelIndex: number) => (
                                            <div key={levelIndex} className="performance-level">
                                              <div className="level-header">
                                                <strong className="level-name">
                                                  {level.level || level.name || `Level ${levelIndex + 1}`}
                                                </strong>
                                                <input
                                                  type="text"
                                                  className="editable-field score-range"
                                                  value={(level.score_range ?? '') + ''}
                                                  placeholder="N/A"
                                                  onChange={(e) => {
                                                    const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                                    const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                                    if (rubricIndex !== -1) {
                                                      updatedRubric.rubric[rubricIndex].subsections[index].performance_levels[levelIndex].score_range = e.target.value;
                                                      const maxScore = subsection.max_score;
                                                      const calculatedPercentage = calculatePercentageFromMarks(e.target.value, maxScore);
                                                      updatedRubric.rubric[rubricIndex].subsections[index].performance_levels[levelIndex].threshold = calculatedPercentage;
                                                      setGeneratedRubric(updatedRubric);
                                                    }
                                                  }}
                                                />
                                                <input
                                                  type="text"
                                                  className="editable-field threshold"
                                                  value={(level.threshold ?? '') + ''}
                                                  placeholder="N/A"
                                                  onChange={(e) => {
                                                    const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                                    const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                                    if (rubricIndex !== -1) {
                                                      updatedRubric.rubric[rubricIndex].subsections[index].performance_levels[levelIndex].threshold = e.target.value;
                                                      setGeneratedRubric(updatedRubric);
                                                    }
                                                  }}
                                                />
                                              </div>
                                              <textarea
                                                className="editable-field level-description"
                                                value={(() => {
                                                  let desc = level.description || 'No description provided';
                                                  const levelName = level.level || level.name || '';
                                                  const scoreRange = level.score_range || '';
                                                  const pattern = new RegExp(`^${levelName}\\s*\\([^)]+\\)\\s*:\\s*`, 'gi');
                                                  let cleaned = desc;
                                                  while (cleaned.match(pattern)) {
                                                    const before = cleaned;
                                                    cleaned = cleaned.replace(pattern, '');
                                                    if (before === cleaned) break;
                                                  }
                                                  return cleaned;
                                                })()}
                                                onChange={(e) => {
                                                  const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                                  const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                                  if (rubricIndex !== -1) {
                                                    updatedRubric.rubric[rubricIndex].subsections[index].performance_levels[levelIndex].description = e.target.value;
                                                    setGeneratedRubric(updatedRubric);
                                                  }
                                                }}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {subsection.deductions && subsection.deductions.length > 0 && (
                                        <div className="deductions">
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <h5 style={{ margin: 0 }}>Deductions:</h5>
                                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                                              <button
                                                type="button"
                                                className="edit-rubric-button penalty-action"
                                                onClick={() => {
                                                  const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                                  const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                                  if (rubricIndex !== -1) {
                                                    if (!updatedRubric.rubric[rubricIndex].subsections[index].deductions) {
                                                      updatedRubric.rubric[rubricIndex].subsections[index].deductions = [];
                                                    }
                                                    updatedRubric.rubric[rubricIndex].subsections[index].deductions.push({
                                                      reason: 'Deduction',
                                                      penalty: '',
                                                      description: ''
                                                    });
                                                    setGeneratedRubric(updatedRubric);
                                                  }
                                                }}
                                              >
                                                + Add Penalty
                                              </button>
                                            </div>
                                          </div>
                                          {subsection.deductions.map((deduction: any, deductionIndex: number) => (
                                            <div key={deductionIndex} className="deduction">
                                              <input
                                                type="text"
                                                className="editable-field deduction-name"
                                                value={(deduction.reason ?? deduction.area ?? '') + ''}
                                                placeholder="Deduction"
                                                onChange={(e) => {
                                                  const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                                  const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                                  if (rubricIndex !== -1) {
                                                    updatedRubric.rubric[rubricIndex].subsections[index].deductions[deductionIndex].reason = e.target.value;
                                                    updatedRubric.rubric[rubricIndex].subsections[index].deductions[deductionIndex].area = e.target.value;
                                                    setGeneratedRubric(updatedRubric);
                                                  }
                                                }}
                                              />
                                              <input
                                                type="text"
                                                className="editable-field penalty"
                                                value={(deduction.penalty ?? '') + ''}
                                                placeholder="N/A"
                                                onChange={(e) => {
                                                  const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                                  const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                                  if (rubricIndex !== -1) {
                                                    const input = e.target.value.trim();
                                                    // If user explicitly sets 0, remove the deduction row
                                                    const numeric = parseFloat(input);
                                                    if (input !== '' && !isNaN(numeric) && numeric === 0) {
                                                      updatedRubric.rubric[rubricIndex].subsections[index].deductions.splice(deductionIndex, 1);
                                                    } else {
                                                      updatedRubric.rubric[rubricIndex].subsections[index].deductions[deductionIndex].penalty = e.target.value;
                                                    }
                                                    setGeneratedRubric(updatedRubric);
                                                  }
                                                }}
                                              />
                                              {/* description intentionally removed */}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {rubricItem.deductions && rubricItem.deductions.length > 0 && (
                                <div className="global-deductions">
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <h4 style={{ margin: 0 }}>Global Deductions:</h4>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <button
                                        type="button"
                                        className="edit-rubric-button penalty-action"
                                        onClick={() => {
                                          const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                          const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                          if (rubricIndex !== -1) {
                                            if (!updatedRubric.rubric[rubricIndex].deductions) {
                                              updatedRubric.rubric[rubricIndex].deductions = [];
                                            }
                                            updatedRubric.rubric[rubricIndex].deductions.push({
                                              area: 'Deduction',
                                              penalty: '',
                                              description: ''
                                            });
                                            setGeneratedRubric(updatedRubric);
                                          }
                                        }}
                                      >
                                        + Add Penalty
                                      </button>
                                    </div>
                                  </div>
                                  {rubricItem.deductions.map((deduction: any, index: number) => (
                                    <div key={index} className="deduction">
                                      <input
                                        type="text"
                                        className="editable-field deduction-name"
                                        value={(deduction.area ?? deduction.reason ?? '') + ''}
                                        placeholder="Deduction"
                                        onChange={(e) => {
                                          const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                          const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                          if (rubricIndex !== -1) {
                                            updatedRubric.rubric[rubricIndex].deductions[index].area = e.target.value;
                                            updatedRubric.rubric[rubricIndex].deductions[index].reason = e.target.value;
                                            setGeneratedRubric(updatedRubric);
                                          }
                                        }}
                                      />
                                      <input
                                        type="text"
                                        className="editable-field penalty"
                                        value={(deduction.penalty ?? '') + ''}
                                        placeholder="N/A"
                                        onChange={(e) => {
                                          const updatedRubric = JSON.parse(JSON.stringify(generatedRubric));
                                          const rubricIndex = updatedRubric.rubric.findIndex((item: any) => item.question_id === selectedQuestionId);
                                          if (rubricIndex !== -1) {
                                            const input = e.target.value.trim();
                                            const numeric = parseFloat(input);
                                            if (input !== '' && !isNaN(numeric) && numeric === 0) {
                                              updatedRubric.rubric[rubricIndex].deductions.splice(index, 1);
                                            } else {
                                              updatedRubric.rubric[rubricIndex].deductions[index].penalty = e.target.value;
                                            }
                                            setGeneratedRubric(updatedRubric);
                                          }
                                        }}
                                      />
                                      {/* description intentionally removed */}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              {rubricItem.subsections && rubricItem.subsections.length > 0 && (
                                    <div className="subsections">
                                  <h4>Subsections:</h4>
                                  {rubricItem.subsections.map((subsection: any, index: number) => (
                                    <div key={index} className="subsection">
                                      <div className="subsection-header">
                                        <strong>{subsection.label || subsection.title || `Subsection ${index + 1}`}</strong>
                                        <span className="subsection-id">ID: {subsection.canonical_id || subsection.subquestion_id || 'N/A'}</span>
                                        <span className="subsection-score">Max Score: {subsection.max_score || 'N/A'}</span>
                                      </div>
                                      {subsection.performance_levels && subsection.performance_levels.length > 0 && (
                                        <div className="performance-levels">
                                          <h5>Performance Levels:</h5>
                                          <div className="performance-levels-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', marginBottom: '0.5rem', gap: '1rem' }}>
                                            <span style={{ flex: 1 }}></span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#213342', width: '80px', textAlign: 'center', flexShrink: 0 }}>Marks</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#213342', width: '120px', minWidth: '120px', textAlign: 'center', flexShrink: 0 }}>Percentage</span>
                                            <span></span>
                                          </div>
                                          {subsection.performance_levels.map((level: any, levelIndex: number) => (
                                            <div key={levelIndex} className="performance-level">
                                              <div className="level-header">
                                                <strong>{level.level || level.name || `Level ${levelIndex + 1}`}</strong>
                                                <span className="score-range">{level.score_range || 'N/A'}</span>
                                                <span className="threshold">{level.threshold || 'N/A'}</span>
                                              </div>
                                              <div className="level-description">
                                                {(() => {
                                                  let desc = level.description || 'No description provided';
                                                  const levelName = level.level || level.name || '';
                                                  const pattern = new RegExp(`^${levelName}\\s*\\([^)]+\\)\\s*:\\s*`, 'gi');
                                                  let cleaned = desc;
                                                  while (cleaned.match(pattern)) {
                                                    const before = cleaned;
                                                    cleaned = cleaned.replace(pattern, '');
                                                    if (before === cleaned) break;
                                                  }
                                                  return cleaned;
                                                })()}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {subsection.deductions && subsection.deductions.length > 0 && (
                                        <div className="deductions">
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <h5 style={{ margin: 0 }}>Deductions:</h5>
                                          </div>
                                          {subsection.deductions.map((deduction: any, deductionIndex: number) => (
                                            <div key={deductionIndex} className="deduction">
                                              <span className="deduction-label">{deduction.reason || deduction.area || 'Deduction'}:</span>
                                              <span className="penalty">Penalty: {deduction.penalty || 'N/A'}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {rubricItem.deductions && rubricItem.deductions.length > 0 && (
                                  <div className="global-deductions">
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <h4 style={{ margin: 0 }}>Global Deductions:</h4>
                                  </div>
                                  {rubricItem.deductions.map((deduction: any, index: number) => (
                                    <div key={index} className="deduction">
                                      <span className="deduction-label">{deduction.area || deduction.reason || 'Deduction'}:</span>
                                      <span className="penalty">Penalty: {deduction.penalty || 'N/A'}</span>
                                      {/* description intentionally removed */}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })()
                  ) : null}
                </div>
              </div>
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

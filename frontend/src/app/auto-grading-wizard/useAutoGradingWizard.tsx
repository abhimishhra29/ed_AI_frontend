'use client';

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  FormEvent,
} from 'react';

export type WorkflowOption = 'Assignment_grader' | 'handwritten_ocr';
export type AssignmentStructureOption = 'question_based' | 'report_based';

export interface AutoGradingWizardContextType {
  /* navigation */
  step: 1 | 2 | 3 | 4;
  setStep: Dispatch<SetStateAction<1 | 2 | 3 | 4>>;

  /* file pickers */
  assignmentFile: File | null;
  setAssignmentFile: Dispatch<SetStateAction<File | null>>;

  /* grading‑stage state */
  assignmentName: string;
  setAssignmentName: Dispatch<SetStateAction<string>>;
  assignmentStructure: AssignmentStructureOption;
  setAssignmentStructure: Dispatch<SetStateAction<AssignmentStructureOption>>;
  workflows: WorkflowOption[];
  selectedWorkflow: WorkflowOption;
  setSelectedWorkflow: Dispatch<SetStateAction<WorkflowOption>>;
  isSubmitting: boolean;
  gradingError: string | null;
  timeLeft: number | null;
  rawOutputs: { filename: string; data: any }[];
  solutionFilesSelected: File[];
  setSolutionFilesSelected: Dispatch<SetStateAction<File[]>>;

  /* rubric generation */
  generatedRubric: any | null;
  extractedQuestions: any[] | null;
  isGeneratingRubric: boolean;
  rubricGenerationError: string | null;
  generateRubric: () => Promise<void>;
  setGeneratedRubric: Dispatch<SetStateAction<any | null>>;
  setExtractedQuestions: Dispatch<SetStateAction<any[] | null>>;
  setRubricGenerationError: Dispatch<SetStateAction<string | null>>;

  /* actions */
  handleGrade: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const AutoGradingWizardContext =
  createContext<AutoGradingWizardContextType | null>(null);

export function useAutoGradingWizard() {
  const ctx = useContext(AutoGradingWizardContext);
  if (!ctx) {
    throw new Error(
      'useAutoGradingWizard must be used inside <CombinedAutoGradingWizard>',
    );
  }
  return ctx;
}

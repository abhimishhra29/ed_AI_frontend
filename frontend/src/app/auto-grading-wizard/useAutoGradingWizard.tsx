'use client';

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  FormEvent,
} from 'react';

export interface AutoGradingWizardContextType {
  /* navigation */
  step: 1 | 2 | 3 | 4;
  setStep: Dispatch<SetStateAction<1 | 2 | 3 | 4>>;

  /* validation‑stage state */
  feedback: string[] | null;
  setFeedback: Dispatch<SetStateAction<string[] | null>>;
  rawValidate: any | null;
  setRawValidate: Dispatch<SetStateAction<any | null>>;
  validationError: string | null;
  loading: boolean;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;

  /* file pickers */
  assignmentFile: File | null;
  setAssignmentFile: Dispatch<SetStateAction<File | null>>;
  rubricsFile: File | null;
  setRubricsFile: Dispatch<SetStateAction<File | null>>;

  validatedFiles: {
    assignmentFile: File;
    rubricsFile: File;
  } | null;
  setValidatedFiles: Dispatch<
    SetStateAction<{
      assignmentFile: File;
      rubricsFile: File;
    } | null>
  >;

  /* grading‑stage state */
  assignmentName: string;
  setAssignmentName: Dispatch<SetStateAction<string>>;
  workflows: string[];
  selectedWorkflow: string;
  setSelectedWorkflow: Dispatch<SetStateAction<string>>;
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
  handleValidate: (e: FormEvent<HTMLFormElement>) => Promise<void>;
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

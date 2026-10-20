export type DecompositionCFL = {
  u: string;
  v: string;
  w: string;
  x: string;
  y: string;
  uLen: number;
  vLen: number;
  wLen: number;
  xLen: number;
  yLen: number;
};

export type ProofCaseCFL = {
  id: string;
  name: string;
  shortDesc: string;
  vwxLocation: 'block1' | 'block1-2' | 'block2' | 'block2-3' | 'block3';
  description: string;
  sampleDecomp: {
    uLen: number;
    vLen: number;
    wLen: number;
    xLen: number;
    yLen: number;
  };
  whyItFails: string;
  recommendedI: number;
  pumpedExplanation: string;
};

export type MembershipResult = {
  isValid: boolean;
  reason: string;
  a1Count: number;
  bCount: number;
  a2Count: number;
  structuralOrderValid: boolean;
  equalCounts: boolean;
  totalLength: number;
  breakdown: string;
};

// ==========================================
// PROBLEM 2: PDA TYPES
// ==========================================

export type PDAStateId = 'q0' | 'q1' | 'qf' | 'trap';

export interface PDATransitionRule {
  id: string;
  fromState: PDAStateId;
  inputSymbol: string; // '0', '1', or 'ε'
  stackTop: string; // 'Z0' or 'A'
  toState: PDAStateId;
  stackReplacement: string; // 'AAAZ0', 'AAAA', 'ε', 'Z0'
  description: string;
}

export interface PDAConfiguration {
  stepIndex: number;
  state: PDAStateId;
  remainingInput: string;
  consumedInput: string;
  stack: string[]; // stack array where index 0 is top or bottom. We'll use index 0 as TOP for display.
  transitionUsed: PDATransitionRule | null;
  zerosRead: number;
  onesRead: number;
  symbolsPushed: number;
  symbolsPopped: number;
  actionNote: string;
}

export interface PDASimulationResult {
  accepted: boolean;
  finalState: PDAStateId;
  message: string;
  steps: PDAConfiguration[];
  reason: string;
}

export interface PDATestCase {
  input: string;
  expected: 'ACCEPTED' | 'REJECTED';
  reason: string;
}

export interface Problem2Submission {
  questionText: string;
  solutionNotes: string;
  imageDataUri?: string;
}

export interface InterpretedStep {
  stepNumber: number;
  title: string;
  description: string;
  mathLatex: string;
  details: string;
}

export interface InterpretedCase {
  title: string;
  condition: string;
  whyFails: string;
  suggestedI: number;
}

export interface InterpretedProblem2 {
  status: 'ready' | 'needs_clarification';
  clarificationMessage?: string;
  languageName: string;
  languageFormal: string;
  alphabet: string[];
  proofGoal: 'not-regular' | 'not-cfl' | 'cfl-membership' | 'general' | 'unknown';
  theoremUsed: string;
  pumpingLengthVariable: string;
  selectedString: string;
  decompositionModel: 'regular' | 'cfl' | 'other';
  steps: InterpretedStep[];
  allCases: InterpretedCase[];
  finalConclusion: string;
  defaultP: number;
  sampleDecompRegular?: {
    xLen: number;
    yLen: number;
    zLen: number;
  };
  sampleDecompCFL?: {
    uLen: number;
    vLen: number;
    wLen: number;
    xLen: number;
    yLen: number;
  };
}

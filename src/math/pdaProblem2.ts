import type {
  PDAConfiguration,
  PDASimulationResult,
  PDATestCase,
  PDATransitionRule,
} from '../types/automata';

/**
 * Formal Transitions for L = { 0^n 1^(3n) | n >= 1 }
 * δ(state, input, stack-top) = (next-state, replacement-stack-string)
 */
export const PDA_TRANSITIONS: PDATransitionRule[] = [
  {
    id: 't1_first_zero',
    fromState: 'q0',
    inputSymbol: '0',
    stackTop: 'Z0',
    toState: 'q0',
    stackReplacement: 'AAAZ0',
    description: 'First zero read: Replace Z0 with AAAZ0 (pushes three A symbols to count 3 ones for this zero).',
  },
  {
    id: 't2_additional_zero',
    fromState: 'q0',
    inputSymbol: '0',
    stackTop: 'A',
    toState: 'q0',
    stackReplacement: 'AAAA',
    description: 'Additional zero read: Replace top A with AAAA (adds exactly three new A symbols to the stack).',
  },
  {
    id: 't3_first_one',
    fromState: 'q0',
    inputSymbol: '1',
    stackTop: 'A',
    toState: 'q1',
    stackReplacement: 'ε',
    description: 'First one read: Pop top A and switch from q0 to q1 (all zeros are finished).',
  },
  {
    id: 't4_subsequent_one',
    fromState: 'q1',
    inputSymbol: '1',
    stackTop: 'A',
    toState: 'q1',
    stackReplacement: 'ε',
    description: 'Subsequent one read: Pop top A and remain in q1.',
  },
  {
    id: 't5_epsilon_accept',
    fromState: 'q1',
    inputSymbol: 'ε',
    stackTop: 'Z0',
    toState: 'qf',
    stackReplacement: 'Z0',
    description: 'Input fully consumed with only Z0 on stack: Take ε-transition to final accepting state qf.',
  },
];

export const PDA_TEST_CASES: PDATestCase[] = [
  {
    input: '00111111',
    expected: 'ACCEPTED',
    reason: 'Contains 2 zeros followed by 6 ones. Since 6 = 3 × 2, it satisfies 0ⁿ1³ⁿ with n = 2.',
  },
  {
    input: '0111',
    expected: 'ACCEPTED',
    reason: 'Contains 1 zero followed by 3 ones. Since 3 = 3 × 1, it satisfies 0ⁿ1³ⁿ with n = 1.',
  },
  {
    input: '0011111',
    expected: 'REJECTED',
    reason: 'Contains 2 zeros and 5 ones. Required 6 ones (5 ≠ 3 × 2). One A remains unpopped on the stack.',
  },
  {
    input: '001111111',
    expected: 'REJECTED',
    reason: 'Contains 2 zeros and 7 ones. Stack has only 6 A symbols; 7th one finds Z0 on stack top (no transition).',
  },
  {
    input: '010111',
    expected: 'REJECTED',
    reason: 'Zero appears after a one has already been read. State q1 has no transition for input 0.',
  },
  {
    input: '111',
    expected: 'REJECTED',
    reason: 'No zeros present (n = 0). The language requires n ≥ 1. In q0 on input 1 with stack Z0, no transition exists.',
  },
  {
    input: '',
    expected: 'REJECTED',
    reason: 'Empty string (ε). Rejected because the condition specifies n ≥ 1.',
  },
];

/**
 * Pure mathematical validator for L = { 0^n 1^(3n) | n >= 1 }
 */
export function validateStringL2(input: string): {
  isValid: boolean;
  zerosCount: number;
  onesCount: number;
  reason: string;
} {
  if (!input || input.length === 0) {
    return {
      isValid: false,
      zerosCount: 0,
      onesCount: 0,
      reason: 'REJECTED — The empty string (ε) is not accepted because n ≥ 1 is strictly required.',
    };
  }

  if (!/^[01]+$/.test(input)) {
    return {
      isValid: false,
      zerosCount: 0,
      onesCount: 0,
      reason: 'REJECTED — The input contains invalid symbols. The alphabet is Σ = {0, 1}.',
    };
  }

  // Check if a 0 appears after any 1
  const firstOneIdx = input.indexOf('1');
  if (firstOneIdx !== -1) {
    const trailingZeros = input.slice(firstOneIdx).indexOf('0');
    if (trailingZeros !== -1) {
      return {
        isValid: false,
        zerosCount: input.split('0').length - 1,
        onesCount: input.split('1').length - 1,
        reason: 'REJECTED — All zeros must appear before any ones. Found a zero after the first one (out of order).',
      };
    }
  }

  const match = input.match(/^(0+)(1+)$/);
  if (!match) {
    if (!input.includes('0')) {
      return {
        isValid: false,
        zerosCount: 0,
        onesCount: input.length,
        reason: 'REJECTED — Missing zeros. The language requires at least one zero (n ≥ 1).',
      };
    }
    if (!input.includes('1')) {
      return {
        isValid: false,
        zerosCount: input.length,
        onesCount: 0,
        reason: 'REJECTED — Missing ones. Each zero requires three ones (found 0 ones).',
      };
    }
    return {
      isValid: false,
      zerosCount: 0,
      onesCount: 0,
      reason: 'REJECTED — Input does not match the block structure 0⁺1⁺.',
    };
  }

  const zerosCount = match[1].length;
  const onesCount = match[2].length;
  const expectedOnes = 3 * zerosCount;

  if (onesCount === expectedOnes) {
    return {
      isValid: true,
      zerosCount,
      onesCount,
      reason: `ACCEPTED — The string belongs to L because it contains ${zerosCount} zero${zerosCount > 1 ? 's' : ''} followed by ${onesCount} ones, and ${onesCount} = 3 × ${zerosCount}.`,
    };
  }

  return {
    isValid: false,
    zerosCount,
    onesCount,
    reason: `REJECTED — Unequal ratio: Found ${zerosCount} zeros and ${onesCount} ones. For n = ${zerosCount}, exactly 3n = ${expectedOnes} ones are required (${onesCount} ≠ ${expectedOnes}).`,
  };
}

/**
 * Simulates the PDA step-by-step on a given input string.
 * Stack convention: array where stack[0] is the TOP element.
 */
export function simulatePDA(input: string): PDASimulationResult {
  const steps: PDAConfiguration[] = [];

  // Initial Configuration: (q0, input, [Z0])
  let currentState: 'q0' | 'q1' | 'qf' | 'trap' = 'q0';
  let stack: string[] = ['Z0']; // index 0 is TOP
  let remaining = input;
  let consumed = '';
  let zerosRead = 0;
  let onesRead = 0;
  let pushedCount = 0;
  let poppedCount = 0;

  // Record initial step
  steps.push({
    stepIndex: 0,
    state: currentState,
    remainingInput: remaining,
    consumedInput: consumed,
    stack: [...stack],
    transitionUsed: null,
    zerosRead,
    onesRead,
    symbolsPushed: pushedCount,
    symbolsPopped: poppedCount,
    actionNote: `Initial configuration: (q0, "${remaining || 'ε'}", [${stack.join(', ')}])`,
  });

  // Step limit to prevent infinite loops
  const maxSteps = 100;
  let stepCount = 0;

  while (stepCount < maxSteps) {
    stepCount++;
    const stackTop = stack.length > 0 ? stack[0] : null;

    if (!stackTop) {
      // Empty stack before input consumed or final state -> Reject
      return {
        accepted: false,
        finalState: currentState,
        message: 'REJECTED — Stack is completely empty (underflow).',
        steps,
        reason: 'Stack became empty without reaching an accepting state.',
      };
    }

    // Check if input is finished: we can only take epsilon transition from q1 with Z0
    if (remaining.length === 0) {
      if (currentState === 'q1' && stackTop === 'Z0') {
        // Take epsilon transition: δ(q1, ε, Z0) = (qf, Z0)
        const trans = PDA_TRANSITIONS.find((t) => t.id === 't5_epsilon_accept')!;
        currentState = 'qf';
        // Stack replacement for Z0 is Z0 (unchanged)
        steps.push({
          stepIndex: steps.length,
          state: currentState,
          remainingInput: 'ε',
          consumedInput: consumed,
          stack: [...stack],
          transitionUsed: trans,
          zerosRead,
          onesRead,
          symbolsPushed: pushedCount,
          symbolsPopped: poppedCount,
          actionNote: `Input consumed and stack top is Z0: Take transition δ(q1, ε, Z0) = (qf, Z0). Reached final state qf!`,
        });

        const validation = validateStringL2(input);
        return {
          accepted: true,
          finalState: 'qf',
          message: `ACCEPTED — The string belongs to L because it contains ${zerosRead} zeros followed by ${onesRead} ones, and ${onesRead} = 3 × ${zerosRead}.`,
          steps,
          reason: validation.reason,
        };
      } else if (currentState === 'q0') {
        // Input exhausted in q0 (e.g. empty string or only zeros, no ones read)
        return {
          accepted: false,
          finalState: currentState,
          message: 'REJECTED — Input consumed while still in state q0. No ones were read (n ≥ 1 required).',
          steps,
          reason: 'Cannot accept in non-final state q0. No ones followed the zeros.',
        };
      } else if (currentState === 'q1' && stackTop === 'A') {
        // Input exhausted but A's remain on stack (not enough ones)
        const remainingAs = stack.filter((s) => s === 'A').length;
        return {
          accepted: false,
          finalState: currentState,
          message: `REJECTED — Input ended prematurely. ${remainingAs} 'A' symbols remain unpopped on the stack (insufficient ones).`,
          steps,
          reason: `Too few ones: Stack still has ${remainingAs} unconsumed 'A' symbols. Expected ${3 * zerosRead} ones, but only read ${onesRead}.`,
        };
      } else {
        // Other exhausted scenario
        return {
          accepted: false,
          finalState: currentState,
          message: 'REJECTED — Input consumed without reaching final state qf.',
          steps,
          reason: 'Automaton halted without reaching an accepting state.',
        };
      }
    }

    // Process next input symbol
    const nextChar = remaining[0];

    if (currentState === 'q0') {
      if (nextChar === '0') {
        if (stackTop === 'Z0') {
          // Transition: δ(q0, 0, Z0) = (q0, AAAZ0)
          const trans = PDA_TRANSITIONS.find((t) => t.id === 't1_first_zero')!;
          consumed += nextChar;
          remaining = remaining.slice(1);
          zerosRead++;
          pushedCount += 3;

          // Replace Z0 with AAAZ0 (new top is A, A, A, Z0)
          stack = ['A', 'A', 'A', 'Z0'];

          steps.push({
            stepIndex: steps.length,
            state: 'q0',
            remainingInput: remaining,
            consumedInput: consumed,
            stack: [...stack],
            transitionUsed: trans,
            zerosRead,
            onesRead,
            symbolsPushed: pushedCount,
            symbolsPopped: poppedCount,
            actionNote: `Read first '0': δ(q0, 0, Z0) = (q0, AAAZ0). Pushed 3 'A's. Stack has 3 A's + Z0.`,
          });
        } else if (stackTop === 'A') {
          // Transition: δ(q0, 0, A) = (q0, AAAA)
          const trans = PDA_TRANSITIONS.find((t) => t.id === 't2_additional_zero')!;
          consumed += nextChar;
          remaining = remaining.slice(1);
          zerosRead++;
          pushedCount += 3;

          // Replace top A with AAAA (pop 1, push 4 = net +3 A's)
          stack = ['A', 'A', 'A', 'A', ...stack.slice(1)];

          steps.push({
            stepIndex: steps.length,
            state: 'q0',
            remainingInput: remaining,
            consumedInput: consumed,
            stack: [...stack],
            transitionUsed: trans,
            zerosRead,
            onesRead,
            symbolsPushed: pushedCount,
            symbolsPopped: poppedCount,
            actionNote: `Read '0': δ(q0, 0, A) = (q0, AAAA). Top A replaced with AAAA (+3 A's). Total A's: ${zerosRead * 3}.`,
          });
        } else {
          return {
            accepted: false,
            finalState: currentState,
            message: `REJECTED — Unexpected stack top '${stackTop}' while reading '0'.`,
            steps,
            reason: `No valid transition in q0 for (input=0, stack=${stackTop}).`,
          };
        }
      } else if (nextChar === '1') {
        if (stackTop === 'A') {
          // Transition: δ(q0, 1, A) = (q1, ε)
          const trans = PDA_TRANSITIONS.find((t) => t.id === 't3_first_one')!;
          consumed += nextChar;
          remaining = remaining.slice(1);
          onesRead++;
          poppedCount += 1;

          // Pop top A
          stack = stack.slice(1);
          currentState = 'q1';

          steps.push({
            stepIndex: steps.length,
            state: 'q1',
            remainingInput: remaining,
            consumedInput: consumed,
            stack: [...stack],
            transitionUsed: trans,
            zerosRead,
            onesRead,
            symbolsPushed: pushedCount,
            symbolsPopped: poppedCount,
            actionNote: `Read first '1': δ(q0, 1, A) = (q1, ε). Popped top A. State changed to q1.`,
          });
        } else if (stackTop === 'Z0') {
          // '1' with stackTop Z0 in q0: no zeros were read prior to this 1
          consumed += nextChar;
          remaining = remaining.slice(1);
          onesRead++;
          return {
            accepted: false,
            finalState: 'trap',
            message: "REJECTED — Encountered '1' when stack top is Z0. No zeros were read (n ≥ 1 violated).",
            steps,
            reason: 'Missing transition: δ(q0, 1, Z0) is undefined. Requires n ≥ 1 zeros first.',
          };
        } else {
          return {
            accepted: false,
            finalState: 'trap',
            message: `REJECTED — No transition for (q0, 1, ${stackTop}).`,
            steps,
            reason: `Undefined transition in q0 for input 1 with stack ${stackTop}.`,
          };
        }
      } else {
        // Unknown symbol
        return {
          accepted: false,
          finalState: 'trap',
          message: `REJECTED — Invalid symbol '${nextChar}'.`,
          steps,
          reason: `Alphabet violation: symbol '${nextChar}' is not in Σ = {0, 1}.`,
        };
      }
    } else if (currentState === 'q1') {
      if (nextChar === '1') {
        if (stackTop === 'A') {
          // Transition: δ(q1, 1, A) = (q1, ε)
          const trans = PDA_TRANSITIONS.find((t) => t.id === 't4_subsequent_one')!;
          consumed += nextChar;
          remaining = remaining.slice(1);
          onesRead++;
          poppedCount += 1;

          // Pop top A
          stack = stack.slice(1);

          steps.push({
            stepIndex: steps.length,
            state: 'q1',
            remainingInput: remaining,
            consumedInput: consumed,
            stack: [...stack],
            transitionUsed: trans,
            zerosRead,
            onesRead,
            symbolsPushed: pushedCount,
            symbolsPopped: poppedCount,
            actionNote: `Read '1': δ(q1, 1, A) = (q1, ε). Popped top A. Remaining A's: ${stack.filter((s) => s === 'A').length}.`,
          });
        } else if (stackTop === 'Z0') {
          // Read '1' but only Z0 is on stack (too many ones)
          consumed += nextChar;
          remaining = remaining.slice(1);
          onesRead++;
          return {
            accepted: false,
            finalState: 'trap',
            message: `REJECTED — Too many ones! Encountered '1' with stack top Z0. Required exactly ${3 * zerosRead} ones, but input has more.`,
            steps,
            reason: 'Undefined transition: δ(q1, 1, Z0) does not exist. Stack was depleted before all ones were consumed.',
          };
        } else {
          return {
            accepted: false,
            finalState: 'trap',
            message: `REJECTED — Undefined transition in q1 for stack top '${stackTop}'.`,
            steps,
            reason: `No transition δ(q1, 1, ${stackTop}).`,
          };
        }
      } else if (nextChar === '0') {
        // Zero in q1 is strictly forbidden (all zeros must precede all ones)
        consumed += nextChar;
        remaining = remaining.slice(1);
        zerosRead++;
        return {
          accepted: false,
          finalState: 'trap',
          message: "REJECTED — Zero encountered after ones in state q1. All zeros must precede all ones.",
          steps,
          reason: "Undefined transition: δ(q1, 0, any) does not exist. State q1 cannot process zeros.",
        };
      } else {
        return {
          accepted: false,
          finalState: 'trap',
          message: `REJECTED — Invalid symbol '${nextChar}'.`,
          steps,
          reason: `Alphabet violation: symbol '${nextChar}' is not in Σ = {0, 1}.`,
        };
      }
    }
  }

  return {
    accepted: false,
    finalState: currentState,
    message: 'REJECTED — Execution exceeded maximum step limit.',
    steps,
    reason: 'Simulation terminated to prevent infinite loop.',
  };
}

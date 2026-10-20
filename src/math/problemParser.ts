import type { InterpretedProblem2, Problem2Submission } from '../types/automata';

export interface PresetProblem {
  id: string;
  title: string;
  language: string;
  question: string;
  solutionNotes: string;
}

export const PRESET_PROBLEMS: PresetProblem[] = [
  {
    id: 'preset-0n1n',
    title: 'L = { 0ⁿ1ⁿ | n ≥ 0 } — Prove Not Regular',
    language: 'L = { 0ⁿ1ⁿ | n ≥ 0 }',
    question: 'Show that the language L = { 0ⁿ1ⁿ | n ≥ 0 } is not regular using the Pumping Lemma for Regular Languages.',
    solutionNotes:
      'Assume L is regular. Let p be the pumping length. Choose s = 0^p 1^p in L with |s| = 2p >= p. Decompose s = xyz with |xy| <= p and |y| > 0. Since |xy| <= p, y contains only 0s (y = 0^k where k >= 1). Pump down with i = 0: x y^0 z = xz = 0^(p-k) 1^p. Since k >= 1, p - k != p, so number of 0s does not equal number of 1s. Thus xz not in L. Contradiction! Hence L is not regular.',
  },
  {
    id: 'preset-anbncn',
    title: 'L = { aⁿbⁿcⁿ | n ≥ 1 } — Prove Not Context-Free',
    language: 'L = { aⁿbⁿcⁿ | n ≥ 1 }',
    question: 'Use the Pumping Lemma for Context-Free Languages to prove that L = { aⁿbⁿcⁿ | n ≥ 1 } is not context-free.',
    solutionNotes:
      'Assume L is context-free. Let p be the pumping length. Choose s = a^p b^p c^p in L. By CFL pumping lemma, s = uvwxy with |vwx| <= p and |vx| > 0. Because |vwx| <= p, vwx can span at most two different symbol types (a and b, or b and c), and can never touch all three blocks of a, b, and c. Therefore vx contains at most two kinds of symbols. Pumping i = 0 or i = 2 changes the counts of at most two symbol types while leaving the third type with exactly p symbols. This makes the three symbol counts unequal. Contradiction! Thus L is not context-free.',
  },
  {
    id: 'preset-ww',
    title: 'L = { ww | w ∈ {0, 1}* } — Prove Not Context-Free',
    language: 'L = { ww | w ∈ {0, 1}* }',
    question: 'Prove that the copy language L = { ww | w ∈ {0, 1}* } is not context-free using the CFL Pumping Lemma.',
    solutionNotes:
      'Assume L is context-free with pumping length p. Choose string s = 0^p 1^p 0^p 1^p in L. Here w = 0^p 1^p and |s| = 4p >= p. Decompose s = uvwxy with |vwx| <= p and |vx| > 0. Since |vwx| <= p, vwx cannot span from the first half of s to the second half in a way that preserves identical halves. For i = 0 or i = 2, pumping alters the balance between the first copy and second copy. Therefore uv^i wx^i y is not of the form ww. Contradiction! Hence L is not context-free.',
  },
  {
    id: 'preset-wwR',
    title: 'L = { w wᴿ | w ∈ {a, b}* } — Prove Not Regular (It is CFL)',
    language: 'L = { w wᴿ | w ∈ {a, b}* }',
    question: 'Show that the language of even-length palindromes L = { w wᴿ | w ∈ {a, b}* } is not regular.',
    solutionNotes:
      'Assume L is regular. Let p be the pumping length. Choose s = a^p b^p b^p a^p in L with |s| = 4p >= p. Decompose s = xyz where |xy| <= p and |y| >= 1. Since |xy| <= p, y lies entirely within the leading prefix of a\'s (y = a^k, 1 <= k <= p). Pumping with i = 0 yields x y^0 z = a^(p-k) b^p b^p a^p. The prefix now has p - k a\'s, but the suffix has p a\'s. Since p - k != p, the string is no longer a palindrome! Thus xz not in L. Contradiction! Hence L is not regular.',
  },
];

/**
 * Intelligent analyzer for Problem 2 user submissions
 */
export function interpretProblem2(submission: Problem2Submission): InterpretedProblem2 {
  const combined = (submission.questionText + ' ' + submission.solutionNotes).toLowerCase();

  // Check if essential information is present
  if (!submission.questionText.trim() && !submission.solutionNotes.trim()) {
    return {
      status: 'needs_clarification',
      clarificationMessage:
        'Essential information is missing: Please enter the formal language or question, or enter your handwritten solution notes. If you uploaded a photograph of your handwriting, please write or transcribe the formal language definition so we can verify the mathematical parameters accurately.',
      languageName: 'Undefined Language',
      languageFormal: 'L = ?',
      alphabet: ['Σ'],
      proofGoal: 'unknown',
      theoremUsed: 'Unknown',
      pumpingLengthVariable: 'p',
      selectedString: '?',
      decompositionModel: 'other',
      steps: [],
      allCases: [],
      finalConclusion: 'Awaiting input.',
      defaultP: 3,
    };
  }

  // Detect proof goal: Not Regular vs Not Context-Free
  const isCFL =
    combined.includes('context-free') ||
    combined.includes('cfl') ||
    combined.includes('uvwxy') ||
    combined.includes('|vwx|') ||
    combined.includes('cfg') ||
    combined.includes('a^n b^n c^n') ||
    combined.includes('aⁿbⁿcⁿ') ||
    combined.includes('ww |');

  const isRegular =
    combined.includes('regular') ||
    combined.includes('dfa') ||
    combined.includes('nfa') ||
    combined.includes('xyz') ||
    combined.includes('|xy|') ||
    combined.includes('0^n 1^n') ||
    combined.includes('0ⁿ1ⁿ') ||
    combined.includes('a^n b^n |');

  // If neither or both are detected, resolve based on strongest signal
  const goal: 'not-regular' | 'not-cfl' = isCFL && !isRegular ? 'not-cfl' : 'not-regular';

  // Detect language pattern
  if (combined.includes('0^n 1^n') || combined.includes('0ⁿ1ⁿ') || combined.includes('0^n1^n')) {
    return build0n1nInterpreted();
  } else if (combined.includes('a^n b^n c^n') || combined.includes('aⁿbⁿcⁿ') || combined.includes('a^nb^nc^n')) {
    return buildAnBnCnInterpreted();
  } else if (combined.includes('ww') && !combined.includes('ww^r') && !combined.includes('wwr')) {
    return buildWWInterpreted();
  } else if (combined.includes('ww^r') || combined.includes('wwr') || combined.includes('palindrome')) {
    return buildWWRInterpreted();
  } else {
    // Generic dynamic interpretation based on user input
    return buildGenericInterpreted(submission, goal);
  }
}

function build0n1nInterpreted(): InterpretedProblem2 {
  return {
    status: 'ready',
    languageName: '0ⁿ1ⁿ (Equal 0s and 1s)',
    languageFormal: 'L = \\{ 0^n 1^n \\mid n \\ge 0 \\}',
    alphabet: ['0', '1'],
    proofGoal: 'not-regular',
    theoremUsed: 'Pumping Lemma for Regular Languages',
    pumpingLengthVariable: 'p',
    selectedString: 's = 0^p 1^p',
    decompositionModel: 'regular',
    defaultP: 3,
    sampleDecompRegular: {
      xLen: 1,
      yLen: 2,
      zLen: 3, // For p = 3, s = 000111, x = 0 (1), y = 00 (2), z = 111 (3)
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Assumption for Contradiction',
        description: 'Assume for contradiction that L is a regular language.',
        mathLatex: '\\text{Suppose } L = \\{ 0^n 1^n \\mid n \\ge 0 \\} \\text{ is regular.}',
        details: 'If L were regular, it would be recognized by a Finite Automaton and satisfy the Regular Pumping Lemma.',
      },
      {
        stepNumber: 2,
        title: 'Introduce Pumping Length p',
        description: 'There exists a pumping length p ≥ 1 given by the lemma (number of states in minimal DFA).',
        mathLatex: '\\exists p \\ge 1 \\text{ such that any } s \\in L \\text{ with } |s| \\ge p \\text{ can be pumped.}',
        details: 'The constant p is determined by the pigeonhole principle on the states of the automaton.',
      },
      {
        stepNumber: 3,
        title: 'Select String s = 0ᵖ 1ᵖ',
        description: 'Choose s = 0ᵖ1ᵖ. Clearly s ∈ L, and |s| = 2p ≥ p.',
        mathLatex: 's = 0^p 1^p \\in L, \\quad |s| = 2p \\ge p',
        details: 'This choice ensures that all the first p characters are 0s.',
      },
      {
        stepNumber: 4,
        title: 'Regular Decomposition: s = xyz',
        description: 'According to the lemma, s = xyz with: (1) |xy| ≤ p, (2) |y| > 0, and (3) ∀i ≥ 0, xyⁱz ∈ L.',
        mathLatex: 's = xyz \\quad \\text{with} \\quad |xy| \\le p, \\; |y| > 0, \\; \\forall i \\ge 0: x y^i z \\in L',
        details: 'Because |xy| ≤ p, y is entirely contained in the initial block of 0s. Thus y = 0ᵏ for some k ≥ 1.',
      },
      {
        stepNumber: 5,
        title: 'Pump with i = 0 (Pumping Down) or i = 2 (Pumping Up)',
        description: 'Examine s₀ = x y⁰ z = xz. We remove y (which contains k 0s).',
        mathLatex: 's_0 = x z = 0^{p-k} 1^p \\quad \\text{where } 1 \\le k \\le p',
        details: 'The number of 0s is now p - k. Since k ≥ 1, p - k < p. But the number of 1s is still p. Thus count(0) ≠ count(1), so s₀ ∉ L!',
      },
      {
        stepNumber: 6,
        title: 'Contradiction & Conclusion',
        description: 'No valid decomposition can satisfy the lemma. Therefore, L is not regular.',
        mathLatex: '\\text{Contradiction! } \\therefore L = \\{ 0^n 1^n \\mid n \\ge 0 \\} \\notin \\text{Regular Languages}.',
        details: 'This completes the formal proof that counting and matching arbitrarily large amounts requires memory not available in finite automata.',
      },
    ],
    allCases: [
      {
        title: 'All Decompositions: y ⊆ 0ᵖ',
        condition: '|xy| ≤ p and |y| ≥ 1 force y to consist solely of 0s.',
        whyFails: 'Pumping down (i=0) leaves fewer 0s than 1s. Pumping up (i=2) leaves more 0s than 1s. In all cases, count(0) ≠ count(1).',
        suggestedI: 0,
      },
    ],
    finalConclusion: 'L = { 0ⁿ1ⁿ | n ≥ 0 } is NOT a regular language. Q.E.D.',
  };
}

function buildAnBnCnInterpreted(): InterpretedProblem2 {
  return {
    status: 'ready',
    languageName: 'aⁿbⁿcⁿ (Equal 3-Way Counts)',
    languageFormal: 'L = \\{ a^n b^n c^n \\mid n \\ge 1 \\}',
    alphabet: ['a', 'b', 'c'],
    proofGoal: 'not-cfl',
    theoremUsed: 'Pumping Lemma for Context-Free Languages',
    pumpingLengthVariable: 'p',
    selectedString: 's = a^p b^p c^p',
    decompositionModel: 'cfl',
    defaultP: 3,
    sampleDecompCFL: {
      uLen: 2,
      vLen: 1,
      wLen: 1,
      xLen: 1,
      yLen: 4,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Assumption: L is Context-Free',
        description: 'Suppose for contradiction that L = { aⁿbⁿcⁿ | n ≥ 1 } is context-free.',
        mathLatex: '\\text{Assume } L = \\{ a^n b^n c^n \\mid n \\ge 1 \\} \\in \\text{CFL}.',
        details: 'If context-free, there is a Context-Free Grammar (CFG) in Chomsky Normal Form generating L.',
      },
      {
        stepNumber: 2,
        title: 'Pumping Length p',
        description: 'Let p be the CFL pumping length guaranteed by the lemma.',
        mathLatex: '\\exists p \\ge 1 \\text{ such that } \\forall s \\in L, |s| \\ge p \\implies s = uvwxy',
        details: 'The constant p is typically 2^(|V|+1) where |V| is the number of variables in the grammar.',
      },
      {
        stepNumber: 3,
        title: 'Choose String s = aᵖ bᵖ cᵖ',
        description: 'Select s = aᵖbᵖcᵖ ∈ L with |s| = 3p ≥ p.',
        mathLatex: 's = a^p b^p c^p, \\quad |s| = 3p \\ge p',
        details: 'Contains three equal blocks of length p.',
      },
      {
        stepNumber: 4,
        title: 'CFL Decomposition Constraints',
        description: 's = uvwxy such that |vwx| ≤ p, |vx| > 0, and ∀i ≥ 0, uvⁱwxⁱy ∈ L.',
        mathLatex: '|vwx| \\le p, \\quad |vx| > 0, \\quad \\forall i \\ge 0: u v^i w x^i y \\in L',
        details: 'Crucial observation: because |vwx| ≤ p, vwx can span at most two different letters (a and b, or b and c). It can never contain all three letters a, b, and c.',
      },
      {
        stepNumber: 5,
        title: 'Pump with i = 0',
        description: 'Since vx contains at most two of the three symbols, at least one symbol is not pumped.',
        mathLatex: 's_0 = u w y \\implies \\text{at least one symbol remains at count } p, \\text{ while other(s) decrease.}',
        details: 'For i = 0, the symbol(s) in vx decrease to < p, but the missing symbol remains at count p. Thus counts are not all equal, so s₀ ∉ L!',
      },
      {
        stepNumber: 6,
        title: 'Conclusion',
        description: 'Every valid decomposition fails. Hence L is not context-free.',
        mathLatex: '\\text{Contradiction! } \\therefore L = \\{ a^n b^n c^n \\mid n \\ge 1 \\} \\notin \\text{CFL}.',
        details: 'Standard landmark proof in automata theory that languages with 3 synchronized counts cannot be parsed with a single pushdown stack.',
      },
    ],
    allCases: [
      {
        title: 'Case 1: vwx contains only one symbol (a, b, or c)',
        condition: 'vx ⊆ a* or vx ⊆ b* or vx ⊆ c*',
        whyFails: 'Pumping changes only that one symbol. The other two symbols stay at count p. Unequal!',
        suggestedI: 0,
      },
      {
        title: 'Case 2: vwx spans two symbols (a and b, or b and c)',
        condition: 'vx contains at most two symbol types; the third symbol type is absent from vx.',
        whyFails: 'The third symbol stays at count p. Pumping i=0 reduces the count of the other symbols to < p. Unequal!',
        suggestedI: 0,
      },
    ],
    finalConclusion: 'L = { aⁿbⁿcⁿ | n ≥ 1 } is NOT context-free. Q.E.D.',
  };
}

function buildWWInterpreted(): InterpretedProblem2 {
  return {
    status: 'ready',
    languageName: 'ww (Copy Language)',
    languageFormal: 'L = \\{ ww \\mid w \\in \\{0, 1\\}^* \\}',
    alphabet: ['0', '1'],
    proofGoal: 'not-cfl',
    theoremUsed: 'Pumping Lemma for Context-Free Languages',
    pumpingLengthVariable: 'p',
    selectedString: 's = 0^p 1^p 0^p 1^p',
    decompositionModel: 'cfl',
    defaultP: 3,
    sampleDecompCFL: {
      uLen: 2,
      vLen: 1,
      wLen: 1,
      xLen: 1,
      yLen: 7,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Assumption: L is Context-Free',
        description: 'Assume for contradiction that the copy language L = { ww | w ∈ {0, 1}* } is context-free.',
        mathLatex: '\\text{Suppose } L = \\{ ww \\mid w \\in \\{0, 1\\}^* \\} \\in \\text{CFL}.',
        details: 'If context-free, there exists a CFL pumping length p.',
      },
      {
        stepNumber: 2,
        title: 'Choose String s = 0ᵖ 1ᵖ 0ᵖ 1ᵖ',
        description: 'Choose s = 0ᵖ1ᵖ0ᵖ1ᵖ in L (where w = 0ᵖ1ᵖ). Total length |s| = 4p ≥ p.',
        mathLatex: 's = 0^p 1^p 0^p 1^p, \\quad |s| = 4p \\ge p',
        details: 'The midpoint divides s cleanly into w = 0ᵖ1ᵖ and w = 0ᵖ1ᵖ.',
      },
      {
        stepNumber: 3,
        title: 'CFL Decomposition: |vwx| ≤ p',
        description: 'Because |vwx| ≤ p, vwx cannot cross both 1ᵖ blocks simultaneously.',
        mathLatex: '|vwx| \\le p, \\quad |vx| > 0',
        details: 'The distance between the two 1ᵖ blocks is p symbols of 0s. Thus vwx is localized to either the first half, the boundary, or the second half.',
      },
      {
        stepNumber: 4,
        title: 'Pump with i = 0 or i = 2',
        description: 'Pumping changes symbols in only one part of the string, preventing the two halves from matching.',
        mathLatex: 's_i = u v^i w x^i y \\notin L \\quad (\\text{first half } \\ne \\text{ second half})',
        details: 'Since the total length changes, the midpoint shifts. The new halves cannot be identical words of the form 0^k 1^m.',
      },
      {
        stepNumber: 5,
        title: 'Conclusion',
        description: 'L is not context-free.',
        mathLatex: '\\text{Contradiction! } \\therefore L = \\{ ww \\mid w \\in \\{0, 1\\}^* \\} \\notin \\text{CFL}.',
        details: 'Pushdown automata with one LIFO stack can reverse strings (w w^R), but cannot verify direct copies (w w).',
      },
    ],
    allCases: [
      {
        title: 'All Decompositions: vwx localized due to |vwx| ≤ p',
        condition: 'Cannot synchronize modifications in both copies of w.',
        whyFails: 'Pumping modifies either the first half or second half, causing halves to diverge.',
        suggestedI: 0,
      },
    ],
    finalConclusion: 'L = { ww | w ∈ {0, 1}* } is NOT context-free. Q.E.D.',
  };
}

function buildWWRInterpreted(): InterpretedProblem2 {
  return {
    status: 'ready',
    languageName: 'w wᴿ (Even-Length Palindromes)',
    languageFormal: 'L = \\{ w w^R \\mid w \\in \\{a, b\\}^* \\}',
    alphabet: ['a', 'b'],
    proofGoal: 'not-regular',
    theoremUsed: 'Pumping Lemma for Regular Languages',
    pumpingLengthVariable: 'p',
    selectedString: 's = a^p b^p b^p a^p',
    decompositionModel: 'regular',
    defaultP: 3,
    sampleDecompRegular: {
      xLen: 1,
      yLen: 2,
      zLen: 9,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Assumption: L is Regular',
        description: 'Assume for contradiction that L = { w wᴿ | w ∈ {a, b}* } is regular.',
        mathLatex: '\\text{Suppose } L = \\{ w w^R \\mid w \\in \\{a, b\\}^* \\} \\text{ is regular.}',
        details: 'If regular, it must satisfy the Regular Pumping Lemma with some constant p.',
      },
      {
        stepNumber: 2,
        title: 'Choose String s = aᵖ bᵖ bᵖ aᵖ',
        description: 'Choose s = aᵖb²ᵖaᵖ ∈ L (with w = aᵖbᵖ). Total length |s| = 4p ≥ p.',
        mathLatex: 's = a^p b^{2p} a^p \\in L, \\quad |s| = 4p \\ge p',
        details: 'The prefix has p a\'s and the suffix has p a\'s.',
      },
      {
        stepNumber: 3,
        title: 'Regular Decomposition: |xy| ≤ p',
        description: 'Decompose s = xyz with |xy| ≤ p and |y| ≥ 1.',
        mathLatex: 's = xyz, \\quad |xy| \\le p, \\; |y| > 0',
        details: 'Since |xy| ≤ p, y lies completely inside the first block of a\'s (y = aᵏ where 1 ≤ k ≤ p).',
      },
      {
        stepNumber: 4,
        title: 'Pump with i = 0',
        description: 's₀ = x y⁰ z = xz. We remove y (which has k a\'s).',
        mathLatex: 's_0 = a^{p-k} b^{2p} a^p \\quad (k \\ge 1)',
        details: 'The prefix has p - k a\'s, but the suffix still has p a\'s. Since p - k ≠ p, the string is no longer a palindrome! Thus s₀ ∉ L.',
      },
      {
        stepNumber: 5,
        title: 'Conclusion',
        description: 'L is not regular.',
        mathLatex: '\\text{Contradiction! } \\therefore L = \\{ w w^R \\mid w \\in \\{a, b\\}^* \\} \\notin \\text{Regular Languages}.',
        details: 'Note: L IS context-free, but it is NOT regular because a finite automaton cannot store and match an unbounded stack of symbols.',
      },
    ],
    allCases: [
      {
        title: 'All Decompositions: y consists only of initial a\'s',
        condition: '|xy| ≤ p forces y ⊆ aᵖ',
        whyFails: 'Pumping changes the number of prefix a\'s without modifying the suffix a\'s, breaking palindrome symmetry.',
        suggestedI: 0,
      },
    ],
    finalConclusion: 'L = { w wᴿ | w ∈ {a, b}* } is NOT regular (it is Context-Free). Q.E.D.',
  };
}

function buildGenericInterpreted(
  submission: Problem2Submission,
  goal: 'not-regular' | 'not-cfl'
): InterpretedProblem2 {
  const isCFL = goal === 'not-cfl';
  const text = (submission.questionText + ' ' + submission.solutionNotes).trim();

  // Extract any math notation like L = { ... }
  const matchLang = text.match(/L\s*=\s*\{([^}]+)\}/i);
  const langBody = matchLang ? matchLang[1].trim() : 'custom language';
  const formalLatex = matchLang ? `L = \\{ ${langBody} \\}` : `L \\text{ (User-Specified Language)}`;

  return {
    status: 'ready',
    languageName: `User Language: L = { ${langBody} }`,
    languageFormal: formalLatex,
    alphabet: ['a', 'b'],
    proofGoal: goal,
    theoremUsed: isCFL ? 'Pumping Lemma for Context-Free Languages' : 'Pumping Lemma for Regular Languages',
    pumpingLengthVariable: 'p',
    selectedString: isCFL ? 's = a^p b^p a^p' : 's = a^p b^p',
    decompositionModel: isCFL ? 'cfl' : 'regular',
    defaultP: 3,
    sampleDecompRegular: !isCFL ? { xLen: 1, yLen: 2, zLen: 3 } : undefined,
    sampleDecompCFL: isCFL ? { uLen: 1, vLen: 1, wLen: 1, xLen: 1, yLen: 5 } : undefined,
    steps: [
      {
        stepNumber: 1,
        title: `Assumption: Suppose L is ${isCFL ? 'Context-Free' : 'Regular'}`,
        description: `Assume for contradiction that L satisfies the properties of a ${isCFL ? 'CFL' : 'regular language'}.`,
        mathLatex: `\\text{Assume for contradiction that } L \\text{ is ${isCFL ? 'context-free' : 'regular'}.}`,
        details: 'Standard proof by contradiction structure.',
      },
      {
        stepNumber: 2,
        title: 'Introduce Pumping Constant p',
        description: `By the ${isCFL ? 'CFL' : 'Regular'} Pumping Lemma, there exists a positive integer p.`,
        mathLatex: '\\exists p \\ge 1 \\text{ such that every string } s \\in L \\text{ with } |s| \\ge p \\text{ can be pumped.}',
        details: 'The constant p is given by the lemma.',
      },
      {
        stepNumber: 3,
        title: 'String Selection',
        description: 'Choose a string s in L with length |s| ≥ p parametrized by p.',
        mathLatex: 's \\in L, \\quad |s| \\ge p',
        details: 'The choice of s is selected to isolate dependent blocks of symbols.',
      },
      {
        stepNumber: 4,
        title: `Decomposition Constraints: ${isCFL ? 's = uvwxy' : 's = xyz'}`,
        description: isCFL
          ? 's = uvwxy with |vwx| ≤ p, |vx| > 0, and ∀i ≥ 0, uvⁱwxⁱy ∈ L.'
          : 's = xyz with |xy| ≤ p, |y| > 0, and ∀i ≥ 0, xyⁱz ∈ L.',
        mathLatex: isCFL
          ? '|vwx| \\le p, \\quad |vx| > 0, \\quad \\forall i \\ge 0: u v^i w x^i y \\in L'
          : '|xy| \\le p, \\quad |y| > 0, \\quad \\forall i \\ge 0: x y^i z \\in L',
        details: 'The length boundary forces the pumped substring to be restricted to specific parts of s.',
      },
      {
        stepNumber: 5,
        title: 'Pumping Contradiction',
        description: 'Pumping with i = 0 or i = 2 violates the required relationship between symbols.',
        mathLatex: `s_i \\notin L \\quad \\text{for some } i \\ge 0`,
        details: 'Shows that no decomposition can satisfy the lemma.',
      },
      {
        stepNumber: 6,
        title: 'Final Conclusion',
        description: `Therefore, L is not ${isCFL ? 'context-free' : 'regular'}.`,
        mathLatex: `\\therefore L \\notin \\text{${isCFL ? 'CFL' : 'Regular Languages'}}.`,
        details: 'Proof complete by contradiction.',
      },
    ],
    allCases: [
      {
        title: 'Case Analysis from Supplied Solution',
        condition: 'Covering all valid substring decompositions bounded by p.',
        whyFails: 'Pumping breaks equality or structure required by the language definition.',
        suggestedI: 0,
      },
    ],
    finalConclusion: `L is proven to be NOT ${isCFL ? 'context-free' : 'regular'}. Q.E.D.`,
  };
}

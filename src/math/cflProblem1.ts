import type { DecompositionCFL, MembershipResult, ProofCaseCFL } from '../types/automata';

/**
 * Builds the base string s = a^p b^p a^p for Problem 1
 */
export function buildStringP1(p: number): {
  s: string;
  block1: string;
  block2: string;
  block3: string;
  totalLength: number;
} {
  const safeP = Math.max(1, Math.min(8, Math.floor(p)));
  const block1 = 'a'.repeat(safeP);
  const block2 = 'b'.repeat(safeP);
  const block3 = 'a'.repeat(safeP);
  return {
    s: block1 + block2 + block3,
    block1,
    block2,
    block3,
    totalLength: safeP * 3,
  };
}

/**
 * Validates whether a decomposition satisfies CFL Pumping Lemma constraints:
 * 1. |vwx| <= p
 * 2. |vx| > 0
 * 3. Total length |uvwxy| === |s|
 */
export function validateDecomposition(
  p: number,
  uLen: number,
  vLen: number,
  wLen: number,
  xLen: number,
  yLen: number
): {
  isValid: boolean;
  vwxValid: boolean;
  vxValid: boolean;
  totalValid: boolean;
  errors: string[];
} {
  const total = uLen + vLen + wLen + xLen + yLen;
  const targetTotal = 3 * p;
  const vwxLen = vLen + wLen + xLen;
  const vxLen = vLen + xLen;

  const vwxValid = vwxLen <= p;
  const vxValid = vxLen > 0;
  const totalValid = total === targetTotal;

  const errors: string[] = [];
  if (!vwxValid) {
    errors.push(`|vwx| = ${vwxLen} exceeds pumping length p = ${p}. Condition requires |vwx| ≤ p.`);
  }
  if (!vxValid) {
    errors.push(`|vx| = 0. Condition requires |vx| > 0 (at least one of v or x must be non-empty).`);
  }
  if (!totalValid) {
    errors.push(`Decomposition length ${total} does not equal |s| = ${targetTotal}.`);
  }

  return {
    isValid: vwxValid && vxValid && totalValid,
    vwxValid,
    vxValid,
    totalValid,
    errors,
  };
}

/**
 * Slices the string s into substrings u, v, w, x, y based on lengths
 */
export function sliceDecomposition(
  s: string,
  uLen: number,
  vLen: number,
  wLen: number,
  xLen: number,
  yLen: number
): DecompositionCFL {
  let idx = 0;
  const u = s.slice(idx, idx + uLen);
  idx += uLen;
  const v = s.slice(idx, idx + vLen);
  idx += vLen;
  const w = s.slice(idx, idx + wLen);
  idx += wLen;
  const x = s.slice(idx, idx + xLen);
  idx += xLen;
  const y = s.slice(idx, idx + yLen);

  return {
    u,
    v,
    w,
    x,
    y,
    uLen,
    vLen,
    wLen,
    xLen,
    yLen,
  };
}

/**
 * Generates the pumped string s_i = u v^i w x^i y
 */
export function pumpString(decomp: DecompositionCFL, i: number): {
  pumpedString: string;
  pumpedV: string;
  pumpedX: string;
  u: string;
  w: string;
  y: string;
  i: number;
} {
  const safeI = Math.max(0, Math.floor(i));
  const pumpedV = safeI === 0 ? '' : decomp.v.repeat(safeI);
  const pumpedX = safeI === 0 ? '' : decomp.x.repeat(safeI);
  const pumpedString = decomp.u + pumpedV + decomp.w + pumpedX + decomp.y;

  return {
    pumpedString,
    pumpedV,
    pumpedX,
    u: decomp.u,
    w: decomp.w,
    y: decomp.y,
    i: safeI,
  };
}

/**
 * Rigorous language membership verifier for L = { a^n b^n a^n | n >= 1 }
 * Checks:
 * 1. String must be in the form a+ b+ a+ (no other characters, correct sequential blocks)
 * 2. Number of first a's = Number of b's = Number of second a's = n, with n >= 1
 */
export function checkMembershipP1(str: string): MembershipResult {
  const totalLength = str.length;

  if (totalLength === 0) {
    return {
      isValid: false,
      reason: 'The string is empty (ε). The language L requires n ≥ 1, so the string cannot be empty.',
      a1Count: 0,
      bCount: 0,
      a2Count: 0,
      structuralOrderValid: false,
      equalCounts: false,
      totalLength: 0,
      breakdown: 'Empty string',
    };
  }

  // Check if string contains only 'a' and 'b'
  if (!/^[ab]+$/.test(str)) {
    return {
      isValid: false,
      reason: 'Contains invalid characters. The alphabet is Σ = {a, b}.',
      a1Count: 0,
      bCount: 0,
      a2Count: 0,
      structuralOrderValid: false,
      equalCounts: false,
      totalLength,
      breakdown: 'Alphabet violation',
    };
  }

  // Match three consecutive blocks: a+ then b+ then a+
  const match = str.match(/^(a+)(b+)(a+)$/);

  if (!match) {
    // If not matching a+ b+ a+, let's determine why:
    // Could have alternating symbols (e.g. abab...) or missing blocks
    const a1 = str.match(/^a+/)?.[0]?.length || 0;
    const remainingAfterA = str.slice(a1);
    const b = remainingAfterA.match(/^b+/)?.[0]?.length || 0;
    const remainingAfterB = remainingAfterA.slice(b);
    const a2 = remainingAfterB.match(/^a+/)?.[0]?.length || 0;
    const extra = remainingAfterB.slice(a2);

    let specificReason = 'The string does not have the structure a⁺b⁺a⁺.';
    if (extra.length > 0) {
      specificReason = `Pumping generated symbols out of order (extra "${extra.slice(0, 8)}..."). The string is not of the form a*b*a*.`;
    } else if (b === 0) {
      specificReason = 'The middle block of b\'s is completely missing (zero b\'s).';
    } else if (a1 === 0 || a2 === 0) {
      specificReason = 'One of the required blocks of a\'s is missing.';
    }

    return {
      isValid: false,
      reason: specificReason,
      a1Count: a1,
      bCount: b,
      a2Count: a2,
      structuralOrderValid: false,
      equalCounts: false,
      totalLength,
      breakdown: `a¹: ${a1}, b: ${b}, a²: ${a2}${extra ? `, extra: ${extra}` : ''}`,
    };
  }

  const a1Count = match[1].length;
  const bCount = match[2].length;
  const a2Count = match[3].length;

  const equalCounts = a1Count === bCount && bCount === a2Count;

  if (equalCounts) {
    return {
      isValid: true,
      reason: `Belongs to L! Form aⁿbⁿaⁿ with n = ${a1Count} (all three blocks have exactly ${a1Count} symbols).`,
      a1Count,
      bCount,
      a2Count,
      structuralOrderValid: true,
      equalCounts: true,
      totalLength,
      breakdown: `a${a1Count} b${bCount} a${a2Count}`,
    };
  }

  return {
    isValid: false,
    reason: `Counts are unequal! Block 1 has ${a1Count} a's, Block 2 has ${bCount} b's, Block 3 has ${a2Count} a's. For membership in L, all three counts must be strictly equal (n = ${a1Count} ≠ ${bCount} or ≠ ${a2Count}).`,
    a1Count,
    bCount,
    a2Count,
    structuralOrderValid: true,
    equalCounts: false,
    totalLength,
    breakdown: `a${a1Count} b${bCount} a${a2Count} (Unequal: ${a1Count} vs ${bCount} vs ${a2Count})`,
  };
}

/**
 * Standard exhaustive 5 proof cases covering all valid decompositions for s = a^p b^p a^p
 */
export function getStandardCasesP1(p: number): ProofCaseCFL[] {
  return [
    {
      id: 'case1',
      name: 'Case 1: vwx is entirely within Block 1 (aᵖ)',
      shortDesc: 'vwx ⊆ 1st block of a\'s',
      vwxLocation: 'block1',
      description:
        `The substring vwx is completely contained in the first block of a's. Thus, v and x consist exclusively of a's from Block 1.`,
      sampleDecomp: {
        uLen: Math.max(0, p - 2),
        vLen: 1,
        wLen: 0,
        xLen: 1,
        yLen: 2 * p,
      },
      whyItFails:
        `Because vx contains only a's from Block 1, pumping changes the count of the first block of a's while the middle block of b's and the second block of a's remain fixed at length p. For i = 0, the first block has < p a's while Block 3 has p a's. For i = 2, the first block has > p a's while Block 3 has p a's. Hence the counts cannot be equal.`,
      recommendedI: 0,
      pumpedExplanation:
        `With i = 0 (pumping down), we remove v and x. The first block of a's decreases to p - |vx| < p, while the second block of a's remains at p. Thus count(a¹) ≠ count(a²).`,
    },
    {
      id: 'case2',
      name: 'Case 2: vwx straddles Block 1 (aᵖ) and Block 2 (bᵖ)',
      shortDesc: 'vwx overlaps 1st a\'s and b\'s',
      vwxLocation: 'block1-2',
      description:
        `The substring vwx crosses the boundary between the first block of a's and the block of b's. Note that vwx cannot contain any symbols from the second block of a's because |vwx| ≤ p and the entire block of b's has length p.`,
      sampleDecomp: {
        uLen: p - 1,
        vLen: 1, // last 'a' of block 1
        wLen: 0,
        xLen: 1, // first 'b' of block 2
        yLen: 2 * p - 1,
      },
      whyItFails:
        `Two subcases occur: (a) If v or x contains both a and b, pumping i = 2 duplicates that mixed substring, causing a's and b's to interleave (e.g. ...abab...), so the string is no longer even in the form a*b*a*. (b) If v is purely a's and x is purely b's, neither v nor x contains any symbols from the second block of a's (Block 3). Thus Block 3 remains strictly with p a's. Pumping i = 0 or i = 2 changes the number of first a's and/or b's, making it impossible for all three blocks to maintain equal count p.`,
      recommendedI: 2,
      pumpedExplanation:
        `With i = 2 (pumping up), the counts of first a's and/or b's increase above p, but Block 3 remains untouched at p a's. Alternatively, if v or x straddles the boundary, pumping produces out-of-order characters.`,
    },
    {
      id: 'case3',
      name: 'Case 3: vwx is entirely within Block 2 (bᵖ)',
      shortDesc: 'vwx ⊆ block of b\'s',
      vwxLocation: 'block2',
      description:
        `The substring vwx is completely contained in the middle block of b's. Therefore, v and x consist exclusively of b's.`,
      sampleDecomp: {
        uLen: p,
        vLen: 1,
        wLen: 0,
        xLen: 1,
        yLen: 2 * p - 2,
      },
      whyItFails:
        `Since vx consists entirely of b's, pumping changes only the number of b's. Both the first block of a's and the second block of a's remain completely untouched with exactly p a's each. For i = 0, the number of b's is p - |vx| < p. For i = 2, the number of b's is p + |vx| > p. In neither case does the number of b's equal the number of a's.`,
      recommendedI: 0,
      pumpedExplanation:
        `With i = 0 (pumping down), the number of b's becomes strictly less than p, while both blocks of a's have length p. Thus count(b) < count(a¹), violating membership.`,
    },
    {
      id: 'case4',
      name: 'Case 4: vwx straddles Block 2 (bᵖ) and Block 3 (aᵖ)',
      shortDesc: 'vwx overlaps b\'s and 2nd a\'s',
      vwxLocation: 'block2-3',
      description:
        `The substring vwx crosses the boundary between the block of b's and the second block of a's. Note that vwx cannot reach the first block of a's because the entire block of b's separates them and |vwx| ≤ p.`,
      sampleDecomp: {
        uLen: 2 * p - 1,
        vLen: 1, // last 'b' of block 2
        wLen: 0,
        xLen: 1, // first 'a' of block 3
        yLen: p - 1,
      },
      whyItFails:
        `Because vwx is restricted to Block 2 and Block 3, vx contains zero symbols from the first block of a's (Block 1). Therefore, Block 1 remains rigidly fixed at p a's. If v or x contains both b and a, pumping i = 2 introduces out-of-order b's and a's. If v is all b's and x is all a's, pumping i = 0 or i = 2 changes the b's and/or second a's, but leaves Block 1 with p a's. In all instances, equality with Block 1 is broken.`,
      recommendedI: 2,
      pumpedExplanation:
        `With i = 2, either the string gains out-of-order characters (...ba...), or the count of b's and second a's changes while Block 1 stays at p a's. Thus s₂ ∉ L.`,
    },
    {
      id: 'case5',
      name: 'Case 5: vwx is entirely within Block 3 (second aᵖ)',
      shortDesc: 'vwx ⊆ 2nd block of a\'s',
      vwxLocation: 'block3',
      description:
        `The substring vwx is completely contained in the second block of a's. Therefore, v and x consist exclusively of a's from Block 3.`,
      sampleDecomp: {
        uLen: 2 * p,
        vLen: 1,
        wLen: 0,
        xLen: 1,
        yLen: Math.max(0, p - 2),
      },
      whyItFails:
        `Since vx contains only a's from Block 3, pumping alters only the count of the second block of a's. The first block of a's and the middle block of b's remain unchanged with exactly p symbols each. For i = 0, count(a²) = p - |vx| < p. For i = 2, count(a²) = p + |vx| > p. Both violate count(a¹) = count(b) = count(a²).`,
      recommendedI: 0,
      pumpedExplanation:
        `With i = 0 (pumping down), the second block of a's has length p - |vx| < p, while the first block still has p a's. Thus count(a¹) ≠ count(a²).`,
    },
  ];
}

/**
 * Step descriptions for the Problem 1 presentation flow (10 steps)
 */
export const P1_STEPS = [
  {
    step: 1,
    title: 'Assumption: Proof by Contradiction',
    tag: 'Formal Setup',
    latex: '\\text{Assume for contradiction that } L = \\{a^n b^n a^n \\mid n \\ge 1\\} \\text{ is context-free.}',
    summary:
      'We begin the indirect proof by contradiction. If L were a Context-Free Language (CFL), it would satisfy the CFL Pumping Lemma.',
    speakerNotes:
      'Begin your presentation by emphasizing that the Pumping Lemma is a necessary property of context-free languages. To prove a language is not context-free, we assume it is context-free and derive a contradiction.',
  },
  {
    step: 2,
    title: 'Introduce Pumping Length p',
    tag: 'Pumping Constant',
    latex: '\\exists p \\ge 1 \\text{ such that any } s \\in L \\text{ with } |s| \\ge p \\text{ satisfies the lemma.}',
    summary:
      'By the CFL Pumping Lemma, there exists a constant integer p ≥ 1 (the pumping length, tied to Chomsky Normal Form parse tree height) guaranteed for L.',
    speakerNotes:
      'Explain that we do not know the exact value of p, but the lemma asserts that such a constant p exists. The proof works for ANY arbitrary positive integer p.',
  },
  {
    step: 3,
    title: 'Select String s = aᵖ bᵖ aᵖ',
    tag: 'String Choice',
    latex: 's = a^p b^p a^p \\in L, \\quad |s| = 3p \\ge p',
    summary:
      'We strategically choose the string s = aᵖbᵖaᵖ. Since n = p ≥ 1, s clearly belongs to L, and its length |s| = 3p is strictly greater than p.',
    speakerNotes:
      'Highlight to your audience: in the quantifier game, the opponent gave us p, but WE have the freedom to pick any valid string s in L of length ≥ p. Choosing s = aᵖbᵖaᵖ isolates each block with length p.',
  },
  {
    step: 4,
    title: 'CFL Decomposition: s = uvwxy',
    tag: 'Decomposition Rule',
    latex: 's = uvwxy \\quad \\text{such that} \\quad |vwx| \\le p, \\quad |vx| > 0, \\quad \\forall i \\ge 0: u v^i w x^i y \\in L',
    summary:
      'The CFL Pumping Lemma states that s must be decomposable into five substrings uvwxy subject to: (1) |vwx| ≤ p, (2) |vx| > 0, and (3) for all i ≥ 0, uvⁱwxⁱy ∈ L.',
    speakerNotes:
      'Note the two essential restrictions: |vwx| ≤ p bounds the window size, and |vx| > 0 guarantees that we are not pumping the empty string.',
  },
  {
    step: 5,
    title: 'Display String in Three Distinct Blocks',
    tag: 'String Visualization',
    latex: 's = \\underbrace{a \\dots a}_{\\text{Block 1: } a^p} \\; \\underbrace{b \\dots b}_{\\text{Block 2: } b^p} \\; \\underbrace{a \\dots a}_{\\text{Block 3: } a^p}',
    summary:
      'The string s is partitioned into three visually distinct blocks of size p each: first aᵖ, middle bᵖ, and second aᵖ.',
    speakerNotes:
      'Point to the screen showing the three colored blocks. Notice that between Block 1 and Block 3 lies the entire middle block of p b\'s.',
  },
  {
    step: 6,
    title: 'Interactive Decomposition Explorer',
    tag: 'Interactive Exploration',
    latex: 's = u \\cdot v \\cdot w \\cdot x \\cdot y',
    summary:
      'Explore possible partitions of s into u, v, w, x, and y. Observe the color-coded tokens and verify that |vwx| ≤ p and |vx| > 0.',
    speakerNotes:
      'Invite questions or demonstrate by moving the sliders: show that any chosen partition must strictly obey |vwx| ≤ p and |vx| > 0.',
  },
  {
    step: 7,
    title: 'The Window Constraint: |vwx| ≤ p',
    tag: 'Crucial Geometric Insight',
    latex: '|vwx| \\le p \\implies vwx \\text{ cannot touch both Block 1 and Block 3.}',
    summary:
      'Because |vwx| ≤ p, the window vwx has a maximum span of p. Since the entire middle block bᵖ has length p, any substring touching both Block 1 and Block 3 would require length ≥ p + 2 > p! Thus, vwx can only reside in 1 block or overlap 2 adjacent blocks.',
    speakerNotes:
      'This is the geometric heart of the proof. The buffer of p b\'s prevents vwx from ever touching both blocks of a\'s simultaneously. Therefore, vwx can never balance all three blocks.',
  },
  {
    step: 8,
    title: 'Demonstrate Pumping: i = 0 and i = 2',
    tag: 'Animated Pumping',
    latex: 's_0 = u w y \\quad (i=0) \\qquad s_2 = u v^2 w x^2 y \\quad (i=2)',
    summary:
      'Watch what happens when we pump: for i = 0 (pumping down), v and x vanish. For i = 2 (pumping up), v and x are duplicated. Compare the resulting string with L.',
    speakerNotes:
      'Show the visual animation: watch the green (v) and red (x) segments vanish when i=0, or clone themselves when i=2. Explain why i=0 and i=2 are the standard test values in textbook proofs.',
  },
  {
    step: 9,
    title: 'Why Membership Fails: Unequal Counts or Malformed Order',
    tag: 'Failure Analysis',
    latex: 's_i \\notin L \\quad \\text{because } N_a^{(1)} \\ne N_b \\text{ or } N_b \\ne N_a^{(2)} \\text{ or symbols out of order.}',
    summary:
      'In all 5 possible cases, pumping with i = 0 or i = 2 changes the count of at most two blocks, leaving at least one block unchanged at p symbols. This destroys the required equality aⁿbⁿaⁿ, or causes interleaving like abab...',
    speakerNotes:
      'Explain that because vwx cannot touch all three blocks, pumping is inherently unbalanced: whichever block is left untouched remains with p symbols, but the other blocks change count!',
  },
  {
    step: 10,
    title: 'Exhaustive Contradiction: L is Not Context-Free',
    tag: 'Final Proof & Conclusion',
    latex: '\\text{Contradiction: No valid decomposition exists. } \\therefore L = \\{a^n b^n a^n \\mid n \\ge 1\\} \\notin \\text{CFL}.',
    summary:
      'Since EVERY decomposition satisfying the pumping lemma conditions fails for some i ≥ 0, the pumping lemma does not hold for L. The initial assumption that L is context-free must be false. Hence, L is not context-free. Q.E.D.',
    speakerNotes:
      'Deliver your concluding remarks: We did not just test one decomposition—we exhaustively proved that ALL possible decompositions fail. Thus, L is definitively not a context-free language.',
  },
];

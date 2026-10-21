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
 * Step descriptions for Problem 1 interactive proof (8 canonical steps)
 */
export const P1_STEPS = [
  {
    step: 1,
    title: 'Step 1: Language Definition & Three-Block Structure',
    tag: 'Language Structure',
    latex: 'L = \\{ a^n b^n a^n \\mid n \\ge 1 \\}',
    summary:
      "Language definition: L consists of strings with an equal positive number of a's, b's, and a's in three consecutive blocks. For n = 1: 'aba'; n = 2: 'aabbaa'; n = 3: 'aaabbbaaa'. Every string requires exactly three consecutive homogeneous blocks with strictly identical symbol counts.",
    speakerNotes:
      "Start by explaining the three consecutive blocks: first a^n, then b^n, then a^n. Note that ordinary pushdown automata have only one stack, making it impossible to check two independent balance comparisons (a's with b's, and b's with second a's) simultaneously.",
  },
  {
    step: 2,
    title: 'Step 2: Assume Context-Free & Introduce Pumping Length p',
    tag: 'Proof by Contradiction',
    latex: '\\text{Assume } L \\in \\text{CFL} \\implies \\exists p \\ge 1 \\text{ (pumping length)}',
    summary:
      'We assume for the sake of contradiction that L is context-free. According to the Pumping Lemma for Context-Free Languages, there exists a pumping length constant p ≥ 1 (tied to Chomsky Normal Form parse tree heights) guaranteed for L.',
    speakerNotes:
      'Emphasize that the proof proceeds by contradiction. We do not know the exact value of p, but the lemma guarantees that such a constant p exists. The argument must hold for ANY arbitrary positive integer p.',
  },
  {
    step: 3,
    title: 'Step 3: Select String s = aᵖ bᵖ aᵖ',
    tag: 'Strategic String Choice',
    latex: 's = a^p b^p a^p \\in L, \\quad |s| = 3p \\ge p',
    summary:
      'In the quantifier game, we strategically choose the string s = aᵖbᵖaᵖ. Since n = p ≥ 1, s clearly belongs to L, and its total length |s| = 3p is strictly greater than or equal to p.',
    speakerNotes:
      'Highlight to your audience: in the quantifier game, the opponent gave us p, but WE have the choice of s. Choosing s = aᵖbᵖaᵖ ensures each block has length p, creating a vital buffer of size p between the first and third blocks.',
  },
  {
    step: 4,
    title: 'Step 4: Introduce Decomposition s = uvwxy & Conditions',
    tag: 'Lemma Conditions',
    latex: 's = uvwxy \\quad \\text{s.t.} \\quad |vwx| \\le p, \\quad |vx| > 0, \\quad \\forall i \\ge 0: u v^i w x^i y \\in L',
    summary:
      'The CFL Pumping Lemma asserts that s can be decomposed into five substrings s = uvwxy satisfying three fundamental conditions: (1) |vwx| ≤ p (bounded pumping window), (2) |vx| > 0 (at least one of v or x is non-empty), and (3) for every integer i ≥ 0, uvⁱwxⁱy must belong to L.',
    speakerNotes:
      'Point out the two critical constraints: |vwx| ≤ p restricts the maximum window span, and |vx| > 0 ensures we are pumping actual characters rather than the empty string.',
  },
  {
    step: 5,
    title: 'Step 5: Visualize 3 Blocks & Explore Valid Decompositions',
    tag: 'Visual String Slices',
    latex: 's = \\underbrace{a \\dots a}_{\\text{Block 1: } a^p} \\; \\underbrace{b \\dots b}_{\\text{Block 2: } b^p} \\; \\underbrace{a \\dots a}_{\\text{Block 3: } a^p}',
    summary:
      "Visualize the three blocks of the selected string with distinct colors (Block 1 in Cyan, Block 2 in Purple, Block 3 in Indigo). Explore valid decompositions and inspect u, v, w, x, y along with their lengths and character slice positions [start, end).",
    speakerNotes:
      'Demonstrate the interactive token bars. Show how adjusting the sliders dynamically reveals the exact substring lengths and slice boundaries, confirming conditions |vwx| ≤ p and |vx| > 0 in real time.',
  },
  {
    step: 6,
    title: 'Step 6: Pumping Controls for i = 0, 1, and 2',
    tag: 'Animated Pumping Controls',
    latex: 's_0 = u w y \\quad (i=0) \\qquad s_2 = u v^2 w x^2 y \\quad (i=2)',
    summary:
      'Add pumping controls for i = 0, 1, and 2. Animate the deletion of v and x when i = 0 (pumping down), or the duplication of v and x when i = 2 (pumping up). The resulting string is displayed and evaluated live against the language definition.',
    speakerNotes:
      'Click i = 0 to watch v and x vanish, or i = 2 to see them duplicate. Point to the live membership card showing why the pumped string immediately violates the equal block count or ordering.',
  },
  {
    step: 7,
    title: 'Step 7: The Proof: Why All Decompositions Fail (|vwx| ≤ p)',
    tag: 'Rigorous Case Analysis',
    latex: '|vwx| \\le p \\implies vwx \\text{ cannot cover both Block 1 and Block 3}',
    summary:
      "Because |vwx| ≤ p, vwx cannot cover both the first and third blocks of aᵖbᵖaᵖ, as the intervening middle block bᵖ alone has length p (spanning both blocks of a's would require |vwx| ≥ p + 2 > p). Since |vx| > 0, pumping changes at least one of the block counts, while at least one block remains fixed at p symbols. Hence, the pumped string cannot preserve the required equal three-block structure in all 5 exhaustive cases.",
    speakerNotes:
      "This is the heart of the mathematical proof. Because vwx can touch at most two adjacent blocks, pumping with i = 0 or i = 2 leaves whichever block was untouched with p symbols, breaking equality. Test each of the 5 cases on screen.",
  },
  {
    step: 8,
    title: 'Step 8: Contradiction & Conclusion: L is Not Context-Free',
    tag: 'Final Proof & Conclusion',
    latex: '\\text{Contradiction!} \\quad \\forall \\text{ valid } uvwxy, \\exists i \\ge 0: u v^i w x^i y \\notin L \\implies L \\notin \\text{CFL} \\quad \\blacksquare',
    summary:
      'Since EVERY valid decomposition satisfying the pumping lemma conditions fails for some i ≥ 0, the pumping lemma does not hold for L. The initial assumption that L is context-free is false. Therefore, L = { aⁿ bⁿ aⁿ | n ≥ 1 } is not context-free. Q.E.D.',
    speakerNotes:
      'Deliver the final conclusion: We have mathematically proved that no context-free grammar or pushdown automaton can recognize L. The language is strictly context-sensitive.',
  },
];

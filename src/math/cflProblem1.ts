import type {
  DecompositionCFL,
  FormulaMode,
  LanguageType,
  MembershipResult,
  NotationMode,
  ProofCaseCFL,
} from '../types/automata';

/**
 * Computes run-length encoding (e.g. 'a15 b7 c7' or 'a11 b11 a7')
 */
export function computeRuns(str: string): string {
  if (!str) return 'empty';
  const runs: { char: string; count: number }[] = [];
  for (const c of str) {
    if (runs.length > 0 && runs[runs.length - 1].char === c) {
      runs[runs.length - 1].count++;
    } else {
      runs.push({ char: c, count: 1 });
    }
  }
  return runs.map(r => `${r.char}${r.count}`).join(' ');
}

/**
 * Builds the base string for Problem 1:
 * - 'notebook': s = a^p a a b^p b b a^p a a (i.e. a^{p+2} b^{p+2} a^{p+2}; let p=5 gives 7 a's, 7 b's, 7 a's; |s| = 21)
 * - 'standard': s = a^p b^p a^p (for p=5 gives 5 a's, 5 b's, 5 a's; |s| = 15)
 * Also supports languageType: 'anbnan' or 'anbncn'
 */
export function buildStringP1(
  p: number,
  formulaMode: FormulaMode = 'notebook',
  languageType: LanguageType = 'anbnan'
): {
  s: string;
  block1: string;
  block2: string;
  block3: string;
  totalLength: number;
  blockSize: number;
  formulaMode: FormulaMode;
  languageType: LanguageType;
  formulaLatex: string;
  formulaText: string;
} {
  const safeP = Math.max(1, Math.min(8, Math.floor(p)));
  const blockSize = formulaMode === 'notebook' ? safeP + 2 : safeP;
  const block1 = 'a'.repeat(blockSize);
  const block2 = 'b'.repeat(blockSize);
  const thirdChar = languageType === 'anbncn' ? 'c' : 'a';
  const block3 = thirdChar.repeat(blockSize);
  const s = block1 + block2 + block3;

  const sym = thirdChar;

  return {
    s,
    block1,
    block2,
    block3,
    totalLength: blockSize * 3,
    blockSize,
    formulaMode,
    languageType,
    formulaLatex:
      formulaMode === 'notebook'
        ? `s = a^p a a \\, b^p b b \\, ${sym}^p ${sym} ${sym} = a^{${safeP}+2} b^{${safeP}+2} ${sym}^{${safeP}+2} = a^{${blockSize}} b^{${blockSize}} ${sym}^{${blockSize}}`
        : `s = a^p b^p ${sym}^p = a^{${safeP}} b^{${safeP}} ${sym}^{${safeP}}`,
    formulaText:
      formulaMode === 'notebook'
        ? `s = aᵖ a a bᵖ b b ${sym}ᵖ ${sym} ${sym} (n = p + 2 = ${blockSize}, |s| = ${blockSize * 3})`
        : `s = aᵖ bᵖ ${sym}ᵖ (n = p = ${safeP}, |s| = ${safeP * 3})`,
  };
}

/**
 * Validates whether a decomposition satisfies CFL Pumping Lemma constraints:
 * In notebook notation (uvxyz):
 * 1. |vxy| <= p
 * 2. |vy| > 0
 * 3. Total length |uvxyz| === |s|
 * In standard notation (uvwxy):
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
  yLen: number,
  formulaMode: FormulaMode = 'notebook',
  notationMode: NotationMode = 'uvxyz'
): {
  isValid: boolean;
  vwxValid: boolean;
  vxValid: boolean;
  totalValid: boolean;
  errors: string[];
} {
  const total = uLen + vLen + wLen + xLen + yLen;
  const targetTotal = formulaMode === 'notebook' ? 3 * (p + 2) : 3 * p;
  const windowLen = vLen + wLen + xLen;
  const pumpedLen = vLen + xLen;

  const windowValid = windowLen <= p;
  const pumpedValid = pumpedLen > 0;
  const totalValid = total === targetTotal;

  const windowLabel = notationMode === 'uvxyz' ? '|vxy|' : '|vwx|';
  const pumpedLabel = notationMode === 'uvxyz' ? '|vy|' : '|vx|';

  const errors: string[] = [];
  if (!windowValid) {
    errors.push(
      `${windowLabel} = ${windowLen} exceeds pumping length p = ${p}. Condition requires ${windowLabel} ≤ p.`
    );
  }
  if (!pumpedValid) {
    errors.push(
      `${pumpedLabel} = 0. Condition requires ${pumpedLabel} > 0 (at least one pumped part must be non-empty).`
    );
  }
  if (!totalValid) {
    errors.push(
      `Decomposition length ${total} does not equal |s| = ${targetTotal}.`
    );
  }

  return {
    isValid: windowValid && pumpedValid && totalValid,
    vwxValid: windowValid,
    vxValid: pumpedValid,
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
 * Generates the pumped string:
 * - In uvwxy notation: s_i = u v^i w x^i y
 * - In uvxyz notation: s_i = u v^i x y^i z
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
 * Rigorous language membership verifier for L = { a^n b^n a^n | n >= 1 } or L = { a^n b^n c^n | n >= 1 }
 * Checks:
 * 1. String must be in the form a+ b+ a+ (or a+ b+ c+)
 * 2. Number of first block = Number of second block = Number of third block = n, with n >= 1
 */
export function checkMembershipP1(
  str: string,
  languageType: LanguageType = 'anbnan'
): MembershipResult {
  const totalLength = str.length;
  const runsText = computeRuns(str);
  const thirdSymbol: 'a' | 'c' = languageType === 'anbncn' ? 'c' : 'a';

  if (totalLength === 0) {
    return {
      isValid: false,
      reason: 'The string is empty (ε). The language L requires n ≥ 1, so the string cannot be empty.',
      a1Count: 0,
      bCount: 0,
      a2Count: 0,
      thirdSymbol,
      structuralOrderValid: false,
      equalCounts: false,
      totalLength: 0,
      breakdown: 'Empty string',
      runsText: 'empty',
    };
  }

  // Check valid characters
  const validCharsRegex = languageType === 'anbncn' ? /^[abc]+$/ : /^[ab]+$/;
  const alphabetStr = languageType === 'anbncn' ? 'Σ = {a, b, c}' : 'Σ = {a, b}';

  if (!validCharsRegex.test(str)) {
    return {
      isValid: false,
      reason: `Contains invalid characters. The alphabet is ${alphabetStr}.`,
      a1Count: 0,
      bCount: 0,
      a2Count: 0,
      thirdSymbol,
      structuralOrderValid: false,
      equalCounts: false,
      totalLength,
      breakdown: 'Alphabet violation',
      runsText,
    };
  }

  // Match three consecutive blocks
  const pattern = languageType === 'anbncn' ? /^(a+)(b+)(c+)$/ : /^(a+)(b+)(a+)$/;
  const match = str.match(pattern);

  if (!match) {
    const a1 = str.match(/^a+/)?.[0]?.length || 0;
    const remainingAfterA = str.slice(a1);
    const b = remainingAfterA.match(/^b+/)?.[0]?.length || 0;
    const remainingAfterB = remainingAfterA.slice(b);
    const a2Pattern = languageType === 'anbncn' ? /^c+/ : /^a+/;
    const a2 = remainingAfterB.match(a2Pattern)?.[0]?.length || 0;
    const extra = remainingAfterB.slice(a2);

    const targetPatternName = languageType === 'anbncn' ? 'a⁺b⁺c⁺' : 'a⁺b⁺a⁺';
    let specificReason = `The string does not have the structure ${targetPatternName}.`;
    if (extra.length > 0) {
      specificReason = `Pumping generated symbols out of order (extra "${extra.slice(0, 8)}..."). The string is not of the form ${targetPatternName}.`;
    } else if (b === 0) {
      specificReason = "The middle block of b's is completely missing (zero b's).";
    } else if (a1 === 0 || a2 === 0) {
      specificReason = `One of the required blocks (${a1 === 0 ? "first a's" : languageType === 'anbncn' ? "c's" : "second a's"}) is missing.`;
    }

    const thirdLabel = languageType === 'anbncn' ? 'c' : 'a²';
    return {
      isValid: false,
      reason: specificReason,
      a1Count: a1,
      bCount: b,
      a2Count: a2,
      thirdSymbol,
      structuralOrderValid: false,
      equalCounts: false,
      totalLength,
      breakdown: `a¹: ${a1}, b: ${b}, ${thirdLabel}: ${a2}${extra ? `, extra: ${extra}` : ''}`,
      runsText,
    };
  }

  const a1Count = match[1].length;
  const bCount = match[2].length;
  const a2Count = match[3].length;

  const equalCounts = a1Count === bCount && bCount === a2Count;
  const langLabel = languageType === 'anbncn' ? 'aⁿbⁿcⁿ' : 'aⁿbⁿaⁿ';
  const thirdCharName = languageType === 'anbncn' ? "c's" : "a's";

  if (equalCounts) {
    return {
      isValid: true,
      reason: `Belongs to L! Form ${langLabel} with n = ${a1Count} (all three blocks have exactly ${a1Count} symbols).`,
      a1Count,
      bCount,
      a2Count,
      thirdSymbol,
      structuralOrderValid: true,
      equalCounts: true,
      totalLength,
      breakdown: `${languageType === 'anbncn' ? `a${a1Count} b${bCount} c${a2Count}` : `a${a1Count} b${bCount} a${a2Count}`}`,
      runsText,
    };
  }

  return {
    isValid: false,
    reason: `Counts are unequal! Block 1 has ${a1Count} a's, Block 2 has ${bCount} b's, Block 3 has ${a2Count} ${thirdCharName}. For membership in L, all three counts must be strictly equal (n = ${a1Count} ≠ ${bCount} or ≠ ${a2Count}).`,
    a1Count,
    bCount,
    a2Count,
    thirdSymbol,
    structuralOrderValid: true,
    equalCounts: false,
    totalLength,
    breakdown: `a${a1Count} b${bCount} ${languageType === 'anbncn' ? 'c' : 'a'}${a2Count} (Unequal: ${a1Count} vs ${bCount} vs ${a2Count})`,
    runsText,
  };
}

/**
 * Standard exhaustive 5 proof cases covering all valid decompositions:
 * Works for both formula modes (notebook: s = a^p a a b^p b b a^p a a, standard: s = a^p b^p a^p)
 * and both notation styles (uvxyz vs uvwxy).
 */
export function getStandardCasesP1(
  p: number,
  formulaMode: FormulaMode = 'notebook',
  notationMode: NotationMode = 'uvxyz',
  languageType: LanguageType = 'anbnan'
): ProofCaseCFL[] {
  const safeP = Math.max(1, Math.min(8, Math.floor(p)));
  const k = formulaMode === 'notebook' ? safeP + 2 : safeP;
  const total = 3 * k;
  const wnd = notationMode === 'uvxyz' ? 'vxy' : 'vwx';
  const pmp = notationMode === 'uvxyz' ? 'vy' : 'vx';

  // Sample decompositions tailored for each case
  // Case 1: Window in Block 1 (matches user's photo with u=2, v=2, x=1, y=2, z=14 for p=5)
  const c1V = formulaMode === 'notebook' && safeP >= 5 ? 2 : 1;
  const c1W = formulaMode === 'notebook' && safeP >= 5 ? 1 : 0;
  const c1X = formulaMode === 'notebook' && safeP >= 5 ? 2 : 1;
  const c1U = Math.max(0, k - (c1V + c1W + c1X));
  const c1Y = total - (c1U + c1V + c1W + c1X);

  // Case 2: Straddles Block 1 & Block 2 (matches handwritten notes Step 6: |vxy| <= 5, |vy| > 0)
  const c2V = formulaMode === 'notebook' ? 2 : 1;
  const c2W = formulaMode === 'notebook' && safeP >= 5 ? 1 : 0;
  const c2X = formulaMode === 'notebook' && safeP >= 5 ? 2 : 1;
  const c2U = Math.max(0, k - c2V);
  const c2Y = total - (c2U + c2V + c2W + c2X);

  // Case 3: In Block 2
  const c3V = formulaMode === 'notebook' && safeP >= 5 ? 2 : 1;
  const c3W = formulaMode === 'notebook' && safeP >= 5 ? 1 : 0;
  const c3X = formulaMode === 'notebook' && safeP >= 5 ? 2 : 1;
  const c3U = k;
  const c3Y = total - (c3U + c3V + c3W + c3X);

  // Case 4: Straddles Block 2 & Block 3
  const c4V = formulaMode === 'notebook' && safeP >= 5 ? 2 : 1;
  const c4W = formulaMode === 'notebook' && safeP >= 5 ? 1 : 0;
  const c4X = formulaMode === 'notebook' && safeP >= 5 ? 2 : 1;
  const c4U = 2 * k - (c4V + c4W);
  const c4Y = total - (c4U + c4V + c4W + c4X);

  // Case 5: In Block 3
  const c5V = formulaMode === 'notebook' ? 2 : 1;
  const c5W = 0;
  const c5X = 1;
  const c5U = 2 * k;
  const c5Y = total - (c5U + c5V + c5W + c5X);

  const thirdCharUpper = languageType === 'anbncn' ? 'c' : 'a';
  const block1Desc = formulaMode === 'notebook' ? 'Block 1 (aᵖ a a)' : 'Block 1 (aᵖ)';
  const block2Desc = formulaMode === 'notebook' ? 'Block 2 (bᵖ b b)' : 'Block 2 (bᵖ)';
  const block3Desc = formulaMode === 'notebook' ? `Block 3 (${thirdCharUpper}ᵖ ${thirdCharUpper} ${thirdCharUpper})` : `Block 3 (${thirdCharUpper}ᵖ)`;

  return [
    {
      id: 'case1',
      name: `Case 1: ${wnd} is entirely within ${block1Desc}`,
      shortDesc: `${wnd} ⊆ 1st block of a's`,
      vwxLocation: 'block1',
      description:
        `The substring ${wnd} is completely contained in the first block of a's. Thus, ${pmp} consists exclusively of a's from Block 1.`,
      sampleDecomp: {
        uLen: c1U,
        vLen: c1V,
        wLen: c1W,
        xLen: c1X,
        yLen: c1Y,
      },
      whyItFails:
        `Because ${pmp} contains only a's from Block 1, pumping changes the count of the first block of a's while the middle block of b's and the second block of a's remain fixed at length ${k}. For i = 0 (pumping down) or i = 3 (pumping up), the counts become unequal.`,
      recommendedI: 3,
      pumpedExplanation:
        `With i = 3 (pumping up 3x as in Step 7), the first block of a's expands while Block 2 and Block 3 remain at ${k}. Thus count(a¹) ≠ count(a²).`,
    },
    {
      id: 'case2',
      name: `Case 2: ${wnd} straddles ${block1Desc} and ${block2Desc}`,
      shortDesc: `${wnd} overlaps 1st a's and b's (Notes Step 6)`,
      vwxLocation: 'block1-2',
      description:
        `The substring ${wnd} crosses the boundary between the first block of a's and the block of b's (matching Step 6: |${wnd}| ≤ ${safeP}, |${pmp}| > 0). It cannot reach Block 3 because Block 2 alone has ${k} b's and |${wnd}| ≤ ${safeP} < ${k}.`,
      sampleDecomp: {
        uLen: c2U,
        vLen: c2V,
        wLen: c2W,
        xLen: c2X,
        yLen: c2Y,
      },
      whyItFails:
        `Because ${wnd} cannot reach Block 3, Block 3 remains rigidly fixed at ${k} a's. Pumping with i = 3 increases the first block of a's and middle b's, leaving Block 3 behind. Thus equality is broken.`,
      recommendedI: 3,
      pumpedExplanation:
        `With i = 3 (Step 7: let i = 3), the pumped string has unequal symbol counts (e.g. 11 a's, 11 b's, but only 7 a's in Block 3). Thus s₃ ∉ L.`,
    },
    {
      id: 'case3',
      name: `Case 3: ${wnd} is entirely within ${block2Desc}`,
      shortDesc: `${wnd} ⊆ middle block of b's`,
      vwxLocation: 'block2',
      description:
        `The substring ${wnd} is completely contained in the middle block of b's. Therefore, ${pmp} consists exclusively of b's.`,
      sampleDecomp: {
        uLen: c3U,
        vLen: c3V,
        wLen: c3W,
        xLen: c3X,
        yLen: c3Y,
      },
      whyItFails:
        `Since ${pmp} consists entirely of b's, pumping alters only the number of b's. Both Block 1 and Block 3 remain fixed at ${k} a's. For i = 0 or i = 3, count(b) ≠ count(a).`,
      recommendedI: 3,
      pumpedExplanation:
        `With i = 3, the number of b's increases far above ${k}, while both blocks of a's remain at ${k}. Thus count(b) > count(a).`,
    },
    {
      id: 'case4',
      name: `Case 4: ${wnd} straddles ${block2Desc} and ${block3Desc}`,
      shortDesc: `${wnd} overlaps b's and 2nd a's`,
      vwxLocation: 'block2-3',
      description:
        `The substring ${wnd} crosses the boundary between the block of b's and the second block of a's. Note that ${wnd} cannot reach Block 1 because the intervening block of b's separates them and |${wnd}| ≤ ${safeP}.`,
      sampleDecomp: {
        uLen: c4U,
        vLen: c4V,
        wLen: c4W,
        xLen: c4X,
        yLen: c4Y,
      },
      whyItFails:
        `Because ${wnd} is restricted to Block 2 and Block 3, ${pmp} contains zero symbols from Block 1. Block 1 remains fixed at ${k} a's. Pumping with i = 3 alters b's and second a's, breaking equality with Block 1.`,
      recommendedI: 3,
      pumpedExplanation:
        `With i = 3, Block 1 stays fixed at ${k} a's while Block 2 and/or Block 3 change. Hence s₃ ∉ L.`,
    },
    {
      id: 'case5',
      name: `Case 5: ${wnd} is entirely within ${block3Desc}`,
      shortDesc: `${wnd} ⊆ 2nd block of a's`,
      vwxLocation: 'block3',
      description:
        `The substring ${wnd} is completely contained in the second block of a's. Therefore, ${pmp} consists exclusively of a's from Block 3.`,
      sampleDecomp: {
        uLen: c5U,
        vLen: c5V,
        wLen: c5W,
        xLen: c5X,
        yLen: c5Y,
      },
      whyItFails:
        `Since ${pmp} contains only a's from Block 3, pumping alters only Block 3. Block 1 and Block 2 remain untouched at ${k} symbols each. For i = 0 or i = 3, count(a²) ≠ count(a¹).`,
      recommendedI: 3,
      pumpedExplanation:
        `With i = 3, the second block of a's expands while Block 1 remains at ${k} a's. Contradiction!`,
    },
  ];
}

/**
 * Step descriptions for Problem 1 interactive proof (8 canonical steps aligned with handwritten class notes)
 */
export const P1_STEPS = [
  {
    step: 1,
    title: 'Step 1: Language Definition & Three-Block Structure',
    tag: 'Language Structure',
    latex: 'L = \\{ a^n b^n a^n \\mid n \\ge 1 \\}',
    summary:
      "Language definition: L consists of strings with an equal positive number of a's, b's, and a's in three consecutive blocks. For n = 1: 'aba'; n = 2: 'aabbaa'; n = 3: 'aaabbbaaa'. Every valid string requires three consecutive homogeneous blocks with strictly identical symbol counts.",
    speakerNotes:
      "Start by explaining the three consecutive blocks: first a^n, then b^n, then a^n. Note that ordinary pushdown automata have only one stack, making it impossible to check two independent balance comparisons simultaneously.",
  },
  {
    step: 2,
    title: 'Step 2: Assume Context-Free & Introduce Pumping Constant p',
    tag: 'Proof by Contradiction',
    latex: '\\text{Assume } L \\in \\text{CFL} \\implies \\exists p \\ge 1 \\text{ (Pumping Length)}',
    summary:
      'We assume for the sake of contradiction that L is context-free. According to the Pumping Lemma for Context-Free Languages, there exists an adversary pumping length constant p ≥ 1 guaranteed for L.',
    speakerNotes:
      'Emphasize that the proof proceeds by contradiction. The lemma guarantees that a constant p exists, and our argument must hold for ANY arbitrary positive integer p.',
  },
  {
    step: 3,
    title: 'Step 3: Select String From L (Class Notes: n = 3)',
    tag: 'Notebook Step 3',
    latex: '\\text{Select any one string from } L \\text{ for } n = 3 \\implies s = a^3 b^3 a^3 = \\text{aaabbbaaa}',
    summary:
      "Class Notes Step 3: Select a sample string from L for n = 3. Here s = aaabbbaaa (3 a's, 3 b's, 3 a's). This confirms the 3-block structure and gives an immediate concrete demonstration of the language requirements.",
    speakerNotes:
      "Show the audience how s = aaabbbaaa has exactly 3 a's, 3 b's, and 3 a's. Point out how this concrete example illustrates the balance requirement.",
  },
  {
    step: 4,
    title: 'Step 4: Applying Pumping Lemma for Selected String',
    tag: 'Notebook Step 4',
    latex: '\\text{Applying Pumping Lemma for selected string, } s = a^n b^n a^n \\text{ for } n = 3 \\implies s = \\text{aaabbbaaa}',
    summary:
      'Class Notes Step 4: Applying the pumping lemma to the selected string s = a^n b^n a^n. To formulate a universal mathematical proof that defeats any arbitrary pumping constant p, we must choose s as a function of p.',
    speakerNotes:
      'Explain that while n = 3 is a great illustrative example, a rigorous proof against an arbitrary p requires parameterizing the string using the pumping length p.',
  },
  {
    step: 5,
    title: 'Step 5: Choose Value for P with Formula s = aᵖ a a bᵖ b b aᵖ a a',
    tag: 'Notebook Step 5 Formula',
    latex: 's = a^p a a \\, b^p b b \\, a^p a a \\quad (\\text{let } p = 5 \\implies s = a^7 b^7 a^7 = \\text{aaaaaaa bbbbbbb aaaaaaa})',
    summary:
      "Class Notes Step 5 Formula: Choose value for P in the given string: s = aᵖ a a bᵖ b b aᵖ a a (i.e. each block has length n = p + 2). Letting p = 5 yields s = a⁷ b⁷ a⁷ = aaaaaaa bbbbbbb aaaaaaa (|s| = 21). This creates a wide middle buffer of 7 b's that exceeds the pumping window p = 5.",
    speakerNotes:
      "Emphasize the instructor's formula: s = a^p a a b^p b b a^p a a. For p = 5, s has 7 a's, 7 b's, and 7 a's (length 21). Because the middle block of b's has length 7 > p = 5, no window of length 5 can ever bridge across from the first block of a's to the second block of a's!",
  },
  {
    step: 6,
    title: 'Step 6: Decomposition s = uvxyz and Constraints (|vxy| ≤ p, |vy| > 0)',
    tag: 'Notebook Step 6',
    latex: 's = uvxyz \\quad \\text{s.t.} \\quad |vxy| \\le p \\implies 5 \\le 5, \\quad |vy| > 0 \\implies 4 > 0',
    summary:
      "Class Notes Step 6: Decompose s into 5 parts s = uvxyz satisfying the two lemma constraints: (1) |vxy| ≤ p (bounded pumping window; for p = 5, |vxy| = 5 ≤ 5); (2) |vy| > 0 (non-trivial pump; in notes, |vy| = 4 > 0 with |v| = 2, |y| = 2).",
    speakerNotes:
      "Highlight the notation s = uvxyz used in the class notes, where v and y are the pumped segments, x is the middle buffer, and z is the suffix. Point out the exact note values: |vxy| = 5 <= 5 and |vy| = 4 > 0.",
  },
  {
    step: 7,
    title: 'Step 7: Pumping Step for i ≥ 0 (Class Notes: let i = 3)',
    tag: 'Notebook Step 7 Pumping',
    latex: '\\text{For } i \\ge 0, \\text{ let } i = 3: \\quad s\' = u v^3 x y^3 z = a^{11} b^{11} a^7 \\notin L \\implies \\text{Contradiction!}',
    summary:
      "Class Notes Step 7: Apply values for i ≥ 0. Testing i = 3 (pump up 3x): z' = u v³ x y³ z yields 11 a's, 11 b's, and 7 a's. Since 11 ≠ 7, the counts are unequal and s' ∉ L. Contradiction!",
    speakerNotes:
      "Show how pumping with i = 3 duplicates v and y three times. In the notebook example, the first block and middle block expand to 11 symbols while the suffix remains stuck at 7, immediately violating membership in L.",
  },
  {
    step: 8,
    title: 'Step 8: Contradiction Across All 5 Cases & Conclusion',
    tag: 'Final Proof Complete',
    latex: '\\text{Contradiction!} \\quad \\forall \\text{ valid } uvxyz, \\exists i \\ge 0: u v^i x y^i z \\notin L \\implies L \\notin \\text{CFL} \\quad \\blacksquare',
    summary:
      'Since EVERY valid decomposition satisfying the pumping lemma conditions fails for some i ≥ 0 across all 5 structural cases, the pumping lemma does not hold for L. The initial assumption that L is context-free is false. Therefore, L = { aⁿ bⁿ aⁿ | n ≥ 1 } is not context-free. Q.E.D.',
    speakerNotes:
      'Deliver the final conclusion: We have mathematically proved that no context-free grammar or pushdown automaton can recognize L. The language is strictly context-sensitive.',
  },
];


import {
  buildStringP1,
  validateDecomposition,
  sliceDecomposition,
  pumpString,
  checkMembershipP1,
  getStandardCasesP1,
} from './src/math/cflProblem1';
import { interpretProblem2 } from './src/math/problemParser';

console.log('======================================================');
console.log('🧪 RUNNING AUTOMATA & PUMPING LEMMA VERIFICATION TESTS');
console.log('======================================================\n');

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
  }
}

// 1. Notebook Formula String Generation Tests (s = a^p a a b^p b b a^p a a)
const sNotebook5 = buildStringP1(5, 'notebook');
assert(
  sNotebook5.s === 'aaaaaaabbbbbbbaaaaaaa',
  'Notebook formula for p=5 produces 7 a\'s, 7 b\'s, 7 a\'s (aaaaaaabbbbbbbaaaaaaa)'
);
assert(sNotebook5.totalLength === 21, 'Notebook formula total length for p=5 is 21');
assert(sNotebook5.blockSize === 7, 'Notebook formula block size for p=5 is 7 (n = p + 2)');

const sNotebook3 = buildStringP1(3, 'notebook');
assert(
  sNotebook3.s === 'aaaaabbbbbaaaaa',
  'Notebook formula for p=3 produces 5 a\'s, 5 b\'s, 5 a\'s (aaaaabbbbbaaaaa)'
);
assert(sNotebook3.totalLength === 15, 'Notebook formula total length for p=3 is 15');

// 2. Standard Formula String Generation Tests (s = a^p b^p a^p)
const s3 = buildStringP1(3, 'standard');
assert(s3.s === 'aaabbbaaa', 'Standard formula for p=3 is aaabbbaaa');
assert(s3.totalLength === 9, 'Standard formula total length for p=3 is 9');

const s4 = buildStringP1(4, 'standard');
assert(s4.s === 'aaaabbbbaaaa', 'Standard formula for p=4 is aaaabbbbaaaa');

// 3. CFL Membership Verification Tests
const mNotebook21 = checkMembershipP1('aaaaaaabbbbbbbaaaaaaa');
assert(mNotebook21.isValid === true, 'aaaaaaabbbbbbbaaaaaaa belongs to L (n=7)');
assert(mNotebook21.equalCounts === true, 'aaaaaaabbbbbbbaaaaaaa has equal counts (n=7)');

const mBase = checkMembershipP1('aaabbbaaa');
assert(mBase.isValid === true, 'aaabbbaaa belongs to L (n=3)');
assert(mBase.equalCounts === true, 'aaabbbaaa has equal counts (n=3)');

const mUnequal1 = checkMembershipP1('aabbbaaa');
assert(mUnequal1.isValid === false, 'aabbbaaa does not belong to L (first block has 2 a\'s)');

const mUnequal2 = checkMembershipP1('aaabbbbaaa');
assert(mUnequal2.isValid === false, 'aaabbbaaa does not belong to L (middle block has 4 b\'s)');

const mMalformed = checkMembershipP1('aaababaab');
assert(mMalformed.isValid === false, 'aaababaab does not belong to L (out of order)');

const mEmpty = checkMembershipP1('');
assert(mEmpty.isValid === false, 'Empty string does not belong to L');

// 4. CFL Pumping Decomposition Constraint Tests
// Notebook mode: p = 5, total = 21, u=5, v=2, x=1, y=2, z=11 -> |vxy|=5 <= 5, |vy|=4 > 0
const valNotebookValid = validateDecomposition(5, 5, 2, 1, 2, 11, 'notebook', 'uvxyz');
assert(
  valNotebookValid.isValid === true,
  'Valid notebook decomposition: |vxy|=5 <= 5, |vy|=4 > 0, total=21'
);

const valNotebookExceed = validateDecomposition(5, 5, 3, 1, 2, 10, 'notebook', 'uvxyz');
assert(
  valNotebookExceed.isValid === false,
  'Invalid notebook decomposition: |vxy|=6 > 5'
);
assert(valNotebookExceed.vwxValid === false, '|vxy| correctly flagged as invalid');

const valNotebookEmpty = validateDecomposition(5, 5, 0, 1, 0, 15, 'notebook', 'uvxyz');
assert(
  valNotebookEmpty.isValid === false,
  'Invalid notebook decomposition: |vy|=0'
);
assert(valNotebookEmpty.vxValid === false, '|vy| correctly flagged as invalid');

// Standard mode: p = 3, total = 9
const valValid = validateDecomposition(3, 1, 1, 0, 1, 6, 'standard', 'uvwxy');
assert(valValid.isValid === true, 'Valid standard decomposition: |vwx|=2 <= 3, |vx|=2 > 0');

// 5. Pumping Slicing & Verification for Notebook Step 7 (let i = 3)
const decompNotes = sliceDecomposition('aaaaaaabbbbbbbaaaaaaa', 5, 2, 1, 2, 11);
assert(decompNotes.u === 'aaaaa', 'u slice is 5 a\'s');
assert(decompNotes.v === 'aa', 'v slice is 2 a\'s (finishing Block 1)');
assert(decompNotes.w === 'b', 'middle x slice is 1 b (first b of Block 2)');
assert(decompNotes.x === 'bb', 'pumped y slice is 2 b\'s (next 2 b\'s of Block 2)');
assert(decompNotes.y === 'bbbbaaaaaaa', 'suffix z slice is 4 b\'s + 7 a\'s');

// Pump with i = 3 (Class Notes Step 7)
const pStep7 = pumpString(decompNotes, 3);
// u (5 a) + v^3 (6 a) + w (1 b) + x^3 (6 b) + y (4 b + 7 a)
// = 11 a's, 11 b's, 7 a's
assert(
  pStep7.pumpedString === 'aaaaaaaaaaabbbbbbbbbbbaaaaaaa',
  'Pumped string with i=3 produces 11 a\'s, 11 b\'s, 7 a\'s (aaaaaaaaaaabbbbbbbbbbbaaaaaaa)'
);
const mStep7 = checkMembershipP1(pStep7.pumpedString);
assert(
  mStep7.isValid === false,
  'Pumped string with i=3 violates membership (11 a\'s vs 11 b\'s vs 7 a\'s)'
);
assert(mStep7.a1Count === 11, '1st block of a\'s has 11');
assert(mStep7.bCount === 11, 'Middle block of b\'s has 11');
assert(mStep7.a2Count === 7, '2nd block of a\'s has 7');

// 6. Exhaustive 5 Cases Verification for Notebook Mode (p = 5)
const casesNotes = getStandardCasesP1(5, 'notebook', 'uvxyz');
assert(casesNotes.length === 5, 'Exactly 5 standard structural cases provided for notebook mode');
casesNotes.forEach((c, idx) => {
  const d = sliceDecomposition(
    'aaaaaaabbbbbbbaaaaaaa',
    c.sampleDecomp.uLen,
    c.sampleDecomp.vLen,
    c.sampleDecomp.wLen,
    c.sampleDecomp.xLen,
    c.sampleDecomp.yLen
  );
  const pTest = pumpString(d, c.recommendedI);
  const mem = checkMembershipP1(pTest.pumpedString);
  assert(
    mem.isValid === false,
    `Notebook Case ${idx + 1} (${c.name}) correctly produces contradiction with i=${c.recommendedI}`
  );
});

// 7. Exhaustive 5 Cases Verification for Standard Mode (p = 3)
const casesStandard = getStandardCasesP1(3, 'standard', 'uvwxy');
assert(casesStandard.length === 5, 'Exactly 5 standard structural cases provided for standard mode');
casesStandard.forEach((c, idx) => {
  const d = sliceDecomposition(
    'aaabbbaaa',
    c.sampleDecomp.uLen,
    c.sampleDecomp.vLen,
    c.sampleDecomp.wLen,
    c.sampleDecomp.xLen,
    c.sampleDecomp.yLen
  );
  const pTest = pumpString(d, c.recommendedI);
  const mem = checkMembershipP1(pTest.pumpedString);
  assert(
    mem.isValid === false,
    `Standard Case ${idx + 1} (${c.name}) correctly produces contradiction with i=${c.recommendedI}`
  );
});

// 8. Problem 2 Parser Tests
const p2NeedsInfo = interpretProblem2({ questionText: '', solutionNotes: '' });
assert(p2NeedsInfo.status === 'needs_clarification', 'Problem 2 requires clarification when inputs are empty');

const p2Preset0n1n = interpretProblem2({
  questionText: 'Show L = { 0^n 1^n | n >= 0 } is not regular',
  solutionNotes: 'Assume L is regular, choose s = 0^p 1^p, pump i=0',
});
assert(p2Preset0n1n.status === 'ready', 'Problem 2 successfully parses 0^n 1^n');
assert(p2Preset0n1n.proofGoal === 'not-regular', 'Detected goal is not-regular');
assert(p2Preset0n1n.decompositionModel === 'regular', 'Uses Regular decomposition xyz');

const p2PresetAnBnCn = interpretProblem2({
  questionText: 'Prove that L = { a^n b^n c^n | n >= 1 } is not context-free',
  solutionNotes: 'Use CFL pumping lemma s = uvwxy with |vwx| <= p',
});
assert(p2PresetAnBnCn.status === 'ready', 'Problem 2 successfully parses a^n b^n c^n');
assert(p2PresetAnBnCn.proofGoal === 'not-cfl', 'Detected goal is not-cfl');
assert(p2PresetAnBnCn.decompositionModel === 'cfl', 'Uses CFL decomposition uvwxy');

console.log(`\n======================================================`);
console.log(`🎉 TEST SUMMARY: ${passed} / ${total} TESTS PASSED!`);
console.log('======================================================');

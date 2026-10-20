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

// 1. String Generation Tests
const s3 = buildStringP1(3);
assert(s3.s === 'aaabbbaaa', 'String generation for p=3 is aaabbbaaa');
assert(s3.totalLength === 9, 'Total length for p=3 is 9');

const s4 = buildStringP1(4);
assert(s4.s === 'aaaabbbbaaaa', 'String generation for p=4 is aaaabbbbaaaa');

// 2. CFL Membership Verification Tests
const mBase = checkMembershipP1('aaabbbaaa');
assert(mBase.isValid === true, 'aaabbbaaa belongs to L');
assert(mBase.equalCounts === true, 'aaabbbaaa has equal counts (n=3)');

const mUnequal1 = checkMembershipP1('aabbbaaa');
assert(mUnequal1.isValid === false, 'aabbbaaa does not belong to L (first block has 2 a\'s)');

const mUnequal2 = checkMembershipP1('aaabbbbaaa');
assert(mUnequal2.isValid === false, 'aaabbbbaaa does not belong to L (middle block has 4 b\'s)');

const mMalformed = checkMembershipP1('aaababaab');
assert(mMalformed.isValid === false, 'aaababaab does not belong to L (out of order)');

const mEmpty = checkMembershipP1('');
assert(mEmpty.isValid === false, 'Empty string does not belong to L');

// 3. CFL Pumping Decomposition Constraint Tests
// p = 3, total = 9
const valValid = validateDecomposition(3, 1, 1, 0, 1, 6);
assert(valValid.isValid === true, 'Valid decomposition: |vwx|=2 <= 3, |vx|=2 > 0');

const valTooLong = validateDecomposition(3, 0, 2, 1, 2, 4);
assert(valTooLong.isValid === false, 'Invalid decomposition: |vwx|=5 > 3');
assert(valTooLong.vwxValid === false, '|vwx| correctly flagged as invalid');

const valEmptyVX = validateDecomposition(3, 2, 0, 1, 0, 6);
assert(valEmptyVX.isValid === false, 'Invalid decomposition: |vx|=0');
assert(valEmptyVX.vxValid === false, '|vx| correctly flagged as invalid');

// 4. Pumping String Slicing & Verification
const decomp = sliceDecomposition('aaabbbaaa', 1, 1, 0, 1, 6);
assert(decomp.u === 'a', 'u slice is correct');
assert(decomp.v === 'a', 'v slice is correct');
assert(decomp.w === '', 'w slice is correct');
assert(decomp.x === 'a', 'x slice is correct');
assert(decomp.y === 'bbbaaa', 'y slice is correct');

// Pump down i=0
const pDown = pumpString(decomp, 0);
assert(pDown.pumpedString === 'abbbaaa', 'Pumped down string (i=0) is abbbaaa');
const mPDown = checkMembershipP1(pDown.pumpedString);
assert(mPDown.isValid === false, 'Pumped down string violates language membership');

// Pump up i=2
const pUp = pumpString(decomp, 2);
assert(pUp.pumpedString === 'aaaaabbbaaa', 'Pumped up string (i=2) is aaaaabbbaaa');
const mPUp = checkMembershipP1(pUp.pumpedString);
assert(mPUp.isValid === false, 'Pumped up string violates language membership');

// 5. Exhaustive 5 Cases Verification
const cases = getStandardCasesP1(3);
assert(cases.length === 5, 'Exactly 5 standard structural cases provided');
cases.forEach((c, idx) => {
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
    `Case ${idx + 1} (${c.name}) correctly produces contradiction with i=${c.recommendedI}`
  );
});

// 6. Problem 2 Parser Tests
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

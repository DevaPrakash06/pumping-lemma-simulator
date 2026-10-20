import { simulatePDA, validateStringL2, PDA_TEST_CASES } from './src/math/pdaProblem2';

console.log('--- Testing 00111111 ---');
const res = simulatePDA('00111111');
console.log('Accepted:', res.accepted);
console.log('Message:', res.message);
res.steps.forEach((s) => {
  console.log(`Step ${s.stepIndex}: (${s.state}, "${s.remainingInput || 'ε'}", [${s.stack.join(', ')}])`);
});

console.log('\n--- Testing All Test Cases ---');
PDA_TEST_CASES.forEach((tc) => {
  const sim = simulatePDA(tc.input);
  const val = validateStringL2(tc.input);
  const simVerdict = sim.accepted ? 'ACCEPTED' : 'REJECTED';
  const valVerdict = val.isValid ? 'ACCEPTED' : 'REJECTED';
  const match = simVerdict === tc.expected && valVerdict === tc.expected;
  console.log(`Input: "${tc.input}" | Expected: ${tc.expected} | Sim: ${simVerdict} | Val: ${valVerdict} | Match: ${match}`);
});

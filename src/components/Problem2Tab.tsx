import React, { useState } from 'react';
import {
  CheckCircle2,
  Presentation,
  Cpu,
} from 'lucide-react';
import { MathView } from './MathView';
import { PDASimulator } from './PDASimulator';
import { PDALanguageGuide } from './PDALanguageGuide';

export const Problem2Tab: React.FC = () => {
  const [selectedInput, setSelectedInput] = useState('00111111');
  const [isPresentationView, setIsPresentationView] = useState(false);

  const handleLoadExample = (val: string) => {
    setSelectedInput(val);
  };

  return (
    <div className="space-y-6">
      {/* Problem 2 Header & Question Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                PROBLEM 2 • PUSHDOWN AUTOMATON
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Deterministic CFL
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Design & Simulate a PDA for{' '}
              <span className="text-indigo-300 font-mono">
                L = &#123; 0ⁿ 1³ⁿ | n ≥ 1 &#125;
              </span>
            </h2>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Design a Pushdown Automaton accepting by final state with initial stack symbol{' '}
              <code className="text-amber-300 font-mono font-bold">Z0</code> that accepts all strings where each zero is followed by exactly three ones. Test input{' '}
              <code className="text-cyan-300 font-mono font-bold">00111111</code> must be accepted with 2 zeros and 6 ones (6 = 3 × 2).
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-2 shrink-0 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsPresentationView(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                !isPresentationView
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Studio
            </button>
            <button
              onClick={() => setIsPresentationView(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isPresentationView
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Presentation Mode</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Test String</span>
            <span className="font-mono text-sm font-bold text-cyan-300">00111111</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Expected Verdict</span>
            <span className="font-mono text-sm font-bold text-emerald-400">ACCEPTED</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Stack Counter</span>
            <span className="font-mono text-sm font-bold text-amber-300">A (3 per '0')</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Acceptance Mode</span>
            <span className="font-mono text-sm font-bold text-indigo-300">Final State (qf)</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Studio Sections */}
      {!isPresentationView ? (
        <div className="space-y-6">
          {/* Section B & C: State Diagram, Input Tape & LIFO Stack Simulator */}
          <PDASimulator
            inputString={selectedInput}
            onInputChange={handleLoadExample}
          />

          {/* Section A & D: Language Guide, Examples Table & Live String Checker */}
          <PDALanguageGuide onLoadExampleToSim={handleLoadExample} />

          {/* Section E: Formal 7-Tuple Definition of PDA */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Formal Mathematical Specification: Pushdown Automaton 7-Tuple
                </h3>
                <p className="text-xs text-slate-400">
                  <MathView math="M = (Q, \Sigma, \Gamma, \delta, q_0, Z_0, F)" />
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-indigo-400 block">States Set (Q):</span>
                <p className="font-mono text-slate-300">Q = &#123; q0, q1, qf &#125;</p>
                <p className="text-[11px] text-slate-400">
                  q0: Push 3 A's per 0<br />
                  q1: Pop 1 A per 1<br />
                  qf: Final accepting state
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-sky-400 block">Alphabets (Σ & Γ):</span>
                <p className="font-mono text-slate-300">Σ = &#123; 0, 1 &#125;</p>
                <p className="font-mono text-amber-300">Γ = &#123; A, Z0 &#125;</p>
                <p className="text-[11px] text-slate-400">
                  Input symbols 0, 1; Stack marker Z0, counting symbol A.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-purple-400 block">Initial & Final:</span>
                <p className="font-mono text-slate-300">Start State: q0</p>
                <p className="font-mono text-amber-300">Stack Start: Z0</p>
                <p className="font-mono text-emerald-400">F = &#123; qf &#125;</p>
                <p className="text-[11px] text-slate-400">
                  Acceptance defined by entering qf after input exhaustion.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">Deterministic Property:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  For every (state, input, stack-top), there is at most one valid move. No non-deterministic guessing is required.
                </p>
              </div>
            </div>

            {/* Transition Mapping Reference */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-200 block">
                Complete Transition Function Table <MathView math="\delta" />:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-sky-300 font-bold">δ(q0, 0, Z0) = (q0, AAAZ0)</span>
                  <span className="block text-slate-400 font-sans text-[10px]">
                    Reads 1st zero: Pushes 3 A's above Z0.
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-sky-300 font-bold">δ(q0, 0, A) = (q0, AAAA)</span>
                  <span className="block text-slate-400 font-sans text-[10px]">
                    Reads next zeros: Replaces top A with 4 A's (net +3 A's).
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-purple-300 font-bold">δ(q0, 1, A) = (q1, ε)</span>
                  <span className="block text-slate-400 font-sans text-[10px]">
                    Reads 1st one: Pops top A, moves to state q1.
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-purple-300 font-bold">δ(q1, 1, A) = (q1, ε)</span>
                  <span className="block text-slate-400 font-sans text-[10px]">
                    Reads next ones: Pops top A for each one, stays in q1.
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 md:col-span-2">
                  <span className="text-emerald-300 font-bold">δ(q1, ε, Z0) = (qf, Z0)</span>
                  <span className="block text-slate-400 font-sans text-[10px]">
                    Input consumed and stack top is Z0: Takes ε-transition to final state qf.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section F: Final Conclusion Panel */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-500/30 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  Conclusion & Theoretical Significance
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The language <MathView math="L = \{ 0^n 1^{3n} \mid n \ge 1 \}" /> is a <strong>Deterministic Context-Free Language (DCFL)</strong>. Unlike finite automata (which cannot count unboundedly), a Pushdown Automaton utilizes a single LIFO stack to store the exact count of zeros scaled by a factor of 3. When reading ones, the stack is popped one by one. The string is accepted if and only if the stack empties to <code className="text-amber-300 font-mono">Z0</code> exactly when the input is fully consumed.
                </p>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  💡 <strong>Comparison with Problem 1:</strong> Problem 1's language <MathView math="L = \{ a^n b^n a^n \}" /> requires checking two independent comparisons across three blocks, which exceeds the memory capacity of a single stack (pushing $a$'s and popping for $b$'s leaves the stack empty before the third block of $a$'s can be compared). Hence, Problem 1 is NOT context-free, while Problem 2 IS context-free!
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Presentation Mode: Focused Classroom Projection View */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-950 rounded-2xl border border-indigo-500/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-indigo-900/60">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <Presentation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Classroom Slide Presentation View
                  </h3>
                  <p className="text-xs text-indigo-300">
                    Live execution of PDA on test input <code className="font-mono text-cyan-300">00111111</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPresentationView(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                Exit Presentation Mode
              </button>
            </div>

            {/* Stepper with Diagram, Tape & Stack */}
            <div className="mt-6">
              <PDASimulator
                inputString={selectedInput}
                onInputChange={handleLoadExample}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

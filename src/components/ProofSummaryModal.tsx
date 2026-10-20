import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Presentation,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { MathView } from './MathView';
import { P1_STEPS } from '../math/cflProblem1';

interface ProofSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProofSummaryModal: React.FC<ProofSummaryModalProps> = ({ isOpen, onClose }) => {
  const [activeDeck, setActiveDeck] = useState<'problem1' | 'problem2'>('problem1');
  const [copied, setCopied] = useState(false);
  const [slideIndex1, setSlideIndex1] = useState(0);
  const [slideIndex2, setSlideIndex2] = useState(0);

  if (!isOpen) return null;

  const currentStep1 = P1_STEPS[slideIndex1];

  const fullLatexProofP1 = `\\textbf{Theorem:} The language $L = \\{ a^n b^n a^n \\mid n \\ge 1 \\}$ is not context-free.

\\textbf{Proof by Contradiction using the CFL Pumping Lemma:}

1. \\textbf{Assumption:} Suppose $L$ is a context-free language.
2. \\textbf{Pumping Length:} By the CFL Pumping Lemma, there exists an integer constant $p \\ge 1$.
3. \\textbf{String Selection:} Select the string $s = a^p b^p a^p \\in L$. Notice that $|s| = 3p \\ge p$.
4. \\textbf{Decomposition Conditions:} The lemma guarantees that $s$ can be written as $s = uvwxy$ such that:
   \\begin{itemize}
     \\item $|vwx| \\le p$
     \\item $|vx| > 0$ (at least one of $v$ or $x$ is non-empty)
     \\item $\\forall i \\ge 0, \\; u v^i w x^i y \\in L$
   \\end{itemize}
5. \\textbf{Geometric Constraint:} Because $|vwx| \\le p$ and the middle block of $b$'s has length $p$, the substring $vwx$ cannot span from the first block of $a$'s to the second block of $a$'s (which would require length $\\ge p+2 > p$).
6. \\textbf{Exhaustive Case Analysis:}
   \\begin{itemize}
     \\item \\textbf{Case 1 ($vwx \\subseteq a^p$ Block 1):} $vx$ contains only first $a$'s. For $i=0$, the number of first $a$'s is $< p$, while Block 3 has $p$ $a$'s. Thus $s_0 \\notin L$.
     \\item \\textbf{Case 2 ($vwx$ straddles Block 1 and 2):} $vx$ contains no symbols from Block 3. Pumping $i=0$ or $i=2$ alters the count of first $a$'s and/or $b$'s, but leaves Block 3 with $p$ $a$'s. If $v$ or $x$ crosses the boundary, pumping $i=2$ introduces symbols out of order. Thus $s_i \\notin L$.
     \\item \\textbf{Case 3 ($vwx \\subseteq b^p$ Block 2):} $vx$ contains only $b$'s. Pumping $i=0$ gives $< p$ $b$'s, while both $a$ blocks have $p$ symbols. Thus $s_0 \\notin L$.
     \\item \\textbf{Case 4 ($vwx$ straddles Block 2 and 3):} $vx$ contains no symbols from Block 1. Block 1 remains fixed at $p$ $a$'s. Pumping $i=0$ or $i=2$ breaks equality with Block 1, or causes out-of-order symbols. Thus $s_i \\notin L$.
     \\item \\textbf{Case 5 ($vwx \\subseteq a^p$ Block 3):} $vx$ contains only second $a$'s. For $i=0$, Block 3 has $< p$ $a$'s while Block 1 has $p$ $a$'s. Thus $s_0 \\notin L$.
   \\end{itemize}
7. \\textbf{Contradiction:} In every possible decomposition, there exists an $i$ such that $u v^i w x^i y \\notin L$.
8. \\textbf{Conclusion:} Therefore, our assumption is false. $L = \\{ a^n b^n a^n \\mid n \\ge 1 \\}$ is NOT context-free. $\\quad \\blacksquare$`;

  const fullLatexProofP2 = `\\textbf{Design of Pushdown Automaton for } $L = \\{ 0^n 1^{3n} \\mid n \\ge 1 \\}$

\\textbf{Formal 7-Tuple Specification:}
$M = (Q, \\Sigma, \\Gamma, \\delta, q_0, Z_0, F)$ where:
\\begin{itemize}
  \\item $Q = \\{ q_0, q_1, q_f \\}$
  \\item $\\Sigma = \\{ 0, 1 \\}$
  \\item $\\Gamma = \\{ A, Z_0 \\}$
  \\item Start state: $q_0$
  \\item Bottom-of-stack marker: $Z_0$
  \\item Final accepting states: $F = \\{ q_f \\}$
\\end{itemize}

\\textbf{Transition Functions } $\\delta(state, input, stack\\_top) = (next\\_state, replacement)$:
1. $\\delta(q_0, 0, Z_0) = (q_0, AAAZ_0)$ \\quad (Pushes 3 $A$'s on first zero)
2. $\\delta(q_0, 0, A) = (q_0, AAAA)$ \\quad (Replaces top $A$ with 4 $A$'s, net $+3$ $A$'s)
3. $\\delta(q_0, 1, A) = (q_1, \\varepsilon)$ \\quad (Pops 1 $A$ on first one, switches to $q_1$)
4. $\\delta(q_1, 1, A) = (q_1, \\varepsilon)$ \\quad (Pops 1 $A$ for each subsequent one)
5. $\\delta(q_1, \\varepsilon, Z_0) = (q_f, Z_0)$ \\quad (Takes $\\varepsilon$-move to $q_f$ when input is exhausted)

\\textbf{Trace for Input } $w = 00111111$:
\\begin{align*}
(q_0, 00111111, Z_0) &\\vdash (q_0, 0111111, AAAZ_0) \\\\
&\\vdash (q_0, 111111, AAAAAAZ_0) \\\\
&\\vdash (q_1, 11111, AAAAAZ_0) \\\\
&\\vdash (q_1, 1111, AAAAZ_0) \\\\
&\\vdash (q_1, 111, AAAZ_0) \\\\
&\\vdash (q_1, 11, AAZ_0) \\\\
&\\vdash (q_1, 1, AZ_0) \\\\
&\\vdash (q_1, \\varepsilon, Z_0) \\\\
&\\vdash (q_f, \\varepsilon, Z_0) \\quad \\text{[ACCEPTED by final state } q_f\\text{]}
\\end{align*}`;

  const p2Slides = [
    {
      title: 'Problem 2: Formal Language & Requirements',
      tag: 'SECTION A',
      latex: 'L = \\{ 0^n 1^{3n} \\mid n \\ge 1 \\}',
      summary: 'Strings begin with one or more 0s followed strictly by ones. Each individual zero mandates exactly three ones (3:1 ratio). The empty string is rejected because n >= 1.',
      speakerNotes: 'Highlight the strict 3-to-1 ratio and that zeros cannot appear after any ones have been read.',
    },
    {
      title: 'Formal 7-Tuple Definition of PDA',
      tag: 'SECTION B',
      latex: 'M = (\\{q_0, q_1, q_f\\}, \\{0, 1\\}, \\{A, Z_0\\}, \\delta, q_0, Z_0, \\{q_f\\})',
      summary: 'The automaton accepts by final state q_f. State q0 processes zeros and pushes stack symbol A. State q1 processes ones and pops A. Bottom marker Z0 prevents stack underflow.',
      speakerNotes: 'Explain the roles of q0 (writing/counting zeros) and q1 (matching/verifying ones).',
    },
    {
      title: 'Stack Symbol Counting Convention',
      tag: 'STACK RULES',
      latex: '\\delta(q_0, 0, Z_0) = (q_0, AAAZ_0), \\quad \\delta(q_0, 0, A) = (q_0, AAAA)',
      summary: 'For the first zero, Z0 is replaced with AAAZ0 (adds 3 A symbols). For subsequent zeros, the top A is replaced with AAAA. Because the top A is popped and 4 are pushed, the net increase is exactly 3 A symbols!',
      speakerNotes: 'Point out why AAAA is used instead of AAA: replacing A with AAAA net-adds 3 symbols.',
    },
    {
      title: 'Execution Trace on Test Input 00111111',
      tag: 'SECTION C',
      latex: '(q_0, 00111111, Z_0) \\vdash^* (q_0, 111111, AAAAAAZ_0) \\vdash^* (q_f, \\varepsilon, Z_0)',
      summary: 'Two zeros push exactly 6 A symbols on top of Z0. The first one transitions to q1 while popping one A. The next 5 ones pop the remaining 5 A symbols. When input is empty and stack top is Z0, the PDA transitions to final state qf.',
      speakerNotes: 'Verify 6 = 3 * 2. Emphasize that the stack has exactly 6 A symbols after reading 00.',
    },
    {
      title: 'Strict Rejection Criteria',
      tag: 'SECTION D',
      latex: 'w \\notin L \\implies \\text{Rejection by Halt or Missing Transition}',
      summary: 'Strings with zeros after ones (e.g. 010111) halt in trap state because q1 has no transition on 0. Strings with too few ones leave unpopped A symbols. Strings with too many ones crash when 1 is read on Z0.',
      speakerNotes: 'Mention that missing transitions lead to immediate rejection in deterministic automata.',
    },
  ];

  const currentStep2 = p2Slides[slideIndex2];

  const handleCopyLatex = async () => {
    try {
      const text = activeDeck === 'problem1' ? fullLatexProofP1 : fullLatexProofP2;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Modal Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center">
                Classroom Presentation Mode & Academic Slides
              </h3>
              <p className="text-xs text-slate-400">
                Formal Languages & Automata Theory • Full Proof Slides & Verbatim LaTeX
              </p>
            </div>
          </div>

          {/* Deck Switcher Tabs */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveDeck('problem1')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeDeck === 'problem1'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Problem 1 (Pumping Lemma)
              </button>
              <button
                onClick={() => setActiveDeck('problem2')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeDeck === 'problem2'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Problem 2 (PDA)
              </button>
            </div>

            <button
              onClick={handleCopyLatex}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition"
              title="Copy full LaTeX transcription for report or blackboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied LaTeX!' : 'Copy LaTeX'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
              title="Print Proof Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeDeck === 'problem1' ? (
            /* Problem 1 Slide Deck */
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-indigo-900/40 relative shadow-inner space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-semibold text-indigo-400 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Problem 1 • Slide {slideIndex1 + 1} of {P1_STEPS.length}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {currentStep1.tag}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {currentStep1.title}
                </h2>

                {currentStep1.latex && (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center text-lg sm:text-xl text-indigo-200 overflow-x-auto shadow-md">
                    <MathView math={currentStep1.latex} displayMode />
                  </div>
                )}

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {currentStep1.summary}
                </p>

                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs sm:text-sm text-indigo-200">
                  <span className="font-bold text-white block mb-1">Speaker's Script / Key Point for College Board:</span>
                  <p className="text-slate-300">{currentStep1.speakerNotes}</p>
                </div>
              </div>

              {/* Slide Navigation Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSlideIndex1(Math.max(0, slideIndex1 - 1))}
                  disabled={slideIndex1 === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center space-x-1 disabled:opacity-30 border border-slate-700 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Slide</span>
                </button>

                <div className="flex space-x-1.5">
                  {P1_STEPS.map((s, idx) => (
                    <button
                      key={s.step}
                      onClick={() => setSlideIndex1(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition ${
                        slideIndex1 === idx ? 'bg-indigo-500 scale-125' : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setSlideIndex1(Math.min(P1_STEPS.length - 1, slideIndex1 + 1))}
                  disabled={slideIndex1 === P1_STEPS.length - 1}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center space-x-1 disabled:opacity-30 shadow-md shadow-indigo-600/30 transition"
                >
                  <span>Next Slide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Full LaTeX Text */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3">
                <h4 className="font-bold text-white flex items-center border-b border-slate-800 pb-2">
                  <BookOpen className="w-4 h-4 text-purple-400 mr-2" />
                  Complete Verbatim LaTeX Transcript for Blackboard / Report
                </h4>
                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto leading-relaxed select-all">
                  {fullLatexProofP1}
                </pre>
              </div>
            </div>
          ) : (
            /* Problem 2 Slide Deck */
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-purple-900/40 relative shadow-inner space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-semibold text-purple-400 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Problem 2 • Slide {slideIndex2 + 1} of {p2Slides.length}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {currentStep2.tag}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {currentStep2.title}
                </h2>

                {currentStep2.latex && (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center text-lg sm:text-xl text-purple-200 overflow-x-auto shadow-md">
                    <MathView math={currentStep2.latex} displayMode />
                  </div>
                )}

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {currentStep2.summary}
                </p>

                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs sm:text-sm text-purple-200">
                  <span className="font-bold text-white block mb-1">Speaker's Script / Key Point for College Board:</span>
                  <p className="text-slate-300">{currentStep2.speakerNotes}</p>
                </div>
              </div>

              {/* Slide Navigation Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSlideIndex2(Math.max(0, slideIndex2 - 1))}
                  disabled={slideIndex2 === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center space-x-1 disabled:opacity-30 border border-slate-700 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Slide</span>
                </button>

                <div className="flex space-x-1.5">
                  {p2Slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSlideIndex2(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition ${
                        slideIndex2 === idx ? 'bg-purple-500 scale-125' : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setSlideIndex2(Math.min(p2Slides.length - 1, slideIndex2 + 1))}
                  disabled={slideIndex2 === p2Slides.length - 1}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold flex items-center space-x-1 disabled:opacity-30 shadow-md shadow-purple-600/30 transition"
                >
                  <span>Next Slide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Full LaTeX Text */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3">
                <h4 className="font-bold text-white flex items-center border-b border-slate-800 pb-2">
                  <Cpu className="w-4 h-4 text-purple-400 mr-2" />
                  Complete PDA Definition & Transition LaTeX Transcript
                </h4>
                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto leading-relaxed select-all">
                  {fullLatexProofP2}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold"
          >
            Close Presentation
          </button>
        </div>
      </div>
    </div>
  );
};

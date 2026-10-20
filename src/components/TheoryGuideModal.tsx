import React from 'react';
import { X, BookOpen, Layers, AlertOctagon } from 'lucide-react';
import { MathView } from './MathView';

interface TheoryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryGuideModal: React.FC<TheoryGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Formal Languages & Automata – Theory Guide
              </h3>
              <p className="text-xs text-slate-400">
                Chomsky Hierarchy, Pumping Lemmas & College Presentation Notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs sm:text-sm text-slate-300">
          {/* CFL Pumping Lemma Formal Definition */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center text-indigo-400">
              <Layers className="w-4 h-4 mr-1.5" />
              Pumping Lemma for Context-Free Languages (Bar-Hillel Lemma)
            </h4>
            <p className="text-slate-300 leading-relaxed">
              If <MathView math="L" /> is a context-free language, then there exists a constant integer{' '}
              <MathView math="p \ge 1" /> (the pumping length) such that every string <MathView math="s \in L" />{' '}
              with <MathView math="|s| \ge p" /> can be divided into five substrings:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-indigo-200">
              <MathView math="s = u v w x y" displayMode />
            </div>
            <p className="text-slate-300">satisfying three strict conditions:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong>Condition 1 (Window span):</strong> <MathView math="|vwx| \le p" />
              </li>
              <li>
                <strong>Condition 2 (Non-emptiness):</strong> <MathView math="|vx| > 0" /> (at least one of <MathView math="v" /> or <MathView math="x" /> is non-empty)
              </li>
              <li>
                <strong>Condition 3 (Pumping property):</strong> For every <MathView math="i \ge 0" />,{' '}
                <MathView math="u v^i w x^i y \in L" />.
              </li>
            </ul>
          </div>

          {/* Regular Pumping Lemma Definition */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center text-purple-400">
              <Layers className="w-4 h-4 mr-1.5" />
              Pumping Lemma for Regular Languages
            </h4>
            <p className="text-slate-300 leading-relaxed">
              If <MathView math="L" /> is regular, then there exists <MathView math="p \ge 1" /> such that every{' '}
              <MathView math="s \in L" /> with <MathView math="|s| \ge p" /> can be split into{' '}
              <MathView math="s = xyz" /> such that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><MathView math="|xy| \le p" /></li>
              <li><MathView math="|y| > 0" /></li>
              <li>For all <MathView math="i \ge 0" />, <MathView math="x y^i z \in L" />.</li>
            </ul>
          </div>

          {/* Top 3 Exam & Presentation Pitfalls */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2">
            <h4 className="font-bold text-rose-300 text-sm flex items-center">
              <AlertOctagon className="w-4 h-4 mr-1.5" />
              Top 3 Common Mistakes to Avoid in College Presentations
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong>Picking a specific decomposition:</strong> You cannot assume <MathView math="v = a" /> and{' '}
                <MathView math="x = b" /> and call the proof done. The opponent chooses the decomposition! You must prove that{' '}
                <em>every possible</em> valid decomposition fails.
              </li>
              <li>
                <strong>Assuming p is a specific number:</strong> Never say "Let p = 3". The pumping length <MathView math="p" />{' '}
                is an arbitrary constant. The string <MathView math="s" /> must be formulated symbolically in terms of <MathView math="p" />{' '}
                (e.g. <MathView math="s = a^p b^p a^p" />).
              </li>
              <li>
                <strong>Thinking Pumping Lemma proves a language IS context-free:</strong> The Pumping Lemma is a necessary condition, NOT a sufficient condition. It can only be used to prove a language is <em>not</em> context-free.
              </li>
            </ol>
          </div>

          {/* Pushdown Automata & CFL Recognition */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center text-emerald-400">
              <Layers className="w-4 h-4 mr-1.5" />
              Pushdown Automata (PDA) & Deterministic CFLs
            </h4>
            <p className="text-slate-300 leading-relaxed">
              A Pushdown Automaton <MathView math="M = (Q, \Sigma, \Gamma, \delta, q_0, Z_0, F)" /> augments a finite automaton with an unbounded Last-In-First-Out (LIFO) stack memory:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong>Single Counter Capability:</strong> A PDA can count and verify one exact linear dependency, such as <MathView math="L = \{ 0^n 1^{3n} \mid n \ge 1 \}" />. For each 0, three <MathView math="A" />'s are pushed. For each 1, one <MathView math="A" /> is popped.
              </li>
              <li>
                <strong>Determinism:</strong> When each configuration <MathView math="(q, a, X)" /> has at most one valid move, the PDA is deterministic (DPDA), recognizing a Deterministic Context-Free Language (DCFL).
              </li>
              <li>
                <strong>Acceptance by Final State:</strong> Acceptance occurs if the PDA consumes the entire input string and enters a designated final state <MathView math="q_f \in F" />.
              </li>
            </ul>
          </div>

          {/* Chomsky Hierarchy Note */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/40 text-xs space-y-1.5">
            <span className="font-bold text-indigo-300 block">Chomsky Hierarchy Comparison: Problem 1 vs Problem 2</span>
            <p className="text-slate-300">
              In the Chomsky Hierarchy:
            </p>
            <p className="text-slate-400">
              • <strong>Type 3 (Regular):</strong> Finite Automata (DFA/NFA) with no stack. Cannot recognize <MathView math="0^n 1^{3n}" /> or <MathView math="a^n b^n a^n" /> because unbounded counting requires memory.<br />
              • <strong>Type 2 (Context-Free):</strong> Recognized by Pushdown Automata (PDA) with 1 stack. <MathView math="L = \{ 0^n 1^{3n} \mid n \ge 1 \}" /> belongs here (Problem 2)!<br />
              • <strong>Type 1 (Context-Sensitive):</strong> Linear Bounded Automata (LBA). <MathView math="L = \{ a^n b^n a^n \mid n \ge 1 \}" /> belongs here because comparing three independent blocks requires two stacks (or a Turing tape), exceeding a single PDA's capability (Problem 1)!
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

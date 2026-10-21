import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Presentation,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  Volume2,
} from 'lucide-react';
import { MathView } from './MathView';
import { BlockVisualizer } from './BlockVisualizer';
import { DecompositionBar } from './DecompositionBar';
import { PumpingAnimator } from './PumpingAnimator';
import { CaseExplorer } from './CaseExplorer';
import { QuantifierMatrix } from './QuantifierMatrix';
import { P1_STEPS } from '../math/cflProblem1';
import type { DecompositionCFL, ProofCaseCFL } from '../types/automata';

interface Problem1PresentationProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onExitPresentation: () => void;
  p: number;
  onPChange: (newP: number) => void;
  i: number;
  onIChange: (newI: number) => void;
  decomp: DecompositionCFL;
  onDecompChange: (u: number, v: number, w: number, x: number, y: number) => void;
  selectedCaseId: string | null;
  onSelectCase: (c: ProofCaseCFL) => void;
}

export const Problem1Presentation: React.FC<Problem1PresentationProps> = ({
  currentStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  onReset,
  onExitPresentation,
  p,
  onPChange,
  i,
  onIChange,
  decomp,
  onDecompChange,
  selectedCaseId,
  onSelectCase,
}) => {
  const stepData = P1_STEPS[currentStep - 1] || P1_STEPS[0];
  const totalSteps = P1_STEPS.length;

  const handlePrev = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Presentation Shell Card */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-950 rounded-2xl border border-indigo-500/40 p-6 shadow-2xl backdrop-blur-md">
        {/* Slide Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-indigo-900/60 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  STEP {currentStep} OF {totalSteps}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {stepData.tag}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {stepData.title}
              </h2>
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1 disabled:opacity-40 transition"
              title="Previous Step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={onTogglePlay}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auto Play</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === totalSteps}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1 disabled:opacity-40 transition"
              title="Next Step"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onReset}
              className="p-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Reset to Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onExitPresentation}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition ml-2"
            >
              Exit Presentation
            </button>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-8 gap-1.5 my-4">
          {P1_STEPS.map((s) => {
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;
            return (
              <button
                key={s.step}
                onClick={() => onStepChange(s.step)}
                title={`Step ${s.step}: ${s.title}`}
                className={`h-2 rounded-full transition-all duration-300 relative ${
                  isCurrent
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-400 shadow-md shadow-indigo-500/50 ring-2 ring-indigo-400/30'
                    : isCompleted
                    ? 'bg-indigo-700/60 hover:bg-indigo-600'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="sr-only">Step {s.step}</span>
              </button>
            );
          })}
        </div>

        {/* LaTeX Math Formula Card */}
        {stepData.latex && (
          <div className="my-4 p-4 rounded-xl bg-slate-950/90 border border-indigo-900/50 text-center shadow-inner overflow-x-auto">
            <MathView math={stepData.latex} displayMode className="text-indigo-200 text-base sm:text-lg" />
          </div>
        )}

        {/* Step Summary */}
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-4">
          {stepData.summary}
        </p>

        {/* Speaker Notes Callout */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 flex items-start space-x-2.5 mb-6">
          <Volume2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-300 uppercase tracking-wider text-[10px] block mb-0.5">
              Speaker Note / Presentation Point:
            </span>
            {stepData.speakerNotes}
          </div>
        </div>

        {/* =========================================================================
            DYNAMIC SLIDE CONTENT: REVEAL ONLY THE RELEVANT STEP'S FOCUSED COMPONENT
           ========================================================================= */}
        <div className="pt-4 border-t border-indigo-900/40">
          {/* STEP 1: Language Definition & Three-Block Structure */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>Block 1: Prefix <MathView math="a^n" /></span>
                  </div>
                  <p className="text-xs text-slate-300">
                    A sequence of <MathView math="n" /> consecutive 'a' symbols. Must be non-empty (<MathView math="n \ge 1" />).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span>Block 2: Middle <MathView math="b^n" /></span>
                  </div>
                  <p className="text-xs text-slate-300">
                    A sequence of <MathView math="n" /> consecutive 'b' symbols. Acts as a strict separator of length <MathView math="n" />.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/50 space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <span>Block 3: Suffix <MathView math="a^n" /></span>
                  </div>
                  <p className="text-xs text-slate-300">
                    A sequence of <MathView math="n" /> consecutive 'a' symbols. Must exactly match the counts of Block 1 and Block 2.
                  </p>
                </div>
              </div>

              {/* Sample Strings Table */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Example Valid Strings Belonging to L:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">n = 1 (Length 3)</span>
                    <span className="text-cyan-400 font-bold">a</span>
                    <span className="text-purple-400 font-bold">b</span>
                    <span className="text-indigo-400 font-bold">a</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">n = 2 (Length 6)</span>
                    <span className="text-cyan-400 font-bold">aa</span>
                    <span className="text-purple-400 font-bold">bb</span>
                    <span className="text-indigo-400 font-bold">aa</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">n = 3 (Length 9)</span>
                    <span className="text-cyan-400 font-bold">aaa</span>
                    <span className="text-purple-400 font-bold">bbb</span>
                    <span className="text-indigo-400 font-bold">aaa</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">n = 4 (Length 12)</span>
                    <span className="text-cyan-400 font-bold">aaaa</span>
                    <span className="text-purple-400 font-bold">bbbb</span>
                    <span className="text-indigo-400 font-bold">aaaa</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Assume Context-Free & Introduce Pumping Length p */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Adversary Choice: Pumping Length Constant <MathView math="p \ge 1" />
                    </h4>
                    <p className="text-xs text-slate-400">
                      In the proof, the adversary provides some positive integer <MathView math="p" />. Slide below to test any <MathView math="p" />:
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-mono font-bold text-indigo-300">p = {p}</span>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={p}
                      onChange={(e) => onPChange(parseInt(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/40">
                    <span className="font-bold text-indigo-300 block mb-1">
                      Why does p exist if L is CFL?
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      If L is generated by a Context-Free Grammar in Chomsky Normal Form with <MathView math="|V|" /> non-terminals, let <MathView math="p = 2^{|V|}" />. Any parse tree for a string of length <MathView math="\ge p" /> has height <MathView math="\ge |V| + 1" />, forcing a repeated non-terminal symbol on the longest path via the Pigeonhole Principle.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-900/40">
                    <span className="font-bold text-purple-300 block mb-1">
                      Universal Quantifier (∀p ≥ 1)
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      We do not pick <MathView math="p" />. Our contradiction argument must successfully refute <MathView math="L \in \text{CFL}" /> for ANY value of <MathView math="p" /> chosen by the adversary.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Select String s = a^p b^p a^p */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <BlockVisualizer p={p} onPChange={onPChange} decomp={decomp} />
            </div>
          )}

          {/* STEP 4: Introduce Decomposition s = uvwxy & Conditions */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                    <span className="px-2 py-0.5 rounded bg-indigo-900/50 text-[11px] font-mono">1</span>
                    <span>Bounded Window</span>
                  </div>
                  <MathView math="|vwx| \le p" className="text-sm font-mono text-cyan-300 block" />
                  <p className="text-xs text-slate-400">
                    The combined length of <MathView math="v, w, x" /> cannot exceed the pumping constant <MathView math="p" />.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <span className="px-2 py-0.5 rounded bg-emerald-900/50 text-[11px] font-mono">2</span>
                    <span>Non-Trivial Pump</span>
                  </div>
                  <MathView math="|vx| > 0" className="text-sm font-mono text-emerald-300 block" />
                  <p className="text-xs text-slate-400">
                    At least one of <MathView math="v" /> or <MathView math="x" /> must be non-empty (<MathView math="|v| + |x| \ge 1" />).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                    <span className="px-2 py-0.5 rounded bg-purple-900/50 text-[11px] font-mono">3</span>
                    <span>Universal Membership</span>
                  </div>
                  <MathView math="\forall i \ge 0: u v^i w x^i y \in L" className="text-sm font-mono text-purple-300 block" />
                  <p className="text-xs text-slate-400">
                    Pumping with ANY non-negative integer <MathView math="i = 0, 1, 2, \dots" /> must produce strings in <MathView math="L" />.
                  </p>
                </div>
              </div>

              {/* Decomposition Bar */}
              <DecompositionBar
                p={p}
                decomp={decomp}
                onDecompChange={onDecompChange}
                selectedCaseId={selectedCaseId}
                onSelectCase={onSelectCase}
              />
            </div>
          )}

          {/* STEP 5: Visualize 3 Blocks & Explore Valid Decompositions */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <BlockVisualizer p={p} onPChange={onPChange} decomp={decomp} />
              <DecompositionBar
                p={p}
                decomp={decomp}
                onDecompChange={onDecompChange}
                selectedCaseId={selectedCaseId}
                onSelectCase={onSelectCase}
              />
            </div>
          )}

          {/* STEP 6: Pumping Controls for i = 0, 1, and 2 */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <PumpingAnimator
                p={p}
                decomp={decomp}
                i={i}
                onIChange={onIChange}
              />
              <DecompositionBar
                p={p}
                decomp={decomp}
                onDecompChange={onDecompChange}
                selectedCaseId={selectedCaseId}
                onSelectCase={onSelectCase}
              />
            </div>
          )}

          {/* STEP 7: The Proof: Why All Decompositions Fail (|vwx| <= p) */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/40 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>The Geometric Bottleneck: Buffer of p b's Prevents Crossing</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Because <MathView math="|vwx| \le p" />, the span of <MathView math="vwx" /> is bounded by <MathView math="p" />. But between the first block of <MathView math="a^p" /> and the third block of <MathView math="a^p" /> lies the entire middle block of <MathView math="p" /> <code className="text-purple-300 font-mono">b</code>'s. Spanning from Block 1 to Block 3 would require length at least <MathView math="p + 2 > p" />! Therefore, <MathView math="vwx" /> touches at most 2 adjacent blocks. Since <MathView math="|vx| > 0" />, pumping changes at most 2 block counts, leaving the third block fixed at <MathView math="p" />, which destroys equal counts in all 5 cases.
                </p>
              </div>

              <CaseExplorer
                p={p}
                selectedCaseId={selectedCaseId}
                onSelectCase={onSelectCase}
              />

              <PumpingAnimator
                p={p}
                decomp={decomp}
                i={i}
                onIChange={onIChange}
              />
            </div>
          )}

          {/* STEP 8: Contradiction & Conclusion: L is Not Context-Free */}
          {currentStep === 8 && (
            <div className="space-y-6">
              {/* Final Conclusion Certificate */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/50 to-purple-950/40 border-2 border-emerald-500/60 shadow-xl space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Formal Mathematical Contradiction & Theorem Concluded
                    </h3>
                    <p className="text-xs text-emerald-300 font-mono">
                      Q.E.D. — L = &#123; aⁿ bⁿ aⁿ | n ≥ 1 &#125; is NOT Context-Free
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Every possible decomposition <MathView math="s = uvwxy" /> satisfying <MathView math="|vwx| \le p" /> and <MathView math="|vx| > 0" /> fails condition (3) for either <MathView math="i = 0" /> or <MathView math="i = 2" /> across all 5 exhaustive structural cases. The Pumping Lemma does not hold for <MathView math="L" />. Hence, the initial assumption that <MathView math="L" /> is context-free must be false.
                </p>

                <div className="pt-3 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-300 font-semibold">
                    Language Classification: <strong>Strictly Context-Sensitive (Chomsky Type-1)</strong>
                  </span>
                  <span className="font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                    ∎ Q.E.D. Proof Complete
                  </span>
                </div>
              </div>

              {/* Quantifier Matrix / Game Theory View */}
              <QuantifierMatrix />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

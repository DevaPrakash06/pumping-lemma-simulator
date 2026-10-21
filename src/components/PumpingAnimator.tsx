import React, { useEffect, useState } from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  Flame,
  TrendingDown,
  TrendingUp,
  Sparkles,
  BookOpen,
  GraduationCap,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MathView } from './MathView';
import type { DecompositionCFL, FormulaMode, NotationMode } from '../types/automata';
import { pumpString, checkMembershipP1 } from '../math/cflProblem1';

interface PumpingAnimatorProps {
  p: number;
  decomp: DecompositionCFL;
  i: number;
  onIChange: (newI: number) => void;
  notationMode?: NotationMode;
  formulaMode?: FormulaMode;
}

export const PumpingAnimator: React.FC<PumpingAnimatorProps> = ({
  p,
  decomp,
  i,
  onIChange,
  notationMode = 'uvxyz',
  formulaMode = 'notebook',
}) => {
  const [copied, setCopied] = useState(false);
  const pumped = pumpString(decomp, i);
  const membership = checkMembershipP1(pumped.pumpedString);

  // Notation labels
  const isUVXYZ = notationMode === 'uvxyz';
  const midSymbol = isUVXYZ ? 'x' : 'w';
  const pmp2Symbol = isUVXYZ ? 'y' : 'x';
  const suffSymbol = isUVXYZ ? 'z' : 'y';

  const baseLatex = isUVXYZ ? 's = u v^1 x y^1 z' : 's = u v^1 w x^1 y';
  const pumpedLatex = isUVXYZ
    ? `s_{${i}} = u v^{${i}} x y^{${i}} z`
    : `s_{${i}} = u v^{${i}} w x^{${i}} y`;

  // Trigger celebration when contradiction is proven (i != 1 and membership is false)
  useEffect(() => {
    if (i !== 1 && !membership.isValid) {
      try {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#818cf8', '#a855f7', '#f43f5e'],
          disableForReducedMotion: true,
        });
      } catch (err) {
        // ignore if canvas not supported
      }
    }
  }, [i, membership.isValid]);

  const handleCopyFinalAnswer = () => {
    const formulaStr = formulaMode === 'notebook'
      ? `s = a^p a a b^p b b a^p a a (where n = p + 2)`
      : `s = a^p b^p a^p (where n = p)`;
    const blockN = formulaMode === 'notebook' ? p + 2 : p;

    const textToCopy = `FINAL ANSWER & PROOF SUMMARY
================================================================================
Problem: Prove that L = { a^n b^n a^n | n >= 1 } is not context-free.

1. Assumption:
   Assume for contradiction that L is context-free.
   By the CFL Pumping Lemma, there exists a constant p >= 1.

2. Selected String s:
   Using formula ${formulaStr}.
   For p = ${p}:
   s = a^${blockN} b^${blockN} a^${blockN} = ${'a'.repeat(blockN)}${'b'.repeat(blockN)}${'a'.repeat(blockN)} (|s| = ${3 * blockN})

3. Decomposition (${isUVXYZ ? 's = uvxyz' : 's = uvwxy'}):
   - ${isUVXYZ ? '|vxy|' : '|vwx|'} <= ${p}
   - ${isUVXYZ ? '|vy|' : '|vx|'} > 0
   - For all i >= 0, ${isUVXYZ ? 'u v^i x y^i z' : 'u v^i w x^i y'} must belong to L.

4. Pumping with i = ${i}:
   s_${i} = ${pumped.pumpedString} (Length: ${pumped.pumpedString.length})
   Counts:
   - 1st Block a's = ${membership.a1Count}
   - Middle Block b's = ${membership.bCount}
   - 2nd Block a's = ${membership.a2Count}
   Equality Check: ${membership.a1Count} = ${membership.bCount} = ${membership.a2Count} --> ${membership.equalCounts ? 'EQUAL' : 'NOT EQUAL (Contradiction!)'}

5. Final Conclusion:
   Since s_${i} does not belong to L, the Pumping Lemma condition is violated.
   Therefore, L = { a^n b^n a^n | n >= 1 } is NOT a Context-Free Language (L ∉ CFL). [Q.E.D.]
================================================================================`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-5">
      {/* Pumping Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white flex items-center">
              <Zap className="w-4 h-4 text-amber-400 mr-2" />
              Pumping Demonstration: <MathView math={pumpedLatex} className="ml-1 text-indigo-300 font-mono" />
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            For pumping length <MathView math={`p = ${p}`} />, vary exponent <MathView math="i \ge 0" /> to duplicate or eliminate <MathView math="v" /> and <MathView math={pmp2Symbol} />.
          </p>
        </div>

        {/* Quick i buttons: i=0 (down), i=1 (base), i=2 (up 2x), i=3 (Notebook Step 7) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => onIChange(0)}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold flex items-center space-x-1 transition ${
              i === 0
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>i = 0 (Down)</span>
          </button>

          <button
            onClick={() => onIChange(1)}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold flex items-center space-x-1 transition ${
              i === 1
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>i = 1 (Base)</span>
          </button>

          <button
            onClick={() => onIChange(2)}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold flex items-center space-x-1 transition ${
              i === 2
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>i = 2 (2x)</span>
          </button>

          {/* Highlighted i = 3 button from Step 7 of the user's handwritten notes */}
          <button
            onClick={() => onIChange(3)}
            className={`px-3 py-1 text-xs rounded-lg font-bold flex items-center space-x-1 transition border ${
              i === 3
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white border-amber-400 shadow-md shadow-indigo-600/40 glow-active'
                : 'bg-slate-900 text-amber-300 border-amber-600/50 hover:bg-slate-800'
            }`}
            title="Notebook Step 7: let i = 3, s = u v³ x y³ z"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>i = 3 (Notes Step 7)</span>
          </button>

          {/* Stepper for i */}
          <div className="flex items-center pl-2 border-l border-slate-800 space-x-1">
            <span className="text-xs text-slate-400 font-mono">i={i}</span>
            <button
              onClick={() => onIChange(Math.max(0, i - 1))}
              disabled={i === 0}
              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs disabled:opacity-30"
            >
              -
            </button>
            <button
              onClick={() => onIChange(Math.min(6, i + 1))}
              disabled={i >= 6}
              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Visual String Comparison: Original vs Pumped */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* Original string s */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-slate-500 mr-1.5"></span>
              Base String <MathView math={baseLatex} className="ml-1 text-slate-300" />
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Length: {decomp.uLen + decomp.vLen + decomp.wLen + decomp.xLen + decomp.yLen}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 font-mono text-xs sm:text-sm bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
            {decomp.u && <span className="text-sky-400 bg-sky-950/40 px-1 rounded">{decomp.u}</span>}
            {decomp.v && <span className="text-emerald-400 bg-emerald-950/50 px-1 rounded border border-emerald-800/40">{decomp.v}</span>}
            {decomp.w && <span className="text-amber-400 bg-amber-950/40 px-1 rounded">{decomp.w}</span>}
            {decomp.x && <span className="text-rose-400 bg-rose-950/50 px-1 rounded border border-rose-800/40">{decomp.x}</span>}
            {decomp.y && <span className="text-purple-400 bg-purple-950/40 px-1 rounded">{decomp.y}</span>}
          </div>
        </div>

        {/* Pumped string s_i */}
        <div className="p-4 rounded-xl bg-slate-950 border-2 border-indigo-500/40 relative overflow-hidden pump-animated shadow-xl shadow-indigo-950/30">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 mr-1" />
                Pumped String <MathView math={pumpedLatex} className="ml-1 text-white" />
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {i === 0
                  ? 'PUMP DOWN (v & ' + pmp2Symbol + ' removed)'
                  : i === 1
                  ? 'UNPUMPED BASE STRING'
                  : i === 3
                  ? 'CLASS NOTES STEP 7: PUMP UP 3x'
                  : `PUMP UP (${i}x duplication)`}
              </span>
            </div>
            <span className="font-mono text-xs text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
              |s_{i}| = {pumped.pumpedString.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 font-mono text-sm sm:text-base bg-slate-900 p-3 rounded-lg border border-indigo-900/40 overflow-x-auto min-h-[44px]">
            {/* Part 1: u */}
            {pumped.u && (
              <span className="text-sky-300 bg-sky-950/40 px-1.5 py-0.5 rounded" title={`u: "${pumped.u}"`}>
                {pumped.u}
              </span>
            )}

            {/* Part 2: v^i */}
            {i > 0 && pumped.pumpedV && (
              <span
                className="text-emerald-300 bg-emerald-950/70 px-1.5 py-0.5 rounded border-2 border-emerald-400 glow-active font-bold"
                title={`v^${i}: "${pumped.pumpedV}" (${i} copies of v)`}
              >
                {pumped.pumpedV}
                <sub className="text-[10px] text-emerald-200 ml-0.5">({i}×v)</sub>
              </span>
            )}
            {i === 0 && decomp.vLen > 0 && (
              <span className="text-xs line-through text-slate-500 px-1" title="v deleted by i=0">
                [v deleted]
              </span>
            )}

            {/* Part 3: middle buffer (w in uvwxy, x in uvxyz) */}
            {pumped.w && (
              <span className="text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded" title={`${midSymbol}: "${pumped.w}"`}>
                {pumped.w}
              </span>
            )}

            {/* Part 4: pumped 2 (x in uvwxy, y in uvxyz) */}
            {i > 0 && pumped.pumpedX && (
              <span
                className="text-rose-300 bg-rose-950/70 px-1.5 py-0.5 rounded border-2 border-rose-400 glow-active font-bold"
                title={`${pmp2Symbol}^${i}: "${pumped.pumpedX}" (${i} copies of ${pmp2Symbol})`}
              >
                {pumped.pumpedX}
                <sub className="text-[10px] text-rose-200 ml-0.5">({i}×${pmp2Symbol})</sub>
              </span>
            )}
            {i === 0 && decomp.xLen > 0 && (
              <span className="text-xs line-through text-slate-500 px-1" title={`${pmp2Symbol} deleted by i=0`}>
                [{pmp2Symbol} deleted]
              </span>
            )}

            {/* Part 5: suffix (y in uvwxy, z in uvxyz) */}
            {pumped.y && (
              <span className="text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded" title={`${suffSymbol}: "${pumped.y}"`}>
                {pumped.y}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Language Membership Verification Card */}
      <div
        className={`p-4 rounded-xl border-2 transition-all ${
          membership.isValid
            ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300'
            : 'bg-rose-950/30 border-rose-500/60 text-rose-200 shadow-lg shadow-rose-950/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-current/20">
          <div className="flex items-center space-x-2">
            {membership.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="font-bold text-sm sm:text-base">
              Language Membership: <MathView math={`s_{${i}}`} /> {membership.isValid ? '∈' : '∉'}{' '}
              <MathView math="L = \{ a^n b^n a^n \mid n \ge 1 \}" />
            </span>
          </div>

          <span
            className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              membership.isValid
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 glow-active'
            }`}
          >
            {membership.isValid ? 'In Language (i=1 Base)' : 'CONTRADICTION FOUND (∉ L)'}
          </span>
        </div>

        {/* Detailed Breakdown of Counts and Order */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px]">1st Block a's</span>
            <span className="font-mono text-base font-bold text-cyan-300">
              {membership.a1Count}
            </span>
            <span className="text-[10px] text-slate-500 block">Required: n</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px]">Middle Block b's</span>
            <span className="font-mono text-base font-bold text-purple-300">
              {membership.bCount}
            </span>
            <span className="text-[10px] text-slate-500 block">Required: n</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px]">2nd Block a's</span>
            <span className="font-mono text-base font-bold text-indigo-300">
              {membership.a2Count}
            </span>
            <span className="text-[10px] text-slate-500 block">Required: n</span>
          </div>
        </div>

        {/* Reason Narrative */}
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/90 text-xs leading-relaxed text-slate-300">
          <p className="font-semibold mb-1 flex items-center">
            <Flame className="w-3.5 h-3.5 text-rose-400 mr-1.5" />
            Mathematical Verification Reason:
          </p>
          <p className="text-slate-300">{membership.reason}</p>
        </div>
      </div>

      {/* FINAL ANSWER / EXAM SUBMISSION SUMMARY CARD */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border-2 border-indigo-500/60 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-900/60 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center">
                <GraduationCap className="w-5 h-5 text-indigo-400 mr-2" />
                Final Answer & Formal Proof Verdict
              </h4>
              <p className="text-[11px] text-indigo-300 font-mono mt-0.5">
                {formulaMode === 'notebook' ? 'Formula: s = aᵖ a a bᵖ b b aᵖ a a (n = p + 2)' : 'Formula: s = aᵖ bᵖ aᵖ (n = p)'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyFinalAnswer}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Final Answer'}</span>
          </button>
        </div>

        {/* The Formal Answer Breakdown */}
        <div className="space-y-3 text-xs sm:text-sm">
          {/* 1. Value after pumping */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-slate-400 text-[11px] uppercase font-bold block flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5"></span>
              1. Resulting String Value After Pumping (i = {i}):
            </span>
            <div className="font-mono text-indigo-200 text-xs sm:text-sm break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 font-sans text-xs mr-1">s' = </span>
              <span className="text-cyan-300 font-bold">{'a'.repeat(membership.a1Count)}</span>
              <span className="text-purple-300 font-bold">{'b'.repeat(membership.bCount)}</span>
              <span className="text-indigo-300 font-bold">{'a'.repeat(membership.a2Count)}</span>
            </div>
            <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
              <span>Total Length: <strong className="text-white font-mono">{pumped.pumpedString.length}</strong> chars</span>
              <span>• Block 1: <strong className="text-cyan-300 font-mono">{membership.a1Count} a's</strong></span>
              <span>• Block 2: <strong className="text-purple-300 font-mono">{membership.bCount} b's</strong></span>
              <span>• Block 3: <strong className="text-indigo-300 font-mono">{membership.a2Count} a's</strong></span>
            </div>
          </div>

          {/* 2. Count Equality Comparison */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-slate-400 text-[11px] uppercase font-bold block flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
              2. Three-Block Count Comparison:
            </span>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-center text-xs sm:text-sm">
              {membership.equalCounts ? (
                <span className="text-emerald-400 font-bold">
                  Count(a¹) = {membership.a1Count} &nbsp;=&nbsp; Count(b) = {membership.bCount} &nbsp;=&nbsp; Count(a²) = {membership.a2Count}
                </span>
              ) : (
                <span className="text-rose-400 font-bold">
                  Count(a¹) = {membership.a1Count} &nbsp;vs&nbsp; Count(b) = {membership.bCount} &nbsp;vs&nbsp; Count(a²) = {membership.a2Count} &nbsp;⟹&nbsp; {membership.a1Count} ≠ {membership.a2Count} (UNEQUAL!)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              The language definition requires <MathView math="n \ge 1" /> symbols in all three homogeneous blocks simultaneously. Because {membership.a1Count} ≠ {membership.a2Count}, the pumped string violates language membership.
            </p>
          </div>

          {/* 3. Final Conclusion Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/50 to-purple-950/40 border-2 border-emerald-500/60 space-y-2">
            <span className="text-emerald-400 text-xs uppercase font-bold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
              3. Final Formal Conclusion & Theorem Verdict:
            </span>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Since the pumped string <MathView math={`s_{${i}}`} /> does not belong to <MathView math="L" />, condition (3) of the Pumping Lemma fails.
              Because this contradiction occurs for every valid decomposition across all 5 exhaustive structural cases, the initial assumption that <MathView math="L" /> is context-free must be false.
            </p>
            <div className="p-3 rounded-lg bg-slate-950/90 border border-emerald-500/50 text-center space-y-1">
              <div className="text-sm sm:text-base font-bold text-white tracking-wide">
                FINAL ANSWER: <span className="text-emerald-400 font-mono">L = &#123; aⁿ bⁿ aⁿ | n ≥ 1 &#125; is NOT a Context-Free Language (L ∉ CFL).</span>
              </div>
              <span className="inline-block font-mono text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                ∎ Q.E.D. Proof by Contradiction Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

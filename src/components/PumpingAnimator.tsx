import React, { useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  Flame,
  TrendingDown,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MathView } from './MathView';
import type { DecompositionCFL } from '../types/automata';
import { pumpString, checkMembershipP1 } from '../math/cflProblem1';

interface PumpingAnimatorProps {
  p: number;
  decomp: DecompositionCFL;
  i: number;
  onIChange: (newI: number) => void;
}

export const PumpingAnimator: React.FC<PumpingAnimatorProps> = ({
  p,
  decomp,
  i,
  onIChange,
}) => {
  const pumped = pumpString(decomp, i);
  const membership = checkMembershipP1(pumped.pumpedString);

  // Trigger brief celebration when contradiction is proven (i != 1 and membership is false)
  useEffect(() => {
    if (i !== 1 && !membership.isValid) {
      // micro confetti burst to reward understanding
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

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-5">
      {/* Pumping Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white flex items-center">
              <Zap className="w-4 h-4 text-amber-400 mr-2" />
              Pumping Demonstration: <MathView math="s_i = u v^i w x^i y" className="ml-1 text-indigo-300 font-mono" />
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            For pumping length <MathView math={`p = ${p}`} />, vary exponent <MathView math="i \ge 0" /> to duplicate or eliminate <MathView math="v" /> and <MathView math="x" />.
          </p>
        </div>

        {/* Quick i buttons: i=0 (down), i=1 (base), i=2 (up), custom */}
        <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => onIChange(0)}
            className={`px-3 py-1 text-xs rounded-lg font-bold flex items-center space-x-1 transition ${
              i === 0
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>i = 0 (Pump Down)</span>
          </button>

          <button
            onClick={() => onIChange(1)}
            className={`px-3 py-1 text-xs rounded-lg font-bold flex items-center space-x-1 transition ${
              i === 1
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>i = 1 (Original)</span>
          </button>

          <button
            onClick={() => onIChange(2)}
            className={`px-3 py-1 text-xs rounded-lg font-bold flex items-center space-x-1 transition ${
              i === 2
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>i = 2 (Pump Up)</span>
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
              onClick={() => onIChange(Math.min(5, i + 1))}
              disabled={i >= 5}
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
              Base String <MathView math="s = u v^1 w x^1 y" className="ml-1 text-slate-300" />
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
                Pumped String <MathView math={`s_{${i}} = u v^{${i}} w x^{${i}} y`} className="ml-1 text-white" />
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {i === 0 ? 'PUMP DOWN (v & x removed)' : i === 1 ? 'UNPUMPED' : `PUMP UP (${i}x duplication)`}
              </span>
            </div>
            <span className="font-mono text-xs text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
              |s_{i}| = {pumped.pumpedString.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 font-mono text-sm sm:text-base bg-slate-900 p-3 rounded-lg border border-indigo-900/40 overflow-x-auto min-h-[44px]">
            {/* u */}
            {pumped.u && (
              <span className="text-sky-300 bg-sky-950/40 px-1.5 py-0.5 rounded" title={`u: "${pumped.u}"`}>
                {pumped.u}
              </span>
            )}

            {/* v^i */}
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

            {/* w */}
            {pumped.w && (
              <span className="text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded" title={`w: "${pumped.w}"`}>
                {pumped.w}
              </span>
            )}

            {/* x^i */}
            {i > 0 && pumped.pumpedX && (
              <span
                className="text-rose-300 bg-rose-950/70 px-1.5 py-0.5 rounded border-2 border-rose-400 glow-active font-bold"
                title={`x^${i}: "${pumped.pumpedX}" (${i} copies of x)`}
              >
                {pumped.pumpedX}
                <sub className="text-[10px] text-rose-200 ml-0.5">({i}×x)</sub>
              </span>
            )}
            {i === 0 && decomp.xLen > 0 && (
              <span className="text-xs line-through text-slate-500 px-1" title="x deleted by i=0">
                [x deleted]
              </span>
            )}

            {/* y */}
            {pumped.y && (
              <span className="text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded" title={`y: "${pumped.y}"`}>
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
    </div>
  );
};

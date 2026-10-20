import React from 'react';
import { Swords } from 'lucide-react';
import { MathView } from './MathView';

export const QuantifierMatrix: React.FC = () => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center">
            <Swords className="w-4 h-4 text-indigo-400 mr-2" />
            Quantifier Logic & The Adversary Game
          </h3>
          <p className="text-xs text-slate-400">
            Why one decomposition is NOT enough: Understanding <MathView math="\forall" /> and <MathView math="\exists" /> in formal proofs.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
          Game Theory Model
        </span>
      </div>

      {/* The 4 Rounds of the Game */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Round 1 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 relative space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Round 1: Opponent</span>
            <span className="font-mono text-[10px] bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
              ∃ p ≥ 1
            </span>
          </div>
          <p className="text-xs text-slate-300">
            The opponent claims <MathView math="L" /> is context-free and provides a pumping length <MathView math="p" />.
          </p>
          <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800/80">
            <strong>Rule:</strong> We do NOT control <MathView math="p" />. The proof must hold for any positive integer <MathView math="p" />.
          </div>
        </div>

        {/* Round 2 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-800/50 relative space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
            <span>Round 2: You (Prover)</span>
            <span className="font-mono text-[10px] bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800">
              Pick s ∈ L
            </span>
          </div>
          <p className="text-xs text-slate-300">
            You choose a smart string <MathView math="s = a^p b^p a^p" /> of length <MathView math="|s| = 3p \ge p" />.
          </p>
          <div className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded border border-indigo-900/50">
            <strong>Advantage:</strong> WE have existential choice here. One well-chosen <MathView math="s" /> is completely sufficient!
          </div>
        </div>

        {/* Round 3 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 relative space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Round 3: Opponent</span>
            <span className="font-mono text-[10px] bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
              ∀ splits s = uvwxy
            </span>
          </div>
          <p className="text-xs text-slate-300">
            The opponent picks ANY decomposition <MathView math="uvwxy" /> obeying <MathView math="|vwx| \le p" /> and <MathView math="|vx| > 0" />.
          </p>
          <div className="text-[11px] text-rose-300 bg-rose-950/30 p-2 rounded border border-rose-900/40">
            <strong>Warning:</strong> You cannot pick the split! You must prove failure for <strong className="text-white">EVERY</strong> split they could choose.
          </div>
        </div>

        {/* Round 4 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-800/50 relative space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>Round 4: You (Win!)</span>
            <span className="font-mono text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
              ∃ i: sᵢ ∉ L
            </span>
          </div>
          <p className="text-xs text-slate-300">
            You counter with <MathView math="i = 0" /> or <MathView math="i = 2" /> to prove <MathView math="s_i \notin L" /> in all cases!
          </p>
          <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-900/50">
            <strong>Victory:</strong> Since the opponent has no winning decomposition left, the CFL hypothesis fails!
          </div>
        </div>
      </div>

      {/* Summary Matrix Table */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs overflow-x-auto">
        <table className="w-full text-left text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
              <th className="pb-2">Quantifier</th>
              <th className="pb-2">Object</th>
              <th className="pb-2">Controlled By</th>
              <th className="pb-2">Proof Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            <tr>
              <td className="py-2 text-indigo-400">∃ p ≥ 1</td>
              <td className="py-2">Pumping length</td>
              <td className="py-2 text-amber-400 font-sans">Opponent / Lemma</td>
              <td className="py-2 font-sans text-slate-400">Keep <MathView math="p" /> as an arbitrary variable</td>
            </tr>
            <tr>
              <td className="py-2 text-emerald-400">∀ s ∈ L (|s| ≥ p)</td>
              <td className="py-2">Test String</td>
              <td className="py-2 text-indigo-400 font-sans">You (Prover)</td>
              <td className="py-2 font-sans text-slate-400">Pick <MathView math="s = a^p b^p a^p" /> strategically</td>
            </tr>
            <tr>
              <td className="py-2 text-rose-400">∃ s = uvwxy</td>
              <td className="py-2">Decomposition</td>
              <td className="py-2 text-amber-400 font-sans">Opponent</td>
              <td className="py-2 font-sans text-slate-400">Must defeat <strong className="text-white">ALL 5</strong> structural cases</td>
            </tr>
            <tr>
              <td className="py-2 text-emerald-400">∀ i ≥ 0</td>
              <td className="py-2">Pumping exponent</td>
              <td className="py-2 text-indigo-400 font-sans">You (Prover)</td>
              <td className="py-2 font-sans text-slate-400">Choose <MathView math="i = 0" /> or <MathView math="i = 2" /> to violate membership</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

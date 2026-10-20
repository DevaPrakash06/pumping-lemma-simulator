import React from 'react';
import { Sliders, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { MathView } from './MathView';
import type { DecompositionCFL } from '../types/automata';

interface BlockVisualizerProps {
  p: number;
  onPChange: (newP: number) => void;
  decomp: DecompositionCFL;
}

export const BlockVisualizer: React.FC<BlockVisualizerProps> = ({ p, onPChange, decomp }) => {
  // Indices calculation for each decomposition part
  const uStart = 0;
  const uEnd = decomp.uLen;
  const vStart = uEnd;
  const vEnd = vStart + decomp.vLen;
  const wStart = vEnd;
  const wEnd = wStart + decomp.wLen;
  const xStart = wEnd;
  const xEnd = xStart + decomp.xLen;
  const yStart = xEnd;
  const yEnd = yStart + decomp.yLen;

  // vwx span
  const vwxStart = vStart;
  const vwxEnd = xEnd;
  const vwxLength = decomp.vLen + decomp.wLen + decomp.xLen;

  // Block boundaries
  // Block 1: [0, p)
  // Block 2: [p, 2p)
  // Block 3: [2p, 3p)
  const touchesBlock1 = vwxStart < p;
  const touchesBlock2 = vwxStart < 2 * p && vwxEnd > p;
  const touchesBlock3 = vwxEnd > 2 * p;

  const touchesAllThree = touchesBlock1 && touchesBlock2 && touchesBlock3;

  const totalLength = 3 * p;
  const charArray: { char: string; index: number; block: number }[] = [];
  for (let i = 0; i < p; i++) {
    charArray.push({ char: 'a', index: i, block: 1 });
  }
  for (let i = 0; i < p; i++) {
    charArray.push({ char: 'b', index: p + i, block: 2 });
  }
  for (let i = 0; i < p; i++) {
    charArray.push({ char: 'a', index: 2 * p + i, block: 3 });
  }

  const getDecompRole = (index: number) => {
    if (index >= uStart && index < uEnd) return 'u';
    if (index >= vStart && index < vEnd) return 'v';
    if (index >= wStart && index < wEnd) return 'w';
    if (index >= xStart && index < xEnd) return 'x';
    if (index >= yStart && index < yEnd) return 'y';
    return '';
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
      {/* Header with Pumping Length p Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 inline-block"></span>
              Selected String <code className="ml-1 text-indigo-300 font-mono">s = aᵖbᵖaᵖ</code>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              |s| = 3p = {totalLength}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Partitioned into three distinct structural blocks of size p.
          </p>
        </div>

        {/* Pumping length p slider & control */}
        <div className="flex items-center space-x-3 bg-slate-950/70 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <label htmlFor="p-slider" className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
            <span>Pumping Length</span>
            <MathView math="p =" className="ml-1" />
            <span className="text-indigo-400 font-mono font-bold text-sm ml-1">{p}</span>
          </label>
          <input
            id="p-slider"
            type="range"
            min="2"
            max="6"
            value={p}
            onChange={(e) => onPChange(parseInt(e.target.value))}
            className="w-24 sm:w-28 accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex space-x-1">
            {[2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => onPChange(val)}
                className={`px-1.5 py-0.5 text-[11px] rounded font-mono transition ${
                  p === val
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Blocks Visual Presentation */}
      <div className="my-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Block 1: a^p */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 relative overflow-hidden group hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-2">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5"></span>
                Block 1: Prefix <MathView math="a^p" className="ml-1 text-cyan-300" />
              </span>
              <span className="font-mono bg-cyan-900/40 px-2 py-0.5 rounded text-[11px] border border-cyan-700/40">
                Length: {p}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center py-2 bg-slate-950/60 rounded-lg p-2 border border-cyan-900/20 min-h-[48px] items-center">
              {charArray
                .filter((c) => c.block === 1)
                .map((c) => {
                  const role = getDecompRole(c.index);
                  return (
                    <div
                      key={c.index}
                      className={`w-7 h-8 sm:w-8 sm:h-9 rounded-md font-mono text-sm font-bold flex flex-col items-center justify-center transition-all duration-200 ${
                        role === 'u'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-400 shadow-sm shadow-sky-500/20'
                          : role === 'v'
                          ? 'bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400 glow-active scale-105'
                          : role === 'w'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                          : role === 'x'
                          ? 'bg-rose-500/30 text-rose-300 border-2 border-rose-400 glow-active scale-105'
                          : role === 'y'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{c.char}</span>
                      <span className="text-[9px] font-sans font-normal opacity-80 uppercase leading-none">
                        {role}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Block 2: b^p */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 relative overflow-hidden group hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-2">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-400 mr-1.5"></span>
                Block 2: Middle <MathView math="b^p" className="ml-1 text-purple-300" />
              </span>
              <span className="font-mono bg-purple-900/40 px-2 py-0.5 rounded text-[11px] border border-purple-700/40">
                Length: {p}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center py-2 bg-slate-950/60 rounded-lg p-2 border border-purple-900/20 min-h-[48px] items-center">
              {charArray
                .filter((c) => c.block === 2)
                .map((c) => {
                  const role = getDecompRole(c.index);
                  return (
                    <div
                      key={c.index}
                      className={`w-7 h-8 sm:w-8 sm:h-9 rounded-md font-mono text-sm font-bold flex flex-col items-center justify-center transition-all duration-200 ${
                        role === 'u'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-400'
                          : role === 'v'
                          ? 'bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400 glow-active scale-105'
                          : role === 'w'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                          : role === 'x'
                          ? 'bg-rose-500/30 text-rose-300 border-2 border-rose-400 glow-active scale-105'
                          : role === 'y'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{c.char}</span>
                      <span className="text-[9px] font-sans font-normal opacity-80 uppercase leading-none">
                        {role}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Block 3: a^p */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/40 relative overflow-hidden group hover:border-indigo-500/50 transition">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-2">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-400 mr-1.5"></span>
                Block 3: Suffix <MathView math="a^p" className="ml-1 text-indigo-300" />
              </span>
              <span className="font-mono bg-indigo-900/40 px-2 py-0.5 rounded text-[11px] border border-indigo-700/40">
                Length: {p}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center py-2 bg-slate-950/60 rounded-lg p-2 border border-indigo-900/20 min-h-[48px] items-center">
              {charArray
                .filter((c) => c.block === 3)
                .map((c) => {
                  const role = getDecompRole(c.index);
                  return (
                    <div
                      key={c.index}
                      className={`w-7 h-8 sm:w-8 sm:h-9 rounded-md font-mono text-sm font-bold flex flex-col items-center justify-center transition-all duration-200 ${
                        role === 'u'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-400'
                          : role === 'v'
                          ? 'bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400 glow-active scale-105'
                          : role === 'w'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                          : role === 'x'
                          ? 'bg-rose-500/30 text-rose-300 border-2 border-rose-400 glow-active scale-105'
                          : role === 'y'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{c.char}</span>
                      <span className="text-[9px] font-sans font-normal opacity-80 uppercase leading-none">
                        {role}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* The Crucial Geometric Theorem Banner (|vwx| <= p) */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
        <div className="flex items-start space-x-2.5">
          {touchesAllThree ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white">
                Why <MathView math="|vwx| \le p" /> Cannot Span All Three Blocks:
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Active |vwx| = {vwxLength} ≤ {p}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Between the first block of <MathView math="a^p" /> and the second block of <MathView math="a^p" /> sits
              the entire middle block of <MathView math="p" /> <span className="text-purple-300 font-mono">b</span>'s.
              To reach both the first <span className="text-cyan-300 font-mono">a</span>'s and the second <span className="text-indigo-300 font-mono">a</span>'s,
              the substring <MathView math="vwx" /> would have to span all <MathView math="p" /> <span className="text-purple-300 font-mono">b</span>'s
              plus at least one <span className="text-cyan-300 font-mono">a</span> from Block 1 and one <span className="text-indigo-300 font-mono">a</span> from Block 3,
              requiring length <MathView math="|vwx| \ge p + 2 > p" />.
            </p>
            <div className="flex items-center space-x-1.5 text-indigo-300 font-medium pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Mathematical Fact: <MathView math="vwx" /> is strictly confined to at most 2 adjacent blocks.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

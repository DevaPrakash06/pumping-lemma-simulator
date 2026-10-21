import React from 'react';
import { Sliders, ShieldAlert, Sparkles, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { MathView } from './MathView';
import type { DecompositionCFL, FormulaMode, NotationMode } from '../types/automata';
import { buildStringP1 } from '../math/cflProblem1';

interface BlockVisualizerProps {
  p: number;
  onPChange: (newP: number) => void;
  decomp: DecompositionCFL;
  formulaMode?: FormulaMode;
  onFormulaModeChange?: (mode: FormulaMode) => void;
  notationMode?: NotationMode;
  onNotationModeChange?: (mode: NotationMode) => void;
}

export const BlockVisualizer: React.FC<BlockVisualizerProps> = ({
  p,
  onPChange,
  decomp,
  formulaMode = 'notebook',
  onFormulaModeChange,
  notationMode = 'uvxyz',
  onNotationModeChange,
}) => {
  const { totalLength, blockSize, formulaLatex, formulaText } = buildStringP1(p, formulaMode);

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

  // Middle window span
  const windowStart = vStart;
  const windowEnd = xEnd;
  const windowLength = decomp.vLen + decomp.wLen + decomp.xLen;

  // Block boundaries
  // Block 1: [0, blockSize)
  // Block 2: [blockSize, 2 * blockSize)
  // Block 3: [2 * blockSize, 3 * blockSize)
  const touchesBlock1 = windowStart < blockSize;
  const touchesBlock2 = windowStart < 2 * blockSize && windowEnd > blockSize;
  const touchesBlock3 = windowEnd > 2 * blockSize;
  const touchesAllThree = touchesBlock1 && touchesBlock2 && touchesBlock3;

  const charArray: { char: string; index: number; block: number }[] = [];
  for (let i = 0; i < blockSize; i++) {
    charArray.push({ char: 'a', index: i, block: 1 });
  }
  for (let i = 0; i < blockSize; i++) {
    charArray.push({ char: 'b', index: blockSize + i, block: 2 });
  }
  for (let i = 0; i < blockSize; i++) {
    charArray.push({ char: 'a', index: 2 * blockSize + i, block: 3 });
  }

  // Symbol mapping based on notation mode:
  // uvxyz (notebook): u, v, x (middle), y (pumped), z (suffix)
  // uvwxy (standard): u, v, w (middle), x (pumped), y (suffix)
  const getDecompRole = (index: number) => {
    if (index >= uStart && index < uEnd) return 'u';
    if (index >= vStart && index < vEnd) return 'v';
    if (index >= wStart && index < wEnd) return notationMode === 'uvxyz' ? 'x' : 'w';
    if (index >= xStart && index < xEnd) return notationMode === 'uvxyz' ? 'y' : 'x';
    if (index >= yStart && index < yEnd) return notationMode === 'uvxyz' ? 'z' : 'y';
    return '';
  };

  const windowLabel = notationMode === 'uvxyz' ? 'vxy' : 'vwx';
  const pumpedLabel = notationMode === 'uvxyz' ? 'vy' : 'vx';

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Header with Mode Toggles and Formula */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 inline-block"></span>
              Selected String <code className="ml-1 text-indigo-300 font-mono text-xs sm:text-sm">{formulaText}</code>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-mono font-bold">
              |s| = {totalLength} chars
            </span>
            {formulaMode === 'notebook' && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-semibold flex items-center">
                <BookOpen className="w-3 h-3 mr-1" />
                Class Notes Step 5
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {formulaMode === 'notebook'
              ? `Each block has n = p + 2 = ${blockSize} characters. Middle buffer of ${blockSize} b's strictly exceeds pumping length p = ${p}.`
              : `Each block has n = p = ${blockSize} characters. Total length |s| = 3p = ${totalLength}.`}
          </p>
        </div>

        {/* P Controls & Toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Formula Mode Toggle */}
          {onFormulaModeChange && (
            <div className="flex items-center bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 space-x-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center">
                <Layers className="w-3 h-3 mr-1 text-indigo-400" />
                Formula:
              </span>
              <button
                onClick={() => onFormulaModeChange('notebook')}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                  formulaMode === 'notebook'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Class Notes Formula: s = aᵖ a a bᵖ b b aᵖ a a (n = p + 2)"
              >
                Notebook: aᵖa²bᵖb²aᵖa²
              </button>
              <button
                onClick={() => onFormulaModeChange('standard')}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                  formulaMode === 'standard'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Standard Textbook Formula: s = aᵖ bᵖ aᵖ (n = p)"
              >
                Standard: aᵖbᵖaᵖ
              </button>
            </div>
          )}

          {/* Notation Mode Toggle */}
          {onNotationModeChange && (
            <div className="flex items-center bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 space-x-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Notation:</span>
              <button
                onClick={() => onNotationModeChange('uvxyz')}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                  notationMode === 'uvxyz'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Notebook notation: s = uvxyz, conditions: |vxy| ≤ p, |vy| > 0"
              >
                uvxyz (Notes)
              </button>
              <button
                onClick={() => onNotationModeChange('uvwxy')}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                  notationMode === 'uvwxy'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Standard textbook notation: s = uvwxy, conditions: |vwx| ≤ p, |vx| > 0"
              >
                uvwxy (Textbook)
              </button>
            </div>
          )}

          {/* Pumping length p slider & control */}
          <div className="flex items-center space-x-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <label htmlFor="p-slider" className="text-xs font-semibold text-slate-300 flex items-center">
              <span>p =</span>
              <span className="text-indigo-400 font-mono font-bold text-sm ml-1">{p}</span>
            </label>
            <input
              id="p-slider"
              type="range"
              min="2"
              max="6"
              value={p}
              onChange={(e) => onPChange(parseInt(e.target.value))}
              className="w-20 accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex space-x-1">
              {[2, 3, 4, 5, 6].map((val) => (
                <button
                  key={val}
                  onClick={() => onPChange(val)}
                  className={`px-1.5 py-0.5 text-[11px] rounded font-mono transition ${
                    p === val
                      ? 'bg-indigo-600 text-white font-bold ring-1 ring-white/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LaTeX Formula Highlight Card */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
        <MathView math={formulaLatex} className="text-sm sm:text-base text-indigo-200 font-mono" />
      </div>

      {/* 3 Blocks Visual Presentation */}
      <div className="my-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Block 1 */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 relative overflow-hidden group hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-2">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5"></span>
                Block 1:{' '}
                {formulaMode === 'notebook' ? (
                  <MathView math="a^p a a" className="ml-1 text-cyan-300" />
                ) : (
                  <MathView math="a^p" className="ml-1 text-cyan-300" />
                )}
              </span>
              <span className="font-mono bg-cyan-900/40 px-2 py-0.5 rounded text-[11px] border border-cyan-700/40">
                Length: {blockSize}
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
                          : role === (notationMode === 'uvxyz' ? 'x' : 'w')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                          : role === (notationMode === 'uvxyz' ? 'y' : 'x')
                          ? 'bg-rose-500/30 text-rose-300 border-2 border-rose-400 glow-active scale-105'
                          : role === (notationMode === 'uvxyz' ? 'z' : 'y')
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

          {/* Block 2 */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 relative overflow-hidden group hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-2">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-400 mr-1.5"></span>
                Block 2:{' '}
                {formulaMode === 'notebook' ? (
                  <MathView math="b^p b b" className="ml-1 text-purple-300" />
                ) : (
                  <MathView math="b^p" className="ml-1 text-purple-300" />
                )}
              </span>
              <span className="font-mono bg-purple-900/40 px-2 py-0.5 rounded text-[11px] border border-purple-700/40">
                Length: {blockSize}
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
                          : role === (notationMode === 'uvxyz' ? 'x' : 'w')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                          : role === (notationMode === 'uvxyz' ? 'y' : 'x')
                          ? 'bg-rose-500/30 text-rose-300 border-2 border-rose-400 glow-active scale-105'
                          : role === (notationMode === 'uvxyz' ? 'z' : 'y')
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

          {/* Block 3 */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/40 relative overflow-hidden group hover:border-indigo-500/50 transition">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-2">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-400 mr-1.5"></span>
                Block 3:{' '}
                {formulaMode === 'notebook' ? (
                  <MathView math="a^p a a" className="ml-1 text-indigo-300" />
                ) : (
                  <MathView math="a^p" className="ml-1 text-indigo-300" />
                )}
              </span>
              <span className="font-mono bg-indigo-900/40 px-2 py-0.5 rounded text-[11px] border border-indigo-700/40">
                Length: {blockSize}
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
                          : role === (notationMode === 'uvxyz' ? 'x' : 'w')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                          : role === (notationMode === 'uvxyz' ? 'y' : 'x')
                          ? 'bg-rose-500/30 text-rose-300 border-2 border-rose-400 glow-active scale-105'
                          : role === (notationMode === 'uvxyz' ? 'z' : 'y')
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

      {/* The Crucial Geometric Theorem Banner (|window| <= p) */}
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
                Why <MathView math={`|${windowLabel}| \\le p`} /> Cannot Span Across All Three Blocks:
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Active |{windowLabel}| = {windowLength} ≤ {p}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Between the first block of <span className="text-cyan-300 font-mono">a</span>'s and the second block of{' '}
              <span className="text-indigo-300 font-mono">a</span>'s sits the middle block of{' '}
              <span className="text-purple-300 font-mono font-bold">{blockSize} b</span>'s. Because the lemma restricts{' '}
              <MathView math={`|${windowLabel}| \\le ${p}`} /> and the middle block of b's has length{' '}
              <MathView math={`${blockSize} \\ge ${p}`} />, the window <MathView math={windowLabel} /> cannot even cross
              all the b's, let alone reach both blocks of a's simultaneously!
            </p>
            <div className="flex items-center space-x-1.5 text-indigo-300 font-medium pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Mathematical Fact: <MathView math={windowLabel} /> is strictly confined to at most 2 adjacent blocks. Pumping {pumpedLabel} always destroys equality with the untouched block.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

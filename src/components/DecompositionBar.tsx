import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  BookmarkCheck,
  Split,
} from 'lucide-react';
import { MathView } from './MathView';
import type { DecompositionCFL, FormulaMode, NotationMode, ProofCaseCFL } from '../types/automata';
import { getStandardCasesP1 } from '../math/cflProblem1';

interface DecompositionBarProps {
  p: number;
  decomp: DecompositionCFL;
  onDecompChange: (uLen: number, vLen: number, wLen: number, xLen: number, yLen: number) => void;
  selectedCaseId: string | null;
  onSelectCase: (c: ProofCaseCFL) => void;
  formulaMode?: FormulaMode;
  notationMode?: NotationMode;
}

export const DecompositionBar: React.FC<DecompositionBarProps> = ({
  p,
  decomp,
  onDecompChange,
  selectedCaseId,
  onSelectCase,
  formulaMode = 'notebook',
  notationMode = 'uvxyz',
}) => {
  const total = formulaMode === 'notebook' ? 3 * (p + 2) : 3 * p;
  const windowLen = decomp.vLen + decomp.wLen + decomp.xLen;
  const pumpedLen = decomp.vLen + decomp.xLen;

  const windowValid = windowLen <= p;
  const pumpedValid = pumpedLen > 0;

  const standardCases = getStandardCasesP1(p, formulaMode, notationMode);

  // Character slice positions [start, end) on s
  const uStart = 0;
  const uEnd = decomp.uLen;
  const vStart = uEnd;
  const vEnd = vStart + decomp.vLen;
  const midStart = vEnd;
  const midEnd = midStart + decomp.wLen;
  const pmp2Start = midEnd;
  const pmp2End = pmp2Start + decomp.xLen;
  const suffStart = pmp2End;
  const suffEnd = suffStart + decomp.yLen;

  // Labels based on notationMode
  const isUVXYZ = notationMode === 'uvxyz';
  const midSymbol = isUVXYZ ? 'x' : 'w';
  const pmp2Symbol = isUVXYZ ? 'y' : 'x';
  const suffSymbol = isUVXYZ ? 'z' : 'y';
  const windowLabel = isUVXYZ ? '|vxy|' : '|vwx|';
  const pumpedLabel = isUVXYZ ? '|vy|' : '|vx|';
  const fullDecompFormula = isUVXYZ ? 's = uvxyz' : 's = uvwxy';

  // Helper to safely update a component length while preserving total
  const handleLengthChange = (key: 'u' | 'v' | 'w' | 'x' | 'y', newLen: number) => {
    let u = decomp.uLen;
    let v = decomp.vLen;
    let w = decomp.wLen;
    let x = decomp.xLen;
    let y = decomp.yLen;

    const safeVal = Math.max(0, newLen);

    if (key === 'u') {
      u = safeVal;
      y = Math.max(0, total - (u + v + w + x));
    } else if (key === 'v') {
      v = safeVal;
      y = Math.max(0, total - (u + v + w + x));
    } else if (key === 'w') {
      w = safeVal;
      y = Math.max(0, total - (u + v + w + x));
    } else if (key === 'x') {
      x = safeVal;
      y = Math.max(0, total - (u + v + w + x));
    } else if (key === 'y') {
      y = safeVal;
    }

    onDecompChange(u, v, w, x, y);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Header and Case Quick-Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center">
            <Split className="w-4 h-4 text-indigo-400 mr-2" />
            Decomposition Explorer: <code className="ml-1 text-indigo-300 font-mono">{fullDecompFormula}</code>
          </h3>
          <p className="text-xs text-slate-400">
            Deconstruct <MathView math="s" /> into 5 parts and test the pumping conditions ({windowLabel} ≤ {p}, {pumpedLabel} &gt; 0).
          </p>
        </div>

        {/* Standard Cases Dropdown / Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 hidden lg:inline">Proof Cases:</span>
          <div className="flex flex-wrap gap-1.5">
            {standardCases.map((sc, idx) => {
              const isSelected = selectedCaseId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectCase(sc)}
                  title={sc.description}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <BookmarkCheck className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                  <span>Case {idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Decomposition Segmented Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Visual String Slices ({fullDecompFormula})</span>
          <span className="font-mono text-[11px] text-slate-400">
            Total length: {decomp.uLen + decomp.vLen + decomp.wLen + decomp.xLen + decomp.yLen} / {total}
          </span>
        </div>

        <div className="h-10 rounded-xl overflow-hidden flex shadow-inner border border-slate-800 bg-slate-950 p-1 gap-1">
          {/* Part 1: u */}
          {decomp.uLen > 0 && (
            <div
              style={{ flex: decomp.uLen }}
              className="bg-sky-500/20 border border-sky-400/60 rounded-lg flex items-center justify-center font-mono font-bold text-sky-300 text-xs transition-all relative group overflow-hidden"
            >
              <span className="truncate px-1">u = "{decomp.u}"</span>
              <span className="absolute bottom-0 right-1 text-[9px] opacity-70">|u|={decomp.uLen}</span>
            </div>
          )}

          {/* Part 2: v (pumped 1) */}
          {decomp.vLen > 0 ? (
            <div
              style={{ flex: decomp.vLen }}
              className="bg-emerald-500/30 border-2 border-emerald-400 rounded-lg flex items-center justify-center font-mono font-bold text-emerald-300 text-xs transition-all relative group overflow-hidden glow-active"
            >
              <span className="truncate px-1">v = "{decomp.v}"</span>
              <span className="absolute bottom-0 right-1 text-[9px] font-sans font-bold text-emerald-200">
                PUMP (vⁱ)
              </span>
            </div>
          ) : (
            <div className="px-1.5 rounded bg-slate-800/40 border border-slate-700 text-[10px] text-slate-500 flex items-center">
              v=ε
            </div>
          )}

          {/* Part 3: middle buffer (w in uvwxy, x in uvxyz) */}
          {decomp.wLen > 0 ? (
            <div
              style={{ flex: decomp.wLen }}
              className="bg-amber-500/20 border border-amber-400/60 rounded-lg flex items-center justify-center font-mono font-bold text-amber-300 text-xs transition-all relative group overflow-hidden"
            >
              <span className="truncate px-1">{midSymbol} = "{decomp.w}"</span>
              <span className="absolute bottom-0 right-1 text-[9px] opacity-70">|{midSymbol}|={decomp.wLen}</span>
            </div>
          ) : (
            <div className="px-1.5 rounded bg-slate-800/40 border border-slate-700 text-[10px] text-slate-500 flex items-center">
              {midSymbol}=ε
            </div>
          )}

          {/* Part 4: pumped 2 (x in uvwxy, y in uvxyz) */}
          {decomp.xLen > 0 ? (
            <div
              style={{ flex: decomp.xLen }}
              className="bg-rose-500/30 border-2 border-rose-400 rounded-lg flex items-center justify-center font-mono font-bold text-rose-300 text-xs transition-all relative group overflow-hidden glow-active"
            >
              <span className="truncate px-1">{pmp2Symbol} = "{decomp.x}"</span>
              <span className="absolute bottom-0 right-1 text-[9px] font-sans font-bold text-rose-200">
                PUMP ({pmp2Symbol}ⁱ)
              </span>
            </div>
          ) : (
            <div className="px-1.5 rounded bg-slate-800/40 border border-slate-700 text-[10px] text-slate-500 flex items-center">
              {pmp2Symbol}=ε
            </div>
          )}

          {/* Part 5: suffix (y in uvwxy, z in uvxyz) */}
          {decomp.yLen > 0 && (
            <div
              style={{ flex: decomp.yLen }}
              className="bg-purple-500/20 border border-purple-400/60 rounded-lg flex items-center justify-center font-mono font-bold text-purple-300 text-xs transition-all relative group overflow-hidden"
            >
              <span className="truncate px-1">{suffSymbol} = "{decomp.y}"</span>
              <span className="absolute bottom-0 right-1 text-[9px] opacity-70">|{suffSymbol}|={decomp.yLen}</span>
            </div>
          )}
        </div>
      </div>

      {/* Length Controls for 5 substrings */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
        {/* Part 1: u control */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-sky-900/30">
          <div className="flex items-center justify-between text-xs font-semibold text-sky-400 mb-1">
            <span>u (prefix)</span>
            <span className="font-mono bg-sky-950 px-1.5 rounded border border-sky-800/50">
              |u|={decomp.uLen}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex justify-between">
            <span>Pos: [{uStart}, {uEnd})</span>
            <span className="truncate max-w-[65px]">"{decomp.u || 'ε'}"</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleLengthChange('u', decomp.uLen - 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max={total}
              value={decomp.uLen}
              onChange={(e) => handleLengthChange('u', parseInt(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-slate-800"
            />
            <button
              onClick={() => handleLengthChange('u', decomp.uLen + 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Part 2: v control */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-900/30">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
            <span>v (pumped 1)</span>
            <span className="font-mono bg-emerald-950 px-1.5 rounded border border-emerald-800/50">
              |v|={decomp.vLen}
            </span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mb-1.5 flex justify-between">
            <span>Pos: [{vStart}, {vEnd})</span>
            <span className="truncate max-w-[65px]">"{decomp.v || 'ε'}"</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleLengthChange('v', decomp.vLen - 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max={p}
              value={decomp.vLen}
              onChange={(e) => handleLengthChange('v', parseInt(e.target.value))}
              className="w-full accent-emerald-400 h-1 bg-slate-800"
            />
            <button
              onClick={() => handleLengthChange('v', decomp.vLen + 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Part 3: middle buffer control (w in uvwxy, x in uvxyz) */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-amber-900/30">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400 mb-1">
            <span>{midSymbol} (middle)</span>
            <span className="font-mono bg-amber-950 px-1.5 rounded border border-amber-800/50">
              |{midSymbol}|={decomp.wLen}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex justify-between">
            <span>Pos: [{midStart}, {midEnd})</span>
            <span className="truncate max-w-[65px]">"{decomp.w || 'ε'}"</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleLengthChange('w', decomp.wLen - 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max={p}
              value={decomp.wLen}
              onChange={(e) => handleLengthChange('w', parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1 bg-slate-800"
            />
            <button
              onClick={() => handleLengthChange('w', decomp.wLen + 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Part 4: pumped 2 control (x in uvwxy, y in uvxyz) */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-rose-900/30">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-400 mb-1">
            <span>{pmp2Symbol} (pumped 2)</span>
            <span className="font-mono bg-rose-950 px-1.5 rounded border border-rose-800/50">
              |{pmp2Symbol}|={decomp.xLen}
            </span>
          </div>
          <div className="text-[10px] font-mono text-rose-400 mb-1.5 flex justify-between">
            <span>Pos: [{pmp2Start}, {pmp2End})</span>
            <span className="truncate max-w-[65px]">"{decomp.x || 'ε'}"</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleLengthChange('x', decomp.xLen - 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max={p}
              value={decomp.xLen}
              onChange={(e) => handleLengthChange('x', parseInt(e.target.value))}
              className="w-full accent-rose-400 h-1 bg-slate-800"
            />
            <button
              onClick={() => handleLengthChange('x', decomp.xLen + 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Part 5: suffix control (y in uvwxy, z in uvxyz) */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-purple-900/30 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-400 mb-1">
            <span>{suffSymbol} (suffix)</span>
            <span className="font-mono bg-purple-950 px-1.5 rounded border border-purple-800/50">
              |{suffSymbol}|={decomp.yLen}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex justify-between">
            <span>Pos: [{suffStart}, {suffEnd})</span>
            <span className="truncate max-w-[65px]">"{decomp.y || 'ε'}"</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleLengthChange('y', decomp.yLen - 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max={total}
              value={decomp.yLen}
              onChange={(e) => handleLengthChange('y', parseInt(e.target.value))}
              className="w-full accent-purple-400 h-1 bg-slate-800"
            />
            <button
              onClick={() => handleLengthChange('y', decomp.yLen + 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Substring Positions & Lengths Coordinates Table */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-300 font-semibold">
          <span>Decomposition Substring Details & Slice Positions:</span>
          <span className="font-mono text-[11px] text-indigo-300">
            s = u · v · {midSymbol} · {pmp2Symbol} · {suffSymbol} (Length: {total})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="text-slate-500 uppercase text-[9px] border-b border-slate-800">
              <tr>
                <th className="py-1 px-2">Substring</th>
                <th className="py-1 px-2">Role</th>
                <th className="py-1 px-2">Content Value</th>
                <th className="py-1 px-2">Length</th>
                <th className="py-1 px-2">String Position [Start, End)</th>
                <th className="py-1 px-2">Pumping Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              <tr>
                <td className="py-1.5 px-2 font-bold text-sky-400">u</td>
                <td className="py-1.5 px-2 text-slate-400 font-sans">Prefix</td>
                <td className="py-1.5 px-2 text-sky-300">"{decomp.u || 'ε'}"</td>
                <td className="py-1.5 px-2">{decomp.uLen}</td>
                <td className="py-1.5 px-2 text-slate-400">[{uStart}, {uEnd})</td>
                <td className="py-1.5 px-2 text-slate-500 font-sans">Fixed (1x)</td>
              </tr>
              <tr className="bg-emerald-950/20">
                <td className="py-1.5 px-2 font-bold text-emerald-400">v</td>
                <td className="py-1.5 px-2 text-emerald-400 font-sans font-semibold">Pumped Part 1</td>
                <td className="py-1.5 px-2 text-emerald-300 font-bold">"{decomp.v || 'ε'}"</td>
                <td className="py-1.5 px-2 text-emerald-300 font-bold">{decomp.vLen}</td>
                <td className="py-1.5 px-2 text-emerald-400">[{vStart}, {vEnd})</td>
                <td className="py-1.5 px-2 text-emerald-300 font-sans font-bold">Multiplied by i (vⁱ)</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-amber-400">{midSymbol}</td>
                <td className="py-1.5 px-2 text-slate-400 font-sans">Middle Buffer</td>
                <td className="py-1.5 px-2 text-amber-300">"{decomp.w || 'ε'}"</td>
                <td className="py-1.5 px-2">{decomp.wLen}</td>
                <td className="py-1.5 px-2 text-slate-400">[{midStart}, {midEnd})</td>
                <td className="py-1.5 px-2 text-slate-500 font-sans">Fixed (1x)</td>
              </tr>
              <tr className="bg-rose-950/20">
                <td className="py-1.5 px-2 font-bold text-rose-400">{pmp2Symbol}</td>
                <td className="py-1.5 px-2 text-rose-400 font-sans font-semibold">Pumped Part 2</td>
                <td className="py-1.5 px-2 text-rose-300 font-bold">"{decomp.x || 'ε'}"</td>
                <td className="py-1.5 px-2 text-rose-300 font-bold">{decomp.xLen}</td>
                <td className="py-1.5 px-2 text-rose-400">[{pmp2Start}, {pmp2End})</td>
                <td className="py-1.5 px-2 text-rose-300 font-sans font-bold">Multiplied by i ({pmp2Symbol}ⁱ)</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-purple-400">{suffSymbol}</td>
                <td className="py-1.5 px-2 text-slate-400 font-sans">Suffix</td>
                <td className="py-1.5 px-2 text-purple-300">"{decomp.y || 'ε'}"</td>
                <td className="py-1.5 px-2">{decomp.yLen}</td>
                <td className="py-1.5 px-2 text-slate-400">[{suffStart}, {suffEnd})</td>
                <td className="py-1.5 px-2 text-slate-500 font-sans">Fixed (1x)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Constraints Live Verification Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Condition 1: |window| <= p */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between ${
            windowValid
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
              : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {windowValid ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <div>
              <span className="font-semibold text-xs block">
                Condition 1: <MathView math={`${windowLabel} \\le p`} />
              </span>
              <span className="text-[11px] opacity-80">
                {windowLen} ≤ {p} ({windowValid ? 'Satisfied (in notes: 5 ≤ 5)' : 'VIOLATION'})
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
            {windowValid ? 'VALID' : 'INVALID'}
          </span>
        </div>

        {/* Condition 2: |pumped| > 0 */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between ${
            pumpedValid
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
              : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {pumpedValid ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <div>
              <span className="font-semibold text-xs block">
                Condition 2: <MathView math={`${pumpedLabel} > 0`} />
              </span>
              <span className="text-[11px] opacity-80">
                {pumpedLabel} = {pumpedLen} {pumpedValid ? '> 0 (in notes: 4 > 0)' : '= 0 (Empty! Cannot pump nothing)'}
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
            {pumpedValid ? 'VALID' : 'INVALID'}
          </span>
        </div>
      </div>
    </div>
  );
};

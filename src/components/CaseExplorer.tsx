import React, { useState } from 'react';
import {
  ListChecks,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  ArrowRightCircle,
  Sparkles,
} from 'lucide-react';
import { MathView } from './MathView';
import type { FormulaMode, LanguageType, NotationMode, ProofCaseCFL } from '../types/automata';
import { getStandardCasesP1 } from '../math/cflProblem1';

interface CaseExplorerProps {
  p: number;
  selectedCaseId: string | null;
  onSelectCase: (c: ProofCaseCFL) => void;
  formulaMode?: FormulaMode;
  notationMode?: NotationMode;
  languageType?: LanguageType;
}

export const CaseExplorer: React.FC<CaseExplorerProps> = ({
  p,
  selectedCaseId,
  onSelectCase,
  formulaMode = 'notebook',
  notationMode = 'uvxyz',
  languageType = 'anbnan',
}) => {
  const cases = getStandardCasesP1(p, formulaMode, notationMode, languageType);
  const [testedCases, setTestedCases] = useState<Record<string, boolean>>({});

  const handleApply = (c: ProofCaseCFL) => {
    setTestedCases((prev) => ({ ...prev, [c.id]: true }));
    onSelectCase(c);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center">
            <ListChecks className="w-4 h-4 text-purple-400 mr-2" />
            Exhaustive Case Analysis (All Valid Decompositions)
          </h3>
          <p className="text-xs text-slate-400">
            A single decomposition does NOT prove non-context-freeness. We must prove{' '}
            <strong className="text-slate-200">every possible decomposition</strong> fails.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Coverage:</span>
          <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
            5 / 5 Cases Proven
          </span>
        </div>
      </div>

      {/* The Universal Separation Theorem */}
      <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 leading-relaxed space-y-1">
        <span className="font-bold text-white flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
          General Mathematical Argument:
        </span>
        <p className="text-slate-300">
          In <MathView math="s = a^p b^p a^p" />, Block 2 has length <MathView math="p" />. Because the lemma
          mandates <MathView math="|vwx| \le p" />, the substring <MathView math="vwx" /> can never touch both
          the first block of <MathView math="a" />'s and the third block of <MathView math="a" />'s. Thus,{' '}
          <MathView math="vwx" /> is partitioned into exactly five exhaustive and mutually exclusive cases.
        </p>
      </div>

      {/* 5 Cases List / Cards */}
      <div className="space-y-3">
        {cases.map((c, index) => {
          const isSelected = selectedCaseId === c.id;
          const isTested = testedCases[c.id];

          return (
            <div
              key={c.id}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-950 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-indigo-300">
                    {index + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {c.name}
                  </h4>
                </div>

                <div className="flex items-center space-x-2">
                  {isTested && (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Tested
                    </span>
                  )}
                  <button
                    onClick={() => handleApply(c)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1 transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-200 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <span>Load Case Into Simulator</span>
                    <ArrowRightCircle className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                {c.description}
              </p>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs space-y-1">
                <span className="font-semibold text-rose-300 flex items-center text-[11px]">
                  <AlertOctagon className="w-3 h-3 mr-1 text-rose-400" />
                  Why Every Decomposition in This Case Fails:
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {c.whyItFails}
                </p>
                <div className="pt-1 text-[11px] text-amber-300 font-mono">
                  Recommended test: <span className="font-bold">i = {c.recommendedI}</span> → {c.pumpedExplanation}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conclusion Banner */}
      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>Formal Contradiction:</strong> All 5 structural cases fail. Therefore, no decomposition can satisfy the lemma.
          </span>
        </div>
        <span className="font-mono font-bold text-xs bg-emerald-900/40 px-2.5 py-1 rounded border border-emerald-700/40">
          Q.E.D.
        </span>
      </div>
    </div>
  );
};

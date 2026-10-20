import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { MathView } from './MathView';
import { PDA_TEST_CASES, validateStringL2 } from '../math/pdaProblem2';

interface PDALanguageGuideProps {
  onLoadExampleToSim: (input: string) => void;
}

export const PDALanguageGuide: React.FC<PDALanguageGuideProps> = ({ onLoadExampleToSim }) => {
  const [testInput, setTestInput] = useState('00111111');
  const validation = validateStringL2(testInput);

  return (
    <div className="space-y-6">
      {/* SECTION A: Language Explanation */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center">
              <BookOpen className="w-4 h-4 text-indigo-400 mr-2" />
              Section A: Formal Language Definition & Mathematical Structure
            </h3>
            <p className="text-xs text-slate-400">
              Analysis of <MathView math="L = \{ 0^n 1^{3n} \mid n \ge 1 \}" className="text-indigo-300 font-mono" />
            </p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
            Deterministic CFL
          </span>
        </div>

        {/* Core Rules List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-sky-400 block">1. Sequential Block Ordering:</span>
            <p className="text-slate-300 leading-relaxed">
              The input must start with one or more zeros. All zeros must appear strictly before any ones. No zero may ever appear after the first one is read.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-purple-400 block">2. Exact 3:1 Ratio (<MathView math="m = 3n" />):</span>
            <p className="text-slate-300 leading-relaxed">
              Each individual zero mandates exactly three ones. Therefore, the total count of ones must equal three times the total count of zeros.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-400 block">3. Strict Positivity (<MathView math="n \ge 1" />):</span>
            <p className="text-slate-300 leading-relaxed">
              The empty string <MathView math="\varepsilon" /> is not accepted. There must be at least one zero (<MathView math="n \ge 1" />) and at least three ones.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-emerald-400 block">4. Pushdown Counting Mechanism:</span>
            <p className="text-slate-300 leading-relaxed">
              Because a Pushdown Automaton has a stack, it pushes three <code className="text-amber-300 font-mono font-bold">A</code> symbols for each zero, and pops one <code className="text-amber-300 font-mono font-bold">A</code> for each one.
            </p>
          </div>
        </div>

        {/* Examples Table */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Comprehensive Classroom Examples:
          </span>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Test String</th>
                  <th className="p-2.5">Zeros (n)</th>
                  <th className="p-2.5">Ones (m)</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Formal Mathematical Reason</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {PDA_TEST_CASES.filter((tc) => tc.input !== '').map((tc) => {
                  const isAcc = tc.expected === 'ACCEPTED';
                  const n = tc.input.split('0').length - 1;
                  const m = tc.input.split('1').length - 1;

                  return (
                    <tr key={tc.input} className="hover:bg-slate-800/30 transition">
                      <td className="p-2.5 font-bold text-white">"{tc.input}"</td>
                      <td className="p-2.5 text-sky-400 font-sans">{n}</td>
                      <td className="p-2.5 text-purple-400 font-sans">{m}</td>
                      <td className="p-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            isAcc
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          }`}
                        >
                          {isAcc ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                          {tc.expected}
                        </span>
                      </td>
                      <td className="p-2.5 font-sans text-slate-400 text-[11px] leading-relaxed">
                        {tc.reason}
                      </td>
                      <td className="p-2.5 text-right font-sans">
                        <button
                          onClick={() => onLoadExampleToSim(tc.input)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-[11px] font-semibold transition"
                        >
                          Load in Sim
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION D: Live String Membership Validator */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
              Section D: Live String Membership Checker
            </h3>
            <p className="text-xs text-slate-400">
              Instant four-condition verification for arbitrary user strings.
            </p>
          </div>
        </div>

        {/* Custom Input Field */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Type any binary string e.g. 000111111111..."
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 flex-1"
          />
          <button
            onClick={() => onLoadExampleToSim(testInput)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition shrink-0"
          >
            Simulate on PDA
          </button>
        </div>

        {/* Validation Result Card */}
        <div
          className={`p-4 rounded-xl border-2 transition-all ${
            validation.isValid
              ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-start space-x-3">
            {validation.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm">
                  Verdict: {validation.isValid ? 'ACCEPTED' : 'REJECTED'}
                </span>
                <span className="font-mono text-xs opacity-75">
                  ({validation.zerosCount} zeros, {validation.onesCount} ones)
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{validation.reason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

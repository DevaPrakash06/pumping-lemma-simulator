import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { simulatePDA, PDA_TEST_CASES, validateStringL2 } from '../math/pdaProblem2';
import { PDADiagram } from './PDADiagram';
import { PDAStackVisualizer } from './PDAStackVisualizer';

interface PDASimulatorProps {
  inputString?: string;
  onInputChange?: (val: string) => void;
}

export const PDASimulator: React.FC<PDASimulatorProps> = ({
  inputString: propInput,
  onInputChange: propOnInputChange,
}) => {
  const [internalInput, setInternalInput] = useState('00111111');
  const inputString = propInput !== undefined ? propInput : internalInput;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Compute full simulation trace
  const simResult = simulatePDA(inputString);
  const totalSteps = simResult.steps.length;
  const currentConfig = simResult.steps[Math.min(currentStepIndex, totalSteps - 1)] || simResult.steps[0];
  const isFinished = currentStepIndex >= totalSteps - 1;

  // Static validation
  const validation = validateStringL2(inputString);

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying && !isFinished) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev: number) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    } else if (isFinished) {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isFinished, totalSteps]);

  // Confetti celebration when accepted at the end
  useEffect(() => {
    if (isFinished && simResult.accepted) {
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#818cf8', '#34d399'],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isFinished, simResult.accepted]);

  const handleInputChange = (newVal: string) => {
    if (propOnInputChange) {
      propOnInputChange(newVal);
    } else {
      setInternalInput(newVal);
    }
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleRunToCompletion = () => {
    setCurrentStepIndex(totalSteps - 1);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Input Control & Examples Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center">
              <Terminal className="w-4 h-4 text-indigo-400 mr-1.5" />
              Input String Tape (Alphabet Σ = &#123;0, 1&#125;)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputString}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter string of 0s and 1s..."
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm sm:text-base font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 flex-1"
              />
              <button
                onClick={handleRunToCompletion}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition shrink-0"
              >
                Run Simulation
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-semibold text-slate-400">Load Test Examples:</span>
            <div className="flex flex-wrap gap-1.5">
              {PDA_TEST_CASES.map((tc) => {
                const isSelected = inputString === tc.input;
                return (
                  <button
                    key={tc.input || 'empty'}
                    onClick={() => handleInputChange(tc.input)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-mono font-medium transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white ring-1 ring-white/20'
                        : tc.expected === 'ACCEPTED'
                        ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-900/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                    }`}
                    title={tc.reason}
                  >
                    {tc.input ? `"${tc.input}"` : 'ε (Empty)'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Input Tape with Cursor */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-white flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 mr-1" />
            Input Head & Symbol Processing Tape
          </span>
          <span className="font-mono">
            Position: {currentConfig.consumedInput.length} / {inputString.length}
          </span>
        </div>

        {/* Tape of Symbol Boxes */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto min-h-[60px]">
          {inputString.length === 0 ? (
            <span className="text-xs text-slate-500 font-mono italic">
              ε (Empty string - no tape symbols)
            </span>
          ) : (
            inputString.split('').map((char: string, idx: number) => {
              const isConsumed = idx < currentConfig.consumedInput.length;
              const isCurrent = idx === currentConfig.consumedInput.length;

              return (
                <div
                  key={idx}
                  className={`w-9 h-11 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-sm transition-all duration-200 relative ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-2 border-indigo-400 shadow-lg shadow-indigo-500/30 scale-110 glow-active'
                      : isConsumed
                      ? 'bg-slate-800/40 text-slate-500 border border-slate-800 line-through'
                      : 'bg-slate-900 text-slate-200 border border-slate-700/60'
                  }`}
                >
                  <span>{char}</span>
                  {isCurrent && (
                    <span className="absolute -bottom-4 text-[9px] font-sans font-bold text-indigo-400 uppercase leading-none">
                      ▲ HEAD
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Automaton State Diagram & Stack Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PDADiagram
            currentState={currentConfig.state}
            activeTransition={currentConfig.transitionUsed}
          />
        </div>
        <div className="lg:col-span-1">
          <PDAStackVisualizer
            stack={currentConfig.stack}
            symbolsPushed={currentConfig.symbolsPushed}
            symbolsPopped={currentConfig.symbolsPopped}
          />
        </div>
      </div>

      {/* Execution Stepper & Controls Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center">
              Step {currentStepIndex} of {totalSteps - 1}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentConfig.actionNote}
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStepBackward}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1 disabled:opacity-40 transition"
              title="Step backward to previous configuration"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isFinished}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm disabled:opacity-40'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={isFinished}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1 disabled:opacity-40 transition"
              title="Step forward to next configuration"
            >
              <span>Step Forward</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Reset simulation to initial state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-400 text-[10px] block">Zeros Read (n)</span>
            <span className="font-mono text-base font-bold text-sky-400">{currentConfig.zerosRead}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-400 text-[10px] block">Ones Read (m)</span>
            <span className="font-mono text-base font-bold text-purple-400">{currentConfig.onesRead}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-400 text-[10px] block">Expected Ones (3n)</span>
            <span className="font-mono text-base font-bold text-indigo-300">
              {currentConfig.zerosRead * 3}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-400 text-[10px] block">Execution Status</span>
            <span
              className={`font-mono text-xs font-bold uppercase ${
                isFinished
                  ? simResult.accepted
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {isFinished ? (simResult.accepted ? 'ACCEPTED' : 'REJECTED') : 'RUNNING'}
            </span>
          </div>
        </div>

        {/* Final Prominent Verdict Banner (When finished) */}
        {isFinished && (
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              simResult.accepted
                ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/60 text-rose-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {simResult.accepted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold text-sm sm:text-base block">
                  {simResult.accepted
                    ? `ACCEPTED — The string belongs to L because it contains ${currentConfig.zerosRead} zeros followed by ${currentConfig.onesRead} ones, and ${currentConfig.onesRead} = 3 × ${currentConfig.zerosRead}.`
                    : simResult.message}
                </span>
                <p className="text-xs opacity-80">{validation.reason}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Configuration History Trace Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center">
          <Terminal className="w-4 h-4 text-purple-400 mr-2" />
          PDA Configuration Trace History: (state, remainingInput, stack)
        </h4>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-2.5">Step</th>
                <th className="p-2.5">Instantaneous Description (ID)</th>
                <th className="p-2.5">Transition Rule Applied</th>
                <th className="p-2.5">Action Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {simResult.steps.map((st, idx) => {
                const isRowActive = idx === currentStepIndex;
                return (
                  <tr
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`cursor-pointer transition ${
                      isRowActive
                        ? 'bg-indigo-950/60 text-white font-bold border-l-4 border-indigo-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-2.5 text-slate-400 font-sans">{st.stepIndex}</td>
                    <td className="p-2.5 text-indigo-300">
                      ({st.state}, "{st.remainingInput || 'ε'}", [{st.stack.join(', ')}])
                    </td>
                    <td className="p-2.5 text-amber-300 font-sans">
                      {st.transitionUsed ? (
                        <span>
                          δ({st.transitionUsed.fromState}, {st.transitionUsed.inputSymbol},{' '}
                          {st.transitionUsed.stackTop}) = ({st.transitionUsed.toState},{' '}
                          {st.transitionUsed.stackReplacement})
                        </span>
                      ) : (
                        <span className="text-slate-500">Initial State</span>
                      )}
                    </td>
                    <td className="p-2.5 text-slate-400 font-sans">{st.actionNote}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Canonical Stage-by-Stage Verification for 00111111 */}
      {inputString === '00111111' && (
        <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-5 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center">
              <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
              Required Classroom Demonstration Stages for Input: <code className="ml-1.5 px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 font-mono text-xs">00111111</code>
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              6 = 3 × 2 (ACCEPTED)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {[
              {
                step: 0,
                title: 'Stage 0: Initial Configuration',
                id: '(q0, 00111111, Z0)',
                note: 'Start in q0 with bottom marker Z0 on stack.',
              },
              {
                step: 1,
                title: 'Stage 1: After 1st zero',
                id: '(q0, 0111111, AAAZ0)',
                note: 'δ(q0, 0, Z0) = (q0, AAAZ0). Pushed 3 A symbols.',
              },
              {
                step: 2,
                title: 'Stage 2: After 2nd zero',
                id: '(q0, 111111, AAAAAAZ0)',
                note: 'δ(q0, 0, A) = (q0, AAAA). Top A replaced by 4 A\'s (+3). Stack has exactly six A\'s.',
              },
              {
                step: 3,
                title: 'Stage 3: After 1st one',
                id: '(q1, 11111, AAAAAZ0)',
                note: 'δ(q0, 1, A) = (q1, ε). Popped 1 A. Switched state to q1.',
              },
              {
                step: 8,
                title: 'Stage 4: After 6th one',
                id: '(q1, ε, Z0)',
                note: 'All 6 ones read. All 6 A symbols popped. Only Z0 remains.',
              },
              {
                step: 9,
                title: 'Stage 5: Final ε-transition',
                id: '(qf, ε, Z0)',
                note: 'δ(q1, ε, Z0) = (qf, Z0). Complete input consumed. Accepted by final state qf!',
              },
            ].map((stg) => {
              const isMatch = currentStepIndex === stg.step;
              return (
                <button
                  key={stg.step}
                  onClick={() => setCurrentStepIndex(stg.step)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isMatch
                      ? 'bg-indigo-950/80 border-indigo-400 ring-1 ring-indigo-400/50 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-[11px]">{stg.title}</span>
                    {isMatch && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-900/50 px-1.5 py-0.2 rounded">
                        Active Step
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-indigo-300 text-[11px] mb-1 font-semibold">
                    {stg.id}
                  </div>
                  <p className="text-slate-400 text-[10px] leading-relaxed">{stg.note}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  GraduationCap,
} from 'lucide-react';
import { P1_STEPS } from '../math/cflProblem1';
import { MathView } from './MathView';

interface StepNavigatorProps {
  currentStep: number; // 1 to 10
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  onReset,
}) => {
  const stepData = P1_STEPS[currentStep - 1] || P1_STEPS[0];

  const handlePrev = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < P1_STEPS.length) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Subtle background glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Stepper Dots & Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider text-indigo-400 flex items-center">
            <GraduationCap className="w-3.5 h-3.5 mr-1" />
            Proof Step {currentStep} of {P1_STEPS.length}
          </span>
          <span className="text-slate-400 font-mono text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
            {stepData.tag}
          </span>
        </div>

        {/* Clickable Step Pills */}
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
          {P1_STEPS.map((s) => {
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;
            return (
              <button
                key={s.step}
                onClick={() => onStepChange(s.step)}
                title={`Step ${s.step}: ${s.title}`}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 relative group ${
                  isCurrent
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/50 ring-2 ring-indigo-400/30'
                    : isCompleted
                    ? 'bg-indigo-700/60 hover:bg-indigo-600/80'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="sr-only">Step {s.step}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {stepData.title}
          </h2>
          <span className="text-xs text-slate-400">
            Pumping Lemma for CFLs
          </span>
        </div>

        {/* Step LaTeX formula card */}
        {stepData.latex && (
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-900/40 text-center shadow-inner overflow-x-auto">
            <MathView math={stepData.latex} displayMode className="text-indigo-200 text-sm sm:text-base" />
          </div>
        )}

        {/* Step Detailed Explanation */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {stepData.summary}
        </p>

        {/* Presentation Speaker Notes */}
        <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/30 text-xs text-indigo-300/90 flex items-start space-x-2">
          <Volume2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-300 uppercase tracking-wider text-[10px] block mb-0.5">
              Speaker Note / Presentation Tip:
            </span>
            {stepData.speakerNotes}
          </div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Play / Pause / Reset */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Auto</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Step</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            title="Reset step to beginning"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start</span>
          </button>
        </div>

        {/* Previous / Next Step Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentStep === 1
                ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === P1_STEPS.length}
            className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentStep === P1_STEPS.length
                ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20'
            }`}
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

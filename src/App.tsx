import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StepNavigator } from './components/StepNavigator';
import { BlockVisualizer } from './components/BlockVisualizer';
import { DecompositionBar } from './components/DecompositionBar';
import { PumpingAnimator } from './components/PumpingAnimator';
import { CaseExplorer } from './components/CaseExplorer';
import { QuantifierMatrix } from './components/QuantifierMatrix';
import { ProofSummaryModal } from './components/ProofSummaryModal';
import { TheoryGuideModal } from './components/TheoryGuideModal';
import { Problem1Presentation } from './components/Problem1Presentation';
import { Problem2Tab } from './components/Problem2Tab';
import { Presentation } from 'lucide-react';
import {
  buildStringP1,
  sliceDecomposition,
  getStandardCasesP1,
  P1_STEPS,
} from './math/cflProblem1';
import type { FormulaMode, LanguageType, NotationMode, ProofCaseCFL } from './types/automata';

export const App: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'problem1' | 'problem2'>('problem1');

  // Modals
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState(false);

  // Problem 1 Presentation View Mode Toggle
  const [isPresentationViewP1, setIsPresentationViewP1] = useState(false);

  // Problem 1 State (Notebook defaults from handwritten class notes: P = 5, i = 3, Case 2)
  const [languageType, setLanguageType] = useState<LanguageType>('anbnan');
  const [formulaMode, setFormulaMode] = useState<FormulaMode>('notebook');
  const [notationMode, setNotationMode] = useState<NotationMode>('uvxyz');
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [p, setP] = useState(5); // Default P = 5 from handwritten class notes Step 5
  const [i, setI] = useState(3); // Default i = 3 from handwritten class notes Step 7
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('case2'); // Default Case 2 (matches notes Step 6)

  // Decomposition lengths (default for P = 5, k = 7, Case 2: u=5, v=2, w=1, x=2, y=11)
  const [uLen, setULen] = useState(5);
  const [vLen, setVLen] = useState(2);
  const [wLen, setWLen] = useState(1);
  const [xLen, setXLen] = useState(2);
  const [yLen, setYLen] = useState(11);

  // Sync decomposition when p, formulaMode, notationMode, or languageType changes
  useEffect(() => {
    const cases = getStandardCasesP1(p, formulaMode, notationMode, languageType);
    const matched = cases.find((c) => c.id === selectedCaseId) || cases[1] || cases[0];
    setULen(matched.sampleDecomp.uLen);
    setVLen(matched.sampleDecomp.vLen);
    setWLen(matched.sampleDecomp.wLen);
    setXLen(matched.sampleDecomp.xLen);
    setYLen(matched.sampleDecomp.yLen);
  }, [p, formulaMode, notationMode, languageType]);

  // Build string and slice
  const { s, formulaText, totalLength, blockSize } = buildStringP1(p, formulaMode, languageType);
  const decomp = sliceDecomposition(s, uLen, vLen, wLen, xLen, yLen);

  // Auto-play timer for presentation mode
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= P1_STEPS.length) {
            setIsPlaying(false);
            return 1;
          }
          return prev + 1;
        });
      }, 5000); // 5 seconds per step
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Handle case selection
  const handleSelectCase = (c: ProofCaseCFL) => {
    setSelectedCaseId(c.id);
    setULen(c.sampleDecomp.uLen);
    setVLen(c.sampleDecomp.vLen);
    setWLen(c.sampleDecomp.wLen);
    setXLen(c.sampleDecomp.xLen);
    setYLen(c.sampleDecomp.yLen);
    setI(c.recommendedI); // set recommended i for contradiction demonstration
  };

  // Reset Problem 1 to Class Notes defaults
  const handleReset = () => {
    setCurrentStep(1);
    setIsPlaying(false);
    setP(5);
    setI(3);
    setFormulaMode('notebook');
    setNotationMode('uvxyz');
    setSelectedCaseId('case2');
    const cases = getStandardCasesP1(5, 'notebook', 'uvxyz');
    const targetCase = cases[1] || cases[0];
    setULen(targetCase.sampleDecomp.uLen);
    setVLen(targetCase.sampleDecomp.vLen);
    setWLen(targetCase.sampleDecomp.wLen);
    setXLen(targetCase.sampleDecomp.xLen);
    setYLen(targetCase.sampleDecomp.yLen);
  };

  // Handle manual decomposition slider changes
  const handleDecompChange = (
    newU: number,
    newV: number,
    newW: number,
    newX: number,
    newY: number
  ) => {
    setSelectedCaseId(null); // marked as custom user decomposition
    setULen(newU);
    setVLen(newV);
    setWLen(newW);
    setXLen(newX);
    setYLen(newY);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenProofModal={() => setIsProofModalOpen(true)}
        onOpenTheoryModal={() => setIsTheoryModalOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Problem 1: CFL Pumping Lemma for a^n b^n a^n */}
        <div className={`space-y-6 ${activeTab === 'problem1' ? 'block' : 'hidden'}`}>
          {/* Problem 1 Header & Mode Switcher Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                    PROBLEM 1 • PUMPING LEMMA
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Formula: {formulaText}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                    Notation: {notationMode === 'uvxyz' ? 's = uvxyz' : 's = uvwxy'}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Prove that{' '}
                  <span className="text-indigo-300 font-mono">
                    L = &#123; aⁿ bⁿ aⁿ | n ≥ 1 &#125;
                  </span>{' '}
                  is not Context-Free
                </h2>

                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Interactive step-by-step proof utilizing the class notes formula{' '}
                  <code className="text-cyan-300 font-mono font-bold">s = aᵖ a a bᵖ b b aᵖ a a</code> (where block size{' '}
                  <code className="text-emerald-300 font-mono font-bold">n = p + 2 = {blockSize}</code>, total length{' '}
                  <code className="text-indigo-300 font-mono font-bold">|s| = {totalLength}</code>). Demonstrate why any decomposition{' '}
                  <code className="text-amber-300 font-mono font-bold">{notationMode === 'uvxyz' ? 's = uvxyz' : 's = uvwxy'}</code> with{' '}
                  <code className="text-rose-300 font-mono font-bold">{notationMode === 'uvxyz' ? '|vxy| ≤ p' : '|vwx| ≤ p'}</code> and{' '}
                  <code className="text-purple-300 font-mono font-bold">{notationMode === 'uvxyz' ? '|vy| > 0' : '|vx| > 0'}</code> fails to preserve equal counts when pumped.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center space-x-2 shrink-0 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setIsPresentationViewP1(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    !isPresentationViewP1
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Interactive Studio
                </button>
                <button
                  onClick={() => setIsPresentationViewP1(true)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isPresentationViewP1
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span>Presentation Mode</span>
                </button>
              </div>
            </div>
          </div>

          {!isPresentationViewP1 ? (
            <div className="space-y-6">
              {/* Step Progression Card */}
              <StepNavigator
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onReset={handleReset}
              />

              {/* Core Visualization & Decomposition Section */}
              <div className="grid grid-cols-1 gap-6">
                {/* String 3-Block Visualizer */}
                <BlockVisualizer
                  p={p}
                  onPChange={setP}
                  decomp={decomp}
                  formulaMode={formulaMode}
                  onFormulaModeChange={setFormulaMode}
                  notationMode={notationMode}
                  onNotationModeChange={setNotationMode}
                  languageType={languageType}
                  onLanguageTypeChange={setLanguageType}
                />

                {/* Decomposition Bar & Token Length Sliders */}
                <DecompositionBar
                  p={p}
                  decomp={decomp}
                  onDecompChange={handleDecompChange}
                  selectedCaseId={selectedCaseId}
                  onSelectCase={handleSelectCase}
                  formulaMode={formulaMode}
                  notationMode={notationMode}
                />

                {/* Animated Pumping & Language Membership Verifier */}
                <PumpingAnimator
                  p={p}
                  decomp={decomp}
                  i={i}
                  onIChange={setI}
                  notationMode={notationMode}
                  formulaMode={formulaMode}
                  languageType={languageType}
                />
              </div>

              {/* General Proof Sections: All 5 Cases & Quantifier Game */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 5 Exhaustive Structural Cases */}
                <CaseExplorer
                  p={p}
                  selectedCaseId={selectedCaseId}
                  onSelectCase={handleSelectCase}
                  formulaMode={formulaMode}
                  notationMode={notationMode}
                  languageType={languageType}
                />

                {/* Quantifier Matrix / Adversary Game Theory */}
                <QuantifierMatrix />
              </div>
            </div>
          ) : (
            /* Problem 1 Focused Step-by-Step Presentation Mode */
            <Problem1Presentation
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onReset={handleReset}
              onExitPresentation={() => setIsPresentationViewP1(false)}
              p={p}
              onPChange={setP}
              i={i}
              onIChange={setI}
              decomp={decomp}
              onDecompChange={handleDecompChange}
              selectedCaseId={selectedCaseId}
              onSelectCase={handleSelectCase}
              formulaMode={formulaMode}
              onFormulaModeChange={setFormulaMode}
              notationMode={notationMode}
              onNotationModeChange={setNotationMode}
            />
          )}
        </div>

        {/* Problem 2: Pushdown Automaton for 0^n 1^(3n) */}
        <div className={`space-y-6 ${activeTab === 'problem2' ? 'block' : 'hidden'}`}>
          <Problem2Tab />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <p>
          Formal Language & Automata Theory Simulator • Pumping Lemma & Pushdown Automata Interactive Suite
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Designed for academic clarity, college presentation slides, and formal automata theory proofs.
        </p>
      </footer>

      {/* Modals */}
      <ProofSummaryModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
      />

      <TheoryGuideModal
        isOpen={isTheoryModalOpen}
        onClose={() => setIsTheoryModalOpen(false)}
      />
    </div>
  );
};

export default App;

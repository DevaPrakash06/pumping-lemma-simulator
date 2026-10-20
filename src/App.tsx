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
import { Problem2Tab } from './components/Problem2Tab';
import {
  buildStringP1,
  sliceDecomposition,
  getStandardCasesP1,
  P1_STEPS,
} from './math/cflProblem1';
import type { ProofCaseCFL } from './types/automata';

export const App: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'problem1' | 'problem2'>('problem1');

  // Modals
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState(false);

  // Problem 1 State
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [p, setP] = useState(3);
  const [i, setI] = useState(0); // Default to i=0 to show pumping down contradiction
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('case1');

  // Decomposition lengths
  const [uLen, setULen] = useState(1);
  const [vLen, setVLen] = useState(1);
  const [wLen, setWLen] = useState(0);
  const [xLen, setXLen] = useState(1);
  const [yLen, setYLen] = useState(6);

  // Sync default decomposition when p changes or when selecting a case
  useEffect(() => {
    const cases = getStandardCasesP1(p);
    const matched = cases.find((c) => c.id === selectedCaseId) || cases[0];
    setULen(matched.sampleDecomp.uLen);
    setVLen(matched.sampleDecomp.vLen);
    setWLen(matched.sampleDecomp.wLen);
    setXLen(matched.sampleDecomp.xLen);
    setYLen(matched.sampleDecomp.yLen);
  }, [p]);

  // Build string and slice
  const { s } = buildStringP1(p);
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

  // Reset Problem 1
  const handleReset = () => {
    setCurrentStep(1);
    setIsPlaying(false);
    setP(3);
    setI(0);
    setSelectedCaseId('case1');
    const cases = getStandardCasesP1(3);
    setULen(cases[0].sampleDecomp.uLen);
    setVLen(cases[0].sampleDecomp.vLen);
    setWLen(cases[0].sampleDecomp.wLen);
    setXLen(cases[0].sampleDecomp.xLen);
    setYLen(cases[0].sampleDecomp.yLen);
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
            <BlockVisualizer p={p} onPChange={setP} decomp={decomp} />

            {/* Decomposition Bar & Token Length Sliders */}
            <DecompositionBar
              p={p}
              decomp={decomp}
              onDecompChange={handleDecompChange}
              selectedCaseId={selectedCaseId}
              onSelectCase={handleSelectCase}
            />

            {/* Animated Pumping & Language Membership Verifier */}
            <PumpingAnimator
              p={p}
              decomp={decomp}
              i={i}
              onIChange={setI}
            />
          </div>

          {/* General Proof Sections: All 5 Cases & Quantifier Game */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 5 Exhaustive Structural Cases */}
            <CaseExplorer
              p={p}
              selectedCaseId={selectedCaseId}
              onSelectCase={handleSelectCase}
            />

            {/* Quantifier Matrix / Adversary Game Theory */}
            <QuantifierMatrix />
          </div>
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

import React from 'react';
import {
  Layers,
  Sparkles,
  BookOpen,
  Presentation,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'problem1' | 'problem2';
  onTabChange: (tab: 'problem1' | 'problem2') => void;
  onOpenProofModal: () => void;
  onOpenTheoryModal: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenProofModal,
  onOpenTheoryModal,
  onReset,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  Formal Language & Automata Theory Simulator
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 mr-1" /> FL & AT Interactive
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Formal Languages & Automata Theory • Classroom & Presentation Suite
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onTabChange('problem1')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'problem1'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Problem 1 — Pumping Lemma</span>
            </button>

            <button
              onClick={() => onTabChange('problem2')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'problem2'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Problem 2 — Pushdown Automaton (PDA)</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenProofModal}
              title="Classroom Presentation Slides & Full Formal Proof"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition shadow-sm"
            >
              <Presentation className="w-4 h-4 text-purple-400" />
              <span className="hidden lg:inline">Presentation Mode</span>
            </button>

            <button
              onClick={onOpenTheoryModal}
              title="Quantifier Game & Theory Guide"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400 inline sm:mr-1" />
              <span className="hidden md:inline">Theory Guide</span>
            </button>

            <button
              onClick={onReset}
              title="Reset All Controls to Default"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition"
            >
              <RotateCcw className="w-4 h-4 inline sm:mr-1" />
              <span className="hidden xl:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

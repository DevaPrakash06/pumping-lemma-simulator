import React from 'react';
import type { PDAStateId, PDATransitionRule } from '../types/automata';

interface PDADiagramProps {
  currentState: PDAStateId;
  activeTransition: PDATransitionRule | null;
}

export const PDADiagram: React.FC<PDADiagramProps> = ({
  currentState,
  activeTransition,
}) => {
  const isQ0Active = currentState === 'q0';
  const isQ1Active = currentState === 'q1';
  const isQfActive = currentState === 'qf';

  const t1Active = activeTransition?.id === 't1_first_zero';
  const t2Active = activeTransition?.id === 't2_additional_zero';
  const t3Active = activeTransition?.id === 't3_first_one';
  const t4Active = activeTransition?.id === 't4_subsequent_one';
  const t5Active = activeTransition?.id === 't5_epsilon_accept';

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 inline-block"></span>
            Section B: Interactive Pushdown Automaton State Diagram
          </h3>
          <p className="text-xs text-slate-400">
            Acceptance by Final State <code className="text-indigo-300 font-mono">qf</code> with bottom-of-stack marker <code className="text-amber-300 font-mono">Z0</code>.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Current State:</span>
          <span
            className={`font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              isQfActive
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700 glow-active'
                : currentState === 'trap'
                ? 'bg-rose-950 text-rose-300 border-rose-700'
                : 'bg-indigo-950 text-indigo-300 border-indigo-700'
            }`}
          >
            {currentState === 'trap' ? 'TRAP (Rejected)' : currentState}
          </span>
        </div>
      </div>

      {/* SVG Automaton Canvas */}
      <div className="w-full overflow-x-auto bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 flex justify-center">
        <svg
          viewBox="0 0 760 300"
          className="w-full max-w-[760px] h-auto select-none"
          style={{ minWidth: '600px' }}
        >
          <defs>
            {/* Standard Arrow Marker */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
            </marker>
            {/* Active Transition Arrow Marker */}
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            {/* Start Arrow Marker */}
            <marker
              id="arrow-start"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#818cf8" />
            </marker>
          </defs>

          {/* 1. START ARROW INTO q0 */}
          <line
            x1="50"
            y1="170"
            x2="120"
            y2="170"
            stroke="#818cf8"
            strokeWidth="2.5"
            markerEnd="url(#arrow-start)"
          />
          <text x="75" y="155" fill="#818cf8" fontSize="11" fontWeight="bold" textAnchor="middle">
            Start
          </text>

          {/* ==============================================
              TRANSITIONS ON q0 (Self loops)
             ============================================== */}
          {/* Self Loop 1 on q0: 0, Z0 / AAAZ0 */}
          <path
            d="M 135 135 C 100 50, 180 50, 165 135"
            fill="none"
            stroke={t1Active || t2Active ? '#38bdf8' : '#64748b'}
            strokeWidth={t1Active || t2Active ? 3 : 2}
            markerEnd={t1Active || t2Active ? 'url(#arrow-active)' : 'url(#arrow)'}
            className={t1Active || t2Active ? 'glow-active' : ''}
          />
          <rect
            x="70"
            y="35"
            width="170"
            height="38"
            rx="6"
            fill="#0f172a"
            stroke={t1Active ? '#38bdf8' : t2Active ? '#a855f7' : '#334155'}
            strokeWidth="1.5"
          />
          <text
            x="155"
            y="50"
            fill={t1Active ? '#38bdf8' : '#e2e8f0'}
            fontSize="10.5"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            0, Z₀ / AAAZ₀ (1st zero)
          </text>
          <text
            x="155"
            y="64"
            fill={t2Active ? '#c084fc' : '#94a3b8'}
            fontSize="10.5"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            0, A / AAAA (next zeros)
          </text>

          {/* ==============================================
              TRANSITION q0 -> q1: 1, A / ε
             ============================================== */}
          <line
            x1="185"
            y1="170"
            x2="335"
            y2="170"
            stroke={t3Active ? '#38bdf8' : '#64748b'}
            strokeWidth={t3Active ? 3.5 : 2}
            markerEnd={t3Active ? 'url(#arrow-active)' : 'url(#arrow)'}
            className={t3Active ? 'glow-active' : ''}
          />
          <rect
            x="215"
            y="145"
            width="90"
            height="22"
            rx="5"
            fill="#0f172a"
            stroke={t3Active ? '#38bdf8' : '#334155'}
            strokeWidth="1.5"
          />
          <text
            x="260"
            y="160"
            fill={t3Active ? '#38bdf8' : '#cbd5e1'}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            1, A / ε
          </text>

          {/* ==============================================
              TRANSITIONS ON q1 (Self loop): 1, A / ε
             ============================================== */}
          <path
            d="M 365 135 C 330 50, 410 50, 395 135"
            fill="none"
            stroke={t4Active ? '#38bdf8' : '#64748b'}
            strokeWidth={t4Active ? 3.5 : 2}
            markerEnd={t4Active ? 'url(#arrow-active)' : 'url(#arrow)'}
            className={t4Active ? 'glow-active' : ''}
          />
          <rect
            x="325"
            y="42"
            width="110"
            height="24"
            rx="5"
            fill="#0f172a"
            stroke={t4Active ? '#38bdf8' : '#334155'}
            strokeWidth="1.5"
          />
          <text
            x="380"
            y="58"
            fill={t4Active ? '#38bdf8' : '#e2e8f0'}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            1, A / ε (subsequent)
          </text>

          {/* ==============================================
              TRANSITION q1 -> qf: ε, Z0 / Z0
             ============================================== */}
          <line
            x1="415"
            y1="170"
            x2="560"
            y2="170"
            stroke={t5Active ? '#10b981' : '#64748b'}
            strokeWidth={t5Active ? 3.5 : 2}
            markerEnd={t5Active ? 'url(#arrow-active)' : 'url(#arrow)'}
            className={t5Active ? 'glow-active' : ''}
          />
          <rect
            x="445"
            y="145"
            width="90"
            height="22"
            rx="5"
            fill="#0f172a"
            stroke={t5Active ? '#10b981' : '#334155'}
            strokeWidth="1.5"
          />
          <text
            x="490"
            y="160"
            fill={t5Active ? '#34d399' : '#cbd5e1'}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            ε, Z₀ / Z₀
          </text>

          {/* ==============================================
              STATE NODES: q0, q1, qf
             ============================================== */}

          {/* STATE q0 */}
          <g transform="translate(150, 170)">
            {isQ0Active && (
              <circle r="38" fill="none" stroke="#6366f1" strokeWidth="3" opacity="0.4" className="animate-ping" />
            )}
            <circle
              r="34"
              fill={isQ0Active ? '#1e1b4b' : '#0f172a'}
              stroke={isQ0Active ? '#818cf8' : '#475569'}
              strokeWidth={isQ0Active ? 3 : 2}
            />
            <text x="0" y="5" fill="#f8fafc" fontSize="16" fontWeight="bold" textAnchor="middle">
              q₀
            </text>
            <text x="0" y="55" fill="#94a3b8" fontSize="10" textAnchor="middle">
              Read 0s (Push 3 A's)
            </text>
          </g>

          {/* STATE q1 */}
          <g transform="translate(380, 170)">
            {isQ1Active && (
              <circle r="38" fill="none" stroke="#a855f7" strokeWidth="3" opacity="0.4" className="animate-ping" />
            )}
            <circle
              r="34"
              fill={isQ1Active ? '#2e1065' : '#0f172a'}
              stroke={isQ1Active ? '#c084fc' : '#475569'}
              strokeWidth={isQ1Active ? 3 : 2}
            />
            <text x="0" y="5" fill="#f8fafc" fontSize="16" fontWeight="bold" textAnchor="middle">
              q₁
            </text>
            <text x="0" y="55" fill="#94a3b8" fontSize="10" textAnchor="middle">
              Read 1s (Pop A)
            </text>
          </g>

          {/* STATE qf (Accepting state: Double Circle) */}
          <g transform="translate(600, 170)">
            {isQfActive && (
              <circle r="42" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.4" className="animate-ping" />
            )}
            {/* Outer Circle */}
            <circle
              r="38"
              fill={isQfActive ? '#064e3b' : '#0f172a'}
              stroke={isQfActive ? '#34d399' : '#475569'}
              strokeWidth={isQfActive ? 3 : 2}
            />
            {/* Inner Circle (Accepting State marker) */}
            <circle
              r="30"
              fill="none"
              stroke={isQfActive ? '#34d399' : '#475569'}
              strokeWidth={isQfActive ? 2.5 : 1.5}
            />
            <text x="0" y="5" fill="#f8fafc" fontSize="16" fontWeight="bold" textAnchor="middle">
              q_f
            </text>
            <text x="0" y="58" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
              ACCEPT
            </text>
          </g>
        </svg>
      </div>

      {/* Transition Conventions & Rule Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <span className="font-semibold text-sky-400 block mb-0.5">1. Counting Ratio (3:1):</span>
          <p className="text-slate-400 text-[11px]">
            For every 0 read in state <code className="text-slate-300">q0</code>, three <code className="text-amber-300 font-bold">A</code> symbols are added to the stack.
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <span className="font-semibold text-purple-400 block mb-0.5">2. Matching Verification:</span>
          <p className="text-slate-400 text-[11px]">
            For every 1 read in state <code className="text-slate-300">q1</code>, exactly one <code className="text-amber-300 font-bold">A</code> symbol is popped from the stack.
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <span className="font-semibold text-emerald-400 block mb-0.5">3. Final State Acceptance:</span>
          <p className="text-slate-400 text-[11px]">
            When all input is consumed and only <code className="text-amber-300 font-bold">Z0</code> remains, take <code className="text-slate-300">δ(q1, ε, Z0) → (qf, Z0)</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

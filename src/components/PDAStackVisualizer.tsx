import React from 'react';
import { Layers, ArrowDown, ArrowUp, AlertCircle } from 'lucide-react';

interface PDAStackVisualizerProps {
  stack: string[]; // stack[0] is top of stack
  symbolsPushed: number;
  symbolsPopped: number;
}

export const PDAStackVisualizer: React.FC<PDAStackVisualizerProps> = ({
  stack,
  symbolsPushed,
  symbolsPopped,
}) => {
  const countA = stack.filter((s) => s === 'A').length;
  const hasZ0 = stack.includes('Z0');

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center">
            <Layers className="w-4 h-4 text-amber-400 mr-2" />
            LIFO Stack Chamber
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
            Depth: {stack.length}
          </span>
        </div>

        {/* Stack Metrics */}
        <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs">
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">Top 'A' Count</span>
            <span className="font-mono text-base font-bold text-cyan-400">{countA}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-emerald-900/30">
            <span className="text-[10px] text-emerald-400 block flex items-center justify-center">
              <ArrowDown className="w-3 h-3 mr-0.5" /> Pushed
            </span>
            <span className="font-mono text-base font-bold text-emerald-300">{symbolsPushed}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-rose-900/30">
            <span className="text-[10px] text-rose-400 block flex items-center justify-center">
              <ArrowUp className="w-3 h-3 mr-0.5" /> Popped
            </span>
            <span className="font-mono text-base font-bold text-rose-300">{symbolsPopped}</span>
          </div>
        </div>
      </div>

      {/* Visual Vertical Stack Chamber */}
      <div className="my-2 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center min-h-[220px] max-h-[300px] overflow-y-auto relative">
        {stack.length === 0 ? (
          <div className="m-auto text-center text-slate-500 text-xs flex flex-col items-center">
            <AlertCircle className="w-5 h-5 text-rose-500 mb-1" />
            <span>Stack is completely empty</span>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-1.5 py-1">
            {stack.map((sym, index) => {
              const isTop = index === 0;
              const isBottomMarker = sym === 'Z0';

              return (
                <div
                  key={`${sym}-${index}`}
                  className={`w-4/5 py-1.5 px-3 rounded-lg font-mono text-xs font-bold flex items-center justify-between transition-all duration-300 pump-animated ${
                    isTop
                      ? 'bg-cyan-500/20 text-cyan-200 border-2 border-cyan-400 shadow-md shadow-cyan-500/20 glow-active scale-105'
                      : isBottomMarker
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/60'
                      : 'bg-indigo-950/40 text-indigo-200 border border-indigo-800/40'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-500 w-4">#{stack.length - index}</span>
                    <span className="text-sm">{sym}</span>
                  </span>

                  {isTop ? (
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider bg-cyan-900/80 text-cyan-200 px-1.5 py-0.5 rounded border border-cyan-400/40">
                      ← TOP
                    </span>
                  ) : isBottomMarker ? (
                    <span className="text-[9px] font-sans text-amber-300 opacity-80">
                      BOTTOM MARKER
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stack Base / Pedestal */}
      <div className="pt-2 text-center">
        <div className="w-full h-2 rounded-full bg-slate-800 border-t border-slate-700 mb-1" />
        <span className="text-[10px] font-mono text-slate-500">
          Stack Base {hasZ0 ? '(Z0 anchored)' : '(No bottom marker)'}
        </span>
      </div>
    </div>
  );
};

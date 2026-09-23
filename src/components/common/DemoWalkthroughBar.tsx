import React from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Activity, RotateCcw } from 'lucide-react';
import { useIncident, EXTENDED_SIMULATION_STEPS } from '../../context/IncidentContext';

interface DemoWalkthroughBarProps {
  onClose: () => void;
}

export const DemoWalkthroughBar: React.FC<DemoWalkthroughBarProps> = ({ onClose }) => {
  const {
    simulationState,
    simulationStepIndex,
    currentStepDefinition,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    setSimulationStep,
  } = useIncident();

  const isPlaying = simulationState === 'RUNNING';

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseSimulation();
    } else if (simulationState === 'PAUSED') {
      resumeSimulation();
    } else {
      startSimulation();
    }
  };

  return (
    <div className="bg-navy-900 border-b border-amber-500/40 py-2.5 px-4 text-slate-100 flex flex-wrap items-center justify-between gap-3 shadow-lg sticky top-[53px] z-40">
      {/* Simulation Header & Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded font-mono text-xs font-bold shrink-0">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>SIMULATION MODE · REPLAY: {currentStepDefinition.timeCode}</span>
        </div>

        <div className="hidden sm:block">
          <h4 className="text-xs font-bold text-white flex items-center space-x-2">
            <span>{currentStepDefinition.title}</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300 font-mono text-[11px] uppercase">
              View: /{currentStepDefinition.tab}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-red-400 font-mono text-[11px] font-bold">
              {currentStepDefinition.floodProbPct}% Risk ({currentStepDefinition.riskLevel})
            </span>
          </h4>
          <p className="text-[11px] text-slate-300 font-medium truncate max-w-xl">
            {currentStepDefinition.subtitle}
          </p>
        </div>
      </div>

      {/* Playback Controls & Navigation */}
      <div className="flex items-center space-x-2">
        <button
          disabled={simulationStepIndex === 0}
          onClick={() => setSimulationStep(simulationStepIndex - 1)}
          className="p-1 rounded bg-navy-800 hover:bg-navy-750 disabled:opacity-40 text-slate-200 border border-surface-border text-xs"
          title="Previous Scenario Step"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleTogglePlay}
          className="flex items-center space-x-1 px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs transition-colors shadow"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-navy-950" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-navy-950" />
              <span>{simulationState === 'PAUSED' ? 'Resume' : 'Play Scenario'}</span>
            </>
          )}
        </button>

        <button
          disabled={simulationStepIndex === EXTENDED_SIMULATION_STEPS.length - 1}
          onClick={() => setSimulationStep(simulationStepIndex + 1)}
          className="p-1 rounded bg-navy-800 hover:bg-navy-750 disabled:opacity-40 text-slate-200 border border-surface-border text-xs"
          title="Next Scenario Step"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={resetSimulation}
          className="p-1 rounded bg-navy-800 hover:bg-navy-750 text-slate-300 border border-surface-border text-xs"
          title="Reset Simulation to Baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-surface-border mx-1" />

        <button
          onClick={onClose}
          className="p-1 rounded bg-navy-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-surface-border text-xs transition-colors"
          title="Exit Scenario Mode"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

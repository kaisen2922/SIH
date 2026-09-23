import React from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineScrubberProps {
  currentMinutes: number;
  onChangeMinutes: (minutes: number) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const TIMELINE_STEPS = [
  { minutes: 0, label: 'Now', rainfall: '38 mm/hr', risk: 'HIGH (78%)' },
  { minutes: 30, label: '+30 min', rainfall: '45 mm/hr', risk: 'CRITICAL (88%)' },
  { minutes: 60, label: '+60 min', rainfall: '42 mm/hr', risk: 'CRITICAL (91%)' },
  { minutes: 90, label: '+90 min', rainfall: '24 mm/hr', risk: 'HIGH (82%)' },
  { minutes: 120, label: '+120 min', rainfall: '12 mm/hr', risk: 'MODERATE (54%)' },
];

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentMinutes,
  onChangeMinutes,
  isPlaying,
  onTogglePlay,
}) => {
  return (
    <div className="bg-navy-900 border border-surface-border rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Hydraulic Horizon Scrubber: {currentMinutes === 0 ? 'Live Status' : `Forecast +${currentMinutes} Min`}
          </span>
        </div>

        {onTogglePlay && (
          <button
            onClick={onTogglePlay}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-750 border border-surface-border text-xs text-slate-200 transition-colors"
          >
            {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isPlaying ? 'Pause Simulation' : 'Play Timeline'}</span>
          </button>
        )}
      </div>

      {/* Scrubber Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {TIMELINE_STEPS.map((step) => {
          const isActive = currentMinutes === step.minutes;
          return (
            <button
              key={step.minutes}
              onClick={() => onChangeMinutes(step.minutes)}
              className={`p-2 rounded border text-left transition-all ${
                isActive
                  ? 'bg-brand-primary/20 border-brand-primary text-white font-semibold'
                  : 'bg-navy-950 border-surface-border text-slate-400 hover:text-slate-200 hover:bg-navy-850'
              }`}
            >
              <span className="font-mono text-xs font-bold block">{step.label}</span>
              <span className="text-[10px] text-brand-cyan block font-mono">{step.rainfall}</span>
              <span
                className={`text-[9px] font-mono font-semibold uppercase ${
                  step.risk.includes('CRITICAL') ? 'text-red-400' : 'text-amber-400'
                }`}
              >
                {step.risk}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

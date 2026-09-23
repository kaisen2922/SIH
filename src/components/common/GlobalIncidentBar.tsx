import React from 'react';
import { ShieldAlert, Clock, Droplets, Users, ChevronRight, Activity, MapPin, Navigation, Bell } from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';

interface GlobalIncidentBarProps {
  onNavigate?: (tab: string) => void;
}

export const GlobalIncidentBar: React.FC<GlobalIncidentBarProps> = ({ onNavigate }) => {
  const {
    incidentId,
    ward,
    status,
    rainfall,
    floodProbability,
    estimatedOnset,
    runoff,
    affectedPopulation,
    selectedCatchment,
    alerts,
    simulationState,
  } = useIncident();

  const catchmentCode = selectedCatchment?.code || 'MC-042';

  return (
    <div className="bg-navy-900/95 border-b border-surface-border text-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
      {/* Left: Incident Identity & Severity Badge */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono font-extrabold text-white text-xs tracking-tight">
            FLOOD EVENT #{incidentId}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-slate-300 font-mono text-[11px] bg-navy-950 px-2 py-0.5 rounded border border-surface-border">
          <MapPin className="w-3 h-3 text-brand-cyan" />
          <span className="font-bold text-white">{catchmentCode}</span>
          <span className="text-slate-500">•</span>
          <span>WARD {ward} (Kolkata)</span>
        </div>

        <span
          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            status === 'ESCALATING'
              ? 'bg-red-950/80 text-red-300 border border-red-700/60'
              : status === 'CONTAINED'
              ? 'bg-yellow-950/80 text-yellow-300 border border-yellow-700/60'
              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
          }`}
        >
          {status}
        </span>

        {simulationState !== 'IDLE' && (
          <span className="badge-simulation font-bold animate-pulse text-[10px] px-2 py-0.5">
            SIMULATION MODE
          </span>
        )}
      </div>

      {/* Middle: Synchronized Real-Time Incident Telemetry with Explicit Data State Badges */}
      <div className="flex flex-wrap items-center space-x-3.5 font-mono text-xs">
        {/* Risk Probability */}
        <div className="flex items-center space-x-1.5">
          <span className="text-red-400 font-extrabold text-sm">{floodProbability}% RISK</span>
          <span className="badge-model">
            MODEL ESTIMATE
          </span>
        </div>

        {/* Estimated Inundation Onset */}
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold">~{estimatedOnset} MIN ONSET</span>
          <span className="badge-model">
            MODEL ESTIMATE
          </span>
        </div>

        {/* Current Precipitation Intensity */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-sky-300 font-bold">{rainfall} mm/h</span>
          <span className="badge-live">
            LIVE
          </span>
        </div>

        {/* Basin Runoff */}
        <div className="hidden md:flex items-center space-x-1.5">
          <span className="text-slate-400">Runoff:</span>
          <span className="text-brand-cyan font-bold">{runoff} m³/s</span>
          <span className="badge-model">
            MODEL ESTIMATE
          </span>
        </div>

        {/* Affected Population */}
        <div className="hidden lg:flex items-center space-x-1.5">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-200 font-bold">{(affectedPopulation / 1000).toFixed(1)}K AFFECTED</span>
          <span className="badge-demo">
            DEMO
          </span>
        </div>

        {/* Active Alerts */}
        <div className="hidden xl:flex items-center space-x-1.5">
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold">{alerts.length} ALERTS ACTIVE</span>
          <span className="badge-live">
            LIVE
          </span>
        </div>
      </div>

      {/* Right: Quick Command Center View Navigation */}
      {onNavigate && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('map')}
            className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-750 text-slate-200 border border-surface-border text-[11px] font-semibold flex items-center space-x-1 transition-colors"
            title="Inspect Incident On Live Flood Map"
          >
            <Navigation className="w-3 h-3 text-brand-cyan" />
            <span className="hidden sm:inline">GIS Focus</span>
          </button>
        </div>
      )}
    </div>
  );
};

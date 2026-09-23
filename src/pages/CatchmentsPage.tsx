import React, { useState } from 'react';
import {
  Waves,
  Droplets,
  Sliders,
  Activity,
  ArrowRight,
  ShieldAlert,
  Clock,
  HelpCircle,
  Building2,
  Navigation,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
} from 'lucide-react';
import { MicroCatchment } from '../types';
import { FlowCanvas } from '../components/catchments/FlowCanvas';
import { RiskBadge } from '../components/common/RiskBadge';
import { useIncident } from '../context/IncidentContext';

interface CatchmentsPageProps {
  catchments: MicroCatchment[];
  selectedCatchment: MicroCatchment | null;
  onSelectCatchment: (mc: MicroCatchment) => void;
  onNavigate: (tab: string, params?: any) => void;
}

export const CatchmentsPage: React.FC<CatchmentsPageProps> = ({
  onSelectCatchment,
  onNavigate,
}) => {
  const {
    catchments,
    selectedCatchment,
    selectCatchment,
    rainfall,
    runoff,
    floodProbability,
    estimatedOnset,
    timelineMinutes,
    setTimelineMinutes,
    openProvenanceModal,
  } = useIncident();

  const currentMc = selectedCatchment || catchments.find((c) => c.code === 'MC-042') || catchments[0];
  const upstreamMc = catchments.find((c) => c.code === 'MC-018') || catchments[1];
  const downstreamTarget = catchments.find((c) => c.code === 'MC-042') || catchments[0];

  // Scenario Simulator Inputs (Section 8)
  const [scenarioRainfall, setScenarioRainfall] = useState(38);
  const [scenarioImpervious, setScenarioImpervious] = useState(72);
  const [scenarioDrainage, setScenarioDrainage] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [scenarioCanal, setScenarioCanal] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  // Scenario Output State
  const [hasRunScenario, setHasRunScenario] = useState(false);
  const [scenarioOutput, setScenarioOutput] = useState({
    probPct: 96,
    onsetTimeMin: 28,
    runoffM3s: 18.2,
    drainageStress: 'CRITICAL (94%)',
  });

  const handleApplyPlus20Rain = () => {
    setScenarioRainfall((prev) => Math.min(90, Math.round(prev * 1.2)));
  };

  const handleRunScenario = () => {
    const deltaRain = (scenarioRainfall - 38) * 0.45;
    const deltaImpervious = (scenarioImpervious - 72) * 0.25;
    const canalPenalty = scenarioCanal === 'HIGH' ? 8 : scenarioCanal === 'LOW' ? -6 : 0;
    const drainageBonus = scenarioDrainage === 'HIGH' ? -10 : scenarioDrainage === 'LOW' ? 12 : 0;

    const computedProb = Math.min(99, Math.max(20, Math.round(91 + deltaRain + deltaImpervious + canalPenalty + drainageBonus)));
    const computedOnset = Math.max(15, Math.round(40 - deltaRain * 0.7 - deltaImpervious * 0.3 - canalPenalty * 0.5));
    const computedRunoff = (14.8 + (scenarioRainfall - 38) * 0.28).toFixed(1);

    setScenarioOutput({
      probPct: computedProb,
      onsetTimeMin: computedOnset,
      runoffM3s: parseFloat(computedRunoff),
      drainageStress: computedProb > 90 ? 'CRITICAL (95%)' : computedProb > 75 ? 'HIGH (82%)' : 'MODERATE (60%)',
    });
    setHasRunScenario(true);
  };

  const handleResetScenario = () => {
    setScenarioRainfall(38);
    setScenarioImpervious(72);
    setScenarioDrainage('MEDIUM');
    setScenarioCanal('MEDIUM');
    setHasRunScenario(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 p-5 rounded-lg border border-surface-border">
        <div>
          <div className="flex items-center space-x-2">
            <Waves className="w-4 h-4 text-brand-cyan" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              Hydrological Intelligence & Flow Dynamics
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            Catchments & Hydraulic Pipeline Dynamics
          </h1>
          <p className="text-xs text-slate-400">
            Traces rainfall-to-runoff kinematic wave accumulation from upstream Shyambazar (MC-018) to the Circular Canal lowland sink (MC-042).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              selectCatchment(currentMc);
              onNavigate('map');
            }}
            className="px-4 py-2.5 rounded bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs flex items-center space-x-2 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>INSPECT ON GIS MAP</span>
          </button>
        </div>
      </div>

      {/* Section 7: INTERACTIVE HYDRAULIC PIPELINE */}
      <div className="bg-navy-800 p-5 rounded-lg border border-surface-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-brand-cyan" />
            <span>INTERACTIVE HYDRAULIC PIPELINE (CLICK ANY NODE TO INSPECT)</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-400 uppercase bg-navy-950 px-2 py-0.5 rounded border border-surface-border">
            TOPOGRAPHICAL FLOW CASCADE
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-mono">
          {/* Node 1: Rainfall */}
          <div
            onClick={() => openProvenanceModal()}
            className="bg-navy-850 p-3 rounded-lg border border-surface-border hover:border-brand-cyan cursor-pointer transition-colors space-y-1"
            title="Inspect Precipitation Telemetry"
          >
            <span className="text-slate-400 block text-[10px] uppercase font-bold">1. RAINFALL</span>
            <span className="text-base font-extrabold text-brand-cyan block">{rainfall} mm/h</span>
            <span className="badge-live text-[9px] block">LIVE RADAR</span>
          </div>

          {/* Node 2: Upstream Catchment MC-018 (Clickable) */}
          <div
            onClick={() => {
              if (upstreamMc) {
                selectCatchment(upstreamMc);
                onSelectCatchment(upstreamMc);
              }
            }}
            className={`bg-navy-850 p-3 rounded-lg border cursor-pointer transition-colors space-y-1 ${
              currentMc.code === 'MC-018' ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-surface-border hover:border-brand-primary'
            }`}
            title="Click to select MC-018 and inspect upstream hydrological parameters"
          >
            <span className="text-slate-400 block text-[10px] uppercase font-bold">2. UPSTREAM</span>
            <span className="text-sm font-extrabold text-white block font-mono">MC-018</span>
            <span className="text-[10px] text-brand-cyan font-semibold block">Elev 5.8 m MSL</span>
          </div>

          {/* Node 3: Runoff */}
          <div
            onClick={() => {
              const el = document.getElementById('whatif-simulator');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-navy-850 p-3 rounded-lg border border-surface-border hover:border-amber-500 cursor-pointer transition-colors space-y-1"
            title="Inspect Kinematic Runoff Wave"
          >
            <span className="text-slate-400 block text-[10px] uppercase font-bold">3. RUNOFF</span>
            <span className="text-base font-extrabold text-amber-400 block">{runoff} m³/s</span>
            <span className="badge-model text-[9px] block">MODEL ESTIMATE</span>
          </div>

          {/* Node 4: Drainage */}
          <div
            onClick={() => openProvenanceModal()}
            className="bg-navy-850 p-3 rounded-lg border border-surface-border hover:border-amber-500 cursor-pointer transition-colors space-y-1"
            title="Inspect Circular Canal Lock Gate Sluice"
          >
            <span className="text-slate-400 block text-[10px] uppercase font-bold">4. DRAINAGE</span>
            <span className="text-sm font-extrabold text-amber-300 block">3.82m Stage</span>
            <span className="text-[9px] text-amber-400 font-bold block">85% Capacity</span>
          </div>

          {/* Node 5: Downstream Catchment MC-042 (Clickable - focuses map) */}
          <div
            onClick={() => {
              if (downstreamTarget) {
                selectCatchment(downstreamTarget);
                onSelectCatchment(downstreamTarget);
                onNavigate('map', { catchmentId: downstreamTarget.id });
              }
            }}
            className={`bg-navy-850 p-3 rounded-lg border cursor-pointer transition-colors space-y-1 ${
              currentMc.code === 'MC-042' ? 'border-red-500 ring-1 ring-red-500' : 'border-surface-border hover:border-red-500'
            }`}
            title="Click to select MC-042 and focus Live Flood Map"
          >
            <span className="text-slate-400 block text-[10px] uppercase font-bold">5. DOWNSTREAM</span>
            <span className="text-sm font-extrabold text-red-400 block font-mono">MC-042</span>
            <span className="text-[10px] text-red-400 font-bold block">Focus GIS Map ➔</span>
          </div>

          {/* Node 6: Flood Risk */}
          <div
            onClick={() => onNavigate('predictions')}
            className="bg-navy-850 p-3 rounded-lg border border-surface-border hover:border-red-500 cursor-pointer transition-colors space-y-1"
            title="Inspect AI Prediction Center"
          >
            <span className="text-slate-400 block text-[10px] uppercase font-bold">6. FLOOD RISK</span>
            <span className="text-base font-extrabold text-red-400 block">{floodProbability}%</span>
            <span className="badge-critical text-[9px] block">CRITICAL NOWCAST</span>
          </div>
        </div>
      </div>

      {/* Section 7 Explanation: WHY DOES WATER MOVE HERE? */}
      <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-surface-border pb-3">
          <HelpCircle className="w-4 h-4 text-brand-cyan" />
          <h2 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
            WHY DOES WATER MOVE HERE? (HYDRAULIC CAUSALITY BREAKDOWN)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1">
            <span className="text-brand-cyan block text-[11px] font-bold uppercase">1. Elevation Difference</span>
            <p className="text-slate-300 font-sans text-xs">
              MC-018 crest sits at <b className="text-white font-mono">5.8m MSL</b> while MC-042 depression basin sits at <b className="text-red-400 font-mono">4.5m MSL</b>. Gravity slopes runoff naturally downward into Ward 17.
            </p>
          </div>

          <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1">
            <span className="text-brand-cyan block text-[11px] font-bold uppercase">2. Flow Accumulation</span>
            <p className="text-slate-300 font-sans text-xs">
              Kinematic wave discharge accumulates 14.8 m³/s peak overland flow across dense asphalt corridors before reaching outfall channels.
            </p>
          </div>

          <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1">
            <span className="text-brand-cyan block text-[11px] font-bold uppercase">3. Catchment Relationship</span>
            <p className="text-slate-300 font-sans text-xs">
              MC-018 and MC-022 serve as direct upstream feeder sub-catchments converging at the Circular Canal basin.
            </p>
          </div>

          <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1">
            <span className="text-brand-cyan block text-[11px] font-bold uppercase">4. Drainage Constraint</span>
            <p className="text-slate-300 font-sans text-xs">
              Circular Canal siltation limits discharge capacity to Medium (lock gate water level at 3.82m reduces gradient velocity by 34%).
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid: Canvas + Section 8 What-If Scenario Simulator + Catchment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Flow Canvas + What-If Scenario Simulator (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dynamic Vector Flow Canvas */}
          <FlowCanvas
            currentRainfallMm={rainfall}
            runoffM3s={runoff}
            selectedCatchment={currentMc}
            onSelectCatchment={(mc) => {
              selectCatchment(mc);
              onSelectCatchment(mc);
            }}
            catchments={catchments}
          />

          {/* Section 8: CATCHMENT SCENARIO SIMULATOR (WHAT-IF SIMULATOR) */}
          <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-brand-cyan" />
                <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                  Catchment Scenario Simulator ("What If" Analysis)
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleApplyPlus20Rain}
                  className="px-2 py-0.5 rounded bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-cyan border border-brand-primary/40 text-[10px] font-mono font-bold transition-colors"
                >
                  +20% Rainfall
                </button>
                <span className="badge-simulation">
                  SIMULATION
                </span>
              </div>
            </div>

            {/* Simulator Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Rain Control */}
              <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rainfall Intensity:</span>
                  <span className="text-brand-cyan font-bold">{scenarioRainfall} mm/h</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={scenarioRainfall}
                  onChange={(e) => setScenarioRainfall(parseInt(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
              </div>

              {/* Impervious Surface Control */}
              <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Impervious Surface:</span>
                  <span className="text-slate-200 font-bold">{scenarioImpervious}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={95}
                  value={scenarioImpervious}
                  onChange={(e) => setScenarioImpervious(parseInt(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
              </div>

              {/* Drainage Capacity */}
              <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1.5">
                <span className="text-slate-400 block font-bold">Drainage Capacity:</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setScenarioDrainage(lvl)}
                      className={`p-1.5 rounded text-center border text-xs font-bold transition-colors ${
                        scenarioDrainage === lvl
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-navy-800 text-slate-400 border-surface-border hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canal Restriction */}
              <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1.5">
                <span className="text-slate-400 block font-bold">Canal Siltation Restriction:</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setScenarioCanal(lvl)}
                      className={`p-1.5 rounded text-center border text-xs font-bold transition-colors ${
                        scenarioCanal === lvl
                          ? 'bg-amber-950/80 text-amber-300 border-amber-600/60'
                          : 'bg-navy-800 text-slate-400 border-surface-border hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Run & Reset Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunScenario}
                className="flex-1 bg-brand-primary hover:bg-brand-hover text-white font-bold py-2.5 rounded text-xs flex items-center justify-center space-x-2 transition-colors active:scale-[0.99]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>RUN WHAT-IF SCENARIO CALCULATION</span>
              </button>
              {hasRunScenario && (
                <button
                  onClick={handleResetScenario}
                  className="px-3 py-2.5 rounded bg-navy-850 hover:bg-navy-750 text-slate-300 border border-surface-border text-xs flex items-center space-x-1 transition-colors"
                  title="Reset to Baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Baseline vs Scenario Side-by-Side Display */}
            {hasRunScenario && (
              <div className="bg-navy-850 p-4 rounded-lg border border-surface-border space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-surface-border pb-2">
                  <span className="font-mono text-xs font-bold text-brand-cyan uppercase">
                    BASELINE VS SCENARIO COMPARISON
                  </span>
                  <span className="badge-simulation">
                    SIMULATION OUTPUT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-navy-800 p-3 rounded border border-surface-border space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">BASELINE (CURRENT)</span>
                    <p className="text-slate-200">Flood Probability: <b className="text-red-400">91%</b></p>
                    <p className="text-slate-200">Estimated Onset: <b className="text-amber-400">~40 min</b></p>
                    <p className="text-slate-200">Runoff Discharge: <b className="text-brand-cyan">14.8 m³/s</b></p>
                    <p className="text-slate-400 text-[10px]">Rainfall: 38 mm/h</p>
                  </div>

                  <div className="bg-navy-800 p-3 rounded border border-brand-primary/60 space-y-1">
                    <span className="text-brand-cyan text-[10px] uppercase font-bold block">SIMULATED SCENARIO</span>
                    <p className="text-slate-200">Flood Probability: <b className="text-red-400">{scenarioOutput.probPct}%</b></p>
                    <p className="text-slate-200">Estimated Onset: <b className="text-amber-400">~{scenarioOutput.onsetTimeMin} min</b></p>
                    <p className="text-slate-200">Runoff Discharge: <b className="text-brand-cyan">{scenarioOutput.runoffM3s} m³/s</b></p>
                    <p className="text-slate-400 text-[10px]">Rainfall: {scenarioRainfall} mm/h</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Catchment Details Card & Catchment List */}
        <div className="space-y-6">
          {/* Selected Catchment Details */}
          <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="font-mono font-extrabold text-lg text-white tracking-tight">{currentMc.code}</h3>
                <h4 className="text-xs font-semibold text-slate-300 mt-0.5">
                  Ward {currentMc.ward} — {currentMc.name}
                </h4>
              </div>
              <RiskBadge level={currentMc.riskLevel} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-navy-850 p-2.5 rounded border border-surface-border">
                <span className="text-slate-400 block text-[10px]">Flood Probability</span>
                <span className="font-bold text-red-400 text-sm">{currentMc.code === 'MC-042' ? floodProbability : currentMc.floodProbabilityPct}%</span>
              </div>
              <div className="bg-navy-850 p-2.5 rounded border border-surface-border">
                <span className="text-slate-400 block text-[10px]">Estimated Onset</span>
                <span className="font-bold text-amber-400 text-sm">~{currentMc.code === 'MC-042' ? estimatedOnset : currentMc.timeToFloodMin} min</span>
              </div>
              <div className="bg-navy-850 p-2 rounded border border-surface-border">
                <span className="text-slate-400 block text-[10px]">Current Rainfall</span>
                <span className="font-bold text-brand-cyan">{currentMc.code === 'MC-042' ? rainfall : currentMc.currentRainfallMm} mm/h</span>
              </div>
              <div className="bg-navy-850 p-2 rounded border border-surface-border">
                <span className="text-slate-400 block text-[10px]">Estimated Runoff</span>
                <span className="font-bold text-slate-200">{currentMc.code === 'MC-042' ? runoff : currentMc.runoffEstimateM3s} m³/s</span>
              </div>
              <div className="bg-navy-850 p-2 rounded border border-surface-border">
                <span className="text-slate-400 block text-[10px]">Elevation / Slope</span>
                <span className="font-bold text-slate-200">{currentMc.elevationM}m MSL / {currentMc.slopePct}%</span>
              </div>
              <div className="bg-navy-850 p-2 rounded border border-surface-border">
                <span className="text-slate-400 block text-[10px]">Drainage Capacity</span>
                <span className="font-bold text-amber-400">{currentMc.drainageCapacity}</span>
              </div>
              <div className="bg-navy-850 p-2 rounded border border-surface-border">
                <span className="text-slate-400 block text-[10px]">Impervious Surface</span>
                <span className="font-bold text-slate-200">{currentMc.imperviousSurfacePct}%</span>
              </div>
              <div className="bg-navy-850 p-2 rounded border border-surface-border">
                <span className="text-slate-400 block text-[10px]">Historical Floods</span>
                <span className="font-bold text-slate-200">{currentMc.historicalFloodCount} events</span>
              </div>
            </div>
          </div>

          {/* Micro-Catchments Selector List */}
          <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              KOLKATA BASIN MICRO-CATCHMENTS
            </h3>

            <div className="space-y-2">
              {catchments.map((mc) => {
                const isSelected = mc.code === currentMc.code;
                return (
                  <div
                    key={mc.id}
                    onClick={() => {
                      selectCatchment(mc);
                      onSelectCatchment(mc);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-navy-750 border-brand-primary'
                        : 'bg-navy-850 border-surface-border hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-white text-xs">{mc.code}</span>
                      <RiskBadge level={mc.riskLevel} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                      <span>Ward {mc.ward} · {mc.elevationM}m MSL</span>
                      <span className="text-red-400 font-bold">{mc.code === 'MC-042' ? floodProbability : mc.floodProbabilityPct}% Risk</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  BrainCircuit,
  CloudRain,
  ShieldAlert,
  Clock,
  Building2,
  ChevronRight,
  X,
  Activity,
  Database,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { MicroCatchment, ExplainableAIFactor } from '../types';
import { ExplainableAIWaterfall } from '../components/predictions/ExplainableAIWaterfall';
import { TimelineScrubber } from '../components/predictions/TimelineScrubber';
import { RiskBadge } from '../components/common/RiskBadge';
import { useIncident } from '../context/IncidentContext';

interface PredictionsPageProps {
  catchments: MicroCatchment[];
  selectedCatchment: MicroCatchment | null;
  explainableFactors: ExplainableAIFactor[];
  onNavigate: (tab: string, params?: any) => void;
}

export const PredictionsPage: React.FC<PredictionsPageProps> = ({
  onNavigate,
}) => {
  const {
    selectedCatchment,
    catchments,
    explainableFactors,
    rainfall,
    runoff,
    floodProbability,
    estimatedOnset,
    timelineMinutes,
    setTimelineMinutes,
    openProvenanceModal,
  } = useIncident();

  const currentMc = selectedCatchment || catchments.find((c) => c.code === 'MC-042') || catchments[0];
  const [activeModelDetail, setActiveModelDetail] = useState<string | null>(null);
  const [showModelInputsModal, setShowModelInputsModal] = useState(false);

  // Section 9: Four Professional Model Cards with Model State, Input Count, Prediction Horizon, Current Output
  const models = [
    {
      id: 'm-rain',
      name: 'RAINFALL NOWCASTING',
      val: `${rainfall} mm/h surge`,
      icon: CloudRain,
      color: 'text-sky-400',
      model: 'Optical Flow Radar Nowcaster',
      modelType: 'Convective Optical Flow Radar Extrapolation',
      modelState: 'ONLINE · INGESTING',
      inputCount: '4 Sensor Telemetry Feeds',
      predictionHorizon: '0 to 60 Minutes',
      currentOutput: `${rainfall} mm/h convective surge detected over Ward 17`,
      inputs: 'IMD Doppler Radar (Kolkata S-band) + Municipal Automated Weather Station (AWS-017)',
      inputFeatures: 'S-band Radar Reflectivity (dBZ), Surface Wind Velocity, AWS Rain Gauge Telemetry',
      prediction: `${rainfall} mm cumulative precipitation surge over next 60 minutes`,
      explanation: 'Atmospheric instability cell moving at 18 km/h northeast directly over northern metropolitan wards.',
      uncertainty: '±4 mm/h Variance Band (90% Confidence Interval)',
      accuracy: '94.2% Lead-Time Correlation (Demo Baseline)',
    },
    {
      id: 'm-risk',
      name: 'FLOOD RISK ESTIMATOR',
      val: `${floodProbability}% probability`,
      icon: ShieldAlert,
      color: 'text-red-400',
      model: 'Overland Inundation Risk Engine',
      modelType: 'Kinematic Wave Overland Flow Hydrodynamic Solver',
      modelState: 'ONLINE · ESTIMATING',
      inputCount: '6 Geospatial / Hydro Layers',
      predictionHorizon: 'Nowcast Horizon +45 Min',
      currentOutput: `${floodProbability}% Critical Inundation Risk for ${currentMc.code}`,
      inputs: '30m Cartosat DEM + Micro-Catchment Topographical Graph + Impervious Cover Layer',
      inputFeatures: '30m ISRO Cartosat DEM, Impervious Cover Ratio (72%), Canal Cross-Section Slope',
      prediction: 'Overland surface water accumulation depth >35cm expected in depression basin',
      explanation: 'Steep topographical gradient from MC-018 (5.8m MSL) slopes runoff directly into low-lying Ward 17 depression (4.5m MSL).',
      uncertainty: '±7% Probability Margin (Topographical DEM Resolution Sensitivity)',
      accuracy: '91.8% Historical Event Fit (Demo Baseline)',
    },
    {
      id: 'm-time',
      name: 'TIME-TO-FLOOD ENGINE',
      val: `~${estimatedOnset} min onset`,
      icon: Clock,
      color: 'text-amber-400',
      model: 'Inundation Lead-Time Router',
      modelType: 'Stage-Storage Empirical Discharge Routing',
      modelState: 'ONLINE · COMPUTING',
      inputCount: '3 Hydraulic Flow Vectors',
      predictionHorizon: '10 to 120 Minutes',
      currentOutput: `~${estimatedOnset} Minutes until ground inundation reaches critical curb height`,
      inputs: 'Kinematic wave hydrograph routing + Circular Canal stage-storage volume curves',
      inputFeatures: 'Hydrograph Runoff Rate (14.8 m³/s), Canal Stage Height (3.82m), Sluice Gate Aperture',
      prediction: `Critical ponding estimated at ~${estimatedOnset} minutes lead time`,
      explanation: 'Upstream hydrograph peak arrival combined with Circular Canal stage approaching 85% capacity limits drainage outflow.',
      uncertainty: '±6 Min Lead-Time Error Window (Canal Gate Actuation Latency)',
      accuracy: '±6 min variance (Demo Validation)',
    },
    {
      id: 'm-impact',
      name: 'IMPACT PREDICTION',
      val: '1 Hospital · 4 Arterials',
      icon: Building2,
      color: 'text-brand-cyan',
      model: 'Lifeline Exposure Classifier',
      modelType: 'Spatial Network Shortest-Path & Asset Exposure Graph',
      modelState: 'ONLINE · EVALUATING',
      inputCount: '5 Infrastructure Graphs',
      predictionHorizon: 'Event Duration +3 Hours',
      currentOutput: 'SSKM Emergency Ingress Gate & Ultadanga Underpass flagged at risk',
      inputs: 'OpenStreetMap Road Network + Municipal Lifeline Asset Inventory + Population Census',
      inputFeatures: 'OSM Road Vector Centroids, Lifeline Asset GIS Points, Census Ward Demographic Polygons',
      prediction: 'Ground-floor residential access roads inundated; medical transit detour required',
      explanation: 'Substation #12 and SSKM Hospital Gate 3 sit in the lowest micro-depression sub-basin susceptible to ponding >30cm.',
      uncertainty: '±50m Spatial Buffer Uncertainty on Street Inundation Fringe',
      accuracy: '96.0% Spatial Overlay (Demo Baseline)',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 p-5 rounded-lg border border-surface-border">
        <div>
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4 text-brand-primary" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              AI Hydrodynamic Prediction Center
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            Hyperlocal Nowcasting & Impact Estimation Ensemble
          </h1>
          <p className="text-xs text-slate-400">
            Inspect live model states, contributing inputs, prediction horizons, and simulated feature weights for {currentMc.code}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowModelInputsModal(true)}
            className="px-3 py-2 rounded bg-navy-850 hover:bg-navy-750 text-slate-200 border border-surface-border font-semibold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-brand-cyan" />
            <span>VIEW MODEL INPUTS</span>
          </button>
          <button
            onClick={() => openProvenanceModal()}
            className="px-3 py-2 rounded bg-navy-850 hover:bg-navy-750 text-slate-200 border border-surface-border font-semibold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-brand-cyan" />
            <span>VIEW DATA PROVENANCE</span>
          </button>
          <button
            onClick={() => onNavigate('infrastructure')}
            className="px-4 py-2 rounded bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <span>Inspect Assets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section 9: Four Professional Model Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => setActiveModelDetail(m.id)}
              className="bg-navy-800 p-4 rounded-lg border border-surface-border hover:border-brand-primary cursor-pointer transition-colors space-y-3 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-mono uppercase font-bold text-slate-200 tracking-wider">
                    {m.name}
                  </span>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-mono font-extrabold text-white group-hover:text-brand-cyan transition-colors">
                    {m.val}
                  </span>
                </div>

                <p className="text-[10px] text-brand-cyan font-mono line-clamp-1">
                  Type: {m.modelType}
                </p>

                <div className="space-y-1 text-[11px] font-mono text-slate-300 pt-2 border-t border-surface-border">
                  <div className="flex justify-between">
                    <span className="text-slate-500">State:</span>
                    <span className="text-teal-400 font-bold text-[10px]">{m.modelState}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inputs:</span>
                    <span className="text-slate-200 truncate max-w-[120px]" title={m.inputFeatures}>{m.inputCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Horizon:</span>
                    <span className="text-amber-400">{m.predictionHorizon}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[10px] font-mono">
                <span className="text-brand-cyan font-bold flex items-center space-x-1">
                  <span>Inspect Spec</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
                <span className="badge-model">MODEL ESTIMATE</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Detail Drawer with Explicit Separation: Input, Prediction, Explanation, Uncertainty */}
      {activeModelDetail && (
        <div className="bg-navy-800 border border-brand-primary/60 rounded-lg p-5 space-y-4 animate-in fade-in">
          {(() => {
            const m = models.find((item) => item.id === activeModelDetail)!;
            return (
              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <BrainCircuit className="w-4 h-4 text-brand-cyan" />
                      <span>{m.name} — {m.model}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Architecture Type: <span className="text-slate-200 font-mono">{m.modelType}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openProvenanceModal()}
                      className="px-2.5 py-1 rounded bg-navy-850 hover:bg-navy-750 text-slate-200 border border-surface-border text-xs flex items-center space-x-1 transition-colors"
                    >
                      <Database className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>VIEW DATA PROVENANCE</span>
                    </button>
                    <button onClick={() => setActiveModelDetail(null)} className="text-slate-400 hover:text-white p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* 1. INPUT */}
                  <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">1. INPUT FEATURES</span>
                      <span className="badge-live text-[9px]">INGESTION</span>
                    </div>
                    <span className="text-white font-bold block">{m.inputs}</span>
                    <p className="text-[11px] text-slate-300 font-sans">{m.inputFeatures}</p>
                  </div>

                  {/* 2. PREDICTION */}
                  <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">2. MODEL PREDICTION</span>
                      <span className="badge-model text-[9px]">NOWCAST</span>
                    </div>
                    <span className="text-brand-cyan font-bold block">{m.currentOutput}</span>
                    <p className="text-[11px] text-slate-300 font-sans">{m.prediction}</p>
                  </div>

                  {/* 3. EXPLANATION */}
                  <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">3. EXPLANATION</span>
                      <span className="badge-simulation text-[9px]">ATTRIBUTION</span>
                    </div>
                    <span className="text-amber-300 font-bold block">Physical Mechanism</span>
                    <p className="text-[11px] text-slate-300 font-sans">{m.explanation}</p>
                  </div>

                  {/* 4. UNCERTAINTY */}
                  <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">4. UNCERTAINTY BOUND</span>
                      <span className="badge-historical text-[9px]">ERROR BAND</span>
                    </div>
                    <span className="text-teal-400 font-bold block">{m.uncertainty}</span>
                    <p className="text-[11px] text-slate-400 font-sans">Validation: {m.accuracy}</p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center font-mono">
                  RIGOROUS OPERATIONAL SPECIFICATION · VERIFIED DATA LINEAGE · DATA PROVENANCE REGISTRY ACCESSIBLE
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Timeline Scrubber */}
      <TimelineScrubber currentMinutes={timelineMinutes} onChangeMinutes={(m) => setTimelineMinutes(m)} />

      {/* Section 10: Explainable AI Waterfall + Visual Model Feature Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExplainableAIWaterfall
            factors={explainableFactors}
            totalRiskPct={floodProbability}
            catchmentCode={currentMc.code}
          />
        </div>

        {/* Feature Input Indicators */}
        <div className="space-y-4">
          <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                FEATURE INPUT ATTRIBUTION
              </h3>
              <span className="badge-simulation">
                DEMO
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Rainfall Intensity</span>
                  <span className="text-red-400 font-bold">{rainfall} mm/h</span>
                </div>
                <div className="w-full bg-navy-850 h-2 rounded overflow-hidden border border-surface-border">
                  <div className="bg-red-500 h-full" style={{ width: `${Math.min(100, rainfall * 2)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Upstream Runoff Accumulation</span>
                  <span className="text-amber-400 font-bold">{runoff} m³/s</span>
                </div>
                <div className="w-full bg-navy-850 h-2 rounded overflow-hidden border border-surface-border">
                  <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, runoff * 5)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Terrain Elevation Baseline</span>
                  <span className="text-slate-300 font-bold">4.5m MSL (Low)</span>
                </div>
                <div className="w-full bg-navy-850 h-2 rounded overflow-hidden border border-surface-border">
                  <div className="bg-slate-500 h-full w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Impervious Surface Concrete</span>
                  <span className="text-slate-200 font-bold">72%</span>
                </div>
                <div className="w-full bg-navy-850 h-2 rounded overflow-hidden border border-surface-border">
                  <div className="bg-brand-primary h-full w-[72%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Drainage Sluice Bottleneck</span>
                  <span className="text-amber-400 font-bold">3.82m Stage</span>
                </div>
                <div className="w-full bg-navy-850 h-2 rounded overflow-hidden border border-surface-border">
                  <div className="bg-amber-500 h-full w-[78%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 text-[9px] text-slate-400 text-center font-mono">
              SIMULATED FEATURE CONTRIBUTION · DATA PROVENANCE AVAILABLE
            </div>
          </div>
        </div>
      </div>

      {/* Model Inputs Detailed Modal */}
      {showModelInputsModal && (
        <div className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-surface-border rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-brand-cyan" />
                <h3 className="font-bold text-sm text-white font-mono uppercase">
                  Active Model Ingestion Feeds & Parameters
                </h3>
              </div>
              <button onClick={() => setShowModelInputsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="bg-navy-850 p-3 rounded border border-surface-border flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Precipitation Radar Feed</span>
                  <span className="text-[11px] text-slate-400 font-sans">IMD Doppler Radar 500m radial reflectivity</span>
                </div>
                <span className="text-teal-400 font-bold">ONLINE ({rainfall} mm/h)</span>
              </div>

              <div className="bg-navy-850 p-3 rounded border border-surface-border flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Digital Elevation Model (DEM)</span>
                  <span className="text-[11px] text-slate-400 font-sans">ISRO Cartosat 30m resolution topographical grid</span>
                </div>
                <span className="text-slate-300 font-bold">STATIC BASELINE</span>
              </div>

              <div className="bg-navy-850 p-3 rounded border border-surface-border flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Canal Stage Sluice Telemetry</span>
                  <span className="text-[11px] text-slate-400 font-sans">Ultrasonic depth gauge #4 (Circular Canal lock gate)</span>
                </div>
                <span className="text-amber-400 font-bold">3.82m DEPTH</span>
              </div>

              <div className="bg-navy-850 p-3 rounded border border-surface-border flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Soil Saturation Index</span>
                  <span className="text-[11px] text-slate-400 font-sans">Ground moisture probe node 009 (Maniktala)</span>
                </div>
                <span className="text-brand-cyan font-bold">94.2% SATURATED</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModelInputsModal(false)}
                className="px-4 py-2 rounded bg-navy-850 hover:bg-navy-750 text-white font-semibold text-xs border border-surface-border transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

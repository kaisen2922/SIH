import React, { useState } from 'react';
import { BarChart3, Sliders, RefreshCw, CheckCircle2, History, ArrowRight, ShieldCheck } from 'lucide-react';
import { ExtentComparisonSlider } from '../components/analytics/ExtentComparisonSlider';

interface AnalyticsPageProps {
  onNavigate?: (tab: string, params?: any) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  const historicalEvents = [
    { year: '2019', event: 'Monsoon Cyclone Bulbul Inundation', rainfall: '142 mm', leadTime: '35 min', overlap: '84.2%', errorMargin: '15.8%' },
    { year: '2020', event: 'Super Cyclone Amphan Surge', rainfall: '210 mm', leadTime: '48 min', overlap: '89.5%', errorMargin: '10.5%' },
    { year: '2021', event: 'Cyclone Yaas Cloudburst', rainfall: '168 mm', leadTime: '42 min', overlap: '87.1%', errorMargin: '12.9%' },
    { year: '2022', event: 'July Monsoonal Flash Inundation', rainfall: '115 mm', leadTime: '38 min', overlap: '88.9%', errorMargin: '11.1%' },
    { year: '2023', event: 'September Convective Cloudburst', rainfall: '135 mm', leadTime: '40 min', overlap: '90.1%', errorMargin: '9.9%' },
    { year: '2024', event: 'Monsoon Depression Ward 17 Overflow', rainfall: '158 mm', leadTime: '42 min', overlap: '91.2%', errorMargin: '8.8%' },
    { year: '2025', event: 'Pre-Monsoon Squall Surge', rainfall: '98 mm', leadTime: '45 min', overlap: '92.4%', errorMargin: '7.6%' },
  ];

  const currentEvent = historicalEvents.find((e) => e.year === selectedYear) || historicalEvents[5];

  // Requirement 13: Exact 7-step model feedback loop
  const feedbackWorkflow = [
    { step: 'PREDICT', desc: 'Hydro nowcast generated via kinematic wave solver' },
    { step: 'EVENT', desc: 'Monsoon rainfall surge observed in target basin' },
    { step: 'OBSERVATION', desc: 'Sentinel-1 SAR satellite overpass + IoT sensor telemetry' },
    { step: 'COMPARE', desc: 'Spatial polygon intersection (IoU) & lead-time overlay' },
    { step: 'ERROR ANALYSIS', desc: 'Residual boundary deviation & false positive analysis' },
    { step: 'RETRAIN', desc: 'Manning roughness n & infiltration coefficient calibration' },
    { step: 'NEW MODEL', desc: 'Calibrated model version deployed to active inference' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 p-5 rounded-lg border border-surface-border shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-brand-cyan" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              Ground-Truth Evaluation & Post-Event Learning
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            Model Performance Evaluation & Feedback Loop
          </h1>
          <p className="text-xs text-slate-400">
            Validates predicted inundation polygons against actual Sentinel-1 SAR satellite observations to calibrate hydrodynamic models.
          </p>
        </div>
      </div>

      {/* Requirement 13: 7-Stage Continuous Model Learning Workflow */}
      <div className="bg-navy-900 border border-surface-border rounded-lg p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              CONTINUOUS MODEL LEARNING & RETRAINING WORKFLOW
            </h2>
          </div>
          <span className="badge-historical">
            HISTORICAL EVALUATION
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-mono">
          {feedbackWorkflow.map((item, idx) => (
            <div key={idx} className="bg-navy-950 p-2.5 rounded border border-surface-border space-y-1">
              <span className="text-[9px] text-slate-500 font-bold block">{idx + 1}</span>
              <span className="font-bold text-brand-cyan block text-[11px]">{item.step}</span>
              <p className="text-[10px] text-slate-400 font-sans leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 18: Historical Flood Event Selector */}
      <div className="bg-navy-900 border border-surface-border rounded-lg p-4 space-y-3 font-mono shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase">
            <History className="w-4 h-4 text-amber-400" />
            <span>Select Monsoonal Inundation Event (14 Past Events Recorded):</span>
          </div>
          <span className="badge-historical">HISTORICAL ARCHIVE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {historicalEvents.map((evt) => {
            const isSelected = selectedYear === evt.year;
            return (
              <button
                key={evt.year}
                onClick={() => setSelectedYear(evt.year)}
                className={`p-2.5 rounded border text-center transition-all ${
                  isSelected
                    ? 'bg-brand-primary text-white font-bold border-brand-primary shadow-sm'
                    : 'bg-navy-950 border-surface-border text-slate-300 hover:bg-navy-850'
                }`}
              >
                <span className="block text-xs font-bold">{evt.year}</span>
                <span className="text-[10px] block text-brand-cyan">{evt.overlap} Overlap</span>
              </button>
            );
          })}
        </div>

        {/* Selected Event Details Table */}
        <div className="bg-navy-950 p-4 rounded border border-surface-border grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Event Name</span>
            <span className="font-bold text-white text-sm">{currentEvent.event}</span>
            <span className="text-slate-400 block text-[11px] font-sans">Precipitation: {currentEvent.rainfall}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Lead Time Provided</span>
            <span className="text-emerald-400 font-bold text-sm">{currentEvent.leadTime}</span>
            <span className="text-slate-400 block text-[11px]">Before peak surface ponding</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Spatial Extent Overlap</span>
            <span className="text-brand-cyan font-bold text-sm">{currentEvent.overlap}</span>
            <span className="text-slate-400 block text-[11px]">IoU with Sentinel-1 SAR</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Residual Error Margin</span>
            <span className="text-amber-300 font-bold text-sm">{currentEvent.errorMargin}</span>
            <span className="text-slate-400 block text-[11px]">Divergence along canal edges</span>
          </div>
        </div>
      </div>

      {/* Interactive Predicted vs Observed Map Comparison Slider */}
      <ExtentComparisonSlider />

      {/* Requirement 13: Separate Predicted, Observed, Error, and Model Update */}
      <div className="bg-navy-900 border border-surface-border rounded-lg p-5 space-y-4 shadow-lg font-mono">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <h2 className="font-bold text-sm text-white uppercase tracking-wider">
              GROUND-TRUTH VS MODEL COMPARISON & CALIBRATION BREAKDOWN
            </h2>
          </div>
          <span className="text-[10px] text-slate-400">
            EVENT: {currentEvent.event} ({currentEvent.year})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: PREDICTED */}
          <div className="bg-navy-950 p-4 rounded-lg border border-surface-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brand-cyan uppercase">1. PREDICTED</span>
              <span className="badge-estimate">MODEL ESTIMATE</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Inundation Area:</span>
                <span className="font-bold text-white">1.42 km²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Water Depth:</span>
                <span className="font-bold text-amber-300">0.62 m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Modelled Lead Time:</span>
                <span className="font-bold text-white">{currentEvent.leadTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Basin Runoff:</span>
                <span className="font-bold text-white">14.8 m³/s</span>
              </div>
            </div>
          </div>

          {/* Card 2: OBSERVED */}
          <div className="bg-navy-950 p-4 rounded-lg border border-surface-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase">2. OBSERVED</span>
              <span className="badge-live">LIVE / SAR TRUTH</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Sentinel-1 SAR Extent:</span>
                <span className="font-bold text-emerald-400">1.34 km²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IoT Ultrasonic Gauge:</span>
                <span className="font-bold text-emerald-400">0.58 m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Actual Lead Time:</span>
                <span className="font-bold text-white">38 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Canal High Watermark:</span>
                <span className="font-bold text-white">3.82 m MSL</span>
              </div>
            </div>
          </div>

          {/* Card 3: ERROR */}
          <div className="bg-navy-950 p-4 rounded-lg border border-surface-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase">3. ERROR</span>
              <span className="badge-simulation">ANALYSIS</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Spatial IoU Overlap:</span>
                <span className="font-bold text-brand-cyan">{currentEvent.overlap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Residual Margin Error:</span>
                <span className="font-bold text-amber-400">{currentEvent.errorMargin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lead Time Delta:</span>
                <span className="font-bold text-white">+4 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Edge Variance Bias:</span>
                <span className="font-bold text-slate-300">+0.08 km²</span>
              </div>
            </div>
          </div>

          {/* Card 4: MODEL UPDATE */}
          <div className="bg-navy-950 p-4 rounded-lg border border-surface-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-300 uppercase">4. MODEL UPDATE</span>
              <span className="badge-verified">RETRAINED</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Roughness Manning n:</span>
                <span className="font-bold text-teal-300">0.035 → 0.038</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Boundary Drift Gain:</span>
                <span className="font-bold text-teal-300">-6.2% error</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Calibrated Checkpoint:</span>
                <span className="font-bold text-white">v2.4.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deployment Status:</span>
                <span className="font-bold text-emerald-400">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

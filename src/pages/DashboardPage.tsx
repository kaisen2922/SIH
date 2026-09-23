import React, { useState } from 'react';
import {
  ShieldAlert,
  Bell,
  Waves,
  FileCheck2,
  AlertTriangle,
  Clock,
  Activity,
  ChevronRight,
  Navigation,
  HelpCircle,
  Building2,
  CheckCircle2,
  Eye,
  ArrowRight,
  MapPin,
  Droplets,
  Users,
} from 'lucide-react';
import { MicroCatchment, AlertItem, CitizenReport } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { useIncident } from '../context/IncidentContext';

interface DashboardPageProps {
  catchments: MicroCatchment[];
  alerts: AlertItem[];
  reports: CitizenReport[];
  onNavigate: (tab: string, params?: any) => void;
  onSelectCatchment: (catchment: MicroCatchment) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectCatchment,
}) => {
  const {
    incidentId,
    ward,
    status,
    rainfall,
    floodProbability,
    estimatedOnset,
    runoff,
    affectedPopulation,
    catchments,
    alerts,
    reports,
    infrastructure,
    selectedCatchment,
    timelineMinutes,
    setTimelineMinutes,
    selectCatchment,
    selectAsset,
  } = useIncident();

  const [isWhyExpanded, setIsWhyExpanded] = useState(true);

  const targetMc = selectedCatchment || catchments.find((c) => c.code === 'MC-042') || catchments[0];
  const criticalCatchments = catchments.filter((c) => c.riskLevel === 'CRITICAL' || c.riskLevel === 'HIGH');

  // Timeline scrubber definitions
  const timelineSteps = [
    { minutes: 0, label: 'NOW', rainfall: 14, prob: 22, onset: '~110 min', risk: 'LOW' as const },
    { minutes: 15, label: '+15 MIN', rainfall: 28, prob: 48, onset: '~75 min', risk: 'MODERATE' as const },
    { minutes: 30, label: '+30 MIN', rainfall: 34, prob: 76, onset: '~55 min', risk: 'HIGH' as const },
    { minutes: 45, label: '+45 MIN', rainfall: 38, prob: 91, onset: '~40 min', risk: 'CRITICAL' as const },
    { minutes: 60, label: '+60 MIN', rainfall: 42, prob: 94, onset: '~35 min', risk: 'CRITICAL' as const },
    { minutes: 90, label: '+90 MIN', rainfall: 24, prob: 68, onset: '~65 min', risk: 'MODERATE' as const },
  ];

  // AI Response Recommendations (Section 4)
  const recommendations = [
    {
      id: 'rec-1',
      priority: 'PRIORITY 1',
      title: 'Inspect Circular Canal Lock Gate #4 Sluice',
      reason: 'Canal depth 3.82m (85% saturation); upstream runoff 14.8 m³/s creates hydraulic backwater bottleneck.',
      estimatedTime: 'Immediate (within 10 min)',
      badge: 'CRITICAL',
      targetAssetId: 'sns-01',
      actionType: 'field',
    },
    {
      id: 'rec-2',
      priority: 'PRIORITY 2',
      title: 'Prepare SSKM Hospital Emergency Access Corridor',
      reason: 'Ambulance ingress at Gate 3 threatened by low curb ponding; initiate trash screen clearance.',
      estimatedTime: 'Within 20 min',
      badge: 'HIGH',
      targetAssetId: 'inf-01',
      actionType: 'infrastructure',
    },
    {
      id: 'rec-3',
      priority: 'PRIORITY 3',
      title: 'Prepare Ward 17 Multi-Channel Emergency Warning',
      reason: 'Model estimates 91% inundation probability within ~40 min onset. High population exposure.',
      estimatedTime: 'Within 15 min',
      badge: 'CRITICAL',
      targetAssetId: null,
      actionType: 'alerts',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Section: Operational Situation Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-navy-800 p-5 rounded-lg border border-surface-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              INCIDENT COMMAND CENTER · OPERATIONAL SITUATION
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase bg-navy-950 px-2 py-0.5 rounded border border-surface-border">
              DEMO INCIDENT #{incidentId}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 font-mono">
            {targetMc.code} · Ward {targetMc.ward} — {targetMc.name}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Kolkata Metro Basin · Status: <span className="text-red-400 font-bold uppercase">{status}</span> · Heavy convective rainfall surge active across northern micro-catchments.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigate('map')}
            className="px-4 py-2.5 rounded bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Launch Live Flood Map</span>
          </button>
          <button
            onClick={() => onNavigate('alerts')}
            className="px-4 py-2.5 rounded bg-red-950/80 border border-red-800/60 text-red-300 hover:bg-red-900 font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Broadcast Warning</span>
          </button>
        </div>
      </div>

      {/* Primary 4 Operational Answers: WHERE, WHEN, HOW BAD, WHAT IS AFFECTED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* WHERE? Target Basin */}
        <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-brand-cyan" />
              <span>WHERE? (PRIMARY BASIN)</span>
            </span>
            <span className="badge-live">
              LIVE / GEO
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-mono font-extrabold text-white">{targetMc.code}</span>
            <span className="text-xs text-brand-cyan font-bold font-mono">Ward {targetMc.ward}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Circular Canal Lowland Basin · Elev 4.5m MSL</p>
        </div>

        {/* WHEN? Estimated Onset */}
        <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center space-x-1">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>WHEN? (ESTIMATED ONSET)</span>
            </span>
            <span className="badge-model">
              MODEL ESTIMATE
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-white">~{estimatedOnset} MIN</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Lead time window for preventative deployment</p>
        </div>

        {/* HOW BAD? Flood Probability */}
        <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold text-red-400 flex items-center space-x-1">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>HOW BAD? (PROBABILITY)</span>
            </span>
            <span className="badge-model">
              MODEL ESTIMATE
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-red-400">{floodProbability}%</span>
            <span className="text-xs text-red-400 font-bold font-mono uppercase tracking-wider">CRITICAL RISK</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{rainfall} mm/h rain · {runoff} m³/s kinematic runoff</p>
        </div>

        {/* WHAT IS AFFECTED? Affected Population & Infrastructure */}
        <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center space-x-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span>WHAT IS AFFECTED?</span>
            </span>
            <span className="badge-demo">
              DEMO / CENSUS
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-white">{affectedPopulation.toLocaleString()}</span>
            <span className="text-xs text-slate-300 font-mono">Residents</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">1 Hospital · 4 Arterial Roads · 1 Substation</p>
        </div>
      </div>

      {/* Hydraulic Timeline Horizon Scrubber (Section 4 & 5) */}
      <div className="bg-navy-800 border border-surface-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Hydraulic Timeline Horizon Scrubber (Explore Model Progression)
            </h3>
          </div>
          <span className="badge-simulation">
            SIMULATION / MODEL ESTIMATE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {timelineSteps.map((step) => {
            const isActive = timelineMinutes === step.minutes;
            return (
              <button
                key={step.minutes}
                onClick={() => setTimelineMinutes(step.minutes)}
                className={`p-2.5 rounded border text-left transition-all ${
                  isActive
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-navy-850 border-surface-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">{step.label}</span>
                  <RiskBadge level={step.risk} showDot={false} />
                </div>
                <div className="mt-1 flex justify-between text-[11px] font-mono">
                  <span className="text-brand-cyan">{step.rainfall} mm/h</span>
                  <span className="text-amber-400 font-bold">{step.prob}% Prob</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Onset: {step.onset}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* WHAT SHOULD WE DO? Prioritized AI Response Recommendations (Section 4) */}
      <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-brand-cyan" />
            <h2 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
              WHAT SHOULD WE DO? — AI RESPONSE RECOMMENDATIONS
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-navy-950 px-2 py-0.5 rounded border border-surface-border">
            DECISION SUPPORT RANKING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-navy-850 border border-surface-border rounded-lg p-4 space-y-3 flex flex-col justify-between hover:border-slate-600 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="badge-critical">
                      {rec.priority}
                    </span>
                    <span className="badge-simulation">
                      MODEL / SIMULATION
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    {rec.estimatedTime}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white font-sans">{rec.title}</h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{rec.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border">
                <button
                  onClick={() => {
                    selectCatchment(targetMc);
                    onNavigate('map');
                  }}
                  className="px-2.5 py-1.5 rounded bg-navy-800 hover:bg-navy-750 text-brand-cyan border border-surface-border text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>VIEW ON MAP</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate(rec.actionType);
                  }}
                  className="px-2.5 py-1.5 rounded bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>REVIEW ACTION</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Infrastructure Summary Row (Section 4) */}
      <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <h2 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
              CRITICAL INFRASTRUCTURE AT RISK (WARD 17 & PERIPHERY)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('infrastructure')}
            className="text-xs font-mono text-brand-cyan hover:underline flex items-center space-x-1"
          >
            <span>View Full Asset Inventory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono">
          <div
            onClick={() => onNavigate('infrastructure')}
            className="bg-navy-850 p-3 rounded border border-surface-border hover:border-slate-500 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-xl">🏥</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Hospitals</span>
            <span className="text-lg font-bold text-red-400">1 (SSKM)</span>
            <span className="text-[9px] text-red-400 font-semibold block">AT RISK</span>
          </div>

          <div
            onClick={() => onNavigate('infrastructure')}
            className="bg-navy-850 p-3 rounded border border-surface-border hover:border-slate-500 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-xl">🛣️</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Roads</span>
            <span className="text-lg font-bold text-amber-400">4 Arterials</span>
            <span className="text-[9px] text-amber-400 font-semibold block">1 Inundated</span>
          </div>

          <div
            onClick={() => onNavigate('infrastructure')}
            className="bg-navy-850 p-3 rounded border border-surface-border hover:border-slate-500 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-xl">🚇</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Metro Access</span>
            <span className="text-lg font-bold text-white">1 Station</span>
            <span className="text-[9px] text-emerald-400 font-semibold block">Monitored Safe</span>
          </div>

          <div
            onClick={() => onNavigate('infrastructure')}
            className="bg-navy-850 p-3 rounded border border-surface-border hover:border-slate-500 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-xl">🏫</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Schools</span>
            <span className="text-lg font-bold text-white">2 Shelters</span>
            <span className="text-[9px] text-slate-400 block">Identified</span>
          </div>

          <div
            onClick={() => onNavigate('infrastructure')}
            className="bg-navy-850 p-3 rounded border border-surface-border hover:border-slate-500 cursor-pointer transition-colors space-y-1"
          >
            <span className="text-xl">⚡</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Power Substation</span>
            <span className="text-lg font-bold text-amber-400">#12 Grid</span>
            <span className="text-[9px] text-amber-400 font-semibold block">AT RISK</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Critical Risk Zones Threat Matrix + Explainable AI Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Highest-Risk Catchments Threat Matrix (2 cols wide) */}
        <div className="lg:col-span-2 bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-red-400" />
              <h2 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                CRITICAL RISK ZONES (HIGHEST-RISK CATCHMENTS)
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catchments')}
              className="text-xs text-brand-cyan hover:underline font-mono flex items-center space-x-1"
            >
              <span>Catchments & Flow</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-850 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Code / Name</th>
                  <th className="p-2.5">Ward</th>
                  <th className="p-2.5">Rainfall</th>
                  <th className="p-2.5">Runoff</th>
                  <th className="p-2.5">Flood Prob</th>
                  <th className="p-2.5">Time to Flood</th>
                  <th className="p-2.5">Risk Level</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border font-mono">
                {criticalCatchments.map((mc) => (
                  <tr key={mc.id} className="hover:bg-navy-750 transition-colors">
                    <td className="p-2.5 font-bold text-white">
                      <div>{mc.code}</div>
                      <span className="text-[10px] text-slate-400 font-normal font-sans">{mc.name}</span>
                    </td>
                    <td className="p-2.5 text-slate-300">Ward {mc.ward}</td>
                    <td className="p-2.5 text-brand-cyan font-bold">{mc.currentRainfallMm} mm/h</td>
                    <td className="p-2.5 text-slate-300">{mc.runoffEstimateM3s} m³/s</td>
                    <td className="p-2.5 text-red-400 font-bold">{mc.floodProbabilityPct}%</td>
                    <td className="p-2.5 text-amber-400 font-bold">~{mc.timeToFloodMin} min</td>
                    <td className="p-2.5">
                      <RiskBadge level={mc.riskLevel} />
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => {
                          selectCatchment(mc);
                          onNavigate('map');
                        }}
                        className="px-2.5 py-1 rounded bg-navy-850 hover:bg-navy-750 text-brand-cyan border border-surface-border text-[11px] font-semibold transition-colors"
                      >
                        Inspect GIS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Explainable AI Summary Box */}
        <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-brand-cyan" />
                <h3 className="font-bold text-sm text-white">Why is {targetMc.code} at Critical Risk?</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono bg-navy-850 p-3.5 rounded border border-surface-border">
              <div className="flex justify-between">
                <span className="text-slate-400">Rainfall Intensity:</span>
                <span className="text-red-400 font-bold">High ({targetMc.currentRainfallMm} mm/h)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Upstream Runoff:</span>
                <span className="text-amber-400 font-bold">High ({targetMc.runoffEstimateM3s} m³/s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Elevation:</span>
                <span className="text-red-400 font-bold">Low ({targetMc.elevationM}m MSL)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Impervious Surface:</span>
                <span className="text-slate-200 font-bold">{targetMc.imperviousSurfacePct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Drainage Capacity:</span>
                <span className="text-amber-400 font-bold">{targetMc.drainageCapacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Historical Frequency:</span>
                <span className="text-red-400 font-bold">High ({targetMc.historicalFloodCount} past events)</span>
              </div>

              <div className="pt-2 border-t border-surface-border flex justify-between items-center text-xs">
                <span className="font-bold text-white font-sans">Combined Flood Probability:</span>
                <span className="font-bold text-red-400 text-sm">{targetMc.floodProbabilityPct}%</span>
              </div>

              <div className="pt-1 text-[9px] text-slate-400 text-center font-mono">
                SIMULATED FEATURE CONTRIBUTION
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('predictions')}
            className="w-full mt-4 bg-brand-primary hover:bg-brand-hover text-white font-bold py-2 rounded text-xs flex items-center justify-center space-x-1 transition-colors"
          >
            <span>Explain AI Risk Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

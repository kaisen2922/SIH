import React, { useState } from 'react';
import { Radio, Database, ShieldCheck, Activity, RefreshCw, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DataSourcePipeline } from '../types';
import { useIncident } from '../context/IncidentContext';

interface DataSourcesPageProps {
  pipelines?: DataSourcePipeline[];
}

export const DataSourcesPage: React.FC<DataSourcesPageProps> = () => {
  const { pipelines, openProvenanceModal } = useIncident();

  // Simulation state for pipeline failure & fallback demonstration (Section 19)
  const [isRadarDegraded, setIsRadarDegraded] = useState(false);

  const toggleRadarSimulation = () => {
    setIsRadarDegraded(!isRadarDegraded);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 p-5 rounded-lg border border-surface-border shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-brand-cyan" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              Telemetry Ingestion Pipelines & Sensor Health
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            IoT Telemetry Grid & Geospatial Pipeline Health
          </h1>
          <p className="text-xs text-slate-400">
            Monitors ingestion integrity from IMD Doppler radar, ISRO DEM, Sentinel-1 SAR imagery, and ultrasonic canal depth gauges.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openProvenanceModal()}
            className="px-3.5 py-2 rounded bg-navy-800 hover:bg-navy-750 text-slate-200 border border-surface-border text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-brand-cyan" />
            <span>DATA PROVENANCE REGISTRY</span>
          </button>

          <button
            onClick={toggleRadarSimulation}
            className={`px-3.5 py-2 rounded text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors border ${
              isRadarDegraded
                ? 'bg-amber-950/70 text-amber-300 border-amber-600/60'
                : 'bg-navy-800 text-slate-300 border-surface-border hover:bg-navy-750'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRadarDegraded ? 'Simulating Radar Degradation (ACTIVE)' : 'Simulate Radar Degradation'}</span>
          </button>
        </div>
      </div>

      {/* Fallback Source Demonstration Banner (Section 19) */}
      {isRadarDegraded && (
        <div className="bg-amber-950/70 border border-amber-500/70 rounded-lg p-4 space-y-2 animate-in fade-in shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-300 font-mono font-bold text-xs uppercase">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>PRIMARY SENSOR DEGRADED — AUTOMATIC FALLBACK ENGAGED</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-navy-950 px-2 py-0.5 rounded border border-amber-600/50 uppercase font-bold">
              FALLBACK ROUTING ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono pt-1 text-slate-200">
            <div className="bg-navy-950 p-2.5 rounded border border-surface-border">
              <span className="text-slate-400 text-[10px] block">Primary Ingestion:</span>
              <span className="text-red-400 font-bold">IMD Doppler Radar (DEGRADED - High Latency)</span>
            </div>
            <div className="bg-navy-950 p-2.5 rounded border border-surface-border">
              <span className="text-slate-400 text-[10px] block">Automatic Fallback Source:</span>
              <span className="text-emerald-400 font-bold">NCMRWF WRF-Hydro Numerical Model + AWS Gauges</span>
            </div>
            <div className="bg-navy-950 p-2.5 rounded border border-surface-border">
              <span className="text-slate-400 text-[10px] block">Operational Impact:</span>
              <span className="text-amber-300 font-bold">Nowcasting operational with ±12% variance band</span>
            </div>
          </div>
        </div>
      )}

      {/* Pipelines Table with Health States (Section 19) */}
      <div className="bg-navy-900 border border-surface-border rounded-lg p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h2 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
            Connected Telemetry Pipelines & Ingestion Health
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {isRadarDegraded ? '6/7 ONLINE · 1 DEGRADED (FALLBACK ACTIVE)' : '7/7 ALL PIPELINES OPERATIONAL'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Pipeline & Provider</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Last Update</th>
                <th className="p-2.5">Latency</th>
                <th className="p-2.5">Data Freshness</th>
                <th className="p-2.5">Designated Fallback</th>
                <th className="p-2.5 text-right">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {pipelines.map((pip) => {
                const isDegradedItem = pip.id === 'pip-01' && isRadarDegraded;
                const statusState = isDegradedItem ? 'DEGRADED' : pip.status;

                return (
                  <tr key={pip.id} className="hover:bg-navy-850 transition-colors">
                    <td className="p-2.5 font-bold text-white max-w-xs">
                      <div>{pip.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal font-sans">
                        {pip.provider} {isDegradedItem && '• (Switched to Numerical Fallback)'}
                      </span>
                    </td>
                    <td className="p-2.5 uppercase text-slate-300">
                      <span className="bg-navy-950 px-2 py-0.5 rounded border border-surface-border font-bold text-[10px] text-brand-cyan">
                        {pip.category}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          statusState === 'ONLINE'
                            ? 'badge-live'
                            : statusState === 'DELAYED'
                            ? 'badge-simulation'
                            : statusState === 'DEGRADED'
                            ? 'badge-critical'
                            : 'badge-historical'
                        }`}
                      >
                        {statusState}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-300">{isDegradedItem ? '14 mins ago' : pip.lastUpdated}</td>
                    <td className="p-2.5 text-brand-cyan font-bold">{isDegradedItem ? '4800 ms' : `${pip.latencyMs} ms`}</td>
                    <td className="p-2.5 text-slate-300">
                      {isDegradedItem ? 'Sub-optimal' : pip.dataFreshness || '15 sec telemetry'}
                    </td>
                    <td className="p-2.5 max-w-xs">
                      <span className="text-[11px] text-slate-400 font-sans block leading-tight">
                        {pip.fallback || 'Empirical lookup baseline'}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-bold text-teal-400">
                      {isDegradedItem ? '68%' : `${pip.qualityScorePct}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

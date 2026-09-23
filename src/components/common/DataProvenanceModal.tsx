import React from 'react';
import { Database, X, ShieldCheck, CheckCircle2, Clock, Layers, FileText } from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';

interface ProvenanceEntry {
  layer: string;
  source: string;
  provider: string;
  lastUpdated: string;
  resolution: string;
  processing: string;
  modelVersion: string;
  status: 'LIVE' | 'STATIC' | 'HISTORICAL' | 'DEMO / SIMULATION';
}

const DEFAULT_PROVENANCE_ENTRIES: ProvenanceEntry[] = [
  {
    layer: 'Precipitation Nowcast & Rainfall Radar',
    source: 'Doppler Weather Radar (Kolkata S-Band Radar Node)',
    provider: 'India Meteorological Department (IMD) / MOSDAC',
    lastUpdated: '12:35 PM (10-min interval)',
    resolution: '500m radial grid / 1-min sweeps',
    processing: 'Reflectivity (Z-R) kinematic extrapolation with optical flow',
    modelVersion: 'v2.4-PINN-Ensemble',
    status: 'DEMO / SIMULATION',
  },
  {
    layer: 'Topographical Elevation & Basin Delineation',
    source: 'Cartosat-1 / SRTM High-Precision Digital Elevation Model',
    provider: 'ISRO National Remote Sensing Centre (NRSC)',
    lastUpdated: 'Static Hydrography Baseline 2024',
    resolution: '30m post-processed raster DEM',
    processing: 'Hydrological depression sink filling & D8 flow accumulation routing',
    modelVersion: 'Hydro-DEM-v1.8',
    status: 'STATIC',
  },
  {
    layer: 'Historical Monsoon Flood Events',
    source: 'Municipal Waterlogging & Disaster Inundation Registry (2018–2025)',
    provider: 'Kolkata Municipal Corporation (KMC) Disaster Management Cell',
    lastUpdated: 'Monsoon 2025 Review',
    resolution: 'Ward & Micro-Catchment Spatial Boundaries',
    processing: 'Empirical return-period frequency analysis (14 historical events)',
    modelVersion: 'KMC-HistFlood-DB-v3',
    status: 'HISTORICAL',
  },
  {
    layer: 'Canal Ultrasonic Sluice & Water Level Telemetry',
    source: 'IoT Canal Ultrasonic Depth Transducers & Level Gauges',
    provider: 'KMC Smart City IoT Telemetry Network',
    lastUpdated: 'Live Telemetry (15 sec interval)',
    resolution: 'Single-point gauge node (Circular Canal Lock Gate #4)',
    processing: 'Spike rejection filter & kalman rate-of-rise trend estimation',
    modelVersion: 'IoT-Firmware-4.1.2',
    status: 'DEMO / SIMULATION',
  },
  {
    layer: 'Critical Assets & Road Inundation Graph',
    source: 'OpenStreetMap Urban Spatial Graph + Municipal Asset Database',
    provider: 'OpenStreetMap Foundation & KMC Health/Works Dept',
    lastUpdated: '24 hours ago',
    resolution: '1:1000 vector centerline roads & building polygons',
    processing: 'Shortest-path Dijkstra modified with dynamic water-depth risk penalties',
    modelVersion: 'OSM-Graph-v2026.04',
    status: 'STATIC',
  },
];

export const DataProvenanceModal: React.FC = () => {
  const { isProvenanceModalOpen, closeProvenanceModal, provenanceData } = useIncident();

  if (!isProvenanceModalOpen) return null;

  const entries = provenanceData?.entries || DEFAULT_PROVENANCE_ENTRIES;
  const title = provenanceData?.title || 'Data Lineage & Algorithmic Provenance Registry';

  return (
    <div className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-surface-border rounded-lg max-w-4xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-brand-blue/20 border border-brand-blue/50 flex items-center justify-center">
              <Database className="w-5 h-5 text-brand-cyan" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white font-mono tracking-tight">{title}</h3>
              <p className="text-xs text-slate-400">
                Transparent data audit showing ingestion source, resolution, processing pipeline, and verification state.
              </p>
            </div>
          </div>
          <button
            onClick={closeProvenanceModal}
            className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operational Notice */}
        <div className="bg-navy-950 p-3.5 rounded border border-surface-border text-xs text-slate-300 font-mono space-y-1">
          <div className="flex items-center space-x-2 text-brand-cyan font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>OPERATIONAL TRANSPARENCY NOTICE</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            In accordance with government disaster intelligence standards, all predictive metrics and radar telemetry
            are tagged with strict data provenance indicators to prevent unverified data from being misrepresented as live sensor readings.
          </p>
        </div>

        {/* Provenance Table */}
        <div className="space-y-3">
          {entries.map((item: ProvenanceEntry, idx: number) => (
            <div
              key={idx}
              className="bg-navy-950 border border-surface-border rounded-lg p-4 space-y-2 hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-850 pb-2">
                <span className="font-mono font-bold text-xs text-white flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                  <span>{item.layer}</span>
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    item.status === 'LIVE'
                      ? 'badge-live'
                      : item.status === 'STATIC'
                      ? 'badge-estimate'
                      : item.status === 'HISTORICAL'
                      ? 'badge-historical'
                      : 'badge-simulation'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono pt-1 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Data Source:</span>
                  <span className="text-white font-medium">{item.source}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Data Provider:</span>
                  <span className="text-slate-200">{item.provider}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Last Updated:</span>
                  <span className="text-amber-300 font-bold">{item.lastUpdated}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Spatial / Temporal Resolution:</span>
                  <span className="text-slate-200">{item.resolution}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Processing Pipeline:</span>
                  <span className="text-sky-300 font-sans text-[11px]">{item.processing}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Model / Schema Version:</span>
                  <span className="text-emerald-400 font-bold">{item.modelVersion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-surface-border">
          <button
            onClick={closeProvenanceModal}
            className="px-5 py-2 rounded bg-navy-800 hover:bg-navy-750 text-white font-semibold text-xs border border-surface-border transition-colors"
          >
            Close Provenance View
          </button>
        </div>
      </div>
    </div>
  );
};

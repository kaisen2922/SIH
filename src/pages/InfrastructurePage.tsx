import React, { useState } from 'react';
import { Building2, AlertTriangle, Users, Navigation, HeartPulse, Bus, Zap, School, ChevronRight, Eye } from 'lucide-react';
import { InfrastructureAsset } from '../types';
import { AssetDetailsModal } from '../components/common/AssetDetailsModal';
import { useIncident } from '../context/IncidentContext';

interface InfrastructurePageProps {
  infrastructure: InfrastructureAsset[];
  onNavigate: (tab: string, params?: any) => void;
  onOpenAlertModal?: (prefill?: any) => void;
}

export const InfrastructurePage: React.FC<InfrastructurePageProps> = ({
  onNavigate,
  onOpenAlertModal,
}) => {
  const { infrastructure, selectAsset, selectedAsset, affectedPopulation } = useIncident();
  const [activeAsset, setActiveAsset] = useState<InfrastructureAsset | null>(selectedAsset || null);

  const inundatedCount = infrastructure.filter((a) => a.floodedStatus === 'INUNDATED').length;
  const atRiskCount = infrastructure.filter((a) => a.floodedStatus === 'AT_RISK').length;

  const handleAssetClick = (asset: InfrastructureAsset) => {
    setActiveAsset(asset);
    selectAsset(asset);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 p-5 rounded-lg border border-surface-border">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-brand-cyan" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              Critical Infrastructure Vulnerability & Impact Analysis
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            Lifeline Asset Inundation & Exposure Matrix
          </h1>
          <p className="text-xs text-slate-400">
            Click any critical asset row below to inspect its flood probability, estimated onset time, and launch response actions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('routes')}
            className="px-4 py-2 rounded bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Generate Safe Route</span>
          </button>
        </div>
      </div>

      {/* Potential Impact Summary Grid (Section 12) */}
      <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
              POTENTIAL IMPACT SUMMARY
            </h2>
          </div>

          <div className="flex items-center space-x-2 font-mono">
            <span className="text-xs text-slate-400">RESPONSE PRIORITY:</span>
            <span className="badge-critical">
              CRITICAL
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono">
          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-xl">🏥</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Hospitals</span>
            <span className="text-lg font-bold text-red-400">1</span>
            <span className="text-[9px] text-red-400 font-semibold block">SSKM At Risk</span>
          </div>

          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-xl">🛣️</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Roads</span>
            <span className="text-lg font-bold text-amber-400">4 Arterials</span>
            <span className="text-[9px] text-red-400 font-semibold block">1 Inundated</span>
          </div>

          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-xl">🚇</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Metro / Rail</span>
            <span className="text-lg font-bold text-white">1</span>
            <span className="text-[9px] text-emerald-400 font-semibold block">Monitored Safe</span>
          </div>

          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-xl">🏫</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Schools</span>
            <span className="text-lg font-bold text-white">2</span>
            <span className="text-[9px] text-slate-400 block">Designated Shelters</span>
          </div>

          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-xl">👥</span>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Affected Population</span>
            <span className="text-lg font-bold text-amber-400">{affectedPopulation.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 block">Ward 17 & Basin</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono text-center">
          MODEL ESTIMATE / DEMO SPATIAL EXPOSURE DATA
        </div>
      </div>

      {/* Interactive Asset Inventory Table (Section 12) */}
      <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div>
            <h2 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              Critical Assets Inventory (Click any asset to inspect)
            </h2>
            <span className="text-xs text-slate-400">Total Monitored: {infrastructure.length}</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            <span className="text-red-400 font-bold">{inundatedCount} Inundated</span> ·{' '}
            <span className="text-amber-400 font-bold">{atRiskCount} At Risk</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Asset Name & Address</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Ward</th>
                <th className="p-2.5">Vulnerability</th>
                <th className="p-2.5">Affected Population</th>
                <th className="p-2.5">Inundation Status</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {infrastructure.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => handleAssetClick(asset)}
                  className="hover:bg-navy-750 cursor-pointer transition-colors group"
                >
                  <td className="p-2.5 font-bold text-white">
                    <div className="group-hover:text-brand-cyan transition-colors">{asset.name}</div>
                    <span className="text-[10px] text-slate-400 font-normal font-sans">{asset.address}</span>
                  </td>
                  <td className="p-2.5 uppercase text-slate-300">
                    <span className="bg-navy-850 px-2 py-0.5 rounded border border-surface-border">{asset.category}</span>
                  </td>
                  <td className="p-2.5 text-slate-300">Ward {asset.ward}</td>
                  <td className="p-2.5 font-bold text-red-400">{asset.vulnerabilityScore} / 100</td>
                  <td className="p-2.5 text-slate-200">{asset.populationImpact.toLocaleString()}</td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        asset.floodedStatus === 'INUNDATED'
                          ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                          : asset.floodedStatus === 'AT_RISK'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {asset.floodedStatus}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssetClick(asset);
                      }}
                      className="px-2.5 py-1 rounded bg-navy-850 hover:bg-navy-750 text-brand-cyan border border-surface-border text-[11px] font-semibold flex items-center space-x-1 ml-auto transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Details Interactive Modal */}
      <AssetDetailsModal
        asset={activeAsset}
        onClose={() => setActiveAsset(null)}
        onNavigate={onNavigate}
        onOpenAlertModal={onOpenAlertModal}
      />
    </div>
  );
};

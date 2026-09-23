import React from 'react';
import { Building2, X, Navigation, AlertTriangle, ShieldCheck, MapPin, Users, HeartPulse, Bus, Zap, School } from 'lucide-react';
import { InfrastructureAsset } from '../../types';
import { useIncident } from '../../context/IncidentContext';

interface AssetDetailsModalProps {
  asset: InfrastructureAsset | null;
  onClose: () => void;
  onNavigate: (tab: string, params?: any) => void;
  onOpenAlertModal?: (prefill?: any) => void;
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({
  asset,
  onClose,
  onNavigate,
  onOpenAlertModal,
}) => {
  const { selectAsset, selectCatchment, catchments } = useIncident();

  if (!asset) return null;

  const handleViewOnMap = () => {
    selectAsset(asset);
    onNavigate('map', { assetId: asset.id });
    onClose();
  };

  const handleGenerateRoute = () => {
    selectAsset(asset);
    onNavigate('routes', { destination: asset.name });
    onClose();
  };

  const handleCreateAlert = () => {
    selectAsset(asset);
    if (onOpenAlertModal) {
      onOpenAlertModal({
        targetWard: `Ward ${asset.ward} (${asset.name})`,
        severity: asset.floodedStatus === 'INUNDATED' ? 'CRITICAL' : 'HIGH',
        affectedPopulation: asset.populationImpact,
      });
    } else {
      onNavigate('alerts');
    }
    onClose();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'hospital':
        return <HeartPulse className="w-5 h-5 text-red-400" />;
      case 'road':
        return <Bus className="w-5 h-5 text-amber-400" />;
      case 'substation':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'metro':
        return <Bus className="w-5 h-5 text-brand-cyan" />;
      case 'school':
      default:
        return <School className="w-5 h-5 text-brand-cyan" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[1050] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-navy-800 border border-surface-border rounded-lg max-w-xl w-full p-5 space-y-4 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-navy-850 border border-surface-border flex items-center justify-center">
              {getCategoryIcon(asset.category)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white font-mono">{asset.name}</h3>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                    asset.floodedStatus === 'INUNDATED'
                      ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                      : asset.floodedStatus === 'AT_RISK'
                      ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                      : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                  }`}
                >
                  {asset.floodedStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{asset.address} (Ward {asset.ward})</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Operational Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Category</span>
            <span className="text-white font-bold uppercase">{asset.category}</span>
          </div>

          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Vulnerability</span>
            <span className="text-red-400 font-bold text-sm">{asset.vulnerabilityScore} / 100</span>
          </div>

          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Affected Population</span>
            <span className="text-amber-400 font-bold text-sm">{asset.populationImpact.toLocaleString()}</span>
          </div>

          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Flood Probability</span>
            <span className="text-red-400 font-bold text-sm">
              {asset.floodedStatus === 'INUNDATED' ? '96%' : asset.floodedStatus === 'AT_RISK' ? '84%' : '22%'}
            </span>
          </div>

          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Onset</span>
            <span className="text-amber-400 font-bold text-sm">
              {asset.floodedStatus === 'INUNDATED' ? 'Imminent (Active)' : '~35 min'}
            </span>
          </div>

          <div className="bg-navy-850 p-3 rounded border border-surface-border space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Coordinates</span>
            <span className="text-slate-300 text-[10px]">
              {asset.lat.toFixed(4)}, {asset.lng.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Operational Context */}
        <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1.5 text-xs">
          <div className="flex items-center space-x-1.5 text-brand-cyan font-mono font-bold text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>DISASTER DECISION ADVISORY</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            {asset.category === 'hospital'
              ? 'Emergency ambulance corridor ingress points are threatened by backwater overflow from local storm sewer drains. Require prioritized clearance and safe bypass routing.'
              : asset.category === 'road'
              ? 'Critical transit arterial. Deep water accumulation under grade-separated flyovers requires traffic diversion and warning broadcast.'
              : 'Essential municipal lifeline asset requiring continuous monitoring.'}
          </p>
        </div>

        {/* Action Buttons: VIEW ON MAP, GENERATE SAFE ROUTE, CREATE ALERT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-surface-border">
          <button
            onClick={handleViewOnMap}
            className="px-3 py-2.5 rounded bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>VIEW ON MAP</span>
          </button>

          <button
            onClick={handleGenerateRoute}
            className="px-3 py-2.5 rounded bg-navy-850 hover:bg-navy-750 text-slate-200 border border-surface-border font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>SAFE ROUTE</span>
          </button>

          <button
            onClick={handleCreateAlert}
            className="px-3 py-2.5 rounded bg-red-950/80 text-red-300 border border-red-800/60 hover:bg-red-900 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>CREATE ALERT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

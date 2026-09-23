import React, { useState } from 'react';
import { Bell, AlertTriangle, Send, ShieldCheck, History, Radio, Users, CheckCircle2 } from 'lucide-react';
import { AlertItem } from '../types';
import { AuthorizationModal } from '../components/alerts/AuthorizationModal';
import { RiskBadge } from '../components/common/RiskBadge';
import { useIncident } from '../context/IncidentContext';

interface AlertsPageProps {
  alerts?: AlertItem[];
  onCreateAlert?: (alertData: Partial<AlertItem>) => void;
  prefillAlert?: any;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ prefillAlert }) => {
  const { alerts, broadcastAlert, affectedPopulation, ward } = useIncident();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSendAlert = (alertData: any) => {
    broadcastAlert(alertData);
    setIsAuthModalOpen(false);
  };

  const totalReached = alerts.reduce((acc, a) => acc + (a.affectedPopulation || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 p-5 rounded-lg border border-surface-border">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-brand-cyan" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              Emergency Early Warning & Public Alert Broadcast
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            Geofenced Alert Broadcast & Multi-Channel Management
          </h1>
          <p className="text-xs text-slate-400">
            Issue authorized targeted warnings via Mobile Push, Cell Broadcast SMS, IVR Voice, and Public PA sirens.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>CREATE & BROADCAST NEW ALERT</span>
          </button>
        </div>
      </div>

      {/* Operational Broadcast Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Broadcasts</span>
          <span className="text-2xl font-bold text-white font-mono">{alerts.length}</span>
          <p className="text-[10px] text-slate-400 font-sans">Geofenced to Ward {ward} & environs</p>
        </div>

        <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Citizens Notified</span>
          <span className="text-2xl font-bold text-white font-mono">{totalReached.toLocaleString()}</span>
          <p className="text-[10px] text-slate-400 font-sans">Across Push, SMS, IVR & Public Web</p>
        </div>

        <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Broadcast Verification State</span>
          <span className="text-sm font-bold text-teal-400 font-mono flex items-center space-x-1 mt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>DISASTER OFFICER SIGNED</span>
          </span>
          <p className="text-[10px] text-slate-400 font-mono">SIMULATION / AUDIT TRAIL LOGGED</p>
        </div>
      </div>

      {/* Sent Alert History Table (Section 14) */}
      <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-brand-cyan" />
            <h2 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              Broadcast Alert Log & Authorization Audit
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Alerts Dispatched: {alerts.length}</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alt) => (
            <div key={alt.id} className="bg-navy-850 border border-surface-border p-4 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RiskBadge level={alt.severity} />
                  <span className="font-mono text-xs font-bold text-white">{alt.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-400">{alt.timestamp}</span>
                  <span className="badge-verified">
                    {alt.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 font-sans leading-relaxed">{alt.recommendedAction}</p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-surface-border">
                <div>
                  <span className="text-slate-500">Target:</span>{' '}
                  <span className="text-slate-200 font-bold">{alt.targetWard}</span>
                </div>
                <div>
                  <span className="text-slate-500">Population Reached:</span>{' '}
                  <span className="text-slate-200 font-bold">{alt.affectedPopulation.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500">Channels:</span>{' '}
                  <span className="text-brand-cyan font-bold uppercase">{alt.channels.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500">Signed By:</span>{' '}
                  <span className="text-slate-200">{alt.authorizedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Step Authorization Modal */}
      <AuthorizationModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onConfirmSend={handleSendAlert}
        initialTargetWard={prefillAlert?.targetWard}
        initialSeverity={prefillAlert?.severity}
      />
    </div>
  );
};

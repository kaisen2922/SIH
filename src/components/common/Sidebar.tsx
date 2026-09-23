import React from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Waves,
  BrainCircuit,
  Building2,
  Navigation,
  Bell,
  FileCheck2,
  Truck,
  BarChart3,
  Radio,
  Settings as SettingsIcon,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useIncident } from '../../context/IncidentContext';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, currentRole }) => {
  const { alerts, reports, fieldTeams } = useIncident();
  const activeAlertsCount = alerts.filter((a) => a.status === 'BROADCAST' || a.status === 'AUTHORIZED').length;
  const pendingReportsCount = reports.filter((r) => r.verificationStatus === 'UNDER_REVIEW').length;

  const sections = [
    {
      title: 'MONITOR',
      items: [
        { id: 'dashboard', label: 'Command Overview', icon: LayoutDashboard },
        { id: 'map', label: 'Live Flood Map', icon: MapIcon, badge: 'LIVE' },
        { id: 'catchments', label: 'Catchments & Flow', icon: Waves },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'predictions', label: 'AI Prediction Center', icon: BrainCircuit, badge: 'XAI' },
        { id: 'infrastructure', label: 'Impact & Vulnerability', icon: Building2 },
        { id: 'routes', label: 'Safe Routes', icon: Navigation },
      ],
    },
    {
      title: 'RESPONSE',
      items: [
        { id: 'alerts', label: 'Emergency Warnings', icon: Bell, badge: `${activeAlertsCount} Active` },
        { id: 'reports', label: 'Citizen Flood Reports', icon: FileCheck2, badge: pendingReportsCount > 0 ? `${pendingReportsCount} New` : undefined },
        { id: 'field', label: 'Field Response', icon: Truck, badge: `${fieldTeams.length} Units` },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'analytics', label: 'Model Feedback', icon: BarChart3 },
        { id: 'datasources', label: 'Data Sources & IoT', icon: Radio },
        { id: 'settings', label: 'Security & Access', icon: SettingsIcon },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-navy-900 border-r border-surface-border min-h-[calc(100vh-53px)] flex flex-col justify-between shrink-0">
      <div className="py-3 px-2 space-y-4 overflow-y-auto">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
              {sec.title}
            </div>

            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 font-semibold'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badge === 'LIVE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                            : 'bg-navy-950 text-amber-400 border border-amber-700/50'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </div>
                </button>
              );
            })}
          </div>
        ))}

        {/* Highlighted Separate Public Portal Action */}
        <div className="pt-2 border-t border-surface-border">
          <button
            onClick={() => onNavigate('public')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'public'
                ? 'bg-teal-600 text-white'
                : 'bg-navy-950 text-teal-400 hover:bg-navy-850 border border-teal-500/30'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Smartphone className="w-4 h-4 text-teal-400" />
              <span>Public Citizen App</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-surface-border bg-navy-950/60">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-400 font-bold">SYSTEMS ONLINE</span>
          </span>
          <span className="text-slate-500">99.9%</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          Persona: <span className="text-slate-200 font-bold uppercase">{currentRole}</span>
        </div>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Bell,
  UserCheck,
  Globe,
  MapPin,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useIncident } from '../../context/IncidentContext';
import logoImg from '../../../logos/logo.png';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onNavigate,
}) => {
  const {
    incidentId,
    ward,
    selectedCatchment,
    simulationState,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    notifications,
    markNotificationRead,
    clearNotifications,
  } = useIncident();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const catchmentCode = selectedCatchment?.code || 'MC-042';

  const handleToggleSimulation = () => {
    if (simulationState === 'RUNNING') {
      pauseSimulation();
    } else if (simulationState === 'PAUSED') {
      resumeSimulation();
    } else {
      startSimulation();
    }
  };

  const handleNotificationClick = (targetTab: string, notifId: string) => {
    markNotificationRead(notifId);
    setIsNotifDropdownOpen(false);
    onNavigate(targetTab);
  };

  return (
    <header className="bg-navy-900 border-b border-surface-border text-slate-100 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <img
              src={logoImg}
              alt="FloodMesh AI Logo"
              className="w-8 h-8 rounded-lg object-contain shadow-md shadow-brand-blue/30 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white font-mono">
                  FLOODMESH<span className="text-brand-blue ml-0.5">AI</span>
                </span>
                <span className="bg-navy-950 text-[10px] text-slate-400 border border-surface-border px-1.5 py-0.5 rounded font-mono font-medium uppercase">
                  COMMAND PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Urban Flood Early Warning & Response
              </p>
            </div>
          </div>
        </div>

        {/* Center: City & Basin Scope */}
        <div className="hidden lg:flex items-center space-x-2 bg-navy-950 px-3 py-1.5 rounded-md border border-surface-border text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-brand-blue" />
          <span className="font-semibold text-slate-200">Kolkata Metro</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-mono">Ward {ward}</span>
          <span className="text-slate-500">•</span>
          <span className="text-brand-cyan font-mono font-bold">{catchmentCode}</span>
        </div>

        {/* Right: Operational Controls & Status */}
        <div className="flex items-center space-x-2.5">
          {/* FLOOD SCENARIO SIMULATION CONTROLS */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleToggleSimulation}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
                simulationState === 'RUNNING'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 animate-pulse'
                  : simulationState === 'PAUSED'
                  ? 'bg-blue-950 text-blue-300 border-blue-500/60'
                  : 'bg-navy-800 text-slate-200 border-surface-border hover:bg-navy-750'
              }`}
            >
              {simulationState === 'RUNNING' ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Pause Scenario</span>
                </>
              ) : simulationState === 'PAUSED' ? (
                <>
                  <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  <span>Resume Scenario</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>▶ Start Flood Scenario</span>
                </>
              )}
            </button>

            {simulationState !== 'IDLE' && (
              <button
                onClick={resetSimulation}
                className="p-1.5 rounded bg-navy-800 hover:bg-navy-750 text-slate-300 border border-surface-border"
                title="Reset Flood Scenario"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Clean Enterprise Systems Operational Pill */}
          <div className="hidden md:flex items-center space-x-2 px-2.5 py-1.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px] font-semibold">● SYSTEMS OPERATIONAL</span>
          </div>

          {/* Notifications Button with Functional Dropdown (Section 23) */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-1.5 rounded bg-navy-800 hover:bg-navy-750 border border-surface-border text-slate-300 hover:text-white transition-colors"
              title="System Active Warnings & Notifications"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-navy-900 border border-surface-border rounded-lg shadow-2xl p-3 z-50 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                  <div className="flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono font-bold text-white text-xs uppercase">
                      Incident Notifications
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-slate-400 hover:text-white font-mono"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 font-mono text-xs">
                      No active notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.targetTab, n.id)}
                        className={`p-2.5 rounded border cursor-pointer transition-colors space-y-1 ${
                          n.read
                            ? 'bg-navy-950/70 border-surface-border text-slate-400'
                            : 'bg-navy-950 border-brand-blue/50 text-slate-200'
                        } hover:border-brand-blue`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              n.priority === 'CRITICAL'
                                ? 'bg-red-950 text-red-300 border border-red-700/60'
                                : n.priority === 'HIGH'
                                ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                                : 'bg-blue-950 text-blue-300 border border-blue-700/60'
                            }`}
                          >
                            {n.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] font-sans text-slate-300 leading-snug">{n.message}</p>
                        <div className="flex items-center space-x-1 text-[10px] text-brand-cyan font-mono pt-1">
                          <span>Inspect in /{n.targetTab}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Public Portal Switcher */}
          <button
            onClick={() => onNavigate(activeTab === 'public' ? 'dashboard' : 'public')}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-brand-blue/15 hover:bg-brand-blue/25 border border-brand-blue/40 text-brand-blue text-xs font-semibold transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{activeTab === 'public' ? 'Command Center' : 'Public Safety App'}</span>
          </button>

          {/* Officer Persona Role Switcher */}
          <div className="relative group">
            <div className="flex items-center space-x-2 bg-navy-800 px-2.5 py-1.5 rounded border border-surface-border cursor-pointer hover:bg-navy-750 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <div className="text-left">
                <span className="text-[9px] text-slate-400 block -mb-0.5 uppercase tracking-wider font-mono">Role</span>
                <span className="font-semibold text-slate-200 capitalize font-mono">{currentRole}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            <div className="absolute right-0 mt-1 w-48 bg-navy-900 border border-surface-border rounded-md shadow-xl py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-mono text-slate-400 border-b border-surface-border">
                Switch Operational Role
              </div>
              {[
                { role: 'officer', label: 'Disaster Duty Officer' },
                { role: 'engineer', label: 'Municipal Engineer' },
                { role: 'field', label: 'Field Response Officer' },
                { role: 'admin', label: 'System Admin' },
                { role: 'citizen', label: 'Public Citizen' },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => onRoleChange(item.role as UserRole)}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-navy-800 flex items-center justify-between ${
                    currentRole === item.role ? 'text-brand-blue font-bold bg-navy-850' : 'text-slate-300'
                  }`}
                >
                  <span>{item.label}</span>
                  {currentRole === item.role && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

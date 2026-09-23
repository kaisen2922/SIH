import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Lock, Eye, Key, UserCheck, CheckCircle2, XCircle } from 'lucide-react';
import { UserRole } from '../types';
import { useIncident } from '../context/IncidentContext';

interface SettingsPageProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentRole, onRoleChange }) => {
  const { auditLogs } = useIncident();

  // Section 20: RBAC Permission Matrix Definition
  const rolesList = [
    { role: 'officer', title: 'Disaster Duty Officer', desc: 'Can authorize and broadcast critical alerts to wards.' },
    { role: 'engineer', title: 'Municipal Engineer', desc: 'Can modify hydraulic parameters and canal thresholds.' },
    { role: 'field', title: 'Field Response Officer', desc: 'Receives assigned incidents and updates team status.' },
    { role: 'admin', title: 'System Administrator', desc: 'Full system configuration, pipelines, and audit governance.' },
    { role: 'citizen', title: 'Public Citizen', desc: 'Public safety portal, evacuation routes, and crowdsourced reporting.' },
  ];

  const permissionsMatrix: { [key: string]: { [perm: string]: boolean } } = {
    officer: { VIEW: true, EDIT: true, AUTHORIZE: true, DISPATCH: true, BROADCAST: true },
    engineer: { VIEW: true, EDIT: true, AUTHORIZE: false, DISPATCH: false, BROADCAST: false },
    field: { VIEW: true, EDIT: false, AUTHORIZE: false, DISPATCH: true, BROADCAST: false },
    admin: { VIEW: true, EDIT: true, AUTHORIZE: true, DISPATCH: true, BROADCAST: true },
    citizen: { VIEW: true, EDIT: false, AUTHORIZE: false, DISPATCH: false, BROADCAST: false },
  };

  const permissionsList = ['VIEW', 'EDIT', 'AUTHORIZE', 'DISPATCH', 'BROADCAST'];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 p-5 rounded-lg border border-surface-border shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              Security Governance & Access Control
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            Role-Based Access Control (RBAC) & Audit Governance
          </h1>
          <p className="text-xs text-slate-400">
            Enforces strict operational boundaries, two-stage digital authorization PINs, and tamper-resistant audit logs.
          </p>
        </div>
      </div>

      {/* Role Selector Grid */}
      <div className="bg-navy-900 border border-surface-border rounded-lg p-5 space-y-4 shadow-lg">
        <h2 className="font-bold text-sm text-white flex items-center space-x-2 font-mono uppercase">
          <UserCheck className="w-4 h-4 text-brand-blue" />
          <span>Active Persona Role Switcher</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {rolesList.map((item) => {
            const isActive = currentRole === item.role;
            return (
              <div
                key={item.role}
                onClick={() => onRoleChange(item.role as UserRole)}
                className={`p-4 rounded-lg border cursor-pointer transition-all space-y-2 ${
                  isActive
                    ? 'bg-brand-primary/20 border-brand-primary text-white shadow-sm'
                    : 'bg-navy-950 border-surface-border text-slate-300 hover:bg-navy-850'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs font-mono">{item.title}</span>
                  {isActive && <span className="text-xs text-teal-400 font-mono font-bold">● ACTIVE</span>}
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 20: Permission Matrix Table */}
      <div className="bg-navy-900 border border-surface-border rounded-lg p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-brand-cyan" />
            <h2 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              OPERATIONAL ROLE PERMISSION MATRIX
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">ENFORCED IN COMMAND CONSOLE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Operational Role</th>
                {permissionsList.map((perm) => (
                  <th key={perm} className="p-3 text-center">
                    {perm}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {rolesList.map((r) => {
                const isCurrent = currentRole === r.role;
                return (
                  <tr
                    key={r.role}
                    className={`transition-colors ${isCurrent ? 'bg-brand-primary/10 font-bold' : 'hover:bg-navy-850'}`}
                  >
                    <td className="p-3 text-white">
                      <div className="flex items-center space-x-2">
                        <span>{r.title}</span>
                        {isCurrent && (
                          <span className="badge-live text-[9px] px-1.5 py-0.5">
                            CURRENT
                          </span>
                        )}
                      </div>
                    </td>
                    {permissionsList.map((perm) => {
                      const hasPerm = permissionsMatrix[r.role]?.[perm];
                      return (
                        <td key={perm} className="p-3 text-center">
                          {hasPerm ? (
                            <span className="text-teal-400 font-bold">✓ GRANTED</span>
                          ) : (
                            <span className="text-slate-500 font-normal">✕ DENIED</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log (Section 20) */}
      <div className="bg-navy-900 border border-surface-border rounded-lg p-5 space-y-3 font-mono text-xs shadow-lg">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-white font-sans">
              Security Audit Trail & Authorizations Log
            </h2>
          </div>
          <span className="text-slate-400 text-[10px]">{auditLogs.length} Events Logged</span>
        </div>

        <div className="space-y-2 bg-navy-950 p-3 rounded border border-surface-border max-h-60 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 p-1.5 text-slate-300 border-b border-navy-850 last:border-b-0">
              <div className="flex items-center space-x-2">
                <span className="text-amber-400 font-bold">[{log.timestamp}]</span>
                <span className="text-slate-400">({log.role}):</span>
                <span className="text-white font-sans">{log.action}</span>
              </div>
              <span className="text-[10px] font-mono text-brand-cyan bg-navy-900 px-1.5 py-0.5 rounded border border-surface-border uppercase">
                {log.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CARTO Security & Key Governance (Section 21) */}
      <div className="bg-navy-900 border border-surface-border rounded-lg p-5 space-y-3 font-mono text-xs shadow-lg">
        <div className="flex items-center space-x-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <h2 className="font-bold text-sm text-white font-sans">Geospatial Key Governance & Masking</h2>
        </div>
        <div className="bg-navy-950 p-3 rounded border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">CARTO Tile API Key</span>
            <span className="text-emerald-400 font-mono">●●●●●●●●●●●●●●●●●●●●●●●●●●●● (Loaded via VITE_CARTO_API_KEY)</span>
          </div>
          <span className="badge-verified">
            SECURELY CONFIGURED
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Truck, AlertTriangle, ShieldCheck, MapPin, Clock, UserCheck, Plus, CheckCircle2, Navigation } from 'lucide-react';
import { FieldIncident } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { useIncident } from '../context/IncidentContext';

interface FieldResponsePageProps {
  incidents?: FieldIncident[];
  onNavigate: (tab: string, params?: any) => void;
}

export const FieldResponsePage: React.FC<FieldResponsePageProps> = ({ onNavigate }) => {
  const { fieldTeams, updateFieldTeamStatus, selectTeam, incidentId } = useIncident();
  const [newNoteText, setNewNoteText] = useState<{ [key: string]: string }>({});

  const handleStatusChange = (id: string, newStatus: 'EN ROUTE' | 'ON SITE' | 'COMPLETED') => {
    updateFieldTeamStatus(id, newStatus);
  };

  const handleAddNote = (id: string) => {
    const text = newNoteText[id];
    if (!text?.trim()) return;
    const team = fieldTeams.find((t) => t.id === id);
    if (team) {
      updateFieldTeamStatus(id, team.status, text.trim());
      setNewNoteText({ ...newNoteText, [id]: '' });
    }
  };

  const handleViewLocation = (team: any) => {
    selectTeam(team);
    onNavigate('map', { teamId: team.id, lat: team.lat, lng: team.lng });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 p-5 rounded-lg border border-surface-border">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-brand-cyan" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              Emergency Field Response & Dispatch Command
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            Active Field Team Response & Incident Deployment
          </h1>
          <p className="text-xs text-slate-400">
            Assigned to Flood Event #{incidentId}. Update field deployment statuses, log operational notes, and inspect GIS coordinates.
          </p>
        </div>
      </div>

      {/* Field Teams Cards Grid (Section 16) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldTeams.map((team) => (
          <div
            key={team.id}
            className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4 flex flex-col justify-between hover:border-slate-500 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-brand-cyan" />
                  <h3 className="font-mono font-bold text-sm text-white">{team.name}</h3>
                </div>
                <span
                  className={
                    team.status === 'COMPLETED'
                      ? 'badge-verified'
                      : team.status === 'ON SITE'
                      ? 'badge-estimate'
                      : 'badge-simulation'
                  }
                >
                  {team.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-navy-850 p-3 rounded border border-surface-border">
                <div>
                  <span className="text-slate-400 block text-[10px]">ETA / Presence:</span>
                  <span className="font-bold text-brand-cyan">{team.eta}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Target Location:</span>
                  <span className="font-bold text-slate-200">{team.location}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Assigned Task:</span>
                <p className="text-xs text-slate-200 bg-navy-850 p-2.5 rounded border border-surface-border font-sans">
                  {team.task}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 uppercase font-bold">Task Progress:</span>
                  <span className="font-bold text-teal-400">
                    {team.status === 'COMPLETED' ? '100% (Completed)' : team.status === 'ON SITE' ? '70% (In Progress)' : '35% (En Route)'}
                  </span>
                </div>
                <div className="w-full bg-navy-950 border border-surface-border rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      team.status === 'COMPLETED'
                        ? 'bg-teal-500 w-full'
                        : team.status === 'ON SITE'
                        ? 'bg-brand-primary w-[70%]'
                        : 'bg-amber-500 w-[35%]'
                    }`}
                  />
                </div>
              </div>

              {/* Note Display */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Operational Log Notes:</span>
                <p className="text-[11px] text-slate-300 font-mono bg-navy-850 p-2.5 rounded border border-surface-border">
                  {team.note}
                </p>
              </div>
            </div>

            {/* Official Status Update Controls & VIEW LOCATION */}
            <div className="space-y-2.5 pt-3 border-t border-surface-border">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-bold">Update Deployment Status:</span>
                <div className="flex items-center space-x-1">
                  {(['EN ROUTE', 'ON SITE', 'COMPLETED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(team.id, st)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        team.status === st
                          ? 'bg-brand-primary text-white border border-brand-primary'
                          : 'bg-navy-850 text-slate-400 hover:text-white border border-surface-border'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Note Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Append operational log note..."
                  value={newNoteText[team.id] || ''}
                  onChange={(e) => setNewNoteText({ ...newNoteText, [team.id]: e.target.value })}
                  className="bg-navy-950 border border-surface-border rounded px-2.5 py-1.5 text-xs text-slate-100 flex-1 focus:border-brand-primary focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(team.id)}
                  className="px-3 py-1.5 rounded bg-navy-850 hover:bg-navy-750 text-slate-200 text-xs font-mono border border-surface-border transition-colors"
                >
                  Log Note
                </button>
              </div>

              {/* VIEW LOCATION Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleViewLocation(team)}
                  className="w-full py-2 rounded bg-navy-850 hover:bg-navy-750 text-brand-cyan border border-surface-border text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>VIEW LIVE LOCATION</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

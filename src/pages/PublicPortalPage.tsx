import React from 'react';
import { ShieldAlert, Navigation, Camera, Bell, PhoneCall, MapPin, ChevronRight, AlertTriangle, LifeBuoy } from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import logoImg from '../../logos/logo.png';

interface PublicPortalPageProps {
  onNavigate: (tab: string, params?: any) => void;
  onOpenReportModal: () => void;
}

export const PublicPortalPage: React.FC<PublicPortalPageProps> = ({ onNavigate, onOpenReportModal }) => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-navy-950 text-slate-100 p-4 space-y-5 pb-12">
      {/* Citizen Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center space-x-2">
          <img
            src={logoImg}
            alt="FloodMesh AI Logo"
            className="w-7 h-7 rounded-md object-contain shadow-sm"
          />
          <span className="font-extrabold text-sm tracking-tight text-white font-mono">
            FLOODMESH <span className="text-teal-400">CITIZEN SAFETY</span>
          </span>
        </div>

        <div className="flex items-center space-x-1 bg-navy-900 px-2 py-1 rounded border border-surface-border text-[11px] font-mono text-slate-300">
          <MapPin className="w-3 h-3 text-brand-primary" />
          <span>Ward 17, Kolkata</span>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-navy-800 border border-red-800/60 rounded-xl p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase">YOUR HYPERLOCAL RISK</span>
          <RiskBadge level="CRITICAL" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">HIGH FLOOD RISK</h2>
          <p className="text-xs text-amber-300 font-mono font-bold mt-1">
            Possible flooding within 40–60 minutes in your current area.
          </p>
        </div>

        <div className="bg-navy-950 p-3 rounded-lg border border-surface-border text-xs text-slate-200">
          <span className="text-slate-400 font-mono block mb-0.5 text-[10px] uppercase font-bold">RECOMMENDED ACTION:</span>
          "Avoid low-lying roadways near Circular Canal and Ultadanga crossing. Seek elevated shelter."
        </div>
      </div>

      {/* Primary Action Buttons Grid */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('routes')}
          className="w-full bg-brand-primary hover:bg-brand-hover text-white font-bold p-4 rounded-xl text-sm flex items-center justify-between shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <Navigation className="w-5 h-5 text-white" />
            <div className="text-left">
              <span className="block font-bold">Find Safe Evacuation Route</span>
              <span className="text-xs text-blue-100 font-normal">Bypasses inundated roads to nearest shelter</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80" />
        </button>

        <button
          onClick={onOpenReportModal}
          className="w-full bg-navy-800 hover:bg-navy-750 text-slate-100 border border-surface-border hover:border-teal-600/50 font-bold p-4 rounded-xl text-sm flex items-center justify-between transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <Camera className="w-5 h-5 text-teal-400" />
            <div className="text-left">
              <span className="block font-bold text-teal-300">Report Street Waterlogging</span>
              <span className="text-xs text-slate-400 font-normal">Upload photo with automatic water depth AI verify</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigate('alerts')}
          className="w-full bg-navy-800 hover:bg-navy-750 text-slate-100 border border-surface-border font-bold p-4 rounded-xl text-sm flex items-center justify-between transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <span className="block font-bold">View Nearby Emergency Warnings</span>
              <span className="text-xs text-slate-400 font-normal">2 active official broadcast warnings</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Emergency SOS Call Button */}
      <div className="pt-2">
        <a
          href="tel:1077"
          className="w-full bg-red-700 hover:bg-red-600 text-white font-extrabold p-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-colors"
        >
          <LifeBuoy className="w-4 h-4 animate-pulse" />
          <span>EMERGENCY DISASTER HELPLINE (1077 / 112)</span>
        </a>
      </div>
    </div>
  );
};

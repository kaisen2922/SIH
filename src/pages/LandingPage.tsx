import React from 'react';
import { ShieldAlert, Globe, ChevronRight, Activity, Cpu, MapPin, CheckCircle2 } from 'lucide-react';
import logoImg from '../../logos/logo.png';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onEnterPublic: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard, onEnterPublic }) => {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Subtle Operational Background Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto z-10">
        <div className="flex items-center space-x-2.5">
          <img
            src={logoImg}
            alt="FloodMesh AI Logo"
            className="w-9 h-9 rounded-xl object-contain shadow-md shadow-brand-blue/30"
          />
          <span className="font-extrabold text-xl tracking-tight text-white font-mono">
            FLOODMESH<span className="text-brand-primary">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span>PRODUCTION-READY DISASTER INTELLIGENCE PLATFORM</span>
        </div>
      </div>

      {/* Central Hero Banner */}
      <div className="max-w-4xl mx-auto text-center z-10 space-y-6 my-auto py-12">
        <div className="flex justify-center mb-1">
          <img
            src={logoImg}
            alt="FloodMesh AI"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-xl shadow-brand-blue/30 ring-1 ring-cyan-500/20"
          />
        </div>

        <div className="inline-flex items-center space-x-2 bg-navy-900 border border-brand-cyan/30 px-3 py-1 rounded-full text-xs font-mono text-brand-cyan">
          <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
          <span>AI-POWERED HYPERLOCAL URBAN FLOOD NOWCASTING</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          Predict. Prepare. Protect.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Hyperlocal flood nowcasting, catchment hydrodynamics, infrastructure impact prediction, and early-warning intelligence for disaster management authorities and citizens.
        </p>

        {/* Entry Gateway Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onEnterDashboard}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Open Operational Command Center</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onEnterPublic}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-teal-400 border border-surface-border hover:border-teal-600/50 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Public Safety Portal (Citizen App)</span>
          </button>
        </div>

        {/* Real Operational Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-12 border-t border-surface-border">
          <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-1.5">
            <div className="flex items-center space-x-2 text-brand-cyan font-mono text-xs font-bold">
              <Activity className="w-4 h-4" />
              <span>Catchment Hydrodynamics</span>
            </div>
            <p className="text-xs text-slate-300">
              Integrates elevation DEM, land cover, impervious surface & canal capacity into physics-guided ML.
            </p>
          </div>

          <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Explainable AI (XAI)</span>
            </div>
            <p className="text-xs text-slate-300">
              Transparent SHAP factor breakdown showing exact meteorological & topographical risk contributors.
            </p>
          </div>

          <div className="bg-navy-800 p-4 rounded-lg border border-surface-border space-y-1.5">
            <div className="flex items-center space-x-2 text-teal-400 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Continuous Feedback Loop</span>
            </div>
            <p className="text-xs text-slate-300">
              Automated model performance scoring comparing predicted extents with Sentinel-1 SAR ground truth.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-xs text-slate-500 font-mono z-10 pt-4 border-t border-surface-border">
        <span>© 2026 FLOODMESH AI Systems • Government Readiness Build</span>
        <span>Kolkata Metropolitan Area Simulation Node</span>
      </div>
    </div>
  );
};

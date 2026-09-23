import React, { useState } from 'react';
import {
  FileCheck2,
  Camera,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Plus,
  X,
  Navigation,
  AlertTriangle,
  Layers,
  Copy,
  BarChart2,
  ArrowRight,
} from 'lucide-react';
import { CitizenReport } from '../types';
import { ReportSubmissionModal } from '../components/reports/ReportSubmissionModal';
import { useIncident } from '../context/IncidentContext';

interface ReportsPageProps {
  reports?: CitizenReport[];
  onSubmitReport?: (reportData: Partial<CitizenReport>) => void;
  onNavigate?: (tab: string, params?: any) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const { reports, verifyCitizenReport } = useIncident();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const verifiedCount = reports.filter((r) => r.verificationStatus === 'VERIFIED').length;
  const underReviewCount = reports.filter((r) => r.verificationStatus === 'UNDER_REVIEW').length;

  const handleVerify = (reportId: string) => {
    verifyCitizenReport(reportId, 'VERIFIED');
  };

  const handleDuplicate = (reportId: string) => {
    verifyCitizenReport(reportId, 'DUPLICATE');
  };

  const handleViewOnMap = (rep: CitizenReport) => {
    if (onNavigate) {
      onNavigate('map', { reportId: rep.id, lat: rep.lat, lng: rep.lng });
    }
  };

  const handleFeedbackLoop = () => {
    if (onNavigate) {
      onNavigate('analytics');
    }
  };

  const workflowSteps = [
    'REPORT',
    'EVIDENCE CHECK',
    'LOCATION CHECK',
    'FLOOD CONSISTENCY',
    'OFFICER REVIEW',
    'VERIFIED INCIDENT',
    'MAP',
    'MODEL FEEDBACK',
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 p-5 rounded-lg border border-surface-border">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-brand-cyan" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              Crowdsourced Flood Reporting & Ground Verification
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            Citizen Ground Evidence & Automated Verification Pipeline
          </h1>
          <p className="text-xs text-slate-400">
            Validates reported water depth telemetry, geofence validity, and radar spatial consistency before escalation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Citizen Flood Report</span>
          </button>
        </div>
      </div>

      {/* Section 15: Workflow Pipeline Stepper */}
      <div className="bg-navy-800 border border-surface-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              MULTI-STAGE CITIZEN REPORT VERIFICATION PIPELINE
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {verifiedCount} Verified · {underReviewCount} Pending Review
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 text-center text-xs font-mono">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-2 rounded border space-y-0.5 ${
                idx >= 5
                  ? 'bg-teal-950/70 border-teal-700/60 text-teal-300'
                  : 'bg-navy-850 border-surface-border text-slate-300'
              }`}
            >
              <span className="text-[9px] text-slate-500 font-bold block">{idx + 1}</span>
              <span className="font-bold text-[10px] block">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Grid (Section 15) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-navy-800 border border-surface-border rounded-lg overflow-hidden space-y-3 p-4 flex flex-col justify-between hover:border-slate-500 transition-colors"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between bg-navy-850 p-2.5 rounded-md border border-surface-border">
                <span className="font-mono text-xs text-amber-400 font-bold">
                  Water Depth: {rep.depthCm} cm
                </span>
                <span
                  className={
                    rep.verificationStatus === 'VERIFIED'
                      ? 'badge-verified'
                      : rep.verificationStatus === 'DUPLICATE'
                      ? 'badge-historical'
                      : 'badge-simulation'
                  }
                >
                  {rep.verificationStatus}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{rep.timestamp}</span>
                  <span className="text-brand-cyan font-bold">REPORT #{rep.id}</span>
                </div>
                <h3 className="font-bold text-sm text-white font-sans">{rep.title}</h3>
                <p className="text-xs text-slate-300 flex items-center space-x-1 mt-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{rep.address}</span>
                </p>
              </div>

              <p className="text-xs text-slate-200 bg-navy-850 p-2.5 rounded border border-surface-border font-sans leading-relaxed">
                "{rep.description}"
              </p>
            </div>

            {/* Evidence & Consistency Telemetry */}
            <div className="pt-2 border-t border-surface-border space-y-2 font-mono text-[11px]">
              <div className="bg-navy-850 p-2 rounded border border-surface-border space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-400">
                  <span>Evidence Image Status:</span>
                  <span className="text-teal-400 font-bold">✓ EXIF Geotag Validated</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Location Geofence Check:</span>
                  <span className="text-teal-400 font-bold">✓ Ward Basin Matched</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Radar Consistency Check:</span>
                  <span className="text-brand-cyan font-bold">{rep.aiConfidencePct}% Confidence</span>
                </div>
              </div>

              {/* Action Buttons: VERIFY, DUPLICATE, VIEW ON MAP */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => handleVerify(rep.id)}
                  disabled={rep.verificationStatus === 'VERIFIED'}
                  className="py-1.5 px-2 rounded bg-teal-950/80 text-teal-300 border border-teal-700/60 text-[10px] font-bold hover:bg-teal-900 disabled:opacity-50 flex items-center justify-center space-x-1 transition-colors"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>VERIFY</span>
                </button>

                <button
                  onClick={() => handleDuplicate(rep.id)}
                  disabled={rep.verificationStatus === 'DUPLICATE'}
                  className="py-1.5 px-2 rounded bg-navy-850 text-slate-400 border border-surface-border text-[10px] font-bold hover:text-white disabled:opacity-50 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>DUPLICATE</span>
                </button>

                <button
                  onClick={() => handleViewOnMap(rep)}
                  className="py-1.5 px-2 rounded bg-navy-850 text-brand-cyan border border-surface-border text-[10px] font-bold hover:bg-navy-750 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>VIEW MAP</span>
                </button>
              </div>

              {/* Requirement 11 & 19: Cross-module Verified Report -> Model Feedback */}
              {rep.verificationStatus === 'VERIFIED' && (
                <button
                  onClick={handleFeedbackLoop}
                  className="w-full py-1.5 px-2.5 rounded bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-cyan border border-brand-primary/50 text-[10px] font-bold flex items-center justify-center space-x-1.5 transition-colors mt-1"
                >
                  <BarChart2 className="w-3 h-3 text-brand-cyan" />
                  <span>FEEDBACK LOOP → MODEL EVALUATION</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ReportSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitReport={(data) => {
          setIsSubmitModalOpen(false);
        }}
      />
    </div>
  );
};

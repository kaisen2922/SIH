import React, { useState } from 'react';
import { Camera, CheckCircle2, ShieldCheck, X, MapPin } from 'lucide-react';

interface ReportSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (reportData: any) => void;
}

export const ReportSubmissionModal: React.FC<ReportSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [title, setTitle] = useState('Ward 17 Street Waterlogging');
  const [address, setAddress] = useState('Circular Canal Rd near Ward 17 Gate');
  const [depthCm, setDepthCm] = useState(45);
  const [description, setDescription] = useState('Knee-deep water blocking local traffic and drainage outfall.');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiVerified, setAiVerified] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingAI(true);

    // Simulate AI Verification delay
    setTimeout(() => {
      setIsProcessingAI(false);
      setAiVerified(true);

      setTimeout(() => {
        onSubmitReport({
          title,
          address,
          depthCm,
          description,
          lat: 22.586,
          lng: 88.373,
        });
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-surface-border rounded-lg max-w-md w-full p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-teal-950/60 border border-teal-700/50 flex items-center justify-center">
              <Camera className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Submit Hyperlocal Citizen Flood Report</h3>
              <p className="text-xs text-slate-400">Crowdsourced Verification & Telemetry Correlation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-mono block mb-1">Incident Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-navy-950 border border-surface-border rounded p-2 text-slate-100 focus:border-brand-blue focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Location Address:</label>
            <div className="relative flex items-center">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-navy-950 border border-surface-border rounded pl-8 pr-2 py-2 text-slate-100 focus:border-brand-blue focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Water Depth Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 font-mono">
              <label className="text-slate-300">Estimated Water Depth:</label>
              <span className="font-bold text-amber-300">{depthCm} cm</span>
            </div>
            <input
              type="range"
              min={5}
              max={120}
              value={depthCm}
              onChange={(e) => setDepthCm(parseInt(e.target.value))}
              className="w-full accent-brand-blue"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Ankle (10cm)</span>
              <span>Knee (45cm)</span>
              <span>Waist (90cm)</span>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Description & Evidence Details:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-navy-950 border border-surface-border rounded p-2 text-slate-100 focus:border-brand-blue focus:outline-none"
              required
            />
          </div>

          {/* AI Processing Status Indicator */}
          {isProcessingAI && (
            <div className="bg-navy-950 p-3 rounded border border-brand-blue/50 space-y-1.5 animate-pulse">
              <div className="flex items-center space-x-2 text-brand-cyan">
                <ShieldCheck className="w-4 h-4 animate-spin" />
                <span className="font-mono font-bold">AI Telemetry Verification in progress...</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Checking EXIF timestamp, water level segmentation, radar correlation & spatial deduplication.
              </p>
            </div>
          )}

          {aiVerified && (
            <div className="bg-emerald-950/80 p-3 rounded border border-emerald-600/50 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-mono font-bold">AI Report Verification Complete: VERIFIED (96% Conf)</span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Correlated with Ward 17 IMD Doppler Radar rain surge & ultrasonic canal depth node sns-01.
              </p>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-navy-800 hover:bg-navy-750 text-slate-300 text-xs font-semibold border border-surface-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessingAI}
              className="px-5 py-2 rounded bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs transition-colors"
            >
              Submit & Verify Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

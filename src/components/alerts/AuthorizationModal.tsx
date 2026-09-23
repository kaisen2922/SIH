import React, { useState } from 'react';
import {
  AlertTriangle,
  Send,
  ShieldCheck,
  X,
  Smartphone,
  MessageSquare,
  Globe,
  Radio,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Lock,
} from 'lucide-react';
import { RiskLevel } from '../../types';

interface AuthorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSend: (alertData: any) => void;
  initialTargetWard?: string;
  initialSeverity?: RiskLevel;
}

export const AuthorizationModal: React.FC<AuthorizationModalProps> = ({
  isOpen,
  onClose,
  onConfirmSend,
  initialTargetWard = 'Ward 17 / MC-042',
  initialSeverity = 'CRITICAL',
}) => {
  // 7-Step Workflow State (Section 14)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [targetZone, setTargetZone] = useState(initialTargetWard);
  const [severity, setSeverity] = useState<RiskLevel>(initialSeverity);
  const [message, setMessage] = useState(
    'FLASH FLOOD WARNING: Circular Canal overflow imminent. Avoid low-lying underpasses along Ultadanga crossing. Seek elevated shelter immediately.'
  );
  const [recommendedAction, setRecommendedAction] = useState(
    'Avoid low-lying roadways and underpasses along Circular Canal. Move elderly and vulnerable residents to upper floors.'
  );
  const [onsetTime, setOnsetTime] = useState('Within 40 Minutes');
  const [affectedPopulation, setAffectedPopulation] = useState(12430);

  // Channels Selection
  const [channels, setChannels] = useState({
    push: true,
    sms: true,
    ivr: true,
    portal: true,
  });

  // Officer PIN Authorization
  const [officerPin, setOfficerPin] = useState('8492');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      // Step 7: Broadcast
      setIsBroadcasting(true);
      setTimeout(() => {
        setIsBroadcasting(false);
        setIsSuccess(true);
        setTimeout(() => {
          onConfirmSend({
            title: `EMERGENCY FLOOD WARNING — ${targetZone}`,
            severity,
            targetWard: targetZone,
            affectedPopulation,
            onsetTime,
            recommendedAction: message,
            channels: Object.keys(channels).filter((k) => (channels as any)[k]),
            authorizedBy: 'Officer R. Banerjee (Disaster Duty Officer)',
          });
          setIsSuccess(false);
          setCurrentStep(1);
          onClose();
        }, 1200);
      }, 1000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const stepLabels = [
    'Target Zone',
    'Severity',
    'Write Message',
    'Channels',
    'Review',
    'Authorize',
    'Broadcast',
  ];

  return (
    <div className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-navy-800 border border-surface-border rounded-lg max-w-xl w-full p-5 space-y-4 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-red-950/80 border border-red-800/60 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white font-mono tracking-tight">
                EMERGENCY ALERT BROADCAST WIZARD
              </h3>
              <p className="text-xs text-red-300">
                Step {currentStep} of 7: {stepLabels[currentStep - 1]}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7-Step Progress Stepper Indicator */}
        <div className="grid grid-cols-7 gap-1">
          {stepLabels.map((lbl, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <div key={idx} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-brand-blue ring-1 ring-white/50'
                      : 'bg-navy-950 border border-surface-border'
                  }`}
                />
                <span className="text-[9px] font-mono text-slate-500 block truncate text-center">
                  {lbl}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        {isSuccess ? (
          <div className="bg-emerald-950/80 p-6 rounded border border-emerald-600/50 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-300 font-mono">
              ✓ Alert Broadcast Successfully Dispatched
            </h4>
            <p className="text-xs text-slate-300 font-sans">
              Warning sent to {affectedPopulation.toLocaleString()} citizens in {targetZone} via selected channels.
              Marked as <b className="font-mono text-amber-300">SIMULATION BROADCAST</b>.
            </p>
          </div>
        ) : isBroadcasting ? (
          <div className="p-8 text-center space-y-3 font-mono">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-red-300 font-bold uppercase">
              Dispatching geofenced emergency broadcast...
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-mono">
            {/* STEP 1: Select Target Zone */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <span className="text-slate-300 font-bold block uppercase">
                  Step 1: Select Target Inundation Zone
                </span>
                <div className="space-y-2">
                  {[
                    'Ward 17 / MC-042 (Circular Canal Lowland Basin)',
                    'Ward 14 / MC-018 (Shyambazar Junction Corridor)',
                    'Ward 45 / MC-055 (SSKM Hospital Zone)',
                    'Ward 28 / MC-033 (Maniktala Canal East)',
                  ].map((z) => (
                    <label
                      key={z}
                      onClick={() => setTargetZone(z)}
                      className={`flex items-center space-x-2 p-3 rounded border cursor-pointer ${
                        targetZone === z
                          ? 'bg-brand-blue/20 border-brand-blue text-white'
                          : 'bg-navy-950 border-surface-border text-slate-300 hover:bg-navy-850'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={targetZone === z}
                        onChange={() => setTargetZone(z)}
                        className="text-brand-blue"
                      />
                      <span className="font-medium">{z}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Select Severity */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <span className="text-slate-300 font-bold block uppercase">
                  Step 2: Select Warning Severity Level
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as RiskLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeverity(lvl)}
                      className={`p-3 rounded border text-left font-bold transition-all ${
                        severity === lvl
                          ? lvl === 'CRITICAL'
                            ? 'bg-red-950 text-red-300 border-red-500 ring-1 ring-red-500'
                            : lvl === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-blue-950 text-blue-300 border-blue-500'
                          : 'bg-navy-950 border-surface-border text-slate-400'
                      }`}
                    >
                      <span className="block text-sm">{lvl}</span>
                      <span className="text-[10px] text-slate-400 font-normal font-sans">
                        {lvl === 'CRITICAL'
                          ? 'Immediate threat to life & property (>85% flood risk)'
                          : lvl === 'HIGH'
                          ? 'Severe waterlogging expected within 60 min'
                          : 'Advisory caution for low-lying areas'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Write Message */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <span className="text-slate-300 font-bold block uppercase">
                  Step 3: Compose Warning Message & Recommended Action
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="text-slate-400 block text-[10px] mb-1">Public Broadcast Message:</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-navy-950 border border-surface-border rounded p-2.5 text-white font-sans text-xs focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px] mb-1">Estimated Onset Timeframe:</label>
                    <input
                      type="text"
                      value={onsetTime}
                      onChange={(e) => setOnsetTime(e.target.value)}
                      className="w-full bg-navy-950 border border-surface-border rounded p-2 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Select Channels */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <span className="text-slate-300 font-bold block uppercase">
                  Step 4: Multi-Channel Broadcast Selection
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2 bg-navy-950 p-3 rounded border border-surface-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.push}
                      onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                      className="rounded text-brand-blue"
                    />
                    <Smartphone className="w-4 h-4 text-brand-cyan" />
                    <div>
                      <span className="font-bold text-white block">Mobile Push</span>
                      <span className="text-[10px] text-slate-400 font-sans">Citizen Safety App notification</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 bg-navy-950 p-3 rounded border border-surface-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.sms}
                      onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                      className="rounded text-brand-blue"
                    />
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">Cell Broadcast SMS</span>
                      <span className="text-[10px] text-slate-400 font-sans">Geofenced tower broadcast</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 bg-navy-950 p-3 rounded border border-surface-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.ivr}
                      onChange={(e) => setChannels({ ...channels, ivr: e.target.checked })}
                      className="rounded text-brand-blue"
                    />
                    <Radio className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-bold text-white block">IVR Automated Voice</span>
                      <span className="text-[10px] text-slate-400 font-sans">Priority voice call to ward leaders</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 bg-navy-950 p-3 rounded border border-surface-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.portal}
                      onChange={(e) => setChannels({ ...channels, portal: e.target.checked })}
                      className="rounded text-brand-primary"
                    />
                    <Globe className="w-4 h-4 text-brand-cyan" />
                    <div>
                      <span className="font-bold text-white block">Public Safety Portal</span>
                      <span className="text-[10px] text-slate-400 font-sans">Municipal live alert banner</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 5: Review Summary */}
            {currentStep === 5 && (
              <div className="space-y-3">
                <span className="text-slate-300 font-bold block uppercase">
                  Step 5: Pre-Broadcast Operational Review
                </span>
                <div className="bg-navy-950 p-3.5 rounded border border-surface-border space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Area:</span>
                    <span className="font-bold text-white">{targetZone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Severity Level:</span>
                    <span className="font-bold text-red-400">{severity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Population Reached:</span>
                    <span className="font-bold text-amber-300">{affectedPopulation.toLocaleString()} citizens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Channels:</span>
                    <span className="text-brand-cyan font-bold uppercase">
                      {Object.keys(channels).filter((k) => (channels as any)[k]).join(', ')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-navy-850">
                    <span className="text-slate-400 block mb-1">Message Text:</span>
                    <p className="text-slate-200 bg-navy-900 p-2 rounded border border-surface-border font-sans text-xs">
                      "{message}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Authorize */}
            {currentStep === 6 && (
              <div className="space-y-3">
                <span className="text-slate-300 font-bold block uppercase">
                  Step 6: Disaster Duty Officer Sign-Off & PIN
                </span>
                <div className="bg-navy-950 p-4 rounded border border-red-700/60 space-y-3">
                  <div className="flex items-center space-x-2 text-red-400 font-bold">
                    <Lock className="w-4 h-4" />
                    <span>AUTHORIZATION AUDIT SIGN-OFF REQUIRED</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Issuing this broadcast will immediately alert citizens and response agencies. By submitting your
                    passcode, your digital identity is signed into the security audit log.
                  </p>
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">
                      Enter Duty Officer Passcode (Demo Default: 8492):
                    </label>
                    <input
                      type="password"
                      value={officerPin}
                      onChange={(e) => setOfficerPin(e.target.value)}
                      className="w-full bg-navy-900 border border-surface-border rounded p-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
              <button
                type="button"
                onClick={currentStep === 1 ? onClose : handleBack}
                className="px-4 py-2 rounded bg-navy-850 hover:bg-navy-750 text-slate-300 font-semibold border border-surface-border flex items-center space-x-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className={`px-5 py-2 rounded font-bold flex items-center space-x-1.5 transition-colors ${
                  currentStep === 6
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-brand-primary hover:bg-brand-hover text-white'
                }`}
              >
                <span>{currentStep === 6 ? 'Authorize & Broadcast' : 'Next Step'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

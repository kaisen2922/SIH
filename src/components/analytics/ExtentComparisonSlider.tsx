import React, { useState } from 'react';
import { Layers, Sliders, CheckCircle, AlertTriangle } from 'lucide-react';

export const ExtentComparisonSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100

  return (
    <div className="bg-navy-900 border border-surface-border rounded-lg p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-brand-cyan" />
            <span>Predicted vs Observed Flood Extent Evaluation</span>
          </h3>
          <p className="text-xs text-slate-400">
            Compare AI Inundation Model Output against Sentinel-1 SAR Ground Truth Satellite Imagery
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-brand-primary/20 text-blue-300 px-2.5 py-1 rounded border border-brand-primary/40 font-bold">
            Spatial Overlap: 91.2%
          </span>
        </div>
      </div>

      {/* Interactive Split-Screen Slider Mock Visualizer */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-surface-border bg-navy-950 select-none cursor-ew-resize">
        {/* Left Side: Predicted Extent Layer */}
        <div
          className="absolute inset-0 bg-navy-950 p-4"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <div className="w-full h-full rounded border border-red-500/40 bg-red-950/40 p-4 relative flex flex-col justify-between">
            <div className="bg-navy-900/90 backdrop-blur px-2.5 py-1 rounded border border-red-500/50 w-fit text-red-300 font-mono text-xs font-bold">
              AI PREDICTED EXTENT (MC-042)
            </div>
            <div className="text-xs text-red-300 font-mono space-y-1">
              <p>• Estimated Surface Inundation: 1.42 km²</p>
              <p>• Projected Lead Time: 42 Min</p>
            </div>
          </div>
        </div>

        {/* Right Side: Observed Satellite SAR Extent Layer */}
        <div
          className="absolute inset-0 bg-navy-950 p-4"
          style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
        >
          <div className="w-full h-full rounded border border-teal-500/40 bg-teal-950/40 p-4 relative flex flex-col justify-between">
            <div className="bg-navy-900/90 backdrop-blur px-2.5 py-1 rounded border border-teal-500/50 w-fit text-teal-300 font-mono text-xs font-bold ml-auto">
              SENTINEL-1 SAR OBSERVED GROUND TRUTH
            </div>
            <div className="text-xs text-teal-300 font-mono space-y-1 text-right">
              <p>• Actual Surface Inundation: 1.38 km²</p>
              <p>• Satellite Overpass: 11:15 AM</p>
            </div>
          </div>
        </div>

        {/* Vertical Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-20 flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-brand-primary text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-md">
            ↔
          </div>
        </div>

        {/* Invisible Range Input Overlay for Dragging */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPos}
          onChange={(e) => setSliderPos(parseInt(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
        />
      </div>

      {/* Model Performance Metrics Cards */}
      <div className="grid grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-navy-950 p-3 rounded border border-surface-border text-center">
          <span className="text-slate-400 block text-[10px]">Precision Rate</span>
          <span className="text-lg font-bold text-emerald-400">88.4%</span>
        </div>
        <div className="bg-navy-950 p-3 rounded border border-surface-border text-center">
          <span className="text-slate-400 block text-[10px]">Recall Score</span>
          <span className="text-lg font-bold text-brand-cyan">91.2%</span>
        </div>
        <div className="bg-navy-950 p-3 rounded border border-surface-border text-center">
          <span className="text-slate-400 block text-[10px]">False Alarm Rate</span>
          <span className="text-lg font-bold text-emerald-300">4.1%</span>
        </div>
        <div className="bg-navy-950 p-3 rounded border border-surface-border text-center">
          <span className="text-slate-400 block text-[10px]">Lead Time Window</span>
          <span className="text-lg font-bold text-amber-300">42 Min</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ExplainableAIFactor } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Brain, HelpCircle, Database, Layers } from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';

interface ExplainableAIWaterfallProps {
  factors: ExplainableAIFactor[];
  totalRiskPct: number;
  catchmentCode: string;
}

export const ExplainableAIWaterfall: React.FC<ExplainableAIWaterfallProps> = ({
  factors,
  totalRiskPct,
  catchmentCode,
}) => {
  const { openProvenanceModal } = useIncident();

  const chartData = factors.map((f) => ({
    name: f.factor.split('(')[0].trim(),
    pts: f.weightPts,
    fullFactor: f.factor,
    desc: f.description,
    category: f.category,
  }));

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'meteorological':
        return '#2563EB'; // Primary Blue
      case 'topographical':
        return '#06B6D4'; // Secondary Intelligence Cyan
      case 'infrastructure':
        return '#14B8A6'; // Operational Teal
      case 'historical':
      default:
        return '#64748B'; // Muted Slate
    }
  };

  return (
    <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center">
            <Brain className="w-4 h-4 text-brand-cyan" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white">Explainable AI (XAI) Attribution Breakdown</h3>
              <span className="badge-simulation">
                SIMULATED FEATURE CONTRIBUTION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Factor Weight Decomposition for Catchment <span className="font-mono text-brand-cyan font-semibold">{catchmentCode}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openProvenanceModal()}
            className="px-2.5 py-1.5 rounded bg-navy-850 hover:bg-navy-750 text-slate-200 border border-surface-border text-xs font-mono flex items-center space-x-1 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-brand-cyan" />
            <span>VIEW DATA PROVENANCE</span>
          </button>
        </div>
      </div>

      {/* Why is this zone at risk explanation */}
      <div className="bg-navy-850 p-3.5 rounded border border-surface-border space-y-1">
        <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5 font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Why is {catchmentCode} flagged at {totalRiskPct}% Critical Risk?</span>
        </h4>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          The simulated hydrodynamic nowcast model aggregates real-time Doppler radar intensity, terrain digital elevation depression depth, and drainage siltation constraints. Relative factor weights are visualized below:
        </p>
      </div>

      {/* Relative Contribution Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <XAxis type="number" domain={[0, 40]} stroke="#64748b" tickFormatter={(v) => `+${v} pts`} />
            <YAxis type="category" dataKey="name" width={180} stroke="#cbd5e1" tick={{ fontSize: 11 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-navy-900 border border-surface-border p-2.5 rounded shadow-xl max-w-xs text-xs">
                      <p className="font-bold text-white mb-1">{data.fullFactor}</p>
                      <p className="text-brand-cyan font-mono mb-1">Simulated Contribution: +{data.pts} pts</p>
                      <p className="text-slate-300 text-[11px] font-sans">{data.desc}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="pts" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Risk Contribution Table */}
      <div className="space-y-1.5 pt-2 border-t border-surface-border">
        {factors.map((factor, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-navy-850 p-2.5 rounded text-xs border border-surface-border hover:border-slate-500 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="font-mono text-slate-500 font-bold">{idx + 1}.</span>
              <span className="text-slate-200 font-medium font-sans">{factor.factor}</span>
            </div>
            <span className="font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
              +{factor.weightPts} risk pts
            </span>
          </div>
        ))}
      </div>

      <div className="pt-1 text-[10px] text-slate-500 text-center font-mono">
        SIMULATED FEATURE CONTRIBUTION · DEMO DATASET
      </div>
    </div>
  );
};

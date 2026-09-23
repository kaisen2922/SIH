import React from 'react';
import { RouteOption } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { Mountain, ShieldCheck } from 'lucide-react';

interface ElevationProfileChartProps {
  route: RouteOption;
}

export const ElevationProfileChart: React.FC<ElevationProfileChartProps> = ({ route }) => {
  const data = route.elevationProfile.map((p) => ({
    dist: `${p.distanceKm} km`,
    elev: p.elevationM,
    floodLevel: 4.8, // Water level threshold
  }));

  return (
    <div className="bg-navy-800 border border-surface-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-surface-border pb-2">
        <div className="flex items-center space-x-2">
          <Mountain className="w-4 h-4 text-brand-cyan" />
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Elevation Profile & Water Inundation Cross-Section
          </h4>
        </div>
        <span className="text-xs font-mono font-bold text-slate-300">{route.name}</span>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorElev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="dist" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" domain={[0, 12]} tickFormatter={(v) => `${v}m`} tick={{ fontSize: 10 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-navy-850 border border-surface-border p-2 rounded text-xs font-mono">
                      <p className="text-slate-300">Distance: {payload[0].payload.dist}</p>
                      <p className="text-teal-400 font-bold">Terrain Elevation: {payload[0].value}m MSL</p>
                      <p className="text-red-400">Flood Inundation Baseline: 4.8m MSL</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={4.8} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Flood Baseline', fill: '#ef4444', fontSize: 10 }} />
            <Area type="monotone" dataKey="elev" stroke="#14B8A6" fillOpacity={1} fill="url(#colorElev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono bg-navy-850 p-2 rounded border border-surface-border">
        <span>Low Elevation Risk Threshold: &lt;4.8m MSL</span>
        <span className="text-teal-400 font-bold flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Route Clearance Margin: +2.4m Safe</span>
        </span>
      </div>
    </div>
  );
};

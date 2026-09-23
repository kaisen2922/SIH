import React, { useState } from 'react';
import { Navigation, ShieldCheck, AlertTriangle, Mountain, Clock, MapPin, ArrowRight } from 'lucide-react';
import { RouteOption } from '../types';
import { ElevationProfileChart } from '../components/routes/ElevationProfileChart';
import { RiskBadge } from '../components/common/RiskBadge';
import { useIncident } from '../context/IncidentContext';

interface RoutesPageProps {
  routes: RouteOption[];
  onNavigate: (tab: string, params?: any) => void;
  initialDestination?: string;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({ routes: initialRoutes, onNavigate, initialDestination }) => {
  const { selectRoute, selectedRoute: globalSelectedRoute } = useIncident();

  const [selectedRouteId, setSelectedRouteId] = useState(globalSelectedRoute?.id || 'rt-c');
  const [origin, setOrigin] = useState('Kolkata Municipal Headquarters (Central Ward Command)');
  const [destination, setDestination] = useState(
    initialDestination || 'SSKM Multi-Specialty Hospital Emergency Gate 3'
  );

  // Section 13: Evaluated Routes with exact specified metrics
  const formattedRoutes = [
    {
      id: 'rt-a',
      name: 'Route A — Direct via Circular Canal Rd',
      riskLevel: 'CRITICAL' as const,
      riskScorePct: 82,
      distanceKm: 4.2,
      durationMin: 28,
      riskySegments: 3,
      waterDepthCm: 45,
      clearanceMarginM: 0.1,
      minElevationM: 4.1,
      hazards: [
        'Severe inundation (>45cm water depth) under Ultadanga flyover underpass',
        'Canal overflow in progress at Ward 17 lock gate',
      ],
      elevationProfile: [
        { distanceKm: 0.0, elevationM: 5.5, risk: 'LOW' as const },
        { distanceKm: 1.2, elevationM: 4.5, risk: 'CRITICAL' as const },
        { distanceKm: 2.8, elevationM: 4.1, risk: 'CRITICAL' as const },
        { distanceKm: 4.2, elevationM: 4.8, risk: 'HIGH' as const },
      ],
      coordinates: [
        [22.585, 88.368],
        [22.586, 88.373],
        [22.580, 88.378],
        [22.560, 88.360],
      ] as [number, number][],
    },
    {
      id: 'rt-b',
      name: 'Route B — Via Maniktala Bypass',
      riskLevel: 'MODERATE' as const,
      riskScorePct: 41,
      distanceKm: 5.1,
      durationMin: 16,
      riskySegments: 1,
      waterDepthCm: 18,
      clearanceMarginM: 1.2,
      minElevationM: 5.4,
      hazards: ['Minor curb pooling near Maniktala market (15-20cm water depth)'],
      elevationProfile: [
        { distanceKm: 0.0, elevationM: 5.5, risk: 'LOW' as const },
        { distanceKm: 1.8, elevationM: 6.2, risk: 'MODERATE' as const },
        { distanceKm: 3.2, elevationM: 5.4, risk: 'MODERATE' as const },
        { distanceKm: 5.1, elevationM: 5.8, risk: 'LOW' as const },
      ],
      coordinates: [
        [22.585, 88.368],
        [22.578, 88.375],
        [22.568, 88.365],
        [22.558, 88.355],
      ] as [number, number][],
    },
    {
      id: 'rt-c',
      name: 'Route C — Via Northern High Ridge (Elevated Corridor)',
      riskLevel: 'LOW' as const,
      riskScorePct: 18,
      distanceKm: 6.4,
      durationMin: 18,
      riskySegments: 0,
      waterDepthCm: 0,
      clearanceMarginM: 3.5,
      minElevationM: 6.8,
      hazards: ['Clean high-elevation surface', 'No recorded drainage bottlenecks'],
      elevationProfile: [
        { distanceKm: 0.0, elevationM: 5.5, risk: 'LOW' as const },
        { distanceKm: 1.5, elevationM: 8.2, risk: 'LOW' as const },
        { distanceKm: 3.5, elevationM: 9.1, risk: 'LOW' as const },
        { distanceKm: 5.0, elevationM: 7.4, risk: 'LOW' as const },
        { distanceKm: 6.4, elevationM: 6.8, risk: 'LOW' as const },
      ],
      coordinates: [
        [22.585, 88.368],
        [22.595, 88.365],
        [22.605, 88.360],
        [22.598, 88.350],
        [22.588, 88.345],
      ] as [number, number][],
    },
  ];

  const selectedRoute = formattedRoutes.find((r) => r.id === selectedRouteId) || formattedRoutes[2];

  const handleSelectRoute = (rt: any) => {
    setSelectedRouteId(rt.id);
    selectRoute(rt as any);
  };

  const handleViewRouteOnGIS = () => {
    selectRoute(selectedRoute as any);
    onNavigate('map', { showRoute: selectedRoute.id });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 p-5 rounded-lg border border-surface-border">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-brand-primary" />
            <span className="font-mono text-xs text-brand-cyan uppercase font-bold tracking-wider">
              Hyperlocal Safe Evacuation & Response Routing
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
            Flood-Aware Navigation & Elevation Profile Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            Topographical elevation profiling ensures emergency vehicles and evacuations bypass low-lying drainage depression basins.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Section 13: VIEW ROUTE ON GIS MAP Button */}
          <button
            onClick={handleViewRouteOnGIS}
            className="px-4 py-2.5 rounded bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs flex items-center space-x-2 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>VIEW ROUTE ON GIS MAP</span>
          </button>
        </div>
      </div>

      {/* Origin / Destination Search Form */}
      <div className="bg-navy-800 border border-surface-border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div>
          <label className="text-slate-400 block mb-1 font-bold">Origin (From):</label>
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-teal-400 absolute left-2.5" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-navy-850 border border-surface-border rounded pl-8 pr-3 py-2 text-slate-100 focus:border-brand-primary focus:outline-none font-sans"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1 font-bold">Destination (To):</label>
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-red-400 absolute left-2.5" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-navy-850 border border-surface-border rounded pl-8 pr-3 py-2 text-slate-100 focus:border-brand-primary focus:outline-none font-sans"
            />
          </div>
        </div>
      </div>

      {/* Section 13: Route Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Evaluated Routes List */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            EVALUATED ROUTE OPTIONS (CLICK TO SELECT)
          </h2>

          {formattedRoutes.map((rt) => {
            const isSelected = rt.id === selectedRoute.id;
            const isLowestRisk = rt.id === 'rt-c';
            return (
              <div
                key={rt.id}
                onClick={() => handleSelectRoute(rt)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors space-y-2.5 ${
                  isSelected
                    ? 'bg-navy-850 border-brand-primary'
                    : 'bg-navy-800 border-surface-border hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RiskBadge level={rt.riskLevel} />
                    {isLowestRisk ? (
                      <span className="badge-low">
                        LOWEST RISK
                      </span>
                    ) : isSelected ? (
                      <span className="badge-estimate">
                        SELECTED
                      </span>
                    ) : null}
                  </div>
                  <span className="font-mono text-xs font-bold text-white">{rt.distanceKm} km</span>
                </div>

                <h3 className="font-bold text-sm text-white font-sans">{rt.name}</h3>

                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-slate-300 pt-2 border-t border-surface-border">
                  <div>
                    <span className="text-slate-500 block text-[9px]">Travel Time:</span>
                    <span className="font-bold text-white">{rt.durationMin} min</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Flood Risk:</span>
                    <span className={`font-bold ${rt.riskScorePct > 70 ? 'text-red-400' : 'text-teal-400'}`}>
                      {rt.riskScorePct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Water Depth:</span>
                    <span className="font-bold text-amber-400">{rt.waterDepthCm} cm</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-400 pt-1">
                  <div>Clearance: <b className="text-slate-200">{rt.clearanceMarginM}m</b></div>
                  <div>Min Elev: <b className="text-slate-200">{rt.minElevationM}m MSL</b></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel: Selected Route Profile Chart & Technical Advisory */}
        <div className="lg:col-span-2 space-y-4">
          <ElevationProfileChart route={selectedRoute as any} />

          {/* Selected Route Operational Banner */}
          <div className="bg-navy-800 border border-surface-border rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <div className="flex items-center space-x-2 text-brand-cyan font-bold text-xs font-mono">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>SELECTED ROUTE: {selectedRoute.name}</span>
              </div>
              <span className="bg-navy-850 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-surface-border">
                {selectedRoute.id === 'rt-c' ? 'LOWEST MODELLED FLOOD RISK' : 'ALTERNATIVE PASSAGE'}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {selectedRoute.id === 'rt-c'
                ? 'Maintains elevation >6.8m MSL throughout the corridor along Northern High Ridge, safely bypassing the Circular Canal depression sink and Ultadanga underpass bottleneck.'
                : selectedRoute.id === 'rt-b'
                ? 'Passes through moderate elevation terrain with localized curb ponding near Maniktala market. Requires low-speed navigation.'
                : 'Direct trajectory traversing deep inundation (>45cm) under Ultadanga flyover. Not safe for passenger or light emergency vehicles.'}
            </p>

            {/* Hazards List */}
            <div className="space-y-1.5 pt-2 border-t border-surface-border">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                SEGMENT HAZARDS & CLEARANCES
              </span>
              {selectedRoute.hazards.map((hzd, idx) => (
                <div key={idx} className="bg-navy-850 p-2 rounded border border-surface-border text-xs font-mono text-slate-200">
                  • {hzd}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleViewRouteOnGIS}
                className="px-4 py-2 rounded bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Render Vector on Live Flood Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

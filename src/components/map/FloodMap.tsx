import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Search,
  ChevronRight,
  Navigation,
  HelpCircle,
  AlertTriangle,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  FileCheck2,
  Truck,
  Droplets,
  Compass,
} from 'lucide-react';
import { MicroCatchment, SensorNode, InfrastructureAsset, CitizenReport, RouteOption } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { useIncident } from '../../context/IncidentContext';

interface FloodMapProps {
  catchments: MicroCatchment[];
  sensors: SensorNode[];
  infrastructure: InfrastructureAsset[];
  reports: CitizenReport[];
  selectedCatchment: MicroCatchment | null;
  onSelectCatchment: (catchment: MicroCatchment | null) => void;
  onNavigateToModule?: (tab: string, params?: any) => void;
  timelineMinutes?: number;
}

export const FloodMap: React.FC<FloodMapProps> = ({
  catchments,
  sensors,
  infrastructure,
  reports,
  selectedCatchment,
  onSelectCatchment,
  onNavigateToModule,
}) => {
  const {
    timelineMinutes,
    setTimelineMinutes,
    selectAsset,
    selectRoute,
    routes,
    fieldTeams,
    floodProbability,
    estimatedOnset,
    rainfall,
    runoff,
  } = useIncident();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Professional Layer Visibility State (Section 5)
  const [layers, setLayers] = useState({
    floodRisk: true,
    catchments: true,
    flowDirection: true,
    drainage: true,
    infrastructure: true,
    rainfall: true,
    historicalFloods: false,
    citizenReports: true,
    responseTeams: true,
    safeRoutes: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isWhyExpanded, setIsWhyExpanded] = useState(true);

  // CARTO API Key Integration (Section 21)
  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
  const tileUrl = cartoApiKey
    ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoApiKey}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Kolkata Center Coords
    const map = L.map(mapContainerRef.current, {
      center: [22.578, 88.372],
      zoom: 13,
      zoomControl: false,
    });

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 20,
      attribution: cartoApiKey
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Time-slider definitions (Section 5)
  const timeSliderSteps = [
    { label: 'NOW', minutes: 0, risk: 'LOW' as const, prob: 22, rain: 14 },
    { label: '+15 MIN', minutes: 15, risk: 'MODERATE' as const, prob: 48, rain: 28 },
    { label: '+30 MIN', minutes: 30, risk: 'HIGH' as const, prob: 76, rain: 34 },
    { label: '+45 MIN', minutes: 45, risk: 'CRITICAL' as const, prob: 91, rain: 38 },
    { label: '+60 MIN', minutes: 60, risk: 'CRITICAL' as const, prob: 94, rain: 42 },
    { label: '+90 MIN', minutes: 90, risk: 'MODERATE' as const, prob: 68, rain: 24 },
  ];

  // Global Search Handler (Section 22)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results: any[] = [];

    // Match Catchments
    catchments.forEach((mc) => {
      if (mc.code.toLowerCase().includes(q) || mc.name.toLowerCase().includes(q) || `ward ${mc.ward}`.includes(q)) {
        results.push({ type: 'Catchment', title: `${mc.code} (Ward ${mc.ward})`, subtitle: mc.name, data: mc, latLng: mc.coordinates[0] });
      }
    });

    // Match Assets / Hospitals / Roads
    infrastructure.forEach((asset) => {
      if (asset.name.toLowerCase().includes(q) || asset.category.toLowerCase().includes(q) || `ward ${asset.ward}`.includes(q)) {
        results.push({ type: 'Asset', title: asset.name, subtitle: `${asset.category.toUpperCase()} · Ward ${asset.ward}`, data: asset, latLng: [asset.lat, asset.lng] });
      }
    });

    // Match Citizen Reports
    reports.forEach((rep) => {
      if (rep.id.toLowerCase().includes(q) || rep.title.toLowerCase().includes(q) || rep.address.toLowerCase().includes(q)) {
        results.push({ type: 'Citizen Report', title: rep.title, subtitle: `${rep.depthCm}cm depth · ${rep.id}`, data: rep, latLng: [rep.lat, rep.lng] });
      }
    });

    // Match Teams
    fieldTeams.forEach((ft) => {
      if (ft.name.toLowerCase().includes(q) || ft.task.toLowerCase().includes(q)) {
        results.push({ type: 'Response Team', title: ft.name, subtitle: `${ft.status} · ${ft.location}`, data: ft, latLng: [ft.lat, ft.lng] });
      }
    });

    setSearchResults(results.slice(0, 5));
  }, [searchQuery, catchments, infrastructure, reports, fieldTeams]);

  const handleSelectSearchResult = (result: any) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(result.latLng, 15, { duration: 1.2 });
    setSearchQuery('');
    setSearchResults([]);

    if (result.type === 'Catchment') {
      onSelectCatchment(result.data);
    } else if (result.type === 'Asset') {
      selectAsset(result.data);
    }
  };

  // Render Vector Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous vector layers
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // 1. Catchments & Flood Risk
    if (layers.catchments || layers.floodRisk) {
      catchments.forEach((mc) => {
        const isSelected = selectedCatchment?.id === mc.id;

        // Dynamic colors based on timeline & catchment risk
        let fillColor = '#10b981';
        let strokeColor = '#059669';
        if (mc.code === 'MC-042') {
          if (floodProbability > 85) {
            fillColor = '#ef4444';
            strokeColor = '#dc2626';
          } else if (floodProbability > 65) {
            fillColor = '#f97316';
            strokeColor = '#ea580c';
          } else {
            fillColor = '#eab308';
            strokeColor = '#ca8a04';
          }
        } else if (mc.riskLevel === 'CRITICAL') {
          fillColor = '#ef4444';
          strokeColor = '#dc2626';
        } else if (mc.riskLevel === 'HIGH') {
          fillColor = '#f97316';
          strokeColor = '#ea580c';
        } else if (mc.riskLevel === 'MODERATE') {
          fillColor = '#eab308';
          strokeColor = '#ca8a04';
        }

        const polygon = L.polygon(mc.coordinates, {
          color: isSelected ? '#38bdf8' : strokeColor,
          weight: isSelected ? 3.5 : 2,
          fillColor: fillColor,
          fillOpacity: layers.floodRisk ? (isSelected ? 0.6 : 0.35) : 0.05,
          dashArray: layers.catchments ? undefined : '4,4',
        }).addTo(map);

        polygon.bindTooltip(
          `<b>${mc.code} · Ward ${mc.ward}</b><br/>Flood Prob: ${mc.code === 'MC-042' ? floodProbability : mc.floodProbabilityPct}% (${mc.riskLevel})<br/><span style="font-size:10px;color:#38bdf8">Click to inspect hydraulic pipeline</span>`,
          { sticky: true, className: 'bg-navy-900 text-white font-mono text-xs border border-surface-border p-1.5' }
        );

        // Section 6: Click catchment -> Catchments & Flow
        polygon.on('click', () => {
          onSelectCatchment(mc);
        });
      });
    }

    // 2. Drainage Network & Flow Vectors
    if (layers.drainage || layers.flowDirection) {
      const canals: [number, number][][] = [
        [
          [22.605, 88.365],
          [22.592, 88.374],
          [22.585, 88.375],
          [22.570, 88.388],
        ],
        [
          [22.545, 88.345],
          [22.532, 88.350],
          [22.520, 88.362],
        ],
      ];

      canals.forEach((line) => {
        L.polyline(line, {
          color: '#0284c7',
          weight: 4,
          opacity: 0.85,
          dashArray: layers.flowDirection ? '8, 6' : undefined,
        }).addTo(map);
      });
    }

    // 3. Rainfall Radar
    if (layers.rainfall) {
      L.circle([22.585, 88.372], {
        radius: 1400,
        color: '#38bdf8',
        weight: 1,
        fillColor: '#0284c7',
        fillOpacity: 0.22,
      }).addTo(map);
    }

    // 4. Infrastructure Assets (Section 6: Click hospital -> Impact & Vulnerability)
    if (layers.infrastructure) {
      infrastructure.forEach((asset) => {
        const iconHtml = `<div class="w-6 h-6 rounded-full ${
          asset.floodedStatus === 'INUNDATED'
            ? 'bg-red-600 ring-4 ring-red-500/40 animate-pulse'
            : asset.floodedStatus === 'AT_RISK'
            ? 'bg-amber-600 ring-2 ring-amber-500/30'
            : 'bg-brand-primary'
        } flex items-center justify-center text-white text-[10px] font-bold shadow-md cursor-pointer">
          ${asset.category === 'hospital' ? '🏥' : asset.category === 'road' ? '🛣️' : '⚡'}
        </div>`;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-infra-marker',
          iconSize: [24, 24],
        });

        const marker = L.marker([asset.lat, asset.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div class="p-1 space-y-1 text-slate-100 font-sans">
            <h4 class="font-bold text-xs text-white">${asset.name}</h4>
            <p class="text-[11px] text-slate-300">Category: <span class="uppercase font-mono">${asset.category}</span> · Ward ${asset.ward}</p>
            <p class="text-[11px]">Status: <b class="${asset.floodedStatus === 'INUNDATED' ? 'text-red-400' : 'text-amber-400'}">${asset.floodedStatus}</b></p>
            <button id="btn-infra-${asset.id}" class="mt-1 w-full bg-brand-primary hover:bg-brand-hover text-white font-mono text-[10px] py-1 px-2 rounded transition-colors">
              Inspect Asset Details →
            </button>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-infra-${asset.id}`);
          if (btn) {
            btn.onclick = () => {
              selectAsset(asset);
              if (onNavigateToModule) onNavigateToModule('infrastructure');
            };
          }
        });
      });
    }

    // 5. Citizen Reports (Section 6: Click report -> Citizen Flood Reports)
    if (layers.citizenReports) {
      reports.forEach((rep) => {
        const iconHtml = `<div class="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] border border-white/60 cursor-pointer">📷</div>`;
        const markerIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-report-marker',
          iconSize: [20, 20],
        });

        const marker = L.marker([rep.lat, rep.lng], { icon: markerIcon }).addTo(map);
        marker.bindPopup(`
          <div class="p-1 text-slate-100 font-sans">
            <h4 class="font-bold text-xs text-white">${rep.title}</h4>
            <p class="text-[11px] text-slate-300">Depth: <b class="text-amber-400 font-mono">${rep.depthCm} cm</b></p>
            <p class="text-[10px] text-teal-400 font-mono">Status: ${rep.verificationStatus}</p>
            <button id="btn-rep-${rep.id}" class="mt-1 w-full bg-brand-primary hover:bg-brand-hover text-white font-mono text-[10px] py-1 px-2 rounded transition-colors">
              View Citizen Report Inbox →
            </button>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-rep-${rep.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onNavigateToModule) onNavigateToModule('reports');
            };
          }
        });
      });
    }

    // 6. Response Teams (Section 6: Click team -> Field Response)
    if (layers.responseTeams) {
      fieldTeams.forEach((ft) => {
        const iconHtml = `<div class="w-6 h-6 rounded bg-emerald-600 border border-white text-white flex items-center justify-center font-bold text-[10px] shadow-lg cursor-pointer">🚒</div>`;
        const markerIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-team-marker',
          iconSize: [24, 24],
        });
        const marker = L.marker([ft.lat, ft.lng], { icon: markerIcon }).addTo(map);
        marker.bindPopup(`
          <div class="p-1 text-slate-100 font-sans">
            <h4 class="font-bold text-xs text-white">${ft.name}</h4>
            <p class="text-[11px] text-slate-300">Status: <b class="text-amber-300 font-mono">${ft.status}</b> · ETA: ${ft.eta}</p>
            <p class="text-[10px] text-slate-400">Task: ${ft.task}</p>
            <button id="btn-team-${ft.id}" class="mt-1 w-full bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-[10px] py-1 px-2 rounded">
              Inspect Field Deployment →
            </button>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-team-${ft.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onNavigateToModule) onNavigateToModule('field');
            };
          }
        });
      });
    }

    // 7. Safe Routes (Section 6: Click route -> Safe Routes)
    if (layers.safeRoutes && routes.length > 0) {
      routes.forEach((rt) => {
        const routeColor = rt.riskLevel === 'CRITICAL' ? '#ef4444' : rt.riskLevel === 'MODERATE' ? '#eab308' : '#10b981';
        const polyline = L.polyline(rt.coordinates, {
          color: routeColor,
          weight: 4.5,
          opacity: 0.9,
          dashArray: rt.recommended ? undefined : '6, 6',
        }).addTo(map);

        polyline.bindTooltip(
          `<b>${rt.name}</b><br/>${rt.distanceKm} km · ${rt.durationMin} min · ${rt.riskLevel} (${rt.floodProbabilityPct}% risk)<br/><span style="font-size:10px;color:#38bdf8">Click to open Route Analyzer</span>`,
          { sticky: true, className: 'bg-navy-900 text-white font-mono text-xs border border-surface-border p-1.5' }
        );

        polyline.on('click', () => {
          selectRoute(rt);
          if (onNavigateToModule) onNavigateToModule('routes');
        });
      });
    }
  }, [layers, catchments, sensors, infrastructure, reports, fieldTeams, routes, selectedCatchment, floodProbability]);

  // Center map on selected catchment
  useEffect(() => {
    if (selectedCatchment && mapInstanceRef.current) {
      const coords = selectedCatchment.coordinates;
      if (coords && coords.length > 0) {
        mapInstanceRef.current.flyTo(coords[0], 14, { duration: 1.2 });
      }
    }
  }, [selectedCatchment]);

  const currentMc = selectedCatchment || catchments[0];

  return (
    <div className="relative w-full h-[calc(100vh-95px)] bg-navy-950 overflow-hidden flex">
      {/* Top Left Global Search Bar (Section 22) */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col space-y-1">
        <div className="flex items-center space-x-2 bg-navy-900/95 backdrop-blur-md p-2 rounded-lg border border-surface-border shadow-xl">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5" />
            <input
              type="text"
              placeholder="Search Ward, Catchment, Asset, Team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-navy-950 border border-surface-border rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-blue w-64 font-sans"
            />
          </div>

          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([22.578, 88.372], 13);
              }
            }}
            className="p-1.5 rounded bg-navy-800 hover:bg-navy-750 text-slate-300 border border-surface-border"
            title="Reset Map Bounds to Kolkata Basin"
          >
            <Navigation className="w-4 h-4 text-brand-blue" />
          </button>
        </div>

        {/* Global Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="w-72 bg-navy-900 border border-surface-border rounded-lg shadow-2xl p-1.5 space-y-1 z-50">
            {searchResults.map((res, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSearchResult(res)}
                className="p-2 rounded hover:bg-navy-800 cursor-pointer text-xs space-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate">{res.title}</span>
                  <span className="text-[9px] font-mono text-brand-cyan bg-navy-950 px-1 rounded uppercase">
                    {res.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{res.subtitle}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Right: MAP LAYERS Professional Controller (Section 5) */}
      <div className="absolute top-4 right-4 z-[400] bg-navy-900/95 backdrop-blur-md p-3 rounded-lg border border-surface-border shadow-2xl w-60 space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-cyan" />
            <span>MAP LAYERS</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">CARTO Voyager</span>
        </div>

        <div className="space-y-1 text-xs">
          {[
            { key: 'floodRisk', label: 'Flood Risk', checked: layers.floodRisk },
            { key: 'catchments', label: 'Catchments', checked: layers.catchments },
            { key: 'flowDirection', label: 'Flow Direction', checked: layers.flowDirection },
            { key: 'drainage', label: 'Drainage', checked: layers.drainage },
            { key: 'infrastructure', label: 'Infrastructure', checked: layers.infrastructure },
            { key: 'rainfall', label: 'Rainfall', checked: layers.rainfall },
            { key: 'historicalFloods', label: 'Historical Floods', checked: layers.historicalFloods },
            { key: 'citizenReports', label: 'Citizen Reports', checked: layers.citizenReports },
            { key: 'responseTeams', label: 'Response Teams', checked: layers.responseTeams },
            { key: 'safeRoutes', label: 'Safe Routes', checked: layers.safeRoutes },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none py-0.5"
            >
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => setLayers({ ...layers, [item.key]: e.target.checked })}
                className="rounded bg-navy-950 border-surface-border text-brand-blue focus:ring-0"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Bottom Center: Professional Time Slider Bar (Section 5) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-navy-900/95 backdrop-blur-md px-4 py-2.5 rounded-lg border border-surface-border shadow-2xl flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-brand-cyan font-mono text-xs font-bold shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>TIME SLIDER:</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {timeSliderSteps.map((step) => {
            const isActive = timelineMinutes === step.minutes;
            return (
              <button
                key={step.minutes}
                onClick={() => setTimelineMinutes(step.minutes)}
                className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-brand-primary text-white border border-brand-primary'
                    : 'bg-navy-950 text-slate-300 hover:bg-navy-800 border border-surface-border'
                }`}
              >
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-surface-border text-xs font-mono">
          <span className="text-slate-400">Risk:</span>
          <span className={`font-bold ${floodProbability > 85 ? 'text-red-400' : 'text-amber-400'}`}>
            {floodProbability}%
          </span>
          <span className="text-slate-400">Rain:</span>
          <span className="text-brand-cyan font-bold">{rainfall} mm/h</span>
        </div>
      </div>

      {/* Bottom Left Risk Severity Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-navy-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-surface-border text-[11px] hidden sm:flex items-center space-x-3">
        <span className="font-mono text-slate-400 font-bold uppercase text-[10px]">Severity:</span>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded bg-red-600" />
          <span className="text-slate-300 font-medium">Critical</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded bg-orange-500" />
          <span className="text-slate-300 font-medium">High</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded bg-yellow-500" />
          <span className="text-slate-300 font-medium">Moderate</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
          <span className="text-slate-300 font-medium">Low</span>
        </div>
      </div>

      {/* Selected Catchment Right Drawer with Action Buttons (Section 5 & 6) */}
      {selectedCatchment && (
        <div className="absolute right-0 top-0 bottom-0 z-[500] w-96 bg-navy-900/98 backdrop-blur-md border-l border-surface-border p-4 overflow-y-auto shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            {/* Catchment Title Header */}
            <div className="flex items-start justify-between pb-3 border-b border-surface-border">
              <div>
                <h2 className="font-mono font-extrabold text-lg text-white tracking-tight">
                  {currentMc.code}
                </h2>
                <h3 className="text-xs font-semibold text-slate-300 mt-0.5">
                  Ward {currentMc.ward} · {currentMc.name}
                </h3>
              </div>
              <button
                onClick={() => onSelectCatchment(null)}
                className="p-1 rounded hover:bg-navy-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 5: MAP ACTIONS Navigation Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                INTELLIGENCE ACTIONS
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => onNavigateToModule?.('dashboard')}
                  className="p-2 rounded bg-navy-950 border border-surface-border hover:border-brand-blue text-left flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span>VIEW INCIDENT</span>
                  <ChevronRight className="w-3 h-3 text-brand-cyan" />
                </button>
                <button
                  onClick={() => onNavigateToModule?.('catchments')}
                  className="p-2 rounded bg-navy-950 border border-surface-border hover:border-brand-blue text-left flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span>VIEW CATCHMENT</span>
                  <ChevronRight className="w-3 h-3 text-brand-cyan" />
                </button>
                <button
                  onClick={() => onNavigateToModule?.('infrastructure')}
                  className="p-2 rounded bg-navy-950 border border-surface-border hover:border-brand-blue text-left flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span>VIEW IMPACT</span>
                  <ChevronRight className="w-3 h-3 text-brand-cyan" />
                </button>
                <button
                  onClick={() => onNavigateToModule?.('routes')}
                  className="p-2 rounded bg-navy-950 border border-surface-border hover:border-brand-blue text-left flex items-center justify-between text-slate-200 transition-colors"
                >
                  <span>VIEW ROUTES</span>
                  <ChevronRight className="w-3 h-3 text-brand-cyan" />
                </button>
              </div>
            </div>

            {/* FLOOD RISK Summary Box */}
            <div className="bg-navy-950 p-4 rounded-lg border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">FLOOD RISK NOWCAST</span>
                <RiskBadge level={currentMc.riskLevel} />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-navy-850">
                <div>
                  <span className="text-2xl font-mono font-extrabold text-red-400 block">
                    {currentMc.code === 'MC-042' ? floodProbability : currentMc.floodProbabilityPct}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Flood probability</span>
                </div>
                <div>
                  <span className="text-2xl font-mono font-extrabold text-amber-300 block">
                    ~{currentMc.code === 'MC-042' ? estimatedOnset : currentMc.timeToFloodMin} min
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Estimated onset</span>
                </div>
              </div>
            </div>

            {/* CATCHMENT PARAMETERS Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                HYDRAULIC PARAMETERS
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-navy-950 p-2 rounded border border-surface-border">
                  <span className="text-slate-400 block text-[10px]">Current Rainfall</span>
                  <span className="font-bold text-sky-400">
                    {currentMc.code === 'MC-042' ? rainfall : currentMc.currentRainfallMm} mm/h
                  </span>
                </div>
                <div className="bg-navy-950 p-2 rounded border border-surface-border">
                  <span className="text-slate-400 block text-[10px]">Estimated Runoff</span>
                  <span className="font-bold text-brand-cyan">
                    {currentMc.code === 'MC-042' ? runoff : currentMc.runoffEstimateM3s} m³/s
                  </span>
                </div>
                <div className="bg-navy-950 p-2 rounded border border-surface-border">
                  <span className="text-slate-400 block text-[10px]">Elevation / Slope</span>
                  <span className="font-bold text-slate-200">
                    {currentMc.elevationM}m MSL / {currentMc.slopePct}%
                  </span>
                </div>
                <div className="bg-navy-950 p-2 rounded border border-surface-border">
                  <span className="text-slate-400 block text-[10px]">Drainage Capacity</span>
                  <span className="font-bold text-amber-300">{currentMc.drainageCapacity}</span>
                </div>
              </div>
            </div>

            {/* Explainable AI Expandable Analysis */}
            <div className="bg-navy-950 border border-surface-border rounded-lg p-3 space-y-2">
              <button
                type="button"
                onClick={() => setIsWhyExpanded(!isWhyExpanded)}
                className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-200 hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Why is {currentMc.code} at Risk?</span>
                </div>
                {isWhyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isWhyExpanded && (
                <div className="space-y-1.5 pt-2 border-t border-surface-border text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rainfall Surge:</span>
                    <span className="text-red-400 font-bold">38 mm/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Depression Elevation:</span>
                    <span className="text-red-400 font-bold">4.5m MSL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Impervious Surface:</span>
                    <span className="text-slate-200 font-bold">{currentMc.imperviousSurfacePct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Canal Outfall:</span>
                    <span className="text-amber-400 font-bold">Medium Sluice</span>
                  </div>
                  <div className="pt-1 text-[9px] text-slate-400 text-center font-mono">
                    SIMULATED FEATURE CONTRIBUTION
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Operational Cross-Module Action Buttons */}
          <div className="pt-3 border-t border-surface-border space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              Cross-Module Operations:
            </div>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => onNavigateToModule?.('dashboard')}
                className="py-1.5 px-2 rounded bg-navy-850 hover:bg-navy-800 text-slate-200 border border-surface-border font-bold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>VIEW INCIDENT</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToModule?.('catchments', { catchmentId: currentMc.code })}
                className="py-1.5 px-2 rounded bg-navy-850 hover:bg-navy-800 text-brand-cyan border border-surface-border font-bold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>VIEW CATCHMENT</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToModule?.('infrastructure', { catchmentId: currentMc.code })}
                className="py-1.5 px-2 rounded bg-navy-850 hover:bg-navy-800 text-slate-200 border border-surface-border font-bold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>VIEW IMPACT</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToModule?.('routes', { catchmentId: currentMc.code })}
                className="py-1.5 px-2 rounded bg-navy-850 hover:bg-navy-800 text-teal-300 border border-surface-border font-bold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>VIEW ROUTES</span>
              </button>
            </div>

            <button
              onClick={() => onNavigateToModule?.('alerts')}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded text-xs flex items-center justify-center space-x-2 transition-colors mt-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>AUTHORIZE EMERGENCY WARNING</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

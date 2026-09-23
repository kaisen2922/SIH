export type UserRole = 'admin' | 'officer' | 'engineer' | 'field' | 'citizen';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface MicroCatchment {
  id: string;
  code: string;
  name: string;
  ward: number;
  coordinates: [number, number][]; // Polygon Lat/Lngs
  areaKm2: number;
  imperviousSurfacePct: number;
  slopePct: number;
  elevationM: number;
  drainageCapacity: 'Low' | 'Medium' | 'High';
  currentRainfallMm: number;
  forecastRainfallMm: number;
  runoffEstimateM3s: number;
  floodProbabilityPct: number;
  timeToFloodMin: number;
  riskLevel: RiskLevel;
  flowDirectionDeg: number;
  historicalFloodCount: number;
  upstreamCatchmentIds: string[];
}

export interface SensorNode {
  id: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  type: 'ultrasonic_canal' | 'rain_gauge' | 'soil_moisture';
  value: number;
  unit: string;
  threshold: number;
  status: 'operational' | 'warning' | 'offline';
  lastUpdated: string;
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  category: 'hospital' | 'school' | 'road' | 'substation' | 'metro' | 'emergency';
  lat: number;
  lng: number;
  vulnerabilityScore: number; // 0 - 100
  populationImpact: number;
  floodedStatus: 'SAFE' | 'AT_RISK' | 'INUNDATED';
  ward: number;
  address: string;
}

export interface CitizenReport {
  id: string;
  title: string;
  lat: number;
  lng: number;
  address: string;
  depthCm: number;
  imageUrl: string;
  description: string;
  timestamp: string;
  verificationStatus: 'VERIFIED' | 'UNDER_REVIEW' | 'DUPLICATE';
  aiConfidencePct: number;
  radarCorrelation: boolean;
  upvotes: number;
}

export interface AlertItem {
  id: string;
  title: string;
  severity: RiskLevel;
  targetWard: string;
  affectedPopulation: number;
  onsetTime: string;
  recommendedAction: string;
  channels: ('push' | 'sms' | 'voice' | 'pa')[];
  status: 'BROADCAST' | 'PENDING' | 'AUTHORIZED';
  timestamp: string;
  authorizedBy: string;
}

export interface RouteOption {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  floodProbabilityPct: number;
  distanceKm: number;
  durationMin: number;
  elevationProfile: { distanceKm: number; elevationM: number; risk: RiskLevel }[];
  coordinates: [number, number][];
  hazards: string[];
  recommended: boolean;
}

export interface FieldIncident {
  id: string;
  incidentNo: string;
  title: string;
  ward: number;
  priority: RiskLevel;
  assignedTeam: string;
  teamStatus: 'EN_ROUTE' | 'ON_SITE' | 'RESOLVED' | 'PENDING';
  lat: number;
  lng: number;
  reportedTime: string;
  description: string;
}

export interface ExplainableAIFactor {
  factor: string;
  weightPts: number;
  description: string;
  category: 'meteorological' | 'topographical' | 'infrastructure' | 'historical';
}

export interface DataSourcePipeline {
  id: string;
  name: string;
  provider: string;
  category:
    | 'Weather'
    | 'Terrain'
    | 'Satellite'
    | 'Drainage GIS'
    | 'IoT'
    | 'Citizen Reports'
    | 'ML Pipeline'
    | 'GIS Infrastructure'
    | 'IoT Sensors';
  status: 'ONLINE' | 'DELAYED' | 'DEGRADED' | 'OFFLINE';
  lastUpdated: string;
  latencyMs: number;
  coveragePct: number;
  qualityScorePct: number;
  dataFreshness?: string;
  fallback?: string;
}

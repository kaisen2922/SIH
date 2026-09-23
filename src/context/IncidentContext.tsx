import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MicroCatchment,
  SensorNode,
  InfrastructureAsset,
  CitizenReport,
  AlertItem,
  RouteOption,
  FieldIncident,
  ExplainableAIFactor,
  DataSourcePipeline,
  UserRole,
  RiskLevel,
} from '../types';
import {
  MOCK_MICRO_CATCHMENTS,
  MOCK_SENSOR_NODES,
  MOCK_INFRASTRUCTURE_ASSETS,
  MOCK_CITIZEN_REPORTS,
  MOCK_ALERTS,
  MOCK_ROUTE_OPTIONS,
  MOCK_FIELD_INCIDENTS,
  MOCK_EXPLAINABLE_AI_FACTORS,
  MOCK_DATA_PIPELINES,
} from '../data/mockData';

export interface FieldTeamItem {
  id: string;
  name: string;
  status: 'EN ROUTE' | 'ON SITE' | 'COMPLETED';
  eta: string;
  task: string;
  location: string;
  lat: number;
  lng: number;
  assignedIncident: string;
  note: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  category: 'ALERT' | 'DISPATCH' | 'CONFIG' | 'VERIFICATION';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'RISK' | 'REPORT' | 'FIELD' | 'ALERT' | 'PIPELINE';
  targetTab: string;
  read: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface SimulationStepDefinition {
  timeCode: string;
  title: string;
  tab: string;
  subtitle: string;
  rainfallMm: number;
  runoffM3s: number;
  floodProbPct: number;
  timeToFloodMin: number;
  riskLevel: RiskLevel;
  canalStress: string;
  alertIssued?: boolean;
  reportArrived?: boolean;
  teamDispatched?: boolean;
}

export const EXTENDED_SIMULATION_STEPS: SimulationStepDefinition[] = [
  {
    timeCode: 'T+00',
    title: 'Rainfall Begins',
    tab: 'dashboard',
    subtitle: 'Convective cloud build-up initiates localized rainfall (14 mm/h). Basins absorbing.',
    rainfallMm: 14,
    runoffM3s: 4.1,
    floodProbPct: 22,
    timeToFloodMin: 110,
    riskLevel: 'LOW',
    canalStress: 'Normal (32% capacity)',
  },
  {
    timeCode: 'T+15',
    title: 'Upstream Rainfall Surge',
    tab: 'map',
    subtitle: 'Precipitation accelerates to 28 mm/h in Shyambazar catchment MC-018.',
    rainfallMm: 28,
    runoffM3s: 8.4,
    floodProbPct: 48,
    timeToFloodMin: 75,
    riskLevel: 'MODERATE',
    canalStress: 'Moderate (54% capacity)',
  },
  {
    timeCode: 'T+30',
    title: 'Runoff Accumulation',
    tab: 'catchments',
    subtitle: 'Hydrodynamic flow accumulates toward Ward 17 depression basin MC-042.',
    rainfallMm: 34,
    runoffM3s: 11.6,
    floodProbPct: 76,
    timeToFloodMin: 55,
    riskLevel: 'HIGH',
    canalStress: 'Elevated (72% capacity)',
  },
  {
    timeCode: 'T+40',
    title: 'Drainage Becomes Stressed',
    tab: 'catchments',
    subtitle: 'Circular Canal lock gate capacity approaches saturation threshold (85%).',
    rainfallMm: 38,
    runoffM3s: 14.8,
    floodProbPct: 88,
    timeToFloodMin: 44,
    riskLevel: 'CRITICAL',
    canalStress: 'Critical Bottleneck (85% capacity)',
  },
  {
    timeCode: 'T+45',
    title: 'MC-042 Critical Risk Inundation',
    tab: 'predictions',
    subtitle: 'AI Nowcasting models confirm 91% Critical Flood Probability within ~40 min.',
    rainfallMm: 38,
    runoffM3s: 14.8,
    floodProbPct: 91,
    timeToFloodMin: 40,
    riskLevel: 'CRITICAL',
    canalStress: 'Overflow Threat (92% capacity)',
  },
  {
    timeCode: 'T+50',
    title: 'Emergency Warning Generated',
    tab: 'alerts',
    subtitle: 'Disaster Duty Officer triggers multi-channel cell warning for Ward 17 residents.',
    rainfallMm: 36,
    runoffM3s: 14.2,
    floodProbPct: 91,
    timeToFloodMin: 38,
    riskLevel: 'CRITICAL',
    canalStress: 'High Siltation Sluice (94% capacity)',
    alertIssued: true,
  },
  {
    timeCode: 'T+60',
    title: 'Citizen Reports Arrive',
    tab: 'reports',
    subtitle: 'Verified citizen report #1042 confirms 45cm knee-deep water on Circular Canal Rd.',
    rainfallMm: 30,
    runoffM3s: 12.8,
    floodProbPct: 89,
    timeToFloodMin: 32,
    riskLevel: 'CRITICAL',
    canalStress: 'Surface Ponding Active',
    reportArrived: true,
  },
  {
    timeCode: 'T+70',
    title: 'Field Team Dispatched',
    tab: 'field',
    subtitle: 'Emergency Response Team Alpha arrives at Ward 17 with 500HP mobile dewatering unit.',
    rainfallMm: 22,
    runoffM3s: 10.4,
    floodProbPct: 79,
    timeToFloodMin: 28,
    riskLevel: 'HIGH',
    canalStress: 'Pumping in Progress',
    teamDispatched: true,
  },
  {
    timeCode: 'T+90',
    title: 'Observed Flood Extent Available',
    tab: 'analytics',
    subtitle: 'Sentinel-1 SAR satellite overpass imagery ready for Predicted vs Observed evaluation.',
    rainfallMm: 12,
    runoffM3s: 6.2,
    floodProbPct: 54,
    timeToFloodMin: 60,
    riskLevel: 'MODERATE',
    canalStress: 'Dewatering Effective (58% capacity)',
  },
];

interface IncidentContextType {
  // Operational Incident State
  incidentId: string;
  catchmentId: string;
  ward: number;
  status: 'ESCALATING' | 'CONTAINED' | 'RESOLVED';
  rainfall: number;
  forecastRainfall: number;
  floodProbability: number;
  estimatedOnset: number;
  runoff: number;
  drainageCapacity: 'Low' | 'Medium' | 'High';
  affectedPopulation: number;
  timelineMinutes: number;

  // Selected Entities
  selectedCatchment: MicroCatchment | null;
  selectedAsset: InfrastructureAsset | null;
  selectedRoute: RouteOption | null;
  selectedTeam: FieldTeamItem | null;

  // Domain Collections
  catchments: MicroCatchment[];
  sensors: SensorNode[];
  infrastructure: InfrastructureAsset[];
  alerts: AlertItem[];
  reports: CitizenReport[];
  routes: RouteOption[];
  fieldTeams: FieldTeamItem[];
  explainableFactors: ExplainableAIFactor[];
  pipelines: DataSourcePipeline[];
  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];

  // Simulation Replay State
  simulationState: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
  simulationStepIndex: number;
  currentStepDefinition: SimulationStepDefinition;

  // Provenance Modal State
  isProvenanceModalOpen: boolean;
  provenanceData: any | null;

  // State Mutators & Workflow Actions
  setTimelineMinutes: (min: number) => void;
  selectCatchment: (mc: MicroCatchment | null) => void;
  selectAsset: (asset: InfrastructureAsset | null) => void;
  selectRoute: (route: RouteOption | null) => void;
  selectTeam: (team: FieldTeamItem | null) => void;
  broadcastAlert: (alert: Partial<AlertItem>) => Promise<AlertItem>;
  verifyCitizenReport: (reportId: string, status: 'VERIFIED' | 'UNDER_REVIEW' | 'DUPLICATE') => void;
  updateFieldTeamStatus: (teamId: string, status: 'EN ROUTE' | 'ON SITE' | 'COMPLETED', note?: string) => void;
  addAuditLog: (action: string, category: 'ALERT' | 'DISPATCH' | 'CONFIG' | 'VERIFICATION', role?: string) => void;
  openProvenanceModal: (customData?: any) => void;
  closeProvenanceModal: () => void;

  // Simulation Controls
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  setSimulationStep: (index: number) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{
  children: ReactNode;
  onNavigateTab?: (tab: string) => void;
  currentRole?: UserRole;
}> = ({ children, onNavigateTab, currentRole = 'officer' }) => {
  // Primary Incident Baseline State
  const [incidentId] = useState('FM-2026-042');
  const [catchmentId] = useState('mc-042');
  const [ward] = useState(17);
  const [status, setStatus] = useState<'ESCALATING' | 'CONTAINED' | 'RESOLVED'>('ESCALATING');

  const [rainfall, setRainfall] = useState(38);
  const [forecastRainfall, setForecastRainfall] = useState(27);
  const [floodProbability, setFloodProbability] = useState(91);
  const [estimatedOnset, setEstimatedOnset] = useState(40);
  const [runoff, setRunoff] = useState(14.8);
  const [drainageCapacity, setDrainageCapacity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [affectedPopulation, setAffectedPopulation] = useState(12430);
  const [timelineMinutes, setTimelineMinutesState] = useState(60);

  // Collections State
  const [catchments, setCatchments] = useState<MicroCatchment[]>(MOCK_MICRO_CATCHMENTS);
  const [sensors, setSensors] = useState<SensorNode[]>(MOCK_SENSOR_NODES);
  const [infrastructure, setInfrastructure] = useState<InfrastructureAsset[]>(MOCK_INFRASTRUCTURE_ASSETS);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [reports, setReports] = useState<CitizenReport[]>(MOCK_CITIZEN_REPORTS);
  const [routes, setRoutes] = useState<RouteOption[]>(MOCK_ROUTE_OPTIONS);
  const [explainableFactors, setExplainableFactors] = useState<ExplainableAIFactor[]>(MOCK_EXPLAINABLE_AI_FACTORS);
  const [pipelines, setPipelines] = useState<DataSourcePipeline[]>(MOCK_DATA_PIPELINES);

  const [fieldTeams, setFieldTeams] = useState<FieldTeamItem[]>([
    {
      id: 'ft-01',
      name: 'FIELD TEAM ALPHA',
      status: 'EN ROUTE',
      eta: '8 min',
      task: 'Drainage Inspection & Circular Canal Lock Gate Clearance',
      location: 'MC-042 Basin Outlet · Ward 17',
      lat: 22.586,
      lng: 88.373,
      assignedIncident: 'INC-1042',
      note: 'Mobile 500HP heavy dewatering pump deployed on site',
    },
    {
      id: 'ft-02',
      name: 'MUNICIPAL HYDRAULICS UNIT #4',
      status: 'ON SITE',
      eta: 'Arrived',
      task: 'SSKM Hospital Gate 3 Trash Screen Clearance',
      location: 'Ward 45 · AJC Bose Rd',
      lat: 22.537,
      lng: 88.345,
      assignedIncident: 'INC-1043',
      note: 'Emergency ambulance ingress lane maintained clear of debris',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      timestamp: '10:45 AM',
      user: 'Officer R. Banerjee',
      role: 'Disaster Duty Officer',
      action: 'Authorized Flash Flood Alert ALT-001 (Ward 17 & 14 Multi-Channel Broadcast)',
      category: 'ALERT',
    },
    {
      id: 'log-2',
      timestamp: '10:32 AM',
      user: 'Officer R. Banerjee',
      role: 'Disaster Duty Officer',
      action: 'Dispatched Emergency Response Team Alpha to Circular Canal lock gate (INC-1042)',
      category: 'DISPATCH',
    },
    {
      id: 'log-3',
      timestamp: '10:14 AM',
      user: 'Eng. S. Das',
      role: 'Municipal Engineer',
      action: 'Updated hydrodynamic canal discharge capacity parameter for MC-042',
      category: 'CONFIG',
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'CRITICAL FLOOD RISK',
      message: 'MC-042 (Ward 17) reached 91% flood probability with ~40 min onset time.',
      timestamp: '2 mins ago',
      category: 'RISK',
      targetTab: 'predictions',
      read: false,
      priority: 'CRITICAL',
    },
    {
      id: 'notif-2',
      title: 'NEW CITIZEN REPORT',
      message: 'Report #1042 submitted: 45cm water depth at Circular Canal Rd.',
      timestamp: '14 mins ago',
      category: 'REPORT',
      targetTab: 'reports',
      read: false,
      priority: 'HIGH',
    },
    {
      id: 'notif-3',
      title: 'FIELD TEAM DISPATCH',
      message: 'Field Team Alpha en route to MC-042 outfall (ETA: 8 min).',
      timestamp: '20 mins ago',
      category: 'FIELD',
      targetTab: 'field',
      read: false,
      priority: 'MEDIUM',
    },
  ]);

  // Selected Entities
  const [selectedCatchment, setSelectedCatchment] = useState<MicroCatchment | null>(MOCK_MICRO_CATCHMENTS[0]);
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(MOCK_ROUTE_OPTIONS[0]);
  const [selectedTeam, setSelectedTeam] = useState<FieldTeamItem | null>(null);

  // Provenance Modal State
  const [isProvenanceModalOpen, setIsProvenanceModalOpen] = useState(false);
  const [provenanceData, setProvenanceData] = useState<any | null>(null);

  // Simulation Engine State
  const [simulationState, setSimulationState] = useState<'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED'>('IDLE');
  const [simulationStepIndex, setSimulationStepIndex] = useState(4); // Default at T+45 critical state

  // Apply a Simulation Step to the Global Incident State
  const applySimulationStep = (index: number) => {
    const step = EXTENDED_SIMULATION_STEPS[index];
    if (!step) return;

    setSimulationStepIndex(index);
    setRainfall(step.rainfallMm);
    setRunoff(step.runoffM3s);
    setFloodProbability(step.floodProbPct);
    setEstimatedOnset(step.timeToFloodMin);
    setStatus(step.floodProbPct > 85 ? 'ESCALATING' : step.floodProbPct > 50 ? 'CONTAINED' : 'RESOLVED');

    // Update target catchment MC-042 in list
    setCatchments((prev) =>
      prev.map((c) => {
        if (c.code === 'MC-042') {
          return {
            ...c,
            currentRainfallMm: step.rainfallMm,
            runoffEstimateM3s: step.runoffM3s,
            floodProbabilityPct: step.floodProbPct,
            timeToFloodMin: step.timeToFloodMin,
            riskLevel: step.riskLevel,
          };
        }
        return c;
      })
    );

    // Sync selectedCatchment if it is MC-042
    setSelectedCatchment((prev) => {
      if (!prev || prev.code === 'MC-042') {
        const mc042 = catchments.find((c) => c.code === 'MC-042') || MOCK_MICRO_CATCHMENTS[0];
        return {
          ...mc042,
          currentRainfallMm: step.rainfallMm,
          runoffEstimateM3s: step.runoffM3s,
          floodProbabilityPct: step.floodProbPct,
          timeToFloodMin: step.timeToFloodMin,
          riskLevel: step.riskLevel,
        };
      }
      return prev;
    });

    // Automatically navigate view if user is following simulation tab
    if (simulationState === 'RUNNING' && onNavigateTab && step.tab) {
      onNavigateTab(step.tab);
    }
  };

  // Automated Simulation Loop
  useEffect(() => {
    if (simulationState !== 'RUNNING') return;

    const timer = setInterval(() => {
      setSimulationStepIndex((prev) => {
        if (prev >= EXTENDED_SIMULATION_STEPS.length - 1) {
          setSimulationState('COMPLETED');
          return prev;
        }
        const nextIdx = prev + 1;
        applySimulationStep(nextIdx);
        return nextIdx;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [simulationState]);

  // Timeline Scrubber Synchronizer (Minutes to Model State)
  const setTimelineMinutes = (min: number) => {
    setTimelineMinutesState(min);
    let targetRain = 22;
    let targetProb = 54;
    let targetOnset = 75;
    let targetRunoff = 7.8;
    let risk: RiskLevel = 'MODERATE';

    if (min === 0) {
      targetRain = 14;
      targetProb = 22;
      targetOnset = 110;
      targetRunoff = 4.1;
      risk = 'LOW';
    } else if (min === 15) {
      targetRain = 28;
      targetProb = 48;
      targetOnset = 75;
      targetRunoff = 8.4;
      risk = 'MODERATE';
    } else if (min === 30) {
      targetRain = 34;
      targetProb = 76;
      targetOnset = 55;
      targetRunoff = 11.6;
      risk = 'HIGH';
    } else if (min === 45) {
      targetRain = 38;
      targetProb = 91;
      targetOnset = 40;
      targetRunoff = 14.8;
      risk = 'CRITICAL';
    } else if (min === 60) {
      targetRain = 42;
      targetProb = 94;
      targetOnset = 35;
      targetRunoff = 16.2;
      risk = 'CRITICAL';
    } else if (min === 90) {
      targetRain = 24;
      targetProb = 68;
      targetOnset = 65;
      targetRunoff = 9.8;
      risk = 'MODERATE';
    }

    setRainfall(targetRain);
    setFloodProbability(targetProb);
    setEstimatedOnset(targetOnset);
    setRunoff(targetRunoff);

    setCatchments((prev) =>
      prev.map((c) => (c.code === 'MC-042' ? { ...c, currentRainfallMm: targetRain, floodProbabilityPct: targetProb, timeToFloodMin: targetOnset, runoffEstimateM3s: targetRunoff, riskLevel: risk } : c))
    );
  };

  const selectCatchment = (mc: MicroCatchment | null) => {
    setSelectedCatchment(mc);
  };

  const selectAsset = (asset: InfrastructureAsset | null) => {
    setSelectedAsset(asset);
  };

  const selectRoute = (route: RouteOption | null) => {
    setSelectedRoute(route);
  };

  const selectTeam = (team: FieldTeamItem | null) => {
    setSelectedTeam(team);
  };

  const broadcastAlert = async (alertData: Partial<AlertItem>): Promise<AlertItem> => {
    const newAlert: AlertItem = {
      id: `alt-${Date.now().toString().slice(-4)}`,
      title: alertData.title || `EMERGENCY FLOOD WARNING — Ward ${ward}`,
      severity: alertData.severity || 'CRITICAL',
      targetWard: alertData.targetWard || `Ward ${ward} / MC-042`,
      affectedPopulation: alertData.affectedPopulation || affectedPopulation,
      onsetTime: alertData.onsetTime || `~${estimatedOnset} minutes`,
      recommendedAction:
        alertData.recommendedAction ||
        'Avoid low-lying roads around Circular Canal & Ultadanga crossing. Seek elevated shelter immediately.',
      channels: alertData.channels || ['push', 'sms', 'voice', 'pa'],
      status: 'BROADCAST',
      timestamp: 'Just now',
      authorizedBy: alertData.authorizedBy || 'Officer R. Banerjee (Disaster Duty Officer)',
    };

    setAlerts((prev) => [newAlert, ...prev]);

    // Add Audit Log
    addAuditLog(
      `Broadcast Emergency Warning ${newAlert.id} to ${newAlert.targetWard} via ${newAlert.channels.join(', ')}`,
      'ALERT'
    );

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'ALERT BROADCAST ISSUED',
        message: `${newAlert.title} dispatched reaching ${newAlert.affectedPopulation.toLocaleString()} citizens.`,
        timestamp: 'Just now',
        category: 'ALERT',
        targetTab: 'alerts',
        read: false,
        priority: 'CRITICAL',
      },
      ...prev,
    ]);

    return newAlert;
  };

  const verifyCitizenReport = (reportId: string, newStatus: 'VERIFIED' | 'UNDER_REVIEW' | 'DUPLICATE') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, verificationStatus: newStatus } : r))
    );

    addAuditLog(
      `Citizen Flood Report #${reportId} status updated to ${newStatus}`,
      'VERIFICATION'
    );
  };

  const updateFieldTeamStatus = (teamId: string, newStatus: 'EN ROUTE' | 'ON SITE' | 'COMPLETED', note?: string) => {
    setFieldTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const updatedNote = note ? `${t.note} | ${note}` : t.note;
          return { ...t, status: newStatus, note: updatedNote };
        }
        return t;
      })
    );

    addAuditLog(
      `Field Team #${teamId} status marked ${newStatus}${note ? `: ${note}` : ''}`,
      'DISPATCH'
    );
  };

  const addAuditLog = (action: string, category: 'ALERT' | 'DISPATCH' | 'CONFIG' | 'VERIFICATION', role = 'Disaster Duty Officer') => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: 'Disaster Command Console',
      role,
      action,
      category,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const openProvenanceModal = (customData?: any) => {
    setProvenanceData(customData || null);
    setIsProvenanceModalOpen(true);
  };

  const closeProvenanceModal = () => {
    setIsProvenanceModalOpen(false);
    setProvenanceData(null);
  };

  // Simulation Controls
  const startSimulation = () => {
    setSimulationState('RUNNING');
    applySimulationStep(0);
  };

  const pauseSimulation = () => {
    setSimulationState('PAUSED');
  };

  const resumeSimulation = () => {
    setSimulationState('RUNNING');
  };

  const resetSimulation = () => {
    setSimulationState('IDLE');
    applySimulationStep(4); // Reset to baseline T+45 critical state
  };

  const setSimulationStep = (index: number) => {
    applySimulationStep(index);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <IncidentContext.Provider
      value={{
        incidentId,
        catchmentId,
        ward,
        status,
        rainfall,
        forecastRainfall,
        floodProbability,
        estimatedOnset,
        runoff,
        drainageCapacity,
        affectedPopulation,
        timelineMinutes,
        selectedCatchment,
        selectedAsset,
        selectedRoute,
        selectedTeam,
        catchments,
        sensors,
        infrastructure,
        alerts,
        reports,
        routes,
        fieldTeams,
        explainableFactors,
        pipelines,
        auditLogs,
        notifications,
        simulationState,
        simulationStepIndex,
        currentStepDefinition: EXTENDED_SIMULATION_STEPS[simulationStepIndex],
        isProvenanceModalOpen,
        provenanceData,
        setTimelineMinutes,
        selectCatchment,
        selectAsset,
        selectRoute,
        selectTeam,
        broadcastAlert,
        verifyCitizenReport,
        updateFieldTeamStatus,
        addAuditLog,
        openProvenanceModal,
        closeProvenanceModal,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        resetSimulation,
        setSimulationStep,
        markNotificationRead,
        clearNotifications,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = (): IncidentContextType => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};

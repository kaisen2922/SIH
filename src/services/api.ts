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
  RiskLevel,
} from '../types';

// Simulated latency to mimic actual GIS API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const floodmeshApi = {
  // Catchments API
  async getMicroCatchments(): Promise<MicroCatchment[]> {
    await delay(150);
    return [...MOCK_MICRO_CATCHMENTS];
  },

  async getCatchmentById(id: string): Promise<MicroCatchment | undefined> {
    await delay(100);
    return MOCK_MICRO_CATCHMENTS.find((c) => c.id === id || c.code.toLowerCase() === id.toLowerCase());
  },

  // Sensors API
  async getSensors(): Promise<SensorNode[]> {
    await delay(100);
    return [...MOCK_SENSOR_NODES];
  },

  // Infrastructure API
  async getInfrastructure(): Promise<InfrastructureAsset[]> {
    await delay(120);
    return [...MOCK_INFRASTRUCTURE_ASSETS];
  },

  // Citizen Reports API
  async getCitizenReports(): Promise<CitizenReport[]> {
    await delay(150);
    return [...MOCK_CITIZEN_REPORTS];
  },

  async submitCitizenReport(report: Partial<CitizenReport>): Promise<CitizenReport> {
    await delay(400);
    const newReport: CitizenReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      title: report.title || 'Waterlogging Report',
      lat: report.lat || 22.585,
      lng: report.lng || 88.371,
      address: report.address || 'Submitted Location',
      depthCm: report.depthCm || 30,
      imageUrl: report.imageUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=800&auto=format&fit=crop',
      description: report.description || 'Verified via citizen portal',
      timestamp: 'Just now',
      verificationStatus: 'VERIFIED',
      aiConfidencePct: 94,
      radarCorrelation: true,
      upvotes: 1,
    };
    MOCK_CITIZEN_REPORTS.unshift(newReport);
    return newReport;
  },

  // Alerts API
  async getAlerts(): Promise<AlertItem[]> {
    await delay(100);
    return [...MOCK_ALERTS];
  },

  async createAlert(alert: Partial<AlertItem>): Promise<AlertItem> {
    await delay(350);
    const newAlert: AlertItem = {
      id: `alt-${Date.now().toString().slice(-3)}`,
      title: alert.title || 'EMERGENCY FLOOD WARNING',
      severity: alert.severity || 'CRITICAL',
      targetWard: alert.targetWard || 'Ward 17',
      affectedPopulation: alert.affectedPopulation || 12430,
      onsetTime: alert.onsetTime || 'Within 40 Minutes',
      recommendedAction: alert.recommendedAction || 'Avoid low-lying roadways and seek elevated shelter.',
      channels: alert.channels || ['push', 'sms', 'voice', 'pa'],
      status: 'BROADCAST',
      timestamp: 'Just now',
      authorizedBy: alert.authorizedBy || 'Disaster Duty Officer',
    };
    MOCK_ALERTS.unshift(newAlert);
    return newAlert;
  },

  // Safe Routes API
  async getRoutes(origin: string, destination: string): Promise<RouteOption[]> {
    await delay(200);
    return [...MOCK_ROUTE_OPTIONS];
  },

  // Field Incidents API
  async getFieldIncidents(): Promise<FieldIncident[]> {
    await delay(120);
    return [...MOCK_FIELD_INCIDENTS];
  },

  // AI Explainability API
  async getExplainableAIFactors(catchmentId?: string): Promise<ExplainableAIFactor[]> {
    await delay(150);
    return [...MOCK_EXPLAINABLE_AI_FACTORS];
  },

  // Data Pipelines API
  async getDataPipelines(): Promise<DataSourcePipeline[]> {
    await delay(100);
    return [...MOCK_DATA_PIPELINES];
  },
};

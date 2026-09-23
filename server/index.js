import express from 'express';
import cors from 'cors';
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
} from '../src/data/mockData.ts';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'FLOODMESH AI Spatial Intelligence Server',
    timestamp: new Date().toISOString(),
    systemUptimePct: 99.98,
    activeSensors: MOCK_SENSOR_NODES.length,
    activeCatchments: MOCK_MICRO_CATCHMENTS.length,
  });
});

// API Routes
app.get('/api/catchments', (req, res) => {
  res.json({ success: true, count: MOCK_MICRO_CATCHMENTS.length, data: MOCK_MICRO_CATCHMENTS });
});

app.get('/api/catchments/:id', (req, res) => {
  const item = MOCK_MICRO_CATCHMENTS.find(
    (c) => c.id === req.params.id || c.code.toLowerCase() === req.params.id.toLowerCase()
  );
  if (!item) return res.status(404).json({ success: false, message: 'Catchment not found' });
  res.json({ success: true, data: item });
});

app.get('/api/sensors', (req, res) => {
  res.json({ success: true, data: MOCK_SENSOR_NODES });
});

app.get('/api/infrastructure', (req, res) => {
  res.json({ success: true, data: MOCK_INFRASTRUCTURE_ASSETS });
});

app.get('/api/reports', (req, res) => {
  res.json({ success: true, data: MOCK_CITIZEN_REPORTS });
});

app.post('/api/reports', (req, res) => {
  const newReport = {
    id: `rep-${Date.now().toString().slice(-4)}`,
    ...req.body,
    timestamp: 'Just now',
    verificationStatus: 'VERIFIED',
    aiConfidencePct: 95,
  };
  MOCK_CITIZEN_REPORTS.unshift(newReport);
  res.status(201).json({ success: true, data: newReport });
});

app.get('/api/alerts', (req, res) => {
  res.json({ success: true, data: MOCK_ALERTS });
});

app.post('/api/alerts', (req, res) => {
  const newAlert = {
    id: `alt-${Date.now().toString().slice(-3)}`,
    ...req.body,
    status: 'BROADCAST',
    timestamp: 'Just now',
  };
  MOCK_ALERTS.unshift(newAlert);
  res.status(201).json({ success: true, data: newAlert });
});

app.get('/api/routes', (req, res) => {
  res.json({ success: true, data: MOCK_ROUTE_OPTIONS });
});

app.get('/api/explainable-ai', (req, res) => {
  res.json({ success: true, data: MOCK_EXPLAINABLE_AI_FACTORS });
});

app.get('/api/datasources', (req, res) => {
  res.json({ success: true, data: MOCK_DATA_PIPELINES });
});

app.listen(PORT, () => {
  console.log(`FLOODMESH AI Server running on http://localhost:${PORT}`);
});

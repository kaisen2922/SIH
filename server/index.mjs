import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const MOCK_MICRO_CATCHMENTS = [
  {
    id: 'mc-042',
    code: 'MC-042',
    name: 'Ward 17 - Circular Canal Lowland Basin',
    ward: 17,
    coordinates: [
      [22.585, 88.368],
      [22.592, 88.375],
      [22.589, 88.384],
      [22.581, 88.378],
      [22.585, 88.368],
    ],
    areaKm2: 1.82,
    imperviousSurfacePct: 72,
    slopePct: 1.2,
    elevationM: 4.5,
    drainageCapacity: 'Medium',
    currentRainfallMm: 38,
    forecastRainfallMm: 27,
    runoffEstimateM3s: 14.8,
    floodProbabilityPct: 91,
    timeToFloodMin: 40,
    riskLevel: 'CRITICAL',
    flowDirectionDeg: 135,
    historicalFloodCount: 14,
    upstreamCatchmentIds: ['mc-018', 'mc-022'],
  }
];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'FLOODMESH AI Spatial Intelligence REST Server',
    timestamp: new Date().toISOString(),
    uptime: '99.98%',
  });
});

app.get('/api/catchments', (req, res) => {
  res.json({ success: true, data: MOCK_MICRO_CATCHMENTS });
});

app.listen(PORT, () => {
  console.log(`FLOODMESH AI REST Server running on http://localhost:${PORT}`);
});

import React, { useEffect, useRef, useState } from 'react';
import { MicroCatchment } from '../../types';

interface FlowCanvasProps {
  currentRainfallMm: number;
  runoffM3s: number;
  selectedCatchment: MicroCatchment;
  onSelectCatchment: (catchment: MicroCatchment) => void;
  catchments: MicroCatchment[];
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  currentRainfallMm,
  runoffM3s,
  selectedCatchment,
  onSelectCatchment,
  catchments,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Upstream and target catchment references
  const mc018 = catchments.find((c) => c.code === 'MC-018') || catchments[1];
  const mc042 = catchments.find((c) => c.code === 'MC-042') || selectedCatchment;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; progress: number; speed: number }[] = [];

    // Initialize flow particles along the hydraulic vector path
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: 0,
        y: 0,
        progress: Math.random(),
        speed: 0.004 + (currentRainfallMm / 50) * 0.006,
      });
    }

    // Bezier control points for hydraulic path (Upstream MC-018 -> Canal Gate -> Downstream Target)
    const p0 = { x: 70, y: 70 };     // Upstream Node MC-018
    const p1 = { x: 200, y: 50 };    // Runoff vector curve
    const p2 = { x: 260, y: 110 };   // Lock gate outfall
    const p3 = { x: 420, y: 150 };   // Downstream Target Node

    // Cubic Bezier interpolation function
    const getBezierPoint = (t: number) => {
      const cx = 3 * (p1.x - p0.x);
      const bx = 3 * (p2.x - p1.x) - cx;
      const ax = p3.x - p0.x - cx - bx;

      const cy = 3 * (p1.y - p0.y);
      const by = 3 * (p2.y - p1.y) - cy;
      const ay = p3.y - p0.y - cy - by;

      const xt = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
      const yt = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;

      return { x: xt, y: yt };
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Grid Pattern
      ctx.strokeStyle = '#1E3355';
      ctx.lineWidth = 1;
      const step = 25;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Hydraulic Flow Vector Polyline (Curve)
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = Math.min(8, Math.max(3, runoffM3s / 2.5));
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx.stroke();

      // Render Animated Water Flow Particles
      particles.forEach((pt) => {
        pt.progress += pt.speed;
        if (pt.progress > 1) pt.progress = 0;
        const pos = getBezierPoint(pt.progress);

        ctx.fillStyle = '#06B6D4';
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Node 1: Upstream Catchment MC-018
      ctx.fillStyle = '#0B1428';
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p0.x, p0.y, 32, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#F1F5F9';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('MC-018', p0.x, p0.y - 4);
      ctx.fillStyle = '#06B6D4';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText('Elev: 5.8m', p0.x, p0.y + 10);

      // Node 2: Canal Lock Gate Outfall
      ctx.fillStyle = '#101B32';
      ctx.strokeStyle = '#1E3355';
      ctx.lineWidth = 2;
      ctx.fillRect(p2.x - 25, p2.y - 16, 50, 32);
      ctx.strokeRect(p2.x - 25, p2.y - 16, 50, 32);
      ctx.fillStyle = '#F1F5F9';
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.fillText('Lock Gate', p2.x, p2.y - 2);
      ctx.fillStyle = '#06B6D4';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText(`${runoffM3s} m³/s`, p2.x, p2.y + 10);

      // Node 3: Target Selected Catchment (MC-042)
      ctx.fillStyle = mc042.riskLevel === 'CRITICAL' ? '#450a0a' : '#101B32';
      ctx.strokeStyle = mc042.riskLevel === 'CRITICAL' ? '#EF4444' : '#F97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p3.x, p3.y, 36, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.fillText(mc042.code, p3.x, p3.y - 4);
      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.fillText(`${mc042.floodProbabilityPct}% Risk`, p3.x, p3.y + 10);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentRainfallMm, runoffM3s, selectedCatchment, catchments]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Upstream Node MC-018 Click Check (around x: 70, y: 70)
    const distUpstream = Math.hypot(clickX - 70, clickY - 70);
    if (distUpstream < 35 && mc018) {
      onSelectCatchment(mc018);
      return;
    }

    // Downstream Node MC-042 Click Check (around x: 420, y: 150)
    const distDownstream = Math.hypot(clickX - 420, clickY - 150);
    if (distDownstream < 40 && mc042) {
      onSelectCatchment(mc042);
      return;
    }
  };

  return (
    <div className="relative bg-navy-850 border border-surface-border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between text-xs font-mono text-slate-300">
        <span className="font-bold text-brand-cyan">HYDRAULIC FLOW DIRECTION & VECTOR MODEL</span>
        <span className="text-slate-400">Runoff Velocity: {runoffM3s} m³/s</span>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={220}
        onClick={handleCanvasClick}
        className="w-full h-56 rounded bg-navy-950 cursor-pointer"
      />
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>▲ Upstream (Click MC-018 to select)</span>
        <span>▼ Downstream Inundation Target (Click MC-042 to select)</span>
      </div>
    </div>
  );
};

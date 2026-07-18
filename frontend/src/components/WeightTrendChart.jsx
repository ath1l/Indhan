import { useState, useEffect, useRef } from 'react';
import './WeightTrendChart.css';

export default function WeightTrendChart({ readings = [], capacity = 14.2 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resample to ~60 points max for performance
  const sampled = readings.length > 60
    ? readings.filter((_, i) => i % Math.ceil(readings.length / 60) === 0)
    : readings;

  useEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width: Math.floor(width), height: Math.floor(height) });
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sampled.length || !dimensions.width) return;

    const dpr = window.devicePixelRatio || 1;
    const w = dimensions.width;
    const h = dimensions.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const weights = sampled.map((r) => r.weight_kg);
    const minW = 0;
    const maxW = capacity * 1.05;
    const xStep = plotW / (sampled.length - 1 || 1);

    const toX = (i) => pad.left + i * xStep;
    const toY = (v) => pad.top + plotH - ((v - minW) / (maxW - minW)) * plotH;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = pad.top + (plotH / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();

      // Y-axis labels
      const val = maxW - ((maxW - minW) / gridCount) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${val.toFixed(1)}`, pad.left - 8, y + 4);
    }

    // X-axis labels (show ~6 dates)
    const labelCount = Math.min(6, sampled.length);
    const labelStep = Math.floor(sampled.length / labelCount);
    ctx.textAlign = 'center';
    for (let i = 0; i < sampled.length; i += labelStep) {
      const d = new Date(sampled[i].timestamp);
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      ctx.fillStyle = '#64748b';
      ctx.fillText(label, toX(i), h - pad.bottom + 20);
    }

    // Gradient fill under curve
    const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.25)');
    gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.08)');
    gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(weights[0]));
    for (let i = 1; i < weights.length; i++) {
      const cpx = (toX(i - 1) + toX(i)) / 2;
      ctx.bezierCurveTo(cpx, toY(weights[i - 1]), cpx, toY(weights[i]), toX(i), toY(weights[i]));
    }
    ctx.lineTo(toX(weights.length - 1), pad.top + plotH);
    ctx.lineTo(toX(0), pad.top + plotH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(weights[0]));
    for (let i = 1; i < weights.length; i++) {
      const cpx = (toX(i - 1) + toX(i)) / 2;
      ctx.bezierCurveTo(cpx, toY(weights[i - 1]), cpx, toY(weights[i]), toX(i), toY(weights[i]));
    }
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Endpoint dot
    const lastX = toX(weights.length - 1);
    const lastY = toY(weights[weights.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f97316';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Store geometry for hover
    canvas._chartMeta = { toX, toY, sampled, weights, pad, plotW, plotH };
  }, [sampled, dimensions, capacity]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas._chartMeta) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const { toX, toY, sampled: s, weights: w, pad: p } = canvas._chartMeta;

    // Find nearest point
    let closest = 0;
    let closestDist = Infinity;
    for (let i = 0; i < s.length; i++) {
      const dist = Math.abs(toX(i) - x);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }

    if (closestDist < 30) {
      setTooltip({
        x: toX(closest),
        y: toY(w[closest]),
        weight: w[closest],
        date: new Date(s[closest].timestamp).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    } else {
      setTooltip(null);
    }
  };

  return (
    <div className="weight-trend-chart" ref={containerRef}>
      <div className="chart-header">
        <h3 className="chart-title">Weight Trend</h3>
        <span className="chart-subtitle">Last 30 days</span>
      </div>
      <div className="chart-canvas-wrap">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        />
        {tooltip && (
          <div
            className="chart-tooltip"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 50}px`,
            }}
          >
            <span className="tooltip-weight">{tooltip.weight.toFixed(2)} kg</span>
            <span className="tooltip-date">{tooltip.date}</span>
          </div>
        )}
      </div>
    </div>
  );
}

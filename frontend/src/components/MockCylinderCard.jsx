import React from 'react';
import { ShieldCheck, PauseCircle, Trash2, ArrowRight } from 'lucide-react';

const MockCylinderCard = ({ cylinder, onDelete }) => {
  if (!cylinder) return null;

  const hasReading = !!cylinder.latest_reading;
  const status = hasReading ? "ACTIVE" : "STANDBY";
  const isStandby = !hasReading;
  
  const capacity = cylinder.capacity_kg || 14.2;
  const tare = cylinder.tare_weight_kg || 15.3;
  const currentWeight = hasReading ? cylinder.latest_reading.weight_kg : (capacity + tare);
  
  const rawPercent = ((currentWeight - tare) / capacity) * 100;
  const percent = Math.min(100, Math.max(0, Math.round(rawPercent)));
  
  const isLow = percent < 20;
  const isCritical = percent < 10;
  
  let statusColor = "text-teal-400";
  let bgGlow = "bg-teal-500/10 group-hover:bg-teal-500/20";
  let strokeColor = "#2dd4bf"; // teal-400
  
  if (isStandby) {
    statusColor = "text-gray-500";
    bgGlow = "bg-gray-500/5 group-hover:bg-gray-500/10";
    strokeColor = "#6b7280"; // gray-500
  } else if (isCritical) {
    statusColor = "text-red-400";
    bgGlow = "bg-red-500/10 group-hover:bg-red-500/20";
    strokeColor = "#f87171"; // red-400
  } else if (isLow) {
    statusColor = "text-orange-400";
    bgGlow = "bg-orange-500/10 group-hover:bg-orange-500/20";
    strokeColor = "#fb923c"; // orange-400
  }

  const Icon = isStandby ? PauseCircle : ShieldCheck;
  
  const runway = cylinder.prediction?.days_remaining !== undefined ? cylinder.prediction.days_remaining.toFixed(1) : '--';
  const burnRate = cylinder.prediction?.burn_rate_kg_per_day !== undefined ? cylinder.prediction.burn_rate_kg_per_day.toFixed(2) : '--';

  // Circular gauge calculations
  const radius = 28;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="glass-panel glass-panel-hover p-5 flex flex-col h-full relative overflow-hidden group min-h-[260px]">
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-colors ${bgGlow}`}></div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1 pr-4 min-w-0">
          <h2 className="text-sm font-semibold text-white tracking-wide truncate" title={cylinder.name}>
            {cylinder.name}
          </h2>
          <div className={`flex items-center gap-1.5 mt-1 text-[10px] font-semibold uppercase tracking-widest ${statusColor}`}>
            <Icon className="w-3 h-3" />
            {status}
          </div>
        </div>
        
        {onDelete && (
          <button 
            onClick={onDelete}
            className="text-gray-600 hover:text-red-500 p-1.5 -mr-1.5 -mt-1.5 rounded-lg hover:bg-red-950/30 transition-colors shrink-0"
            title="Delete Cylinder"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Center: Gauge and Value */}
      <div className="flex items-center gap-4 mb-5 relative z-10">
        <div className="relative w-[64px] h-[64px] shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-mono font-medium text-gray-300">{percent}%</span>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-3xl font-display font-light text-white tracking-tight">{currentWeight.toFixed(2)}</span>
            <span className="text-sm text-gray-500 font-medium">kg</span>
          </div>
          <span className="text-[11px] text-gray-500">Gross Weight</span>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 relative z-10 mt-auto">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-widest mb-0.5">Runway</span>
          <span className="text-sm font-mono text-gray-300 whitespace-nowrap">{runway} <span className="text-[10px] text-gray-500 font-sans">days</span></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-widest mb-0.5">Burn Rate</span>
          <span className="text-sm font-mono text-gray-300 whitespace-nowrap">{burnRate} <span className="text-[10px] text-gray-500 font-sans">kg/d</span></span>
        </div>
      </div>
      
      {/* Footer Status */}
      <div className="mt-4 flex items-center justify-between text-[10px] font-medium text-gray-500 relative z-10">
        <span className="truncate pr-2">{isStandby ? 'Awaiting telemetry' : (isLow ? 'Refill recommended' : 'Consumption normal')}</span>
        <span className="text-teal-500/70 group-hover:text-teal-400 flex items-center gap-1 shrink-0 transition-colors">
          Analytics <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default MockCylinderCard;

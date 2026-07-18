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
  
  let statusColor = "text-red-600";
  let bgGlow = "bg-red-50 group-hover:bg-red-100";
  let strokeColor = "#dc2626"; // red-600
  let emptyStroke = "#f1f5f9"; // slate-100
  let iconBg = "bg-red-50 border-red-100";
  
  if (isStandby) {
    statusColor = "text-slate-500";
    bgGlow = "bg-slate-50 group-hover:bg-slate-100";
    strokeColor = "#94a3b8"; // slate-400
    iconBg = "bg-slate-100 border-slate-200";
  } else if (isCritical) {
    statusColor = "text-red-700";
    bgGlow = "bg-red-100 group-hover:bg-red-200";
    strokeColor = "#b91c1c"; // red-700
    iconBg = "bg-red-100 border-red-200";
  } else if (isLow) {
    statusColor = "text-amber-500";
    bgGlow = "bg-amber-50 group-hover:bg-amber-100";
    strokeColor = "#f59e0b"; // amber-500
    iconBg = "bg-amber-50 border-amber-100";
  }

  const Icon = isStandby ? PauseCircle : ShieldCheck;
  
  const runway = (cylinder.prediction?.days_remaining != null) ? Number(cylinder.prediction.days_remaining).toFixed(1) : '--';
  const burnRate = (cylinder.prediction?.burn_rate_kg_per_day != null) ? Number(cylinder.prediction.burn_rate_kg_per_day).toFixed(2) : '--';

  // Circular gauge calculations
  const radius = 28;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="glass-panel glass-panel-hover p-6 flex flex-col h-full relative overflow-hidden group min-h-[260px]">
      
      {/* Decorative Background Artwork */}
      <div className="absolute -right-12 -bottom-16 opacity-[0.03] pointer-events-none transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-105">
        <svg width="200" height="400" viewBox="0 0 100 200" fill="currentColor" className="text-slate-900">
          <path d="M25 175 L75 175 L80 195 L20 195 Z" />
          <path d="M35 40 L65 40 L65 15 L35 15 Z" />
          <path d="M25 45 C30 20 70 20 75 45" fill="none" stroke="currentColor" strokeWidth="4" />
          <rect x="15" y="40" width="70" height="140" rx="20" />
        </svg>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex-1 pr-4 min-w-0">
          <h2 className="text-base font-display font-bold text-slate-900 tracking-tight truncate mb-2" title={cylinder.name}>
            {cylinder.name}
          </h2>
          <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${statusColor} ${iconBg} px-2 py-0.5 rounded border w-fit`}>
            <Icon className="w-3 h-3" />
            {status}
          </div>
        </div>
        
        {onDelete && (
          <button 
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500 p-2 -mr-2 -mt-2 rounded-xl hover:bg-red-50 transition-colors shrink-0"
            title="Delete Cylinder"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Center: Gauge and Value */}
      <div className="flex items-center gap-6 mb-6 relative z-10">
        <div className="relative w-[76px] h-[76px] shrink-0">
          {/* Subtle glow behind gauge */}
          <div className="absolute inset-0 rounded-full blur-md opacity-10 bg-red-500 mix-blend-multiply pointer-events-none"></div>
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="38"
              cy="38"
              r={radius}
              stroke={emptyStroke}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="38"
              cy="38"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-[15px] font-display font-bold ${statusColor}`}>{percent}%</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-4xl font-display font-bold text-slate-900 tracking-tight">{currentWeight.toFixed(2)}</span>
            <span className="text-sm text-slate-400 font-semibold">kg</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 block">Gross Weight</span>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 relative z-10 mt-auto">
        <div className="flex flex-col group/metric">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1 group-hover/metric:text-emerald-600 transition-colors">Runway</span>
          <span className="text-[15px] font-bold text-slate-800 whitespace-nowrap">{runway} <span className="text-[10px] text-slate-400 font-semibold">days</span></span>
        </div>
        <div className="flex flex-col group/metric">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1 group-hover/metric:text-emerald-600 transition-colors">Burn Rate</span>
          <span className="text-[15px] font-bold text-slate-800 whitespace-nowrap">{burnRate} <span className="text-[10px] text-slate-400 font-semibold">kg/d</span></span>
        </div>
      </div>
      
      {/* Footer Action */}
      <div className="mt-5 flex items-center justify-between relative z-10 opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">ID:{cylinder.id.slice(-6)}</span>
        <span className="text-[10px] font-bold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1 shrink-0 transition-colors uppercase tracking-widest">
          Analytics <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default MockCylinderCard;

import React from 'react';
import { Trash2, ArrowRight } from 'lucide-react';
import GasLevelIndicator from './GasLevelIndicator';

const MockCylinderCard = ({ cylinder, onDelete }) => {
  if (!cylinder) return null;

  const hasReading = !!cylinder.latest_reading;
  const isStandby = !hasReading;
  
  const capacity = cylinder.capacity_kg || 14.2;
  const tare = cylinder.tare_weight_kg || 15.3;
  const currentWeight = hasReading ? cylinder.latest_reading.weight_kg : (capacity + tare);
  
  const rawPercent = ((currentWeight - tare) / capacity) * 100;
  const percent = Math.min(100, Math.max(0, Math.round(rawPercent)));
  
  const isLow = percent < 20;
  const isCritical = percent < 10;
  
  // Theme logic for subtle accents based on status
  let theme = {
    hoverGlow: "group-hover:border-emerald-500/30 group-hover:shadow-[0_8px_32px_-12px_rgba(16,185,129,0.15)]",
    cardBg: "bg-white",
  };
  
  if (isStandby) {
    theme.hoverGlow = "group-hover:border-slate-400/30 group-hover:shadow-[0_8px_32px_-12px_rgba(148,163,184,0.15)]";
    theme.cardBg = "bg-slate-50/50";
  } else if (isCritical) {
    theme.hoverGlow = "group-hover:border-red-500/30 group-hover:shadow-[0_8px_32px_-12px_rgba(239,68,68,0.15)]";
    theme.cardBg = "bg-red-50/10";
  } else if (isLow) {
    theme.hoverGlow = "group-hover:border-amber-500/30 group-hover:shadow-[0_8px_32px_-12px_rgba(245,158,11,0.15)]";
    theme.cardBg = "bg-amber-50/10";
  }
  
  const runway = (cylinder.prediction?.days_remaining != null) ? Number(cylinder.prediction.days_remaining).toFixed(1) : '--';
  const burnRate = (cylinder.prediction?.burn_rate_kg_per_day != null) ? Number(cylinder.prediction.burn_rate_kg_per_day).toFixed(2) : '--';

  return (
    <div className={`p-6 border border-slate-200/80 rounded-[24px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.06)] flex flex-col relative overflow-hidden group transition-all duration-300 min-w-[280px] w-full flex-1 ${theme.cardBg} ${theme.hoverGlow} hover:-translate-y-0.5`}>
      
      {/* Background Graphic */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:8px_8px] opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity rounded-bl-full"></div>

      {/* Header Row */}
      <div className="flex justify-between items-start mb-6 relative z-10 w-full">
        <div className="flex-1 pr-4 min-w-0">
          <h2 className="text-[15px] font-display font-bold text-slate-900 tracking-tight truncate mb-1" title={cylinder.name}>
            {cylinder.name}
          </h2>
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block truncate">
            ID:{cylinder.id.slice(-6)}
          </span>
        </div>
        
        {onDelete && (
          <button 
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500 p-2 -mr-2 -mt-2 rounded-xl hover:bg-red-50 transition-colors shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Delete Asset"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Center Layout: Visual on Left, Data on Right */}
      <div className="flex items-center justify-between mb-8 relative z-10 w-full">
        
        {/* Left: GasLevelIndicator (Small) */}
        <div className="shrink-0">
          <GasLevelIndicator 
            currentWeight={currentWeight} 
            capacity={capacity} 
            tare={tare} 
            size="small" 
            hasReading={hasReading} 
          />
        </div>
        
        {/* Right: Primary Weight Metric */}
        <div className="flex flex-col items-end justify-center min-w-0 pl-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Gross Weight</span>
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-4xl font-display font-bold text-slate-900 tracking-tight">{currentWeight.toFixed(2)}</span>
            <span className="text-sm text-slate-400 font-bold font-sans">kg</span>
          </div>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 relative z-10 mt-auto w-full">
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1 truncate">Runway</span>
          <span className="text-[13px] font-bold text-slate-800 whitespace-nowrap">{runway} <span className="text-[9px] text-slate-400 font-semibold">days</span></span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1 truncate">Burn Rate</span>
          <span className="text-[13px] font-bold text-slate-800 whitespace-nowrap">{burnRate} <span className="text-[9px] text-slate-400 font-semibold">kg/d</span></span>
        </div>
      </div>
      
      {/* Footer Nav Hint */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
        <span className="text-emerald-500 bg-emerald-50 border border-emerald-100 p-1.5 rounded-lg shadow-sm flex items-center justify-center">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};

export default MockCylinderCard;

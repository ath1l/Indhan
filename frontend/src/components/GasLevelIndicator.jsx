import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, PauseCircle } from 'lucide-react';

const GasLevelIndicator = ({ currentWeight = 29.5, capacity = 14.2, tare = 15.3, size = "large", hasReading = true }) => {
  // Gas logic
  const gasWeight = Math.max(0, currentWeight - tare);
  const rawPercent = (gasWeight / capacity) * 100;
  const percentage = Math.min(100, Math.max(0, Math.round(rawPercent)));
  
  // Theme logic
  let theme = {
    color: "text-emerald-600",
    fill: "#10b981", // emerald-500
    track: "#ecfdf5", // emerald-50
    statusText: "Stable",
    Icon: CheckCircle2
  };

  if (!hasReading) {
    theme = {
      color: "text-slate-400",
      fill: "#cbd5e1", // slate-300
      track: "#f8fafc", // slate-50
      statusText: "Standby",
      Icon: PauseCircle
    };
  } else if (percentage <= 10) {
    theme = {
      color: "text-red-600",
      fill: "#ef4444", // red-500
      track: "#fef2f2", // red-50
      statusText: "Critical",
      Icon: AlertCircle
    };
  } else if (percentage <= 25) {
    theme = {
      color: "text-amber-500",
      fill: "#f59e0b", // amber-500
      track: "#fffbeb", // amber-50
      statusText: "Low Reserve",
      Icon: AlertTriangle
    };
  }

  const isLarge = size === "large";
  
  // SVG Metrics for a 60x100 cylinder
  const svgWidth = isLarge ? 80 : 50;
  const svgHeight = isLarge ? 140 : 85;
  const fillHeight = (percentage / 100) * 70; // 70 is the height of the cylinder body in the viewBox
  const fillY = 90 - fillHeight; // 90 is the bottom of the cylinder body in the viewBox

  return (
    <div className={`flex items-center ${isLarge ? 'space-x-6' : 'space-x-3'}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Minimal Vertical Cylinder Silhouette */}
        <svg 
          width={svgWidth} 
          height={svgHeight} 
          viewBox="0 0 60 100" 
          className="drop-shadow-sm"
        >
          <defs>
            <clipPath id="cylinderBodyClipSmall">
              <rect x="15" y="20" width="30" height="70" rx="10" />
            </clipPath>
          </defs>
          
          {/* Cylinder Outline */}
          <path d="M22 20 L38 20 L38 10 L22 10 Z" fill="#e2e8f0" />
          <path d="M18 20 C22 10 38 10 42 20" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <rect x="26" y="5" width="8" height="5" rx="1" fill="#cbd5e1" />
          
          {/* Main Body Background */}
          <rect x="15" y="20" width="30" height="70" rx="10" fill={theme.track} stroke="#cbd5e1" strokeWidth="1.5" />
          
          {/* Data-Driven Fill */}
          <rect 
            x="15" 
            y={hasReading ? fillY : 90} 
            width="30" 
            height={hasReading ? fillHeight : 0} 
            fill={theme.fill} 
            clipPath="url(#cylinderBodyClipSmall)"
            className="transition-all duration-1000 ease-out"
          />

          {/* Gloss overlay */}
          <rect x="15" y="20" width="8" height="70" rx="8" fill="white" opacity="0.3" clipPath="url(#cylinderBodyClipSmall)" pointerEvents="none" />

          {/* Measurement Ticks */}
          <g stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.5">
            <line x1="52" y1="37" x2="55" y2="37" />
            <line x1="52" y1="55" x2="55" y2="55" />
            <line x1="52" y1="72" x2="55" y2="72" />
          </g>
          
        </svg>
      </div>
      
      <div className="flex flex-col justify-center">
        <div className={`flex items-baseline gap-1 mb-1 ${theme.color}`}>
          <span className={`font-display font-bold tracking-tight ${isLarge ? 'text-5xl' : 'text-3xl'}`}>
            {hasReading ? percentage : '--'}
          </span>
          <span className={`font-sans font-bold ${isLarge ? 'text-2xl' : 'text-lg'}`}>%</span>
        </div>
        
        <div className={`flex items-center font-bold tracking-wider text-[10px] uppercase ${theme.color} mb-1.5`}>
          <theme.Icon className="w-3 h-3 mr-1" />
          {theme.statusText}
        </div>
        
        <span className="text-[10px] text-slate-500 font-bold tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit uppercase">
          {hasReading ? gasWeight.toFixed(2) : '--'} kg
        </span>
      </div>
    </div>
  );
};

export default GasLevelIndicator;

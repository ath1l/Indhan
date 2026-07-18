import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

const GasLevelIndicator = ({ currentWeight = 29.5, capacity = 14.2, tare = 15.3, size = "large" }) => {
  // Gas logic
  const gasWeight = Math.max(0, currentWeight - tare);
  const rawPercent = (gasWeight / capacity) * 100;
  const percentage = Math.min(100, Math.max(0, Math.round(rawPercent)));
  
  let colorClass = "text-emerald-600";
  let strokeColor = "stroke-emerald-500";
  let statusText = "Stable";
  let StatusIcon = CheckCircle2;

  if (percentage <= 10) {
    colorClass = "text-red-500";
    strokeColor = "stroke-red-500";
    statusText = "Refill Required";
    StatusIcon = AlertCircle;
  } else if (percentage <= 25) {
    colorClass = "text-orange-500";
    strokeColor = "stroke-orange-500";
    statusText = "Low";
    StatusIcon = AlertTriangle;
  }

  // SVG metrics
  const isLarge = size === "large";
  const circleRadius = isLarge ? 54 : 36;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (percentage / 100) * circleCircumference;
  const svgSize = isLarge ? 140 : 90;
  const strokeWidth = isLarge ? 8 : 6;
  const textSize = isLarge ? "text-4xl" : "text-2xl";

  return (
    <div className={`flex items-center ${isLarge ? 'space-x-8' : 'space-x-4'}`}>
      <div className="relative flex items-center justify-center drop-shadow-sm">
        <svg 
          width={svgSize} 
          height={svgSize} 
          viewBox={`0 0 ${svgSize} ${svgSize}`} 
          className="transform -rotate-90"
        >
          {/* Background Track */}
          <circle 
            cx={svgSize/2} 
            cy={svgSize/2} 
            r={circleRadius} 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth={strokeWidth} 
            className="text-slate-100" 
          />
          {/* Progress Ring */}
          <circle 
            cx={svgSize/2} 
            cy={svgSize/2} 
            r={circleRadius} 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth={strokeWidth}
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${strokeColor} transition-all duration-1000 ease-out`} 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`${textSize} font-bold tracking-tight text-slate-900`}>
            {percentage}<span className={isLarge ? "text-xl text-slate-400 ml-1 font-semibold" : "text-sm text-slate-400 ml-1 font-semibold"}>%</span>
          </span>
        </div>
      </div>
      
      <div className="flex flex-col justify-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Status</span>
        <div className={`flex items-center font-bold tracking-wide ${colorClass} ${isLarge ? 'text-xl' : 'text-lg'} mb-1`}>
          <StatusIcon className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} mr-2`} />
          {statusText}
        </div>
        <span className="text-xs text-slate-500 font-medium mt-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
          Gas: <span className="text-slate-700 font-mono font-semibold ml-1">{gasWeight.toFixed(2)} kg</span>
        </span>
      </div>
    </div>
  );
};

export default GasLevelIndicator;

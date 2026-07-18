import React, { useState } from 'react';
import { DollarSign, TrendingUp, Activity } from 'lucide-react';

const CostProjectionCard = ({ prediction }) => {
  const [simulatedPrice, setSimulatedPrice] = useState(65);
  
  // Use the decoupled 7-day average burn rate for stable budgets
  const burnRate = prediction?.rolling_avg_burn_rate !== undefined 
    ? prediction.rolling_avg_burn_rate 
    : (prediction?.burn_rate_kg_per_day || 0);
    
  const baseMonthlyCost = burnRate * 30 * 65;
  const projectedMonthlyCost = burnRate * 30 * simulatedPrice;
  const variance = projectedMonthlyCost - baseMonthlyCost;

  return (
    <div className="glass-panel glass-panel-hover p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Ambient Glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-teal-400" />
            Projected Fuel Cost
          </h2>
          {variance > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border text-orange-400 bg-orange-500/10 border-orange-500/20">
              <TrendingUp className="w-3 h-3" />
              +₹{variance.toFixed(0)}
            </span>
          )}
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-medium text-gray-500">₹</span>
          <span className="text-5xl font-display font-light text-white tracking-tight">
            {projectedMonthlyCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
          </span>
        </div>
        <p className="text-xs text-gray-500 font-medium">Estimated 30-day expenditure</p>
      </div>
      
      {/* Interactive Slider Section */}
      <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">Market Price</p>
            <p className="text-sm text-gray-300 font-medium mt-0.5">₹{simulatedPrice} <span className="text-xs text-gray-500">/ kg</span></p>
          </div>
          <div className="px-2 py-1 bg-white/5 rounded-md text-[9px] uppercase tracking-widest text-teal-500/80 font-bold border border-white/5">
            Simulate
          </div>
        </div>
        
        <div className="relative w-full h-1.5 bg-gray-800 rounded-full flex items-center group/slider">
          <input 
            type="range" 
            min="40" 
            max="120" 
            step="1"
            value={simulatedPrice}
            onChange={(e) => setSimulatedPrice(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            aria-label="Simulate Market Price"
          />
          {/* Custom Track Fill */}
          <div 
            className="absolute left-0 h-full bg-teal-500 rounded-full transition-all ease-out z-10 pointer-events-none group-hover/slider:bg-teal-400"
            style={{ width: `${((simulatedPrice - 40) / (120 - 40)) * 100}%` }}
          ></div>
          {/* Custom Thumb */}
          <div 
            className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)] z-10 pointer-events-none transition-all group-hover/slider:scale-125"
            style={{ left: `calc(${((simulatedPrice - 40) / (120 - 40)) * 100}% - 6px)` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CostProjectionCard;

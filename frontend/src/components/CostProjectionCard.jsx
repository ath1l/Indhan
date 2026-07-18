import React, { useState } from 'react';
import { DollarSign, TrendingUp, CircleDollarSign } from 'lucide-react';

const CostProjectionCard = ({ prediction }) => {
  const [simulatedPrice, setSimulatedPrice] = useState(65.69);
  
  // Use the decoupled 7-day average burn rate for stable budgets
  const burnRate = prediction?.rolling_avg_burn_rate !== undefined 
    ? prediction.rolling_avg_burn_rate 
    : (prediction?.burn_rate_kg_per_day || 0);
    
  const baseMonthlyCost = burnRate * 30 * 65.69;
  const projectedMonthlyCost = burnRate * 30 * simulatedPrice;
  const variance = projectedMonthlyCost - baseMonthlyCost;

  return (
    <div className="p-8 glass-panel glass-panel-hover flex flex-col justify-between h-full relative overflow-hidden group">
      
      {/* Subtle Decorative Background Motif */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:-translate-x-2 transition-transform duration-700 text-emerald-900">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M50 20 L50 80 M35 40 L65 40 M35 60 L65 60 M50 20 C65 30 65 70 50 80 C35 70 35 30 50 20 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between text-slate-500 mb-8">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600">
              <CircleDollarSign className="w-4 h-4" />
            </span>
            <span className="uppercase tracking-widest text-[10px] font-bold text-slate-500">Projected Budget</span>
          </div>
          {variance > 0 && (
            <span className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              +₹{variance.toFixed(0)} Var
            </span>
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl text-slate-400 font-sans font-medium mb-1">₹</span>
            <p className="text-6xl font-display font-bold text-slate-900 tracking-tight">
              {projectedMonthlyCost.toFixed(2)}
            </p>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest block">30-Day Simulation</p>
        </div>
      </div>
      
      <div className="mt-auto pt-8 border-t border-slate-100 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Market Price</span>
          <span className="text-emerald-700 text-[11px] font-bold font-mono tracking-tight bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm">₹{simulatedPrice}/kg</span>
        </div>
        <div className="px-1">
          <input 
            type="range" 
            min="50" 
            max="150" 
            step="1"
            value={simulatedPrice}
            onChange={(e) => setSimulatedPrice(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
};

export default CostProjectionCard;

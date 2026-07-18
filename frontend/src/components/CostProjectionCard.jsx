import React, { useState } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

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
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between text-slate-500 mb-6">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-indigo-500" />
            <span className="uppercase tracking-widest text-[10px] font-bold">Projected Budget (7-Day Avg)</span>
          </div>
          {variance > 0 && (
            <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              +₹{variance.toFixed(0)} Var
            </span>
          )}
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl text-slate-400 font-sans font-medium">₹</span>
          <p className="text-5xl font-display font-bold text-slate-900 tracking-tight">
            {projectedMonthlyCost.toFixed(2)}
          </p>
        </div>
        <p className="text-xs text-slate-500 mt-3 font-semibold bg-slate-50 inline-block px-3 py-1 rounded-lg">per month (simulated)</p>
      </div>
      
      <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">
          <span>Market Price</span>
          <span className="text-indigo-600 font-mono tracking-tight bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">₹{simulatedPrice}/kg</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="150" 
          step="1"
          value={simulatedPrice}
          onChange={(e) => setSimulatedPrice(Number(e.target.value))}
          className="w-full accent-indigo-500 opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
};

export default CostProjectionCard;

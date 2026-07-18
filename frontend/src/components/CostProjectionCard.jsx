import React, { useState } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

const CostProjectionCard = ({ prediction }) => {
  const [simulatedPrice, setSimulatedPrice] = useState(80);
  
  const burnRate = prediction?.burn_rate_kg_per_day || 0;
  const baseMonthlyCost = burnRate * 30 * 80;
  const projectedMonthlyCost = burnRate * 30 * simulatedPrice;
  const variance = projectedMonthlyCost - baseMonthlyCost;

  return (
    <div className="p-8 glass-panel glass-panel-hover flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between text-gray-400 mb-6">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
            <span className="uppercase tracking-widest text-xs font-semibold">Projected Budget</span>
          </div>
          {variance > 0 && (
            <span className="flex items-center text-xs font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-md shadow-inner">
              <TrendingUp className="w-3 h-3 mr-1" />
              +₹{variance.toFixed(0)} Variance
            </span>
          )}
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl text-gray-400 font-sans font-medium">₹</span>
          <p className="text-5xl font-display font-light text-white">
            {projectedMonthlyCost.toFixed(2)}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-2 font-medium">per month (simulated)</p>
      </div>
      
      <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
        <div className="flex justify-between text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
          <span>Market Price</span>
          <span className="text-indigo-300 font-mono tracking-tight bg-white/5 px-2 py-0.5 rounded">₹{simulatedPrice}/kg</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="150" 
          step="1"
          value={simulatedPrice}
          onChange={(e) => setSimulatedPrice(Number(e.target.value))}
          className="w-full accent-indigo-400 opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
};

export default CostProjectionCard;

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
    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-gray-400 mb-4">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-emerald-500" />
            <span className="uppercase tracking-wider text-xs font-medium">Projected Budget (7-Day Avg)</span>
          </div>
          {variance > 0 && (
            <span className="flex items-center text-xs font-medium text-red-400 bg-red-950/50 px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3 mr-1" />
              +₹{variance.toFixed(0)} Variance
            </span>
          )}
        </div>
        <p className="text-4xl font-light text-white">
          ₹ {projectedMonthlyCost.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mt-2">per month (simulated)</p>
      </div>
      
      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Market Price Fluctuations</span>
          <span className="text-emerald-400 font-medium">₹{simulatedPrice}/kg</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="150" 
          step="1"
          value={simulatedPrice}
          onChange={(e) => setSimulatedPrice(Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>
    </div>
  );
};

export default CostProjectionCard;

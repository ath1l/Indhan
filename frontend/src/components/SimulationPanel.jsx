import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, RefreshCw } from 'lucide-react';

const SimulationPanel = ({ cylinderId, currentWeight, capacity = 14.2, tare = 15.3, onReadingAdded }) => {
  const fullWeight = capacity + tare;
  const [sliderValue, setSliderValue] = useState(currentWeight || fullWeight);
  const [loading, setLoading] = useState(false);

  const submitReading = async (weight) => {
    setLoading(true);
    try {
      await axios.post(`/api/v1/cylinders/${cylinderId}/readings`, { weight_kg: parseFloat(weight) });
      if (onReadingAdded) {
        onReadingAdded();
      }
    } catch (err) {
      console.error("Error submitting reading:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => submitReading(sliderValue);
  const handleSimulateLeak = () => submitReading(Math.max(tare, currentWeight - 2.0));
  const handleSimulateRefill = () => submitReading(fullWeight);

  return (
    <div className="mt-8 p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
      <div className="flex items-center text-gray-400 mb-6">
        <Activity className="w-5 h-5 mr-2 text-blue-500" />
        <span className="uppercase tracking-wider text-xs font-medium">Live ML Simulation Panel</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manual Control */}
        <div className="space-y-4">
          <label className="text-sm text-gray-400">
            Manual Weight Injection: <span className="text-white font-mono">{sliderValue} kg</span>
          </label>
          <input 
            type="range" 
            min={tare} 
            max={fullWeight} 
            step="0.1" 
            value={sliderValue}
            onChange={(e) => setSliderValue(e.target.value)}
            disabled={loading}
            className="w-full accent-blue-600"
          />
          <button 
            onClick={handleManualSubmit}
            disabled={loading}
            className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 rounded-lg py-2 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Processing ML Pipeline...' : 'Submit Custom Reading'}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 flex flex-col justify-end">
          <button 
            onClick={handleSimulateLeak}
            disabled={loading}
            className="w-full flex items-center justify-center bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 text-red-400 rounded-lg py-2 transition-colors disabled:opacity-50 font-medium"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Simulate Leak (-2 kg)
          </button>
          <button 
            onClick={handleSimulateRefill}
            disabled={loading}
            className="w-full flex items-center justify-center bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-900/50 text-emerald-400 rounded-lg py-2 transition-colors disabled:opacity-50 font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Simulate Refill (Full {fullWeight} kg)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;

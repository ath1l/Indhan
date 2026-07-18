import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, RefreshCw, Flame, Clock, Droplet } from 'lucide-react';

const SimulationPanel = ({ cylinderId, currentWeight, capacity = 14.2, tare = 15.3, onReadingAdded }) => {
  const fullWeight = capacity + tare;
  const [sliderValue, setSliderValue] = useState(currentWeight || fullWeight);
  const [gasConsumed, setGasConsumed] = useState(0.5);
  const [durationMinutes, setDurationMinutes] = useState(60);
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

  const handleManualSubmit = async () => {
    setLoading(true);
    try {
      // Calculate delta and spread over 10 minutes to prevent instant spikes
      const diff = currentWeight - sliderValue;
      await axios.post(`/api/v1/cylinders/${cylinderId}/readings/simulate`, {
        gas_consumed: diff,
        duration_minutes: 10
      });
      if (onReadingAdded) onReadingAdded();
    } catch (err) {
      console.error("Error with manual submission:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSimulateRefill = () => submitReading(fullWeight);
  
  const handleCustomUsage = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/v1/cylinders/${cylinderId}/readings/simulate`, { 
        gas_consumed: parseFloat(gasConsumed),
        duration_minutes: parseInt(durationMinutes)
      });
      // Reset to defaults
      setGasConsumed(0.5);
      setDurationMinutes(60);
      
      if (onReadingAdded) {
        onReadingAdded();
      }
    } catch (err) {
      console.error("Error simulating usage:", err);
    } finally {
      setLoading(false);
    }
  };
  


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

        {/* Custom Usage Scenario */}
        <div className="space-y-4">
          <label className="text-sm text-gray-400 block -mb-1">
            Custom Usage Scenario
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-gray-500 mb-1 block">Gas (kg)</span>
              <div className="relative">
                <Droplet className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={gasConsumed}
                  onChange={(e) => setGasConsumed(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500 mb-1 block">Time (mins)</span>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  step="1"
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleCustomUsage}
            disabled={loading}
            className="w-full flex items-center justify-center bg-orange-950/30 hover:bg-orange-900/50 border border-orange-900/50 text-orange-400 rounded-lg py-2 transition-colors disabled:opacity-50 font-medium"
          >
            <Activity className="w-4 h-4 mr-2" />
            Run Simulation
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

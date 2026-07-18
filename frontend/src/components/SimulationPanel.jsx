import React, { useState } from 'react';
import axios from 'axios';
import { Activity, RefreshCw, Flame, Clock, Droplet, Check, Zap } from 'lucide-react';

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
    <div className="glass-panel p-6 md:p-8 mt-8 relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-4">
        <div>
          <div className="flex items-center text-teal-400 mb-2">
            <Zap className="w-5 h-5 mr-2" />
            <h2 className="uppercase tracking-widest text-sm font-semibold">Consumption Simulator</h2>
          </div>
          <p className="text-sm text-gray-400">Model usage scenarios and observe how consumption affects LPG runway and cost.</p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="text-[10px] font-mono text-teal-400 font-semibold tracking-widest uppercase">Simulation Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Usage Scenario */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-6">Usage Scenario</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1.5 block">Gas Consumed (kg)</span>
              <div className="relative">
                <Flame className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={gasConsumed}
                  onChange={(e) => setGasConsumed(e.target.value)}
                  className="w-full bg-[#030614] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1.5 block">Duration (mins)</span>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  step="1"
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full bg-[#030614] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleCustomUsage}
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Processing...' : 'Run Simulation'}
            </button>
            <button 
              onClick={handleSimulateRefill}
              disabled={loading}
              className="w-full btn-secondary"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Simulate Refill
            </button>
          </div>
        </div>

        {/* Manual Sensor Input */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 flex flex-col">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-6">Manual Sensor Input</h3>
          
          <div className="flex-grow flex flex-col justify-center mb-8">
            <div className="flex justify-between items-end mb-4">
              <span className="text-sm text-gray-400">Injection Weight</span>
              <span className="text-2xl font-mono text-white">{sliderValue} <span className="text-sm text-gray-500 font-sans">kg</span></span>
            </div>
            
            <div className="relative w-full h-1.5 bg-gray-800 rounded-full flex items-center group/slider">
              <input 
                type="range" 
                min={tare} 
                max={fullWeight} 
                step="0.1" 
                value={sliderValue}
                onChange={(e) => setSliderValue(e.target.value)}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
              />
              <div 
                className="absolute left-0 h-full bg-indigo-500 rounded-full transition-all ease-out z-10 pointer-events-none group-hover/slider:bg-indigo-400"
                style={{ width: `${((sliderValue - tare) / (fullWeight - tare)) * 100}%` }}
              ></div>
              <div 
                className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10 pointer-events-none transition-all group-hover/slider:scale-110"
                style={{ left: `calc(${((sliderValue - tare) / (fullWeight - tare)) * 100}% - 8px)` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-mono">
              <span>{tare.toFixed(1)}kg (Empty)</span>
              <span>{fullWeight.toFixed(1)}kg (Full)</span>
            </div>
          </div>
          
          <button 
            onClick={handleManualSubmit}
            disabled={loading}
            className="w-full btn-secondary text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/30"
          >
            Submit Reading
          </button>
        </div>

      </div>
    </div>
  );
};

export default SimulationPanel;

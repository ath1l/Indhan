import React, { useState } from 'react';
import axios from 'axios';
import { Activity, RefreshCw, Droplet, Clock, ChevronRight } from 'lucide-react';
import GasLevelIndicator from './GasLevelIndicator';

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
    <div className="mt-8 p-8 md:p-10 rounded-[32px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
      {/* Very faint background laboratory pattern (dots) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="uppercase tracking-widest text-sm font-bold text-slate-900">Consumption Simulator</h3>
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-md shadow-sm">
              Simulation Mode
            </span>
          </div>
          <p className="text-slate-500 text-[13px] font-medium max-w-lg">
            Model LPG usage scenarios and observe their effect on cylinder consumption.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Visual Connection (Left) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
          <GasLevelIndicator 
            currentWeight={currentWeight} 
            capacity={capacity} 
            tare={tare} 
            size="large"
            hasReading={true}
          />
        </div>

        {/* Separator / Flow Art */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center text-slate-300">
          <ChevronRight className="w-8 h-8 opacity-50" />
        </div>

        {/* Controls (Right) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Manual Weight Input */}
          <div className="flex flex-col h-full space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                Manual Weight Input
              </label>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-display font-bold text-slate-900 tracking-tight">{sliderValue}</span>
                <span className="text-sm text-slate-400 font-bold mb-1">kg</span>
              </div>
            </div>
            
            <div className="pt-2 pb-2 mt-auto">
              <input 
                type="range" 
                min={tare} 
                max={fullWeight} 
                step="0.1" 
                value={sliderValue}
                onChange={(e) => setSliderValue(e.target.value)}
                disabled={loading}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>
            
            <button 
              onClick={handleManualSubmit}
              disabled={loading}
              className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-600 border border-slate-200 rounded-xl py-3.5 transition-all disabled:opacity-50 font-bold text-[10px] uppercase tracking-widest shadow-sm"
            >
              {loading ? 'Processing...' : 'Submit Reading'}
            </button>
          </div>

          {/* Vertical Divider for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100"></div>

          {/* Usage Scenario */}
          <div className="flex flex-col h-full space-y-5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0 md:mb-4">
              Usage Scenario
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-end">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 block">LPG Consumption</span>
                <div className="relative group/input">
                  <Droplet className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within/input:text-emerald-500 transition-colors" />
                  <input 
                    type="number" 
                    step="0.1"
                    min="0.1"
                    value={gasConsumed}
                    onChange={(e) => setGasConsumed(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-8 font-mono text-sm text-slate-700 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">kg</span>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 block">Duration</span>
                <div className="relative group/input">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within/input:text-emerald-500 transition-colors" />
                  <input 
                    type="number" 
                    step="1"
                    min="1"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-9 font-mono text-sm text-slate-700 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">min</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto pt-2">
              <button 
                onClick={handleSimulateRefill}
                disabled={loading}
                className="w-full flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] text-emerald-700 border border-emerald-200/60 rounded-xl py-3.5 transition-all disabled:opacity-50 font-bold text-[10px] uppercase tracking-widest shadow-sm order-2 sm:order-1"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Simulate Refill
              </button>

              <button 
                onClick={handleCustomUsage}
                disabled={loading}
                className="w-full flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white rounded-xl py-3.5 transition-all disabled:opacity-50 font-bold text-[10px] uppercase tracking-widest shadow-[0_4px_14px_rgba(16,185,129,0.25)] order-1 sm:order-2"
              >
                <Activity className="w-3.5 h-3.5 mr-2" />
                Run Simulation
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;

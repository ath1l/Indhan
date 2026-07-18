import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, RefreshCw, Flame, Clock, Droplet, FlaskConical, Calendar, TrendingDown } from 'lucide-react';

const SimulationPanel = ({ cylinderId, currentWeight, capacity = 14.2, tare = 15.3, onReadingAdded }) => {
  const fullWeight = capacity + tare;
  const [sliderValue, setSliderValue] = useState(currentWeight || fullWeight);
  const [gasConsumed, setGasConsumed] = useState(0.5);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [loading, setLoading] = useState(false);

  // Demo Studio State
  const [demoDays, setDemoDays] = useState(30);
  const [demoProfile, setDemoProfile] = useState("normal"); 

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

  const handleGenerateHistory = async () => {
    setLoading(true);
    try {
      let endWeight = 17.0; // normal
      if (demoProfile === 'light') endWeight = 22.0;
      if (demoProfile === 'heavy') endWeight = 15.5; 

      await axios.post(`/api/v1/cylinders/${cylinderId}/readings/simulate-history`, {
        days: parseInt(demoDays),
        startWeight: fullWeight,
        endWeight: endWeight
      });
      if (onReadingAdded) {
        onReadingAdded();
      }
    } catch (err) {
      console.error("Error generating history:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-8 p-8 rounded-[24px] bg-slate-100 border border-slate-200/60 shadow-inner relative overflow-hidden group mb-8">
      {/* Background laboratory pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

      <div className="absolute top-0 right-0 p-3 bg-red-500 text-white font-bold text-[9px] uppercase tracking-[0.2em] rounded-bl-xl shadow-sm z-10 flex items-center gap-1.5">
        <FlaskConical className="w-3 h-3" /> Simulation Mode
      </div>
      
      <div className="relative z-10 flex items-center text-slate-900 mb-2">
        <Activity className="w-5 h-5 mr-3 text-red-600" />
        <h3 className="uppercase tracking-widest text-sm font-bold">LPG Telemetry Simulator</h3>
      </div>
      <p className="relative z-10 text-slate-500 text-sm mb-8 font-medium max-w-2xl">
        Inject synthetic data payloads to model consumption scenarios and validate machine-learning runway predictions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Manual Control */}
        <div className="space-y-4 p-6 bg-white/60 backdrop-blur-sm border border-white rounded-2xl shadow-sm">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block flex justify-between items-center">
            Manual Weight Injection
            <span className="text-red-700 bg-red-50 px-2 py-1 rounded font-mono text-sm border border-red-100">{sliderValue} kg</span>
          </label>
          <div className="pt-2 pb-4">
            <input 
              type="range" 
              min={tare} 
              max={fullWeight} 
              step="0.1" 
              value={sliderValue}
              onChange={(e) => setSliderValue(e.target.value)}
              disabled={loading}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>
          <button 
            onClick={handleManualSubmit}
            disabled={loading}
            className="w-full bg-white hover:bg-red-50 active:scale-[0.98] text-red-700 border border-red-200/60 rounded-xl py-3 transition-all disabled:opacity-50 font-bold text-[10px] uppercase tracking-widest shadow-sm"
          >
            {loading ? 'Processing Payload...' : 'Inject Weight Reading'}
          </button>
        </div>

        {/* Custom Usage Scenario */}
        <div className="space-y-4 p-6 bg-white/60 backdrop-blur-sm border border-white rounded-2xl shadow-sm">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">
            Synthetic Consumption Scenario
          </label>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 block">Gas Payload (kg)</span>
              <div className="relative">
                <Droplet className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={gasConsumed}
                  onChange={(e) => setGasConsumed(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 font-mono text-sm text-slate-700 font-bold focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors shadow-sm"
                />
              </div>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 block">Duration (mins)</span>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  step="1"
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 font-mono text-sm text-slate-700 font-bold focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors shadow-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleCustomUsage}
              disabled={loading}
              className="w-full flex items-center justify-center bg-white hover:bg-orange-50 active:scale-[0.98] border border-orange-200/60 text-orange-600 rounded-xl py-3 transition-all disabled:opacity-50 font-bold text-[10px] uppercase tracking-widest shadow-sm"
            >
              <Activity className="w-3.5 h-3.5 mr-2" />
              Execute Burn
            </button>
            
            <button 
              onClick={handleSimulateRefill}
              disabled={loading}
              className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white rounded-xl py-3 transition-all disabled:opacity-50 font-bold text-[10px] uppercase tracking-widest shadow-[0_4px_12px_rgba(220,38,38,0.2)]"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Simulate Refill (Full {fullWeight} kg)
            </button>
          </div>
        </div>
      </div>

      {/* Demo Studio - Historical Generator */}
      <div className="p-8 rounded-[24px] bg-slate-100 border border-slate-200/60 shadow-inner relative overflow-hidden group">
        <div className="flex items-center text-slate-900 mb-6 relative z-10">
          <Calendar className="w-5 h-5 mr-3 text-purple-600" />
          <span className="uppercase tracking-widest text-sm font-bold">Time-Lapse Demo Studio</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-10">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Timeframe</label>
            <select 
              value={demoDays} 
              onChange={(e) => setDemoDays(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 font-mono text-sm text-slate-700 font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-sm"
            >
              <option value="7">Last 7 Days</option>
              <option value="15">Last 15 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Usage Profile</label>
            <select 
              value={demoProfile} 
              onChange={(e) => setDemoProfile(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 font-mono text-sm text-slate-700 font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-sm"
            >
              <option value="light">Light Cooking</option>
              <option value="normal">Normal Household</option>
              <option value="heavy">Heavy / Catering</option>
            </select>
          </div>

          <button 
            onClick={handleGenerateHistory}
            disabled={loading}
            className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white border border-purple-700/50 rounded-xl py-3 transition-all disabled:opacity-50 font-bold text-[10px] uppercase tracking-widest shadow-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><TrendingDown className="w-4 h-4 mr-2" /> Generate Historical Data</>}
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default SimulationPanel;

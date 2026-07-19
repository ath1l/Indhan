import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FastForward, Play, Square, Settings2 } from 'lucide-react';

const TimeWarpSimulator = ({ cylinderId, initialWeight, onLivePointGenerated }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(3600); // Default 1 hour per second
  const dailyBurn = 0.5; // kg per day
  
  const [virtualTime, setVirtualTime] = useState(new Date());
  const [currentWeight, setCurrentWeight] = useState(initialWeight || 14.2 + 15.3);

  // Refs for loop state to avoid closure staleness
  const stateRef = useRef({
    virtualTime: new Date(),
    currentWeight: initialWeight || 14.2 + 15.3,
    lastDispatchRealTime: Date.now()
  });

  // Sync initial props
  useEffect(() => {
    if (initialWeight && !isPlaying && Math.abs(stateRef.current.currentWeight - initialWeight) > 0.1) {
      setCurrentWeight(initialWeight);
      stateRef.current.currentWeight = initialWeight;
    }
  }, [initialWeight, isPlaying]);

  useEffect(() => {
    let intervalId;
    
    if (isPlaying) {
      const TICK_MS = 100; // Real-world interval tick
      
      intervalId = setInterval(() => {
        const virtualMsPassed = TICK_MS * multiplier;
        const virtualHoursPassed = virtualMsPassed / (1000 * 60 * 60);
        
        let newVirtualTime = new Date(stateRef.current.virtualTime.getTime() + virtualMsPassed);
        let weightDrop = 0;
        
        // Burn Algorithm
        const hour = newVirtualTime.getHours();
        if (hour === 7 || hour === 8) { // Breakfast: 15% of daily burn
          const ratePerHour = (dailyBurn * 0.15) / 2;
          weightDrop = virtualHoursPassed * ratePerHour;
        } else if (hour === 19 || hour === 20) { // Dinner: 85% of daily burn
          const ratePerHour = (dailyBurn * 0.85) / 2;
          weightDrop = virtualHoursPassed * ratePerHour;
        }

        let newWeight = stateRef.current.currentWeight - weightDrop;
        
        // Safety bounds
        if (newWeight <= 15.3) { // Tare weight limit
          newWeight = 15.3;
          setIsPlaying(false); // Auto-pause
        }

        // Update state refs
        stateRef.current.virtualTime = newVirtualTime;
        stateRef.current.currentWeight = newWeight;
        
        // Sync React state for UI rendering
        setVirtualTime(newVirtualTime);
        setCurrentWeight(newWeight);

        // Network Dispatch Logic (throttle to 2 per second max)
        const nowReal = Date.now();
        if (nowReal - stateRef.current.lastDispatchRealTime > 500) {
          stateRef.current.lastDispatchRealTime = nowReal;
          
          const jitter = (Math.random() - 0.5) * 0.1; // +/- 0.05kg
          const finalWeight = parseFloat((newWeight + jitter).toFixed(3));
          
          // 1. Dispatch to UI instantly
          if (onLivePointGenerated) {
            onLivePointGenerated({
              date: newVirtualTime.toISOString(),
              weight_kg: finalWeight,
              is_simulation: true
            });
          }
          
          // 2. Dispatch to Backend silently
          axios.post(`/api/v1/cylinders/${cylinderId}/readings`, {
            weight_kg: finalWeight,
            timestamp: newVirtualTime.toISOString(),
            type: 'simulation'
          }).catch(err => console.error("TimeWarp POST err:", err));
        }
        
      }, TICK_MS);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, multiplier, dailyBurn, cylinderId, onLivePointGenerated]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const resetSimulation = () => {
    setIsPlaying(false);
    const now = new Date();
    setVirtualTime(now);
    setCurrentWeight(initialWeight || 29.5);
    stateRef.current.virtualTime = now;
    stateRef.current.currentWeight = initialWeight || 29.5;
  };

  return (
    <div className="mt-8 p-6 lg:p-8 bg-white border border-slate-200 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
      
      <div className="flex items-center justify-center text-slate-400 mb-8 relative z-10">
        <FastForward className={`w-5 h-5 mr-2 ${isPlaying ? 'text-emerald-500 animate-pulse' : ''}`} />
        <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Live Time Warp Engine</span>
      </div>

      <div className="flex flex-col md:flex-row gap-10 relative z-10 items-center justify-between">
        
        {/* Large Digital Clock Display */}
        <div className="flex flex-col justify-center items-center text-center px-8">
           <div className="text-6xl font-display font-bold text-slate-900 tracking-tight tabular-nums">
             {virtualTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
           </div>
           <div className="text-sm font-medium text-slate-500 mt-2 tracking-wide uppercase">
             {virtualTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
           </div>
           <div className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
             Simulated Weight
             <span className="text-emerald-700 font-display text-lg tracking-tight bg-emerald-50 px-3 py-1 rounded-[10px] border border-emerald-100 tabular-nums">
               {currentWeight.toFixed(2)} kg
             </span>
           </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col justify-center space-y-6 w-full max-w-sm">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mb-3">
              <Settings2 className="w-3 h-3 mr-1" /> Speed Multiplier
            </label>
            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200">
              {[1, 60, 3600, 86400].map(mult => (
                <button
                  key={mult}
                  onClick={() => setMultiplier(mult)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    multiplier === mult 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {mult === 1 ? '1x' : mult === 60 ? '60x' : mult === 3600 ? '3600x' : '86400x'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={togglePlay}
              className={`flex-1 flex items-center justify-center py-4 rounded-xl font-bold transition-all ${
                isPlaying 
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 shadow-sm' 
                  : 'btn-primary'
              }`}
            >
              {isPlaying ? (
                <><Square className="w-5 h-5 mr-2 fill-current" /> Pause Warp</>
              ) : (
                <><Play className="w-5 h-5 mr-2 fill-current" /> Initialize Warp</>
              )}
            </button>
            
            <button 
              onClick={resetSimulation}
              disabled={isPlaying}
              className="px-6 flex items-center justify-center text-sm rounded-xl font-bold text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent shadow-sm"
            >
              Reset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimeWarpSimulator;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FastForward, Play, Square, Settings2, Clock } from 'lucide-react';

const TimeWarpSimulator = ({ cylinderId, initialWeight, onLivePointGenerated }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(3600); // Default 1 hour per second
  const [dailyBurn, setDailyBurn] = useState(0.5); // kg per day
  
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
    <div className="mt-8 p-6 rounded-2xl bg-gray-900/50 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] relative overflow-hidden">
      
      {/* Background Animated Glow */}
      <div className={`absolute -top-32 -right-32 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${isPlaying ? 'opacity-100 scale-150 animate-pulse' : 'opacity-30 scale-100'}`}></div>

      <div className="flex items-center text-purple-400 mb-6 relative z-10">
        <FastForward className={`w-5 h-5 mr-2 ${isPlaying ? 'animate-bounce' : ''}`} />
        <span className="uppercase tracking-wider text-xs font-bold">Live Time-Warp Engine</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Virtual Clock Display */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col justify-center items-center">
          <Clock className={`w-6 h-6 mb-2 ${isPlaying ? 'text-purple-400' : 'text-gray-500'}`} />
          <div className="text-2xl font-mono text-white tracking-widest text-center">
            {virtualTime.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} <br/>
            <span className={isPlaying ? 'text-purple-300 drop-shadow-[0_0_5px_rgba(216,180,254,0.8)]' : 'text-gray-300'}>
              {virtualTime.toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
          <div className="mt-3 text-sm font-medium text-gray-400">
            Engine Weight: <span className="text-white">{currentWeight.toFixed(2)} kg</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col justify-center space-y-4">
          <label className="text-sm text-gray-400 flex items-center">
            <Settings2 className="w-4 h-4 mr-2" /> Speed Multiplier
          </label>
          <div className="flex gap-2 bg-black/40 p-1.5 rounded-lg border border-white/5">
            {[1, 60, 3600, 86400].map(mult => (
              <button
                key={mult}
                onClick={() => setMultiplier(mult)}
                className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${multiplier === mult ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {mult === 1 ? '1x' : mult === 60 ? '60x' : mult === 3600 ? '3600x' : '86400x'}
              </button>
            ))}
          </div>

          <label className="text-sm text-gray-400 mt-2">Baseline Burn Rate</label>
          <input 
            type="range" 
            min="0.1" 
            max="2.0" 
            step="0.1"
            value={dailyBurn}
            onChange={(e) => setDailyBurn(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="text-xs text-right text-gray-500 font-mono">{dailyBurn.toFixed(1)} kg/day</div>
        </div>

        {/* Play/Stop Buttons */}
        <div className="flex flex-col justify-center gap-3">
          <button 
            onClick={togglePlay}
            className={`flex items-center justify-center py-4 rounded-xl font-bold transition-all ${isPlaying ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]'}`}
          >
            {isPlaying ? (
              <><Square className="w-5 h-5 mr-2 fill-current" /> Pause Time-Warp</>
            ) : (
              <><Play className="w-5 h-5 mr-2 fill-current" /> Initialize Engine</>
            )}
          </button>
          
          <button 
            onClick={resetSimulation}
            disabled={isPlaying}
            className="flex items-center justify-center py-2 text-sm rounded-xl font-medium text-gray-400 hover:text-white border border-gray-700 hover:bg-gray-800 transition-colors disabled:opacity-30"
          >
            Reset Clock
          </button>
        </div>

      </div>
    </div>
  );
};

export default TimeWarpSimulator;

import React from 'react';
import { Calendar, Clock, Activity, Zap } from 'lucide-react';

const DaysRemainingCard = ({ prediction }) => {
  if (!prediction) return null;

  const { days_remaining, est_empty_at, confidence } = prediction;
  const isLow = days_remaining < 3;
  const dateStr = new Date(est_empty_at).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const confPercent = Math.round(confidence * 100);

  return (
    <div className="glass-panel glass-panel-hover p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Ambient Glow */}
      <div className={`absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isLow ? 'bg-orange-500/10 group-hover:bg-orange-500/20' : 'bg-teal-500/10 group-hover:bg-teal-500/20'}`}></div>
      
      <div className="relative z-10">
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Calendar className={`w-4 h-4 ${isLow ? 'text-orange-400' : 'text-teal-400'}`} />
          Estimated Runway
        </h2>
        
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-5xl font-display font-light text-white tracking-tight">
            {days_remaining.toFixed(1)}
          </span>
          <span className="text-2xl font-medium text-gray-500">days</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mt-2">
          <Clock className="w-3.5 h-3.5 mr-2 opacity-50" />
          <span>Expected empty on <span className="text-gray-200 font-medium">{dateStr}</span></span>
        </div>
      </div>
      
      {/* Premium Confidence Indicator */}
      <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${confPercent > 90 ? 'text-teal-400' : 'text-teal-600'}`} />
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">AI Confidence</span>
          </div>
          <span className="text-sm font-mono text-gray-300">{confPercent}%</span>
        </div>
        
        <div className="w-full flex gap-1 h-1.5">
           {[...Array(10)].map((_, i) => (
             <div 
               key={i} 
               className={`flex-1 rounded-full ${i < Math.floor(confPercent / 10) ? (isLow ? 'bg-orange-500/80 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-teal-500/80 shadow-[0_0_8px_rgba(20,184,166,0.4)]') : 'bg-gray-800'}`}
             ></div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default DaysRemainingCard;

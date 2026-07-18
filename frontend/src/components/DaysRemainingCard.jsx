import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const DaysRemainingCard = ({ prediction }) => {
  if (!prediction) return null;

  const { days_remaining, est_empty_at, confidence } = prediction;
  const isLow = days_remaining < 3;
  const dateStr = new Date(est_empty_at).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={`p-8 glass-panel glass-panel-hover flex flex-col justify-between h-full relative overflow-hidden group`}>
      <div className={`absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isLow ? 'bg-orange-500/20 group-hover:bg-orange-500/30' : 'bg-teal-500/10 group-hover:bg-teal-500/20'}`}></div>
      
      <div className="flex items-center space-x-4 mb-4 relative z-10">
        <div className={`p-3 rounded-2xl border ${isLow ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'} shadow-inner`}>
          <Calendar className={`w-6 h-6 ${isLow ? 'drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]' : 'drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]'}`} />
        </div>
        <div>
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Estimated Depletion</h2>
          <p className="text-4xl font-display font-light tracking-tight text-white mt-1">
            {days_remaining.toFixed(1)} <span className="text-xl text-gray-500 font-sans font-medium">days</span>
          </p>
        </div>
      </div>
      
      <div className="pt-5 mt-auto border-t border-white/10 flex flex-col space-y-3 relative z-10">
        <div className="flex items-center text-gray-400 text-sm">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span>Expected empty on <span className="text-gray-200 font-medium">{dateStr}</span></span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium uppercase tracking-wider mt-2">
          <span>AI Confidence</span>
          <span className="text-gray-300 bg-white/5 px-2 py-0.5 rounded text-mono-data">{Math.round(confidence * 100)}%</span>
        </div>
        <div className="w-full bg-white/5 border border-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
          <div 
            className={`h-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] ${isLow ? 'bg-orange-400' : 'bg-teal-400'}`} 
            style={{ width: `${Math.round(confidence * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DaysRemainingCard;

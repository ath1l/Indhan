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
    <div className={`p-6 glass-panel glass-panel-hover flex flex-col justify-between h-full relative overflow-hidden group`}>
      <div className={`absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isLow ? 'bg-orange-500/10 group-hover:bg-orange-500/20' : 'bg-emerald-500/5 group-hover:bg-emerald-500/10'}`}></div>
      
      <div className="flex items-center space-x-4 mb-4 relative z-10">
        <div className={`p-3 rounded-2xl border ${isLow ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Estimated Depletion</h2>
          <p className="text-4xl font-display font-bold tracking-tight text-slate-900 mt-1">
            {days_remaining.toFixed(1)} <span className="text-xl text-slate-400 font-sans font-semibold">days</span>
          </p>
        </div>
      </div>
      
      <div className="pt-4 mt-auto border-t border-slate-100 flex flex-col space-y-3 relative z-10">
        <div className="flex items-center text-slate-500 text-sm font-medium">
          <Clock className="w-4 h-4 mr-2 text-slate-400" />
          <span>Expected empty on <span className="text-slate-900 font-bold">{dateStr}</span></span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">
          <span>AI Confidence</span>
          <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{Math.round(confidence * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
          <div 
            className={`h-1.5 rounded-full ${isLow ? 'bg-orange-500' : 'bg-emerald-500'}`} 
            style={{ width: `${Math.round(confidence * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DaysRemainingCard;

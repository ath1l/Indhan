import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const DaysRemainingCard = ({ prediction }) => {
  if (!prediction) return null;

  const { days_remaining, est_empty_at, confidence } = prediction;
  const isLow = days_remaining < 3;
  const dateStr = new Date(est_empty_at).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  
  const confPercent = Math.round((confidence || 0) * 100);
  
  // Dynamic color selection based on urgency
  const theme = isLow 
    ? { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', stroke: '#f59e0b', shadow: 'shadow-amber-500/20' }
    : { text: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', stroke: '#10b981', shadow: 'shadow-emerald-500/20' };

  // Calculate SVG arc for confidence
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confPercent / 100) * circumference;

  return (
    <div className={`p-8 glass-panel glass-panel-hover flex flex-col justify-between h-full relative overflow-hidden group`}>
      <div className={`absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-20 ${theme.bg} group-hover:scale-125`}></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center text-slate-500 mb-2">
            <div className={`p-1.5 rounded-lg border mr-2 ${theme.bg} ${theme.text} ${theme.border}`}>
              <Calendar className="w-4 h-4" />
            </div>
            <span className="uppercase tracking-widest text-[10px] font-bold">Prediction</span>
          </div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Estimated Runway</h2>
        </div>
        
        {/* Subtle SVG Confidence Arc */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="6" />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke={theme.stroke} 
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-[10px] font-bold text-slate-700">{confPercent}%</span>
            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest -mt-1">Conf</span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mb-8 mt-2">
        <p className="text-6xl font-display font-bold text-slate-900 tracking-tight">
          {days_remaining.toFixed(1)} <span className="text-2xl text-slate-400 font-sans font-medium">days</span>
        </p>
      </div>
      
      <div className="mt-auto pt-5 border-t border-slate-100 relative z-10">
        <div className="flex items-center text-slate-500 text-sm font-medium">
          <Clock className="w-4 h-4 mr-2 text-slate-400" />
          <span className="text-xs">Expected empty on <span className="text-slate-900 font-bold ml-1">{dateStr}</span></span>
        </div>
      </div>
    </div>
  );
};

export default DaysRemainingCard;

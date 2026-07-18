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
    <div className={`p-6 rounded-2xl border ${isLow ? 'bg-red-950/20 border-red-900/50' : 'bg-gray-900/50 border-gray-800'} backdrop-blur-sm shadow-xl flex flex-col justify-between`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 rounded-xl ${isLow ? 'bg-red-900/30 text-red-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Estimated Depletion</h2>
          <p className="text-3xl font-light tracking-tight text-white mt-1">
            {days_remaining.toFixed(1)} <span className="text-lg text-gray-500">days</span>
          </p>
        </div>
      </div>
      
      <div className="pt-4 mt-2 border-t border-gray-800/50 flex flex-col space-y-2">
        <div className="flex items-center text-gray-400 text-sm">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span>Expected empty on <span className="text-gray-200 font-medium">{dateStr}</span></span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>AI Confidence Score</span>
          <span className="text-gray-300 font-medium">{Math.round(confidence * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1 overflow-hidden">
          <div 
            className={`h-1.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} 
            style={{ width: `${Math.round(confidence * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DaysRemainingCard;

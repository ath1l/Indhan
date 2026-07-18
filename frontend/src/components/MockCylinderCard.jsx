import React from 'react';
import { ShieldCheck, PauseCircle } from 'lucide-react';

const MockCylinderCard = ({ name, status, percent, weight }) => {
  const isStandby = status === 'Standby';
  const Icon = isStandby ? PauseCircle : ShieldCheck;

  return (
    <div className={`p-6 glass-panel glass-panel-hover flex flex-col h-[200px] relative overflow-hidden group`}>
      {!isStandby && (
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-teal-500/20 transition-colors"></div>
      )}
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <h2 className={`text-xs font-semibold uppercase tracking-widest ${isStandby ? 'text-gray-500' : 'text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]'}`}>
          {name}
        </h2>
      </div>
      
      <div className="flex items-end space-x-2 mb-4 relative z-10 mt-auto">
        <span className="text-4xl font-display font-light tracking-tighter text-white">
          {weight.toFixed(2)}
        </span>
        <span className="text-lg font-medium text-gray-500 pb-1">kg</span>
      </div>

      <div className="space-y-3 relative z-10 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider">
          <span className={`${isStandby ? 'text-gray-500' : 'text-teal-300'} flex items-center gap-2`}>
            <Icon className="w-3.5 h-3.5" />
            {status}
          </span>
          <span className="text-gray-400">{percent}%</span>
        </div>
        
        <div className="w-full bg-white/5 border border-white/10 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-1 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)] ${isStandby ? 'bg-gray-500' : 'bg-teal-400'}`} 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MockCylinderCard;

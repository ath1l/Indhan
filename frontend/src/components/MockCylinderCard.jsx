import React from 'react';
import { ShieldCheck, PauseCircle, Trash2 } from 'lucide-react';
import GasLevelIndicator from './GasLevelIndicator';

const MockCylinderCard = ({ name, status, percent, weight, onDelete }) => {
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
        {onDelete && (
          <button 
            onClick={onDelete}
            className="text-gray-600 hover:text-red-500 p-1.5 -mr-1.5 -mt-1.5 rounded-md hover:bg-red-950/30 transition-colors z-10"
            title="Delete Cylinder"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="mb-2 mt-auto relative z-10">
        <GasLevelIndicator currentWeight={weight} size="small" />
      </div>

      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider relative z-10 border-t border-white/10 pt-4 mt-2">
        <span className={`${isStandby ? 'text-gray-500' : 'text-teal-300'} flex items-center gap-2`}>
          <Icon className="w-3.5 h-3.5" />
          {status}
        </span>
      </div>
    </div>
  );
};

export default MockCylinderCard;

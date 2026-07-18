import React from 'react';
import { ShieldCheck, PauseCircle, Trash2 } from 'lucide-react';

const MockCylinderCard = ({ name, status, percent, weight, onDelete }) => {
  const isStandby = status === 'Standby';
  const colorClass = isStandby ? 'text-gray-400 bg-gray-950/50 border-gray-800' : 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30';
  const Icon = isStandby ? PauseCircle : ShieldCheck;

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-sm shadow-xl flex flex-col h-full ${colorClass}`}>
      <div className="flex justify-between items-start mb-6">
        <h2 className={`text-sm font-medium uppercase tracking-wider ${isStandby ? 'text-gray-500' : 'text-emerald-500'}`}>
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
      
      <div className="flex items-end space-x-2 mb-6">
        <span className="text-4xl font-light tracking-tighter text-white">
          {weight.toFixed(2)}
        </span>
        <span className="text-xl text-gray-500 pb-1">kg</span>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {status}
          </span>
          <span className="text-gray-300">{percent}% Full</span>
        </div>
        
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-1.5 rounded-full ${isStandby ? 'bg-gray-600' : 'bg-emerald-500'}`} 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MockCylinderCard;

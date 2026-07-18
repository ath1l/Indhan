import React from 'react';
import { AlertTriangle, X, CheckCircle, Info } from 'lucide-react';
import axios from 'axios';

const AnomalyAlert = ({ anomalies, cylinderId, onDismiss }) => {
  if (!anomalies || anomalies.length === 0) return null;

  const handleAcknowledge = async (anomalyId) => {
    try {
      await axios.post(`/api/v1/cylinders/${cylinderId}/anomalies/${anomalyId}/acknowledge`);
      onDismiss(anomalyId);
    } catch (error) {
      console.error("Failed to acknowledge anomaly", error);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 pl-1">Consumption Signals</h2>
      {anomalies.map(anomaly => (
        <div key={anomaly.id} className="relative overflow-hidden p-5 flex items-start space-x-4 glass-panel border-orange-500/20 bg-orange-500/[0.02] group transition-all">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500/50"></div>
          
          {/* Subtle Glow */}
          <div className="absolute -left-10 top-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex-shrink-0 p-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 shadow-inner relative z-10 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          
          <div className="flex-grow relative z-10">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-orange-400 font-semibold text-sm tracking-wide">{anomaly.type}</h3>
              <span className="text-[10px] text-gray-500 font-mono">
                {new Date(anomaly.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              {anomaly.message}
            </p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleAcknowledge(anomaly.id)}
                className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <CheckCircle className="w-3 h-3" /> Acknowledge
              </button>
              <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
                <Info className="w-3 h-3" /> May impact estimated runway
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => onDismiss(anomaly.id)}
            className="flex-shrink-0 text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors relative z-10"
            title="Dismiss temporarily"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AnomalyAlert;

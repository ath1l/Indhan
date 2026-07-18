import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
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
      {anomalies.map(anomaly => (
        <div key={anomaly.id} className="relative overflow-hidden p-5 flex items-start space-x-4 glass-panel border-orange-500/20 bg-orange-950/10 group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
          
          <div className="absolute -left-10 top-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex-shrink-0 p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 shadow-inner relative z-10">
            <AlertTriangle className="w-5 h-5 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
          </div>
          
          <div className="flex-grow pt-1 relative z-10">
            <h3 className="text-orange-300 font-display font-medium text-sm tracking-wide uppercase">{anomaly.type} Detected</h3>
            <p className="text-orange-200 text-sm mt-1 leading-relaxed">
              {anomaly.message}
            </p>
            <p className="text-xs text-orange-400/60 font-mono tracking-tight mt-2 font-medium">
              DETECTED AT: {new Date(anomaly.timestamp).toLocaleString()}
            </p>
          </div>
          
          <button 
            onClick={() => handleAcknowledge(anomaly.id)}
            className="flex-shrink-0 text-orange-400/50 hover:text-orange-300 bg-orange-500/5 hover:bg-orange-500/10 rounded-xl transition-colors p-2 relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AnomalyAlert;

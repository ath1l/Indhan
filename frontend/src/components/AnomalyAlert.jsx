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
        <div key={anomaly.id} className="relative overflow-hidden p-5 flex items-start space-x-4 bg-orange-50 border border-orange-200 rounded-2xl shadow-sm group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
          
          <div className="absolute -left-10 top-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex-shrink-0 p-2.5 bg-white border border-orange-100 rounded-xl text-orange-500 shadow-sm relative z-10">
            <AlertTriangle className="w-5 h-5" />
          </div>
          
          <div className="flex-grow pt-1 relative z-10">
            <h3 className="text-orange-900 font-bold text-sm tracking-wide uppercase">{anomaly.type} Detected</h3>
            <p className="text-orange-800 text-sm mt-1 leading-relaxed font-medium">
              {anomaly.message}
            </p>
            <p className="text-[10px] text-orange-500/80 font-mono tracking-tight mt-2 font-bold uppercase">
              DETECTED AT: {new Date(anomaly.timestamp).toLocaleString()}
            </p>
          </div>
          
          <button 
            onClick={() => handleAcknowledge(anomaly.id)}
            className="flex-shrink-0 text-orange-400 hover:text-orange-600 bg-white hover:bg-orange-100 border border-orange-100 rounded-xl transition-colors p-2 shadow-sm relative z-10"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AnomalyAlert;

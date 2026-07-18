import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import axios from 'axios';

const AnomalyAlert = ({ anomalies, cylinderId, onDismiss }) => {
  if (!anomalies || anomalies.length === 0) return null;

  const handleAcknowledge = async (anomalyId) => {
    try {
      // Hit the API to acknowledge
      await axios.post(`/api/v1/cylinders/${cylinderId}/anomalies/${anomalyId}/acknowledge`);
      onDismiss(anomalyId);
    } catch (error) {
      console.error("Failed to acknowledge anomaly", error);
    }
  };

  return (
    <div className="space-y-3 mb-6">
      {anomalies.map(anomaly => (
        <div key={anomaly.id} className="relative overflow-hidden rounded-xl bg-orange-950/40 border border-orange-900/50 p-4 flex items-start space-x-4 shadow-lg backdrop-blur-md">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
          <div className="flex-shrink-0 p-2 bg-orange-900/30 rounded-full text-orange-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-grow pt-1">
            <h3 className="text-orange-300 font-medium text-sm tracking-wide uppercase">{anomaly.type} Detected</h3>
            <p className="text-orange-200/70 text-sm mt-1 leading-relaxed">
              {anomaly.description}
            </p>
            <p className="text-xs text-orange-400/50 mt-2">
              Detected at: {new Date(anomaly.detected_at).toLocaleString()}
            </p>
          </div>
          <button 
            onClick={() => handleAcknowledge(anomaly.id)}
            className="flex-shrink-0 text-orange-400/50 hover:text-orange-300 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AnomalyAlert;

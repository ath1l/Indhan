import React from 'react';
import { AlertTriangle, X, Activity, Zap } from 'lucide-react';
import axios from 'axios';

const AnomalyAlert = ({ anomalies, cylinderId, onDismiss }) => {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="mb-8 flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[20px] shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-1.5 h-8 bg-emerald-400 rounded-full"></div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-slate-700 font-bold text-xs tracking-wider uppercase">Telemetry Stable</h3>
            <p className="text-slate-500 text-xs font-medium mt-0.5">No unusual consumption patterns detected.</p>
          </div>
        </div>
        {/* Subtle stable wave background */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 40" className="h-full w-48 text-emerald-600">
            <path d="M0 20 L40 20 L50 10 L60 30 L70 20 L200 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    );
  }

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
      {anomalies.map(anomaly => {
        // Determine severity visually based on type or message
        // Default to Warning (Amber)
        let theme = {
          bg: "bg-amber-50/70",
          border: "border-amber-200/50",
          text: "text-amber-800",
          indicator: "bg-amber-500",
          iconBg: "bg-amber-100 border-amber-200",
          iconText: "text-amber-600",
          Icon: AlertTriangle
        };

        if (anomaly.type?.toLowerCase().includes('leak') || anomaly.message?.toLowerCase().includes('critical')) {
          theme = {
            bg: "bg-red-50/70",
            border: "border-red-200/50",
            text: "text-red-900",
            indicator: "bg-red-600",
            iconBg: "bg-red-100 border-red-200",
            iconText: "text-red-600",
            Icon: Zap
          };
        }

        return (
          <div key={anomaly.id} className={`relative overflow-hidden p-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 ${theme.bg} border ${theme.border} rounded-[20px] shadow-sm group transition-all`}>
            
            {/* Status Indicator Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.indicator} opacity-80`}></div>
            
            {/* Decorative Background Waveform */}
            <div className={`absolute -right-10 top-0 bottom-0 opacity-5 pointer-events-none ${theme.iconText}`}>
              <svg viewBox="0 0 200 80" className="h-full w-64">
                <path d="M0 40 L30 40 L40 10 L60 70 L75 35 L90 55 L105 25 L120 40 L200 40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Icon */}
            <div className={`flex-shrink-0 ml-2 p-2.5 rounded-xl border shadow-sm relative z-10 ${theme.iconBg} ${theme.iconText}`}>
              <theme.Icon className="w-5 h-5" />
            </div>
            
            {/* Content */}
            <div className="flex-grow relative z-10 min-w-0">
              <h3 className={`${theme.text} font-bold text-xs tracking-wider uppercase truncate`}>
                {anomaly.type || 'Anomaly'} Signal
              </h3>
              <p className={`text-slate-600 text-sm mt-1 leading-relaxed font-medium`}>
                {anomaly.message}
              </p>
            </div>
            
            {/* Action & Time */}
            <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:gap-1 pl-2 relative z-10 border-t border-black/5 md:border-none pt-3 md:pt-0 shrink-0">
              <p className="text-[9px] font-mono tracking-widest text-slate-400 font-bold uppercase">
                {new Date(anomaly.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <button 
                onClick={() => handleAcknowledge(anomaly.id)}
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-[0.97]`}
              >
                Acknowledge <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnomalyAlert;

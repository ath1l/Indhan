import React, { useState } from 'react';
import axios from 'axios';
import { X, Plus, Database } from 'lucide-react';

const AddCylinderModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(14.2);
  const [tare, setTare] = useState(15.3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/v1/cylinders', {
        name,
        capacity_kg: parseFloat(capacity),
        tare_weight_kg: parseFloat(tare)
      });
      setName('');
      setCapacity(14.2);
      setTare(15.3);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to connect asset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-[28px] w-full max-w-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row">
        
        {/* Left Side: Form */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-8 pb-6 border-b border-slate-100">
            <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm">
                <Database className="w-5 h-5" />
              </span>
              Connect Asset
            </h2>
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-700 bg-white border border-slate-200 p-2 rounded-xl shadow-sm transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6 flex-1 flex flex-col">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Asset Name / Zone</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Tandoor Line"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-slate-400 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Capacity (kg)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm font-mono text-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">kg</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tare (kg)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    value={tare}
                    onChange={(e) => setTare(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm font-mono text-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">kg</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-auto flex items-center justify-end space-x-3">
              <button 
                type="button" 
                onClick={onClose}
                disabled={loading}
                className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary py-3"
              >
                {loading ? 'Connecting...' : <><Plus className="w-4 h-4 mr-1" /> Connect Asset</>}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Decorative SVG */}
        <div className="hidden md:flex w-[260px] bg-slate-50 border-l border-slate-100 flex-col relative overflow-hidden">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 p-2 rounded-xl shadow-sm transition-colors z-20">
            <X className="w-4 h-4" />
          </button>
          
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50 z-0"></div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8">
            
            {/* Minimal Cylinder Illustration */}
            <div className="w-32 h-48 relative">
              {/* Sensor Signal Wave Background */}
              <div className="absolute -inset-10 bg-emerald-500/5 rounded-full blur-2xl"></div>
              <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-sm text-slate-300">
                {/* Cylinder Body */}
                <path d="M25 175 L75 175 L80 195 L20 195 Z" fill="currentColor" opacity="0.3"/>
                <path d="M35 40 L65 40 L65 15 L35 15 Z" fill="currentColor" opacity="0.3"/>
                <path d="M25 45 C30 20 70 20 75 45" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5"/>
                <rect x="15" y="40" width="70" height="140" rx="20" fill="white" stroke="currentColor" strokeWidth="2"/>
                
                {/* Signal Graphic inside cylinder */}
                <path d="M 15 110 Q 32 90, 50 110 T 85 110 L 85 180 L 15 180 Z" fill="#10b981" opacity="0.1"/>
                <path d="M 15 110 Q 32 90, 50 110 T 85 110" fill="none" stroke="#10b981" strokeWidth="2"/>
                
                {/* Measurement Ticks */}
                <g stroke="currentColor" strokeWidth="1" opacity="0.4">
                  <line x1="15" y1="60" x2="25" y2="60" />
                  <line x1="15" y1="90" x2="30" y2="90" />
                  <line x1="15" y1="120" x2="25" y2="120" />
                  <line x1="15" y1="150" x2="30" y2="150" />
                </g>
              </svg>
            </div>
            
            <div className="mt-8 text-center space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded-md">
                Telemetry Link
              </span>
              <p className="text-xs font-medium text-slate-500">
                Connecting physical asset to INDHAN digital monitoring.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AddCylinderModal;

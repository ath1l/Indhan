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
      <div className="bg-white border border-slate-200 rounded-[24px] w-full max-w-md shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            Connect LPG Asset
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Asset Name / Zone</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tandoor Line"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-slate-400 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Capacity (kg)</label>
              <input 
                type="number" 
                step="0.1"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tare (kg)</label>
              <input 
                type="number" 
                step="0.1"
                required
                value={tare}
                onChange={(e) => setTare(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Connecting...' : <><Plus className="w-4 h-4" /> Connect Asset</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCylinderModal;

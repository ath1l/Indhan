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
      setError('Failed to create cylinder. Please check your connection or inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030614]/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative group">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
          <h2 className="text-[13px] font-semibold text-gray-300 uppercase tracking-widest flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-400" />
            Add New Asset
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
          {error && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-medium tracking-wide uppercase rounded-lg flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0"></span>
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Asset Name / Identifier</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Main Kitchen Tandoor"
              className="w-full bg-[#030614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 transition-colors placeholder-gray-700 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Gross Capacity (kg)</label>
              <input 
                type="number" 
                step="0.1"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full bg-[#030614] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Tare Weight (kg)</label>
              <input 
                type="number" 
                step="0.1"
                required
                value={tare}
                onChange={(e) => setTare(e.target.value)}
                className="w-full bg-[#030614] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Registering...' : <><Plus className="w-3.5 h-3.5" /> Register Asset</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCylinderModal;

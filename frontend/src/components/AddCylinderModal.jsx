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
      setError('Failed to create cylinder.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-light text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            Add New Cylinder
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Cylinder Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tandoor Line"
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Capacity (kg)</label>
              <input 
                type="number" 
                step="0.1"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tare Weight (kg)</label>
              <input 
                type="number" 
                step="0.1"
                required
                value={tare}
                onChange={(e) => setTare(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {loading ? 'Creating...' : <><Plus className="w-4 h-4" /> Create Cylinder</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCylinderModal;

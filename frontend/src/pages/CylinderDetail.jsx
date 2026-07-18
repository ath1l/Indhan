import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Activity, Flame, DollarSign, Clock, Database } from 'lucide-react';
import WeightTrendChart from '../components/WeightTrendChart';
import SimulationPanel from '../components/SimulationPanel';
import CostProjectionCard from '../components/CostProjectionCard';

const CylinderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cylinder, setCylinder] = useState(null);
  const [history, setHistory] = useState([]);
  const [cost, setCost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch specific cylinder basic details
        const cylRes = await axios.get(`/api/v1/cylinders/${id}`);
        const readingsRes = await axios.get(`/api/v1/cylinders/${id}/readings`);
        const readings = readingsRes.data;

        if (!readings || readings.length < 2) {
          setCylinder({ ...cylRes.data, prediction: null });
          setHistory([]);
          setCost(null);
          setLoading(false);
          return;
        }

        // Fetch history
        const histRes = await axios.get(`/api/v1/cylinders/${id}/prediction/history${startDate ? `?startDate=${startDate}` : ''}`);
        // Fetch cost intelligence
        const costRes = await axios.get(`/api/v1/cylinders/${id}/cost`);
        // Fetch prediction
        const predRes = await axios.get(`/api/v1/cylinders/${id}/prediction`);
        
        const finalPrediction = predRes.data.prediction !== undefined ? predRes.data.prediction : predRes.data;
        setCylinder({ ...cylRes.data, prediction: finalPrediction });
        setHistory(histRes.data);
        setCost(costRes.data);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, refreshTrigger, startDate]);

  const handleReadingAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 p-6 md:p-12 font-sans selection:bg-teal-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group glass-panel px-4 py-2 text-sm font-medium w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </button>

        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium tracking-tight text-white flex items-center gap-3">
              {cylinder?.name || 'Cylinder Detail'}
            </h1>
            <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
              Identifier: <span className="font-mono tracking-tight text-teal-400">{id}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <span className="px-3 text-sm text-gray-500 border-r border-white/10">Filter</span>
              <input 
                type="date" 
                className="bg-transparent border-none text-sm text-gray-300 focus:ring-0 p-2 cursor-pointer outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                title="Filter graph from date"
              />
            </div>
            <div className="px-5 py-2.5 glass-panel text-sm text-gray-400 font-medium">
              Capacity: <span className="text-white ml-1">{cylinder?.capacity_kg} kg</span>
            </div>
            <div className="px-5 py-2.5 glass-panel text-sm text-gray-400 font-medium">
              Tare: <span className="text-white ml-1">{cylinder?.tare_weight_kg} kg</span>
            </div>
          </div>
        </header>

        {/* Detailed Stats */}
        {(!cylinder?.prediction && history.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-12 glass-panel mb-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-teal-500/5 rounded-3xl pointer-events-none"></div>
            <Database className="w-12 h-12 text-gray-500 mb-4 relative z-10" />
            <h2 className="text-xl text-white font-display font-medium mb-2 relative z-10">Cylinder is in Standby</h2>
            <p className="text-gray-400 max-w-md mb-8 relative z-10">This cylinder has no telemetry data yet. Initialize it by simulating the first weight reading (Full Capacity).</p>
            <button 
              onClick={async () => {
                if (!cylinder) return;
                setLoading(true);
                try {
                  await axios.post(`/api/v1/cylinders/${id}/readings`, { weight_kg: cylinder.capacity_kg + cylinder.tare_weight_kg });
                  setRefreshTrigger(prev => prev + 1);
                } catch (err) {
                  console.error("Failed to initialize cylinder", err);
                  setLoading(false);
                }
              }}
              disabled={!cylinder || loading}
              className="px-6 py-3 bg-teal-500/20 hover:bg-teal-500/30 text-teal-100 border border-teal-500/30 font-medium rounded-2xl shadow-[0_0_15px_rgba(20,184,166,0.15)] transition-all flex items-center gap-2 disabled:opacity-50 relative z-10"
            >
              <Activity className="w-5 h-5" />
              Initialize Cylinder ({cylinder ? (cylinder.capacity_kg + cylinder.tare_weight_kg).toFixed(1) : '...'} kg)
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="glass-panel p-8 flex flex-col relative overflow-hidden group">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
                <div className="flex items-center text-gray-400 mb-4 relative z-10">
                  <Flame className="w-4 h-4 mr-2 text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                  <span className="uppercase tracking-widest text-xs font-semibold">Consumption Rate</span>
                </div>
                <p className="text-5xl font-display font-light text-white relative z-10">
                  {cylinder?.prediction?.burn_rate_kg_per_day?.toFixed(2) || '0.00'} <span className="text-lg text-gray-500 font-sans font-medium">kg/day</span>
                </p>
              </div>

              <CostProjectionCard prediction={cylinder?.prediction} />

              <div className="glass-panel p-8 flex flex-col relative overflow-hidden group">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all"></div>
                <div className="flex items-center text-gray-400 mb-4 relative z-10">
                  <Clock className="w-4 h-4 mr-2 text-teal-400 drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]" />
                  <span className="uppercase tracking-widest text-xs font-semibold">Estimated Runway</span>
                </div>
                <p className="text-5xl font-display font-light text-white relative z-10">
                  {cylinder?.prediction?.days_remaining?.toFixed(1) || '0'} <span className="text-lg text-gray-500 font-sans font-medium">days</span>
                </p>
                <p className="text-xs text-gray-500 mt-2 font-medium relative z-10">
                  {cylinder?.prediction?.est_empty_at ? new Date(cylinder?.prediction.est_empty_at).toLocaleDateString() : 'Calculating...'}
                </p>
              </div>

            </div>

            {/* Big Chart */}
            <div className="h-96 mb-8">
              <WeightTrendChart history={history} />
            </div>

            {/* Live ML Simulation Panel */}
            <SimulationPanel 
              cylinderId={id} 
              currentWeight={cylinder?.prediction?.current_weight_kg || (cylinder?.capacity_kg + cylinder?.tare_weight_kg)}
              capacity={cylinder?.capacity_kg}
              tare={cylinder?.tare_weight_kg}
              onReadingAdded={handleReadingAdded}
            />
          </>
        )}

      </div>
    </div>
  );
};

export default CylinderDetail;

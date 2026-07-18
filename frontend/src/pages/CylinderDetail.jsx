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
        const histRes = await axios.get(`/api/v1/cylinders/${id}/prediction/history`);
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
  }, [id, refreshTrigger]);

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
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-12 font-sans selection:bg-blue-900/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-800/50 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
              {cylinder?.name || 'Cylinder Detail'}
            </h1>
            <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
              ID: {id}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-400">
              Capacity: <span className="text-gray-200">{cylinder?.capacity_kg} kg</span>
            </div>
            <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-400">
              Tare: <span className="text-gray-200">{cylinder?.tare_weight_kg} kg</span>
            </div>
          </div>
        </header>

        {/* Detailed Stats */}
        {(!cylinder?.prediction && history.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-900/50 border border-gray-800 rounded-2xl mb-8 text-center">
            <Database className="w-12 h-12 text-gray-600 mb-4" />
            <h2 className="text-xl text-white font-medium mb-2">Cylinder is in Standby</h2>
            <p className="text-gray-400 max-w-md mb-8">This cylinder has no telemetry data yet. Initialize it by simulating the first weight reading (Full Capacity).</p>
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
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Activity className="w-5 h-5" />
              Initialize Cylinder ({cylinder ? (cylinder.capacity_kg + cylinder.tare_weight_kg).toFixed(1) : '...'} kg)
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 flex flex-col">
                <div className="flex items-center text-gray-400 mb-4">
                  <Flame className="w-5 h-5 mr-2 text-orange-500" />
                  <span className="uppercase tracking-wider text-xs font-medium">Burn Rate</span>
                </div>
                <p className="text-4xl font-light text-white">
                  {cylinder?.prediction?.burn_rate_kg_per_day?.toFixed(2) || '0.00'} <span className="text-lg text-gray-500">kg/day</span>
                </p>
              </div>

              <CostProjectionCard prediction={cylinder?.prediction} />

              <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 flex flex-col">
                <div className="flex items-center text-gray-400 mb-4">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="uppercase tracking-wider text-xs font-medium">Est. Depletion</span>
                </div>
                <p className="text-4xl font-light text-white">
                  {cylinder?.prediction?.days_remaining?.toFixed(1) || '0'} <span className="text-lg text-gray-500">days</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
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

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Activity, Flame, DollarSign, Clock, Database } from 'lucide-react';
import WeightTrendChart from '../components/WeightTrendChart';
import SimulationPanel from '../components/SimulationPanel';
import CostProjectionCard from '../components/CostProjectionCard';
import DaysRemainingCard from '../components/DaysRemainingCard';
import AnomalyAlert from '../components/AnomalyAlert';

const CylinderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cylinder, setCylinder] = useState(null);
  const [history, setHistory] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const cylRes = await axios.get(`/api/v1/cylinders/${id}`);
        const readingsRes = await axios.get(`/api/v1/cylinders/${id}/readings`);
        const readings = readingsRes.data;

        if (!readings || readings.length < 2) {
          setCylinder({ ...cylRes.data, prediction: null });
          setHistory([]);
          setAnomalies([]);
          setLoading(false);
          return;
        }

        const histRes = await axios.get(`/api/v1/cylinders/${id}/prediction/history`);
        const predRes = await axios.get(`/api/v1/cylinders/${id}/prediction`);
        const anomaliesRes = await axios.get(`/api/v1/cylinders/${id}/anomalies`);
        
        const finalPrediction = predRes.data.prediction !== undefined ? predRes.data.prediction : predRes.data;
        setCylinder({ ...cylRes.data, prediction: finalPrediction });
        setHistory(histRes.data);
        setAnomalies(anomaliesRes.data || []);
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
  
  const handleDismissAnomaly = (anomalyId) => {
    setAnomalies(anomalies.filter(a => a.id !== anomalyId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030614] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 selection:bg-teal-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[11px] font-semibold tracking-widest uppercase text-gray-500 hover:text-white transition-colors mb-8 group bg-white/5 border border-white/5 hover:bg-white/10 px-4 py-2 rounded-full w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Command Center
        </button>

        {/* Workspace Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-6 h-6 text-teal-500" />
              <h1 className="text-4xl font-display font-medium tracking-tight text-white">
                {cylinder?.name || 'Asset Detail'}
              </h1>
            </div>
            <p className="text-gray-500 text-sm flex items-center gap-2 font-medium">
              ID: <span className="font-mono tracking-tight text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">{id}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-5 py-3 glass-panel text-xs text-gray-500 font-semibold uppercase tracking-widest flex flex-col gap-1 items-end">
              <span>Gross Capacity</span>
              <span className="text-white font-mono text-base">{cylinder?.capacity_kg} <span className="text-gray-500 text-xs font-sans">kg</span></span>
            </div>
            <div className="px-5 py-3 glass-panel text-xs text-gray-500 font-semibold uppercase tracking-widest flex flex-col gap-1 items-end">
              <span>Tare Weight</span>
              <span className="text-white font-mono text-base">{cylinder?.tare_weight_kg} <span className="text-gray-500 text-xs font-sans">kg</span></span>
            </div>
          </div>
        </header>

        <AnomalyAlert anomalies={anomalies} cylinderId={id} onDismiss={handleDismissAnomaly} />

        {/* Detailed Stats */}
        {(!cylinder?.prediction && history.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-24 glass-panel mb-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-teal-500/5 group-hover:bg-teal-500/10 transition-colors pointer-events-none"></div>
            <Database className="w-12 h-12 text-gray-700 mb-6 relative z-10" />
            <h2 className="text-2xl text-white font-display font-medium mb-3 relative z-10">Asset is Offline</h2>
            <p className="text-gray-400 max-w-md mb-8 relative z-10 leading-relaxed text-sm">This cylinder requires initial telemetry calibration. Initialize it by simulating the first weight reading (Gross Capacity).</p>
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
              className="btn-primary relative z-10"
            >
              <Activity className="w-4 h-4" />
              Initialize Asset ({cylinder ? (cylinder.capacity_kg + cylinder.tare_weight_kg).toFixed(1) : '...'} kg)
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              <div className="glass-panel glass-panel-hover p-6 md:p-8 flex flex-col relative overflow-hidden group">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all pointer-events-none"></div>
                <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4 relative z-10">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Consumption Rate
                </h2>
                <div className="flex items-baseline gap-2 mb-1 relative z-10">
                  <span className="text-5xl font-display font-light text-white tracking-tight">
                    {cylinder?.prediction?.burn_rate_kg_per_day?.toFixed(2) || '0.00'}
                  </span>
                  <span className="text-2xl font-medium text-gray-500">kg/d</span>
                </div>
                <p className="text-xs text-gray-500 font-medium relative z-10 mt-auto pt-6">Rolling 7-day average</p>
              </div>

              <DaysRemainingCard prediction={cylinder?.prediction} />
              
              <CostProjectionCard prediction={cylinder?.prediction} />

            </div>

            {/* Big Chart */}
            <div className="mb-8">
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

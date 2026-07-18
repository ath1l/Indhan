import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Activity, Flame, Clock, Database, CheckCircle2, PauseCircle } from 'lucide-react';
import WeightTrendChart from '../components/WeightTrendChart';
import SimulationPanel from '../components/SimulationPanel';
import TimeWarpSimulator from '../components/TimeWarpSimulator';
import CostProjectionCard from '../components/CostProjectionCard';
import LpgVisualizer from '../components/LpgVisualizer';

const CylinderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cylinder, setCylinder] = useState(null);
  const [history, setHistory] = useState([]);
  const [_cost, setCost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
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

        const histRes = await axios.get(`/api/v1/cylinders/${id}/prediction/history${startDate ? `?startDate=${startDate}` : ''}`);
        const costRes = await axios.get(`/api/v1/cylinders/${id}/cost`);
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

  const handleLivePoint = (newPoint) => {
    setHistory(prev => {
      const updated = [...prev, newPoint];
      // Keep only last 1000 points to prevent memory issues during hyper-speed
      if (updated.length > 1000) return updated.slice(updated.length - 1000);
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen app-shell flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate stats for visualizer
  const capacity = cylinder?.capacity_kg || 14.2;
  const tare = cylinder?.tare_weight_kg || 15.3;
  const currentWeight = cylinder?.prediction?.current_weight_kg || (capacity + tare);
  const rawPercent = ((currentWeight - tare) / capacity) * 100;
  const percent = Math.min(100, Math.max(0, Math.round(rawPercent)));
  
  const hasReading = !!cylinder?.prediction;
  const status = hasReading ? "ACTIVE" : "STANDBY";
  
  let statusColor = "text-emerald-600";
  let statusBg = "bg-emerald-50 border-emerald-100";
  let StatusIcon = CheckCircle2;

  if (!hasReading) {
    statusColor = "text-slate-500";
    statusBg = "bg-slate-100 border-slate-200";
    StatusIcon = PauseCircle;
  } else if (percent < 10) {
    statusColor = "text-red-700";
    statusBg = "bg-red-100 border-red-200";
  } else if (percent < 20) {
    statusColor = "text-orange-600";
    statusBg = "bg-orange-50 border-orange-100";
  }

  return (
    <div className="app-shell">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-6 group bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-sm font-semibold w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </button>

        {/* Hero Section: Digital Twin */}
        <div className="glass-panel p-8 mb-8 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          {/* Subtle background tech pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none mix-blend-multiply"></div>

          <div className="w-48 h-64 shrink-0 relative z-10">
            <LpgVisualizer percent={hasReading ? percent : 100} statusColor={statusColor} />
          </div>

          <div className="flex-1 relative z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${statusColor} ${statusBg} px-2.5 py-1 rounded-md border shadow-sm`}>
                    <StatusIcon className="w-3.5 h-3.5" /> {status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest">ID: {id.slice(-8)}</span>
                </div>
                <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 mb-2">
                  {cylinder?.name || 'Asset Detail'}
                </h1>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-r border-slate-200 bg-slate-50">Filter</span>
                  <input 
                    type="date" 
                    className="bg-white border-none text-sm text-slate-700 font-bold focus:ring-0 p-2.5 cursor-pointer outline-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Fill Level</span>
                <span className={`text-2xl font-display font-bold ${statusColor}`}>{hasReading ? percent : '--'}%</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Gross Weight</span>
                <span className="text-2xl font-display font-bold text-slate-900">{currentWeight.toFixed(2)}<span className="text-sm text-slate-500 ml-1">kg</span></span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Capacity</span>
                <span className="text-2xl font-display font-bold text-slate-900">{capacity}<span className="text-sm text-slate-500 ml-1">kg</span></span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tare Weight</span>
                <span className="text-2xl font-display font-bold text-slate-900">{tare}<span className="text-sm text-slate-500 ml-1">kg</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        {(!cylinder?.prediction && history.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white border border-slate-200 rounded-[32px] shadow-sm mb-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-50/50 rounded-[32px] pointer-events-none"></div>
            <Database className="w-12 h-12 text-slate-300 mb-4 relative z-10" />
            <h2 className="text-xl text-slate-900 font-bold mb-2 relative z-10">Asset in Standby</h2>
            <p className="text-slate-500 max-w-md mb-8 relative z-10 font-medium leading-relaxed">This asset has no telemetry data yet. Initialize it by simulating the first weight reading (Full Capacity).</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="glass-panel p-8 flex flex-col relative overflow-hidden group">
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-orange-500/5 group-hover:bg-orange-500/10 transition-all duration-700"></div>
                <div className="flex items-center text-slate-500 mb-6 relative z-10">
                  <div className="p-2.5 rounded-xl border bg-orange-50 text-orange-500 border-orange-100 mr-3 shadow-sm">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Calculated</h2>
                    <span className="uppercase tracking-widest text-xs font-bold text-slate-900">Burn Rate</span>
                  </div>
                </div>
                <p className="text-5xl font-display font-bold text-slate-900 tracking-tight relative z-10 mt-auto">
                  {cylinder?.prediction?.burn_rate_kg_per_day?.toFixed(2) || '0.00'} <span className="text-xl text-slate-400 font-sans font-semibold">kg/day</span>
                </p>
              </div>

              <CostProjectionCard prediction={cylinder?.prediction} />

              <div className="glass-panel p-8 flex flex-col relative overflow-hidden group">
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-700 bg-red-500/5 group-hover:bg-red-500/10"></div>
                
                <div className="flex items-center text-slate-500 mb-6 relative z-10">
                  <div className="p-2.5 rounded-xl border bg-red-50 text-red-600 border-red-100 mr-3 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Prediction</h2>
                    <span className="uppercase tracking-widest text-xs font-bold text-slate-900">Estimated Runway</span>
                  </div>
                </div>
                
                <div className="mt-auto relative z-10">
                  <p className="text-5xl font-display font-bold text-slate-900 tracking-tight">
                    {cylinder?.prediction?.days_remaining?.toFixed(1) || '0'} <span className="text-xl text-slate-400 font-sans font-semibold">days</span>
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[11px] text-slate-500 font-bold bg-slate-50 inline-block px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm uppercase tracking-wider">
                      Empty: <span className="text-slate-900 ml-1">{cylinder?.prediction?.est_empty_at ? new Date(cylinder?.prediction.est_empty_at).toLocaleDateString() : '...'}</span>
                    </p>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{Math.round((cylinder?.prediction?.confidence || 0) * 100)}% Conf</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="h-[450px] mb-8 glass-panel p-6 flex flex-col">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Weight Trend</h3>
              <div className="flex-1 min-h-0">
                <WeightTrendChart 
                  history={history} 
                  capacity={cylinder?.capacity_kg || 14.2}
                  tare={cylinder?.tare_weight_kg || 15.3}
                />
              </div>
            </div>

            <SimulationPanel 
              cylinderId={id} 
              currentWeight={cylinder?.prediction?.current_weight_kg || (cylinder?.capacity_kg + cylinder?.tare_weight_kg)}
              capacity={cylinder?.capacity_kg}
              tare={cylinder?.tare_weight_kg}
              onReadingAdded={handleReadingAdded}
            />

            {/* Live Time-Warp Engine */}
            <TimeWarpSimulator 
              cylinderId={id}
              initialWeight={history.length > 0 ? history[history.length - 1].weight_kg : (cylinder?.capacity_kg + cylinder?.tare_weight_kg)}
              onLivePointGenerated={handleLivePoint}
            />
          </>
        )}

      </div>
    </div>
  );
};

export default CylinderDetail;

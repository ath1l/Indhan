import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, LogOut, ChevronRight, Download, Plus } from 'lucide-react';
import DaysRemainingCard from '../components/DaysRemainingCard';
import WeightTrendChart from '../components/WeightTrendChart';
import AnomalyAlert from '../components/AnomalyAlert';
import MockCylinderCard from '../components/MockCylinderCard';
import AddCylinderModal from '../components/AddCylinderModal';
import IndhanLogo from '../components/IndhanLogo';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/v1/dashboard/summary');
        setData(res.data);
        
        // Mock fetching history for the chart since dashboard/summary doesn't return the full history
        if (res.data.cylinders && res.data.cylinders.length > 0) {
          const cylId = res.data.cylinders[0].id;
          const histRes = await axios.get(`/api/v1/cylinders/${cylId}/prediction/history`);
          setHistory(histRes.data);
        }
        
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 tracking-wider text-sm uppercase">Loading telemetry...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="p-6 bg-red-950/20 border border-red-900/50 rounded-xl max-w-md text-center">
          <Activity className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-red-400 font-medium">Connection Error</h2>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (!data?.cylinders) return;

    const headers = ['Cylinder ID', 'Name', 'Current Weight (kg)', 'Burn Rate (kg/day)', 'Est. Empty Date'];
    const rows = data.cylinders.map(c => [
      c.id,
      c.name,
      c.latest_reading?.weight_kg?.toFixed(2) || 'N/A',
      c.prediction?.burn_rate_kg_per_day || '0.00',
      c.prediction?.est_empty_at ? new Date(c.prediction.est_empty_at).toLocaleDateString() : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'INDHAN_OpEx_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cylinder = data?.cylinders?.[0];

  return (
    <div className="min-h-screen text-gray-100 p-6 md:p-12 font-sans selection:bg-teal-500/30">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-widest text-white flex items-center gap-4">
            <span className="p-2.5 glass-panel flex items-center justify-center">
              <IndhanLogo className="w-6 h-6 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
            </span>
            INDHAN
          </h1>
          <p className="text-gray-400 text-sm mt-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Live Telemetry Active
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-5">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-300">{cylinder?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{cylinder?.id}</p>
          </div>
          <div className="h-11 w-11 rounded-2xl glass-panel flex items-center justify-center text-gray-300 font-display text-lg">
            {cylinder?.name?.charAt(0) || 'C'}
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all shadow-lg hover:shadow-white/5"
            title="Add New Cylinder"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-100 rounded-2xl transition-all shadow-[0_0_15px_rgba(20,184,166,0.1)]"
            title="Export Monthly OpEx Summary (.CSV)"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="p-2.5 text-gray-400 hover:text-white glass-panel glass-panel-hover"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-6">
        
        {/* Alerts */}
        <AnomalyAlert 
          anomalies={cylinder?.active_alerts} 
          cylinderId={cylinder?.id} 
          onDismiss={(id) => {
            // Update local state to hide alert
            if (data && data.cylinders) {
              const updated = {...data};
              updated.cylinders[0].active_alerts = updated.cylinders[0].active_alerts.filter(a => a.id !== id);
              setData(updated);
            }
          }}
        />

        {/* Multi-Cylinder Kitchen Matrix - Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
          
          {/* Cylinder 01 - Main Wok Line (Real Data) */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col gap-6">
            <div 
              onClick={() => cylinder?.id && navigate(`/cylinders/${cylinder.id}`)}
              className="glass-panel glass-panel-hover p-8 flex flex-col justify-between cursor-pointer group h-[300px] relative overflow-hidden"
            >
              {/* Decorative background glow inside the card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <h2 className="text-teal-300 text-xs font-semibold uppercase tracking-widest flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]"></span>
                  Main Wok Line
                </h2>
                <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-col justify-end mt-auto relative z-10">
                <span className="text-gray-400 text-sm mb-1 font-medium">Live Weight</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-7xl font-display font-light tracking-tighter text-white drop-shadow-md">
                    {cylinder?.latest_reading?.weight_kg?.toFixed(2) || '0.00'}
                  </span>
                  <span className="text-2xl text-gray-500 font-medium">kg</span>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <div className="flex items-center text-sm font-medium text-gray-400">
                    <Activity className="w-4 h-4 mr-2 text-teal-400" />
                    Live Burn Rate
                  </div>
                  <span className="text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm font-mono tracking-tight">{cylinder?.prediction?.burn_rate_kg_per_day || '0.00'} kg/day</span>
                </div>
              </div>
            </div>
            
          </div>

          <div className="md:col-span-4 lg:col-span-4">
            <DaysRemainingCard prediction={cylinder?.prediction} />
          </div>

          {/* Dynamically Rendered Cylinders */}
          <div className="md:col-span-8 lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.cylinders?.slice(1).map((cyl) => {
              const hasReading = !!cyl.latest_reading;
              const currentWeight = hasReading ? cyl.latest_reading.weight_kg : 29.5;
              const percent = Math.min(100, Math.max(0, Math.round(((currentWeight - 15.3) / 14.2) * 100)));
              
              return (
                <div 
                  key={cyl.id} 
                  className="cursor-pointer"
                  onClick={() => navigate(`/cylinders/${cyl.id}`)}
                >
                  <MockCylinderCard 
                    name={cyl.name} 
                    status={hasReading ? "Active" : "Standby"} 
                    percent={hasReading ? percent : 100} 
                    weight={currentWeight} 
                  />
                </div>
              );
            })}
          </div>
          
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6">
          <WeightTrendChart history={history} />
        </div>
        
      </main>

      {/* Modal */}
      <AddCylinderModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => {
          setIsAddModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }} 
      />
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, Droplet, LogOut, ChevronRight, Download } from 'lucide-react';
import DaysRemainingCard from '../components/DaysRemainingCard';
import WeightTrendChart from '../components/WeightTrendChart';
import AnomalyAlert from '../components/AnomalyAlert';
import MockCylinderCard from '../components/MockCylinderCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

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
  }, []);

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
    link.setAttribute('download', 'Indhan_OpEx_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cylinder = data?.cylinders?.[0];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-12 font-sans selection:bg-blue-900/50">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between border-b border-gray-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <span className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-900/20">
              <Droplet className="w-6 h-6 text-white" />
            </span>
            Indhan Intelligence
          </h1>
          <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Telemetry Active
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-300">{cylinder?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{cylinder?.id}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
            {cylinder?.name?.charAt(0) || 'C'}
          </div>
          <button 
            onClick={handleExportCSV}
            className="ml-2 flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 bg-blue-950/30 hover:bg-blue-900/50 rounded-lg transition-colors border border-blue-900/50"
            title="Export Monthly OpEx Summary (.CSV)"
          >
            <Download className="w-4 h-4" />
            Export OpEx
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="ml-2 p-2 text-gray-500 hover:text-white bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors border border-gray-800"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto space-y-6">
        
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

        {/* Multi-Cylinder Kitchen Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Cylinder 01 - Main Wok Line (Real Data) */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-6">
            <div 
              onClick={() => cylinder?.id && navigate(`/cylinders/${cylinder.id}`)}
              className="p-6 rounded-2xl bg-gray-900/50 border border-blue-900/50 backdrop-blur-sm shadow-xl shadow-blue-900/10 flex flex-col justify-between cursor-pointer hover:bg-gray-800/80 hover:border-gray-700 transition-all group h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-blue-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Cylinder 01 - Main Wok Line
                </h2>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-5xl font-light tracking-tighter text-white">
                  {cylinder?.latest_reading?.weight_kg?.toFixed(2) || '0.00'}
                </span>
                <span className="text-xl text-gray-500 pb-1">kg</span>
              </div>
              <div className="mt-6 flex items-center text-sm text-gray-500">
                <Activity className="w-4 h-4 mr-2" />
                Live burn rate: {cylinder?.prediction?.burn_rate_kg_per_day || '0.00'} kg/day
              </div>
            </div>
            
            <DaysRemainingCard prediction={cylinder?.prediction} />
          </div>

          {/* Cylinder 02 - Mock Oven Bank */}
          <div className="lg:col-span-1">
            <MockCylinderCard name="Cylinder 02 - Oven Bank" status="Healthy" percent={82} weight={24.2} />
          </div>

          {/* Cylinder 03 - Mock Backup */}
          <div className="lg:col-span-1">
            <MockCylinderCard name="Cylinder 03 - Backup Supply" status="Standby" percent={100} weight={29.5} />
          </div>
          
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6">
          <WeightTrendChart history={history} />
        </div>
        
      </main>
    </div>
  );
};

export default Dashboard;

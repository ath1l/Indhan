import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, LogOut, Plus, LayoutGrid, Zap } from 'lucide-react';
import MockCylinderCard from '../components/MockCylinderCard';
import AddCylinderModal from '../components/AddCylinderModal';
import IndhanLogo from '../components/IndhanLogo';
import LpgHeroArt from '../components/LpgHeroArt';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/v1/dashboard/summary');
        setData(res.data);
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
      <div className="min-h-screen app-shell flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium tracking-wider text-sm uppercase">Loading telemetry...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen app-shell flex items-center justify-center">
        <div className="p-8 bg-white border border-red-100 rounded-3xl shadow-sm max-w-md text-center">
          <Activity className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-slate-900 font-semibold text-lg">Connection Error</h2>
          <p className="text-slate-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const handleDeleteCylinder = async (id) => {
    if (window.confirm("Are you sure you want to delete this cylinder? All telemetry data will be permanently lost.")) {
      try {
        await axios.delete(`/api/v1/cylinders/${id}`);
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error("Failed to delete cylinder:", err);
        alert("Failed to delete cylinder.");
      }
    }
  };

  const cylinders = data?.cylinders || [];
  const activeCount = cylinders.filter(c => c.latest_reading).length;
  
  // Calculate aggregate metrics
  let totalRunway = 0;
  let totalBurnRate = 0;
  let validRunwayCount = 0;

  cylinders.forEach(c => {
    if (c.prediction?.burn_rate_kg_per_day) {
      totalBurnRate += c.prediction.burn_rate_kg_per_day;
    }
    if (c.prediction?.days_remaining != null) {
      totalRunway += c.prediction.days_remaining;
      validRunwayCount++;
    }
  });

  const avgRunway = validRunwayCount > 0 ? (totalRunway / validRunwayCount).toFixed(1) : '--';

  return (
    <div className="app-shell">
      
      {/* Top Navigation */}
      <header className="max-w-[1200px] mx-auto mb-10 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-display font-bold tracking-widest text-slate-900 flex items-center gap-3">
            <span className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <IndhanLogo variant="icon" className="w-5 h-5 text-red-600 relative z-10" />
            </span>
            INDHAN
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add Cylinder
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all active:scale-[0.95]"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-[1200px] mx-auto flex flex-col gap-10">
        
        {/* Hero Artwork Centerpiece */}
        <LpgHeroArt />

        {/* Metric Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 flex flex-col justify-between group">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 group-hover:text-red-600 transition-colors">Active Cylinders</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-display font-bold text-slate-900 tracking-tight">{activeCount}</span>
              <span className="text-base font-bold text-slate-400">/ {cylinders.length}</span>
            </div>
          </div>
          
          <div className="glass-panel p-6 flex flex-col justify-between group">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 group-hover:text-red-600 transition-colors">Total Burn Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-display font-bold text-slate-900 tracking-tight">{totalBurnRate.toFixed(2)}</span>
              <span className="text-base font-bold text-slate-400">kg/d</span>
            </div>
          </div>

          {/* Dark Feature Anchor */}
          <div className="dark-panel p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 p-4 opacity-5 text-red-400 group-hover:scale-110 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-700">
              <Zap className="w-32 h-32" />
            </div>
            <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay"></div>
            
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 relative z-10 group-hover:text-red-400 transition-colors">Average Reserve</span>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-5xl font-display font-bold text-white tracking-tight">{avgRunway}</span>
              <span className="text-base font-bold text-red-500/80">days</span>
            </div>
          </div>
        </div>

        {/* Cylinder Grid */}
        <section>
          <div className="flex justify-between items-center mb-8 px-1 border-b border-slate-200/50 pb-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Asset Registry
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cylinders.map((cyl) => (
              <div 
                key={cyl.id} 
                className="cursor-pointer"
                onClick={() => navigate(`/cylinders/${cyl.id}`)}
              >
                <MockCylinderCard 
                  cylinder={cyl} 
                  onDelete={(e) => {
                    e.stopPropagation();
                    handleDeleteCylinder(cyl.id);
                  }}
                />
              </div>
            ))}
            {cylinders.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-16 bg-white border border-slate-200 border-dashed rounded-[24px]">
                <p className="text-slate-500 font-bold mb-6 text-sm uppercase tracking-widest">No LPG assets connected</p>
                <button onClick={() => setIsAddModalOpen(true)} className="btn-primary shadow-xl shadow-red-600/20">
                  <Plus className="w-4 h-4" /> Add Your First Cylinder
                </button>
              </div>
            )}
          </div>
        </section>
        
      </main>

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

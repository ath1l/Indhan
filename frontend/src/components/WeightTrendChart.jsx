import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] min-w-[140px]">
        <p className="text-slate-400 text-[9px] uppercase font-bold tracking-widest mb-3">
          {new Date(label).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        {payload.map((entry, index) => {
          const isProjected = entry.name === 'projected_weight_kg';
          return (
            <div key={index} className="flex flex-col mb-1.5 last:mb-0">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                {isProjected ? 'Projected Empty' : 'Actual Weight'}
              </span>
              <span className={`text-xl font-display font-bold ${isProjected ? 'text-slate-400' : 'text-slate-900'}`}>
                {entry.value} <span className="text-xs text-slate-500 font-sans font-semibold">kg</span>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const WeightTrendChart = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[250px] relative w-full overflow-hidden">
        {/* Subtle decorative flatline */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <svg className="w-full h-24" preserveAspectRatio="none" viewBox="0 0 1000 100">
            <path d="M0 50 L400 50 L410 20 L420 80 L430 50 L1000 50" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm">
          <Activity className="w-8 h-8 text-slate-300 mb-3" />
          <p className="text-slate-600 font-bold text-sm">Awaiting Telemetry</p>
          <p className="text-slate-400 font-medium text-xs mt-1 max-w-xs text-center">Weight history will appear as readings are recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-10 flex flex-col">
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {/* Subtle horizontal grid lines only */}
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#cbd5e1" 
              tick={{fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace', fontWeight: 600}} 
              tickLine={false}
              axisLine={{ stroke: '#f1f5f9' }}
              minTickGap={40}
              tickFormatter={(val) => {
                const date = new Date(val);
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              }}
              dy={10}
            />
            <YAxis 
              domain={[0, 'auto']}
              stroke="#cbd5e1" 
              tick={{fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace', fontWeight: 600}} 
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }} 
              isAnimationActive={false}
            />
            
            {/* Main Historical Data Line */}
            <Area 
              type="monotone" 
              dataKey="weight_kg" 
              stroke="#10b981" // INDHAN Emerald
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWeight)"
              activeDot={{ r: 5, fill: "#ffffff", stroke: "#10b981", strokeWidth: 2, className: "shadow-sm" }}
              isAnimationActive={true}
              animationDuration={1500}
            />
            
            {/* Projected Line (if exists) */}
            <Area 
              type="linear" 
              dataKey="projected_weight_kg" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={0} 
              activeDot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightTrendChart;

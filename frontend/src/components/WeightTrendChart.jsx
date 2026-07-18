import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-xl shadow-slate-200/50">
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">
          {new Date(label).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex flex-col mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {entry.name === 'projected_weight_kg' ? 'Projected Empty' : 'Actual Weight'}
            </span>
            <span className={`text-2xl font-display font-bold ${entry.name === 'projected_weight_kg' ? 'text-slate-500' : 'text-red-600'}`}>
              {entry.value} <span className="text-sm">kg</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const WeightTrendChart = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No telemetry history available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            tick={{fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace', fontWeight: 700}} 
            tickLine={false}
            axisLine={false}
            minTickGap={30}
            tickFormatter={(val) => {
              const date = new Date(val);
              return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }}
          />
          <YAxis 
            domain={[0, 35]}
            stroke="#94a3b8" 
            tick={{fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace', fontWeight: 700}} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }} />
          
          <Area 
            type="monotone" 
            dataKey="weight_kg" 
            stroke="#ef4444" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorWeight)"
            activeDot={{ r: 6, fill: "#fff", stroke: "#ef4444", strokeWidth: 3 }}
            filter="url(#glow)"
          />
          <Area 
            type="linear" 
            dataKey="projected_weight_kg" 
            stroke="#94a3b8" 
            strokeWidth={3}
            strokeDasharray="6 6"
            fillOpacity={0} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightTrendChart;

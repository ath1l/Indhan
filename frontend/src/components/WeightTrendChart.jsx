import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const WeightTrendChart = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 glass-panel flex items-center justify-center h-64">
        <p className="text-gray-500 font-medium">No telemetry history available</p>
      </div>
    );
  }

  return (
    <div className="p-8 glass-panel glass-panel-hover flex flex-col relative overflow-hidden group h-full">
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-all"></div>
      
      <h2 className="text-teal-300 text-xs font-semibold uppercase tracking-widest mb-6 relative z-10 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]"></span>
          Telemetry & Future Projection
        </span>
        <span className="text-gray-500 text-[10px] bg-white/5 px-2 py-1 rounded">Dashed line = Predicted Drain</span>
      </h2>
      <div className="flex-grow w-full h-72 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#4b5563" 
              tick={{fill: '#9ca3af', fontSize: 11, fontFamily: 'monospace'}} 
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
              stroke="#4b5563" 
              tick={{fill: '#9ca3af', fontSize: 11, fontFamily: 'monospace'}} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(3, 6, 20, 0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#f3f4f6', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#2dd4bf', fontWeight: 'bold' }}
              labelFormatter={(label) => new Date(label).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              formatter={(value, name) => {
                if (name === 'projected_weight_kg') return [`${value} kg`, 'Projected Empty Date'];
                return [`${value} kg`, 'Actual Weight'];
              }}
            />
            <Area 
              type="monotone" 
              dataKey="weight_kg" 
              stroke="#2dd4bf" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
            />
            <Area 
              type="linear" 
              dataKey="projected_weight_kg" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={0} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightTrendChart;

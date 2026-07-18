import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity } from 'lucide-react';

const WeightTrendChart = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="glass-panel p-12 flex flex-col items-center justify-center h-full text-center border-dashed border-white/10">
        <Activity className="w-8 h-8 text-gray-600 mb-3" />
        <h4 className="text-gray-300 font-medium mb-1">No telemetry history available</h4>
        <p className="text-sm text-gray-500">Wait for the system to process incoming data.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 md:p-8 flex flex-col relative overflow-hidden group h-full">
      {/* Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all"></div>
      
      <div className="mb-8 relative z-10">
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-teal-400" />
          Weight Trend
        </h2>
        <p className="text-xs text-gray-500">30-day consumption trajectory</p>
      </div>

      <div className="flex-grow w-full h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.25}/>
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#4b5563" 
              tick={{fill: '#6b7280', fontSize: 10, fontFamily: 'monospace'}} 
              tickLine={false}
              axisLine={false}
              minTickGap={40}
              tickFormatter={(val) => {
                const date = new Date(val);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
              dy={10}
            />
            <YAxis 
              domain={[0, 'dataMax + 2']}
              stroke="#4b5563" 
              tick={{fill: '#6b7280', fontSize: 10, fontFamily: 'monospace'}} 
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(11, 15, 25, 0.8)', 
                backdropFilter: 'blur(16px)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '16px', 
                color: '#f3f4f6', 
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                padding: '12px 16px'
              }}
              itemStyle={{ color: '#2dd4bf', fontWeight: '600', fontFamily: 'monospace', fontSize: '14px' }}
              labelStyle={{ color: '#9ca3af', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
              labelFormatter={(label) => new Date(label).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              formatter={(value) => [`${value} kg`, 'Reserve']}
              cursor={{ stroke: 'rgba(45,212,191,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="weight_kg" 
              stroke="#2dd4bf" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
              activeDot={{ r: 6, fill: '#0B0F19', stroke: '#2dd4bf', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightTrendChart;

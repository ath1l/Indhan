import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const WeightTrendChart = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 flex items-center justify-center h-64">
        <p className="text-gray-500">No history available</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-xl flex flex-col">
      <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-6">Weight Trend (30 Days)</h2>
      <div className="flex-grow w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#4b5563" 
              tick={{fill: '#6b7280', fontSize: 12}} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                const date = new Date(val);
                return `${date.getMonth()+1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              stroke="#4b5563" 
              tick={{fill: '#6b7280', fontSize: 12}} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
              itemStyle={{ color: '#60a5fa' }}
            />
            <Area 
              type="monotone" 
              dataKey="days_remaining" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightTrendChart;

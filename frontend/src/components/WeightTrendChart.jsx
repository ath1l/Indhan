import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine, ReferenceArea } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percent = data.percent;
    const weight = data.weight_kg;
    
    // Prevent rendering tooltip if percent is null
    if (percent === null || percent === undefined) return null;

    let statusText = "Stable";
    let statusColor = "text-emerald-500";
    if (percent <= 10) {
      statusText = "Empty / Critical";
      statusColor = "text-red-500";
    } else if (percent <= 25) {
      statusText = "Low Supply";
      statusColor = "text-orange-500";
    }

    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-xl shadow-slate-200/50 relative z-50">
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3">
          {new Date(label).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>{statusText}</span>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Remaining</span>
            <span className="text-sm font-bold text-slate-700">{percent.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Weight</span>
            <span className="text-sm font-bold text-slate-700">{weight?.toFixed(2)} kg</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const WeightTrendChart = ({ history, capacity = 14.2, tare = 15.3 }) => {
  if (!history || history.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No telemetry history available</p>
      </div>
    );
  }

  // 1. Map data to percentages
  const mappedData = history.map(item => {
    const p = item.weight_kg !== null ? Math.max(0, ((item.weight_kg - tare) / capacity) * 100) : null;
    return {
      ...item,
      percent: p
    };
  });

  // 2. Calculate dynamic gradient stops based on max Y axis value (100)
  // Because YAxis is fixed 0 to 100, the SVG exactly maps 0% height to 100 on Y-Axis, and 100% height to 0 on Y-Axis.
  const yAxisMax = 100;
  const stopRed = 1 - (10 / yAxisMax);
  const stopOrange = 1 - (25 / yAxisMax);

  return (
    <div className="w-full h-full relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mappedData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset={`${stopOrange * 100}%`} stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset={`${stopOrange * 100}%`} stopColor="#f97316" stopOpacity={0.8}/>
              <stop offset={`${stopRed * 100}%`} stopColor="#f97316" stopOpacity={0.8}/>
              <stop offset={`${stopRed * 100}%`} stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8}/>
            </linearGradient>
            <linearGradient id="colorHealthArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.15}/>
              <stop offset={`${stopOrange * 100}%`} stopColor="#10b981" stopOpacity={0.1}/>
              <stop offset={`${stopOrange * 100}%`} stopColor="#f97316" stopOpacity={0.1}/>
              <stop offset={`${stopRed * 100}%`} stopColor="#f97316" stopOpacity={0.1}/>
              <stop offset={`${stopRed * 100}%`} stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          
          <ReferenceArea y1={0} y2={10} fill="#ef4444" fillOpacity={0.05} />
          <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Empty / Critical', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={25} stroke="#f97316" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Low Supply', fill: '#f97316', fontSize: 10 }} />

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
            domain={[0, 100]}
            stroke="#94a3b8" 
            tick={{fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace', fontWeight: 700}} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }} />
          
          <Area 
            type="monotone" 
            dataKey="percent" 
            stroke="url(#colorHealth)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorHealthArea)"
            activeDot={{ r: 6, fill: "#fff", stroke: "#10b981", strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightTrendChart;

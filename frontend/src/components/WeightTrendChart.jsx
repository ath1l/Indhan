import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine, ReferenceArea } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isProjected = payload[0].name === 'projected_percent' || payload[0].dataKey === 'projected_percent';
    const percent = isProjected ? data.projected_percent : data.percent;
    const weight = isProjected ? data.projected_weight_kg : data.weight_kg;
    
    // Prevent rendering tooltip if hovering over the bridge point where percent is null
    if (percent === null || percent === undefined) return null;

    let statusText = "Stable";
    let statusColor = "text-emerald-400";
    if (percent <= 10) {
      statusText = "Empty / Critical";
      statusColor = "text-red-400";
    } else if (percent <= 25) {
      statusText = "Low Supply";
      statusColor = "text-orange-400";
    }

    return (
      <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-xl z-50 relative">
        <p className="text-gray-400 text-xs mb-2">
          {new Date(label).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          {isProjected && <span className="ml-2 text-[10px] bg-white/10 px-1 rounded text-gray-300 uppercase">Projected</span>}
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm text-gray-400">Status:</span>
            <span className={`text-sm font-bold ${statusColor}`}>{statusText}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm text-gray-400">Remaining:</span>
            <span className="text-sm font-bold text-white">{percent.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm text-gray-400">Weight:</span>
            <span className="text-sm font-bold text-white">{weight?.toFixed(2)} kg</span>
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
      <div className="p-8 glass-panel flex items-center justify-center h-64">
        <p className="text-gray-500 font-medium">No telemetry history available</p>
      </div>
    );
  }

  // 1. Map data to percentages
  const mappedData = history.map(item => {
    const p = item.weight_kg !== null ? Math.max(0, ((item.weight_kg - tare) / capacity) * 100) : null;
    const pp = item.projected_weight_kg !== null && item.projected_weight_kg !== undefined ? Math.max(0, ((item.projected_weight_kg - tare) / capacity) * 100) : null;
    return {
      ...item,
      percent: p,
      projected_percent: pp
    };
  });

  // 2. Calculate dynamic gradient stops based on max Y axis value (100)
  // Because YAxis is fixed 0 to 100, the SVG exactly maps 0% height to 100 on Y-Axis, and 100% height to 0 on Y-Axis.
  const yAxisMax = 100;
  const stopRed = 1 - (10 / yAxisMax);
  const stopOrange = 1 - (25 / yAxisMax);

  return (
    <div className="p-8 glass-panel glass-panel-hover flex flex-col relative overflow-hidden group h-full">
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-all"></div>
      
      <h2 className="text-teal-300 text-xs font-semibold uppercase tracking-widest mb-6 relative z-10 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]"></span>
          Fuel Gauge Projection
        </span>
        <span className="text-gray-500 text-[10px] bg-white/5 px-2 py-1 rounded">Dashed line = Predicted Drain</span>
      </h2>
      <div className="flex-grow w-full h-72 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mappedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset={`${stopOrange * 100}%`} stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset={`${stopOrange * 100}%`} stopColor="#f97316" stopOpacity={0.2}/>
                <stop offset={`${stopRed * 100}%`} stopColor="#f97316" stopOpacity={0.2}/>
                <stop offset={`${stopRed * 100}%`} stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
            
            <ReferenceArea y1={0} y2={10} fill="#ef4444" fillOpacity={0.05} />
            <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Empty / Critical', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={25} stroke="#f97316" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Low Supply', fill: '#f97316', fontSize: 10 }} />

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
              domain={[0, 100]}
              stroke="#4b5563" 
              tick={{fill: '#9ca3af', fontSize: 11, fontFamily: 'monospace'}} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="percent" 
              stroke="url(#colorHealth)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorHealthArea)" 
              activeDot={{ r: 6, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }}
            />
            <Area 
              type="linear" 
              dataKey="projected_percent" 
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

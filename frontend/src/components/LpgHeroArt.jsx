import React from 'react';

const LpgHeroArt = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-[32px] overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 group flex flex-col md:flex-row">
      
      {/* --- BACKGROUND --- */}
      {/* Very faint background technical grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      
      {/* Subtle radial glow in the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* --- TEXT CONTENT --- */}
      <div className="relative z-20 p-8 md:p-10 md:w-1/3 flex flex-col justify-center pointer-events-none shrink-0">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">
          INDHAN Energy Intelligence
        </h2>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight mb-2">
          Every kilogram counts.
        </h1>
        <p className="text-xs font-medium text-slate-500 max-w-xs leading-relaxed">
          Monitor consumption. Predict depletion. Control LPG costs.
        </p>
      </div>

      {/* --- MAIN SVG ILLUSTRATION --- */}
      <div className="relative z-10 w-full h-48 md:h-80 md:w-2/3 pointer-events-none overflow-hidden flex items-end justify-end">
        <svg 
          viewBox="0 0 1200 400" 
          preserveAspectRatio="xMidYMax slice" 
          className="w-full h-full min-w-[600px] text-slate-900"
        >
          <defs>
            {/* CSS Animation for data flow */}
            <style>
              {`
                @keyframes flowRight {
                  0% { stroke-dashoffset: 200; }
                  100% { stroke-dashoffset: 0; }
                }
                .animate-flow {
                  animation: flowRight 6s linear infinite;
                  stroke-dasharray: 4 24;
                }
                
                @keyframes pulseData {
                  0%, 100% { opacity: 0.2; transform: scale(0.9); }
                  50% { opacity: 0.8; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                  animation: pulseData 4s ease-in-out infinite;
                  transform-origin: center;
                }
              `}
            </style>

            <linearGradient id="fadeLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="20%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="fadeRight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="80%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Baseline/Floor */}
          <line x1="100" y1="320" x2="1100" y2="320" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />

          {/* ============================== */}
          {/* STAGE 1: PHYSICAL SUPPLY (Left) */}
          {/* ============================== */}
          <g transform="translate(150, 0)">
            {/* Secondary background cylinder */}
            <path d="M 20 180 L 70 180 C 75 180 80 185 80 190 L 80 320 L 10 320 L 10 190 C 10 185 15 180 20 180 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            
            {/* Primary active cylinder */}
            <g transform="translate(50, 20)">
              {/* Valve */}
              <path d="M 30 110 L 60 110 L 60 140 L 30 140 Z" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="45" cy="120" r="4" fill="#94a3b8" />
              
              {/* Body */}
              <path d="M 15 140 L 75 140 C 85 140 90 150 90 160 L 90 300 L 0 300 L 0 160 C 0 150 5 140 15 140 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              
              {/* Active Green Highlight */}
              <rect x="0" y="240" width="90" height="60" fill="#ecfdf5" opacity="0.8" />
              <path d="M 0 240 Q 45 230 90 240" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.5" />
              
              {/* Measurement Ticks */}
              <line x1="90" y1="180" x2="98" y2="180" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="90" y1="210" x2="105" y2="210" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="90" y1="240" x2="98" y2="240" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="90" y1="270" x2="105" y2="270" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>

          {/* ============================== */}
          {/* STAGE 2: SENSOR & TELEMETRY    */}
          {/* ============================== */}
          <g transform="translate(150, 320)">
            {/* Load cell platform */}
            <rect x="30" y="0" width="130" height="8" rx="2" fill="#1e293b" />
            <rect x="40" y="8" width="110" height="6" fill="#94a3b8" />
            <circle cx="95" cy="11" r="2" fill="#10b981" />
            
            {/* Signal Waves */}
            <path d="M 95 30 Q 110 50 130 40" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" className="animate-pulse-slow" />
            <path d="M 105 35 Q 120 55 140 45" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" className="animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
          </g>


          {/* ============================== */}
          {/* STAGE 3: ENERGY & DATA FLOW    */}
          {/* ============================== */}
          {/* Base Flow Path */}
          <path d="M 330 310 C 450 310, 450 200, 580 200 C 700 200, 700 280, 830 280" fill="none" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" />
          
          {/* Active Data Flow Line */}
          <path d="M 330 310 C 450 310, 450 200, 580 200 C 700 200, 700 280, 830 280" fill="none" stroke="url(#fadeLeft)" strokeWidth="2" strokeLinecap="round" />
          
          {/* Animated Particles along path */}
          <path d="M 330 310 C 450 310, 450 200, 580 200 C 700 200, 700 280, 830 280" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" className="animate-flow" />


          {/* ============================== */}
          {/* STAGE 4: COMMERCIAL KITCHEN    */}
          {/* ============================== */}
          <g transform="translate(680, 150)">
            {/* Stove / Range outline */}
            <rect x="0" y="100" width="140" height="70" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Oven Window */}
            <rect x="20" y="115" width="100" height="40" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="30" y1="135" x2="110" y2="135" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Burners */}
            <line x1="10" y1="100" x2="130" y2="100" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            
            {/* Flame */}
            <path d="M 40 98 Q 30 80 40 70 Q 50 80 40 98" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
            <path d="M 100 98 Q 90 85 100 75 Q 110 85 100 98" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
            
            {/* Pot */}
            <path d="M 80 98 L 80 60 C 80 50 120 50 120 60 L 120 98 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Flow Connector dot */}
            <circle cx="150" cy="130" r="4" fill="#10b981" />
          </g>


          {/* ============================== */}
          {/* STAGE 5: INTELLIGENCE / DATA   */}
          {/* ============================== */}
          <g transform="translate(850, 170)">
            {/* Data flow transitioning into analytics */}
            <path d="M -20 110 C 20 110, 20 20, 60 20 C 100 20, 100 80, 140 80 C 180 80, 180 50, 220 50" fill="none" stroke="url(#fadeRight)" strokeWidth="2" strokeLinecap="round" />
            
            {/* Decorative Bar Chart representing prediction model */}
            <rect x="60" y="80" width="8" height="40" rx="4" fill="#f1f5f9" />
            <rect x="80" y="60" width="8" height="60" rx="4" fill="#e2e8f0" />
            <rect x="100" y="40" width="8" height="80" rx="4" fill="#10b981" opacity="0.8" />
            <rect x="120" y="30" width="8" height="90" rx="4" fill="#cbd5e1" />
            <rect x="140" y="50" width="8" height="70" rx="4" fill="#e2e8f0" />
            
            {/* Prediction nodes */}
            <circle cx="104" cy="40" r="3" fill="#10b981" className="animate-pulse-slow" />
            <circle cx="144" cy="50" r="3" fill="#cbd5e1" />
            
            {/* Base grid lines */}
            <line x1="40" y1="120" x2="180" y2="120" stroke="#f1f5f9" strokeWidth="2" strokeLinecap="round" />
          </g>

        </svg>
      </div>
    </div>
  );
};

export default LpgHeroArt;

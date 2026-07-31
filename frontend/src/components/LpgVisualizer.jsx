import React from 'react';

const LpgVisualizer = ({ percent, statusColor = "text-emerald-600", className = "" }) => {
  // SVG viewBox is 100x200
  // Cylinder Body is x=15 to x=85 (width 70), y=40 to y=180 (height 140)
  
  // Calculate fill height based on percent
  const fillHeight = (percent / 100) * 120; // max liquid height is 120
  const fillY = 175 - fillHeight; // 175 is the bottom liquid baseline

  // Derive fill color from tailwind class
  let fillColor = "#10b981"; // emerald-500
  let glowColor = "rgba(16, 185, 129, 0.3)";
  
  if (statusColor.includes('red')) {
    fillColor = "#ef4444";
    glowColor = "rgba(239, 68, 68, 0.3)";
  } else if (statusColor.includes('amber') || statusColor.includes('orange')) {
    fillColor = "#f59e0b";
    glowColor = "rgba(245, 158, 11, 0.3)";
  } else if (statusColor.includes('slate') || statusColor.includes('gray')) {
    fillColor = "#cbd5e1";
    glowColor = "rgba(148, 163, 184, 0.1)";
  }

  return (
    <div className={`relative flex items-center justify-center ${className} group`}>
      <svg 
        viewBox="-20 -20 140 240" 
        className="w-full h-full drop-shadow-lg"
      >
        <defs>
          {/* Gradients for 3D realism without being photorealistic */}
          <linearGradient id="cylinderBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="15%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          
          <linearGradient id="cylinderGloss" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="20%" stopColor="white" stopOpacity="0.8" />
            <stop offset="40%" stopColor="white" stopOpacity="0.1" />
            <stop offset="85%" stopColor="black" stopOpacity="0.05" />
            <stop offset="100%" stopColor="black" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.6" />
          </linearGradient>
          
          {/* Cutaway window mask */}
          <clipPath id="cutawayClip">
            <rect x="42" y="55" width="16" height="120" rx="8" />
          </clipPath>
          
          {/* Subtle glow filter */}
          <filter id="liquidGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Background Decorative Art (Energy/Sensor Flow) --- */}
        <g className="transition-all duration-1000 ease-in-out opacity-40 group-hover:opacity-70 group-hover:scale-105 origin-center">
          <circle cx="50" cy="110" r="70" fill="none" stroke={fillColor} strokeWidth="0.5" strokeDasharray="4 6" opacity="0.3" />
          <circle cx="50" cy="110" r="85" fill="none" stroke={fillColor} strokeWidth="1" strokeDasharray="1 10" opacity="0.2" />
          <path d="M-10 110 L20 110 M80 110 L110 110" stroke={fillColor} strokeWidth="0.5" opacity="0.5" />
          <path d="M50 0 L50 20 M50 200 L50 220" stroke={fillColor} strokeWidth="0.5" opacity="0.5" />
        </g>
        
        {/* Subtle radial glow behind cylinder */}
        <circle cx="50" cy="110" r="60" fill={fillColor} opacity="0.03" />

        {/* --- Cylinder Illustration --- */}
        
        {/* Foot Ring */}
        <path d="M25 175 L75 175 L80 195 L20 195 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        
        {/* Valve / Collar */}
        <path d="M35 40 L65 40 L65 15 L35 15 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="44" y="5" width="12" height="10" fill="#94a3b8" rx="2" />
        {/* Collar guard rings */}
        <path d="M25 45 C30 15 70 15 75 45" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

        {/* Cylinder Body Main */}
        <rect x="15" y="40" width="70" height="140" rx="20" fill="url(#cylinderBody)" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* Internal Liquid (Visible through cutaway window) */}
        <g clipPath="url(#cutawayClip)">
          {/* Empty window background */}
          <rect x="42" y="55" width="16" height="120" fill="#0f172a" opacity="0.8" />
          {/* Liquid level */}
          <rect 
            x="42" 
            y={fillY} 
            width="16" 
            height={fillHeight} 
            fill="url(#liquidGradient)"
            filter="url(#liquidGlow)"
            className="transition-all duration-1000 ease-in-out"
          />
          {/* Measurement Ticks on window */}
          <g stroke="#ffffff" strokeWidth="0.5" opacity="0.3">
            <line x1="42" y1="85" x2="48" y2="85" />
            <line x1="42" y1="115" x2="52" y2="115" />
            <line x1="42" y1="145" x2="48" y2="145" />
          </g>
        </g>
        
        {/* Cutaway window border/glass */}
        <rect x="42" y="55" width="16" height="120" rx="8" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="42" y="55" width="16" height="120" rx="8" fill="url(#cylinderGloss)" opacity="0.5" pointerEvents="none" />

        {/* Cylinder Main Gloss Overlay */}
        <rect x="15" y="40" width="70" height="140" rx="20" fill="url(#cylinderGloss)" pointerEvents="none" />
        
        {/* Sensor Connection / Status Dot */}
        <circle cx="50" cy="190" r="2.5" fill={fillColor} opacity="0.8" />
      </svg>
    </div>
  );
};

export default LpgVisualizer;

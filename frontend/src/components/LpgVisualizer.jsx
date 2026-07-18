import React from 'react';

const LpgVisualizer = ({ percent, statusColor = "text-red-600", className = "" }) => {
  // SVG viewBox is 100x200
  // Cylinder Body is x=15 to x=85 (width 70), y=40 to y=180 (height 140)
  
  // Calculate fill height based on percent
  // Fill bounds: y=40 (100%) to y=180 (0%)
  const fillY = 180 - (percent / 100) * 140;

  // Derive fill color from tailwind class
  let fillColor = "#dc2626"; // red-600 default
  let glowColor = "rgba(220, 38, 38, 0.4)";
  
  if (statusColor.includes('emerald') || statusColor.includes('green')) {
    fillColor = "#059669";
    glowColor = "rgba(5, 150, 105, 0.4)";
  } else if (statusColor.includes('amber') || statusColor.includes('orange')) {
    fillColor = "#f59e0b";
    glowColor = "rgba(245, 158, 11, 0.4)";
  } else if (statusColor.includes('slate') || statusColor.includes('gray')) {
    fillColor = "#94a3b8";
    glowColor = "rgba(148, 163, 184, 0.2)";
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 200" 
        className="w-full h-full drop-shadow-md"
        style={{ filter: `drop-shadow(0 10px 15px ${glowColor})` }}
      >
        <defs>
          <linearGradient id="cylinderGloss" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="20%" stopColor="white" stopOpacity="0.8" />
            <stop offset="40%" stopColor="white" stopOpacity="0.1" />
            <stop offset="85%" stopColor="black" stopOpacity="0.05" />
            <stop offset="100%" stopColor="black" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.8" />
            <stop offset="30%" stopColor={fillColor} stopOpacity="1" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.7" />
          </linearGradient>

          <clipPath id="cylinderBodyClip">
            <rect x="15" y="40" width="70" height="140" rx="20" />
          </clipPath>
        </defs>

        {/* Foot Ring */}
        <path d="M25 175 L75 175 L80 195 L20 195 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        
        {/* Valve / Collar */}
        <path d="M35 40 L65 40 L65 15 L35 15 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="42" y="5" width="16" height="10" fill="#94a3b8" rx="2" />
        {/* Collar guard rings */}
        <path d="M25 45 C30 20 70 20 75 45" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

        {/* Cylinder Body Background */}
        <rect x="15" y="40" width="70" height="140" rx="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

        {/* Liquid Fill */}
        <rect 
          x="15" 
          y={fillY} 
          width="70" 
          height={180 - fillY} 
          fill="url(#liquidGradient)" 
          clipPath="url(#cylinderBodyClip)"
          className="transition-all duration-1000 ease-in-out"
        />

        {/* Gloss Overlay */}
        <rect x="15" y="40" width="70" height="140" rx="20" fill="url(#cylinderGloss)" pointerEvents="none" />
        
        {/* Measurement Ticks */}
        <g stroke="#cbd5e1" strokeWidth="1" opacity="0.6">
          <line x1="15" y1="68" x2="22" y2="68" />
          <line x1="15" y1="96" x2="25" y2="96" />
          <line x1="15" y1="124" x2="22" y2="124" />
          <line x1="15" y1="152" x2="25" y2="152" />
        </g>
      </svg>
    </div>
  );
};

export default LpgVisualizer;

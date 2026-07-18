import React from 'react';

const IndhanLogo = ({ variant = 'full', className = '', showDescriptor = false }) => {
  // SVG Icon element: Geometric Flame/Droplet
  const icon = (
    <svg 
      className={`shrink-0 ${variant === 'icon' ? className : (variant === 'compact' ? 'w-5 h-5' : 'w-7 h-7')} transition-all duration-300`} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="INDHAN Logo"
      role="img"
    >
      {/* Outer Flame (INDHAN Green) */}
      <path 
        d="M16 2 C16 2, 6 12, 6 20 C6 25.523, 10.477 30, 16 30 C21.523 30, 26 25.523, 26 20 C26 12, 16 2, 16 2 Z" 
        fill="#10b981" 
      />
      {/* Inner Droplet / Dark Accent */}
      <path 
        d="M16 12 C16 12, 11 17, 11 22 C11 24.761, 13.239 27, 16 27 C18.761 27, 21 24.761, 21 22 C21 17, 16 12, 16 12 Z" 
        fill="#0f172a" 
      />
      {/* Subtly glowing accent (Negative Space Cutout simulation) */}
      <circle cx="16" cy="22" r="2" fill="#34d399" />
    </svg>
  );

  // Icon-only variant
  if (variant === 'icon') {
    return icon;
  }

  // Full and Compact variants
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Subtle premium hover interaction (soft glow) */}
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none"></div>
        {icon}
      </div>
      
      <div className="flex flex-col justify-center mt-0.5">
        <span className={`font-display font-bold tracking-[0.1em] text-slate-900 leading-none ${variant === 'compact' ? 'text-lg' : 'text-[22px]'}`}>
          INDHAN
        </span>
        {showDescriptor && (
          <span className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1 opacity-90">
            Energy OS
          </span>
        )}
      </div>
    </div>
  );
};

export default IndhanLogo;

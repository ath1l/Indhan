import React from 'react';

const IndhanLogo = ({ variant = 'full', className = '', showDescriptor = false }) => {
  // SVG Icon element
  const icon = (
    <svg 
      className={`shrink-0 ${variant === 'icon' ? className : (variant === 'compact' ? 'w-5 h-5' : 'w-8 h-8')} transition-all duration-300`} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="INDHAN Logo"
      role="img"
    >
      <path d="M14 28V12L20 4C20 4 26 10 26 18C26 23.5228 21.5228 28 16 28H14Z" fill="url(#logo_gradient)"/>
      <rect x="6" y="16" width="6" height="12" rx="3" fill="#2dd4bf"/>
      <defs>
        <linearGradient id="logo_gradient" x1="14" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dd4bf"/>
          <stop offset="1" stopColor="#0f766e"/>
        </linearGradient>
      </defs>
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
        <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none"></div>
        {icon}
      </div>
      
      <div className="flex flex-col justify-center">
        <span className={`font-display font-bold tracking-[0.15em] text-white leading-none ${variant === 'compact' ? 'text-lg' : 'text-2xl'}`}>
          INDHAN
        </span>
        {showDescriptor && (
          <span className="text-[10px] text-gray-400 font-sans tracking-widest uppercase mt-1.5 opacity-80">
            Energy Intelligence
          </span>
        )}
      </div>
    </div>
  );
};

export default IndhanLogo;

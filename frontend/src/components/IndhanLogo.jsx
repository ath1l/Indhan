import React from 'react';

const IndhanLogo = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 28V12L20 4C20 4 26 10 26 18C26 23.5228 21.5228 28 16 28H14Z" fill="url(#logo_gradient)"/>
    <rect x="6" y="16" width="6" height="12" rx="3" fill="#2dd4bf"/>
    <defs>
      <linearGradient id="logo_gradient" x1="14" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2dd4bf"/>
        <stop offset="1" stopColor="#14b8a6"/>
      </linearGradient>
    </defs>
  </svg>
);

export default IndhanLogo;

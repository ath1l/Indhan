import React from 'react';

const TeamBourbonFooter = () => {
  return (
    <footer className="w-auto bg-slate-100/80 border-t border-slate-200 mt-24 -mx-4 md:-mx-8 -mb-4 md:-mb-8 px-4 py-12 flex flex-col items-center">
      
      {/* Cute LPG Doodle */}
      <div className="mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-400">
          {/* Heart floating above */}
          <path d="M12 9.5C11.5 8 10 7.5 9 7.5C7.5 7.5 6.5 8.5 6.5 10C6.5 12.5 12 16 12 16C12 16 17.5 12.5 17.5 10C17.5 8.5 16.5 7.5 15 7.5C14 7.5 12.5 8 12 9.5Z" 
                fill="#10b981" 
                className="opacity-80" 
          />
          {/* Tiny Cylinder */}
          <path d="M9 13H15V21C15 21.5523 14.5523 22 14 22H10C9.44772 22 9 21.5523 9 21V13Z" fill="currentColor" />
          {/* Cylinder Top Valve */}
          <path d="M11 11H13V13H11V11Z" fill="currentColor" />
          <path d="M10 9H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Primary Text */}
      <div className="text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5 mb-2">
        Made with 
        <span className="text-emerald-500 hover:scale-125 hover:text-emerald-400 transition-transform duration-200 cursor-default">
          ♥
        </span> 
        by <span className="font-bold text-slate-800 tracking-tight">Team Bourbon</span>
      </div>

      {/* Secondary Text */}
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
        INDHAN · Every kilogram counts
      </div>
      
    </footer>
  );
};

export default TeamBourbonFooter;

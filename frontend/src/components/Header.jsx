import React from 'react';

const Header = ({ activeCategory }) => {
  return (
    
    // This gives us absolute spatial control over the logo
    <header className="fixed inset-0 z-0 pointer-events-none">
      
      {/* THE GLASSY SEMICIRCLE (Layered Back) */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] md:w-[120vw] h-[220px] bg-gradient-to-b from-purple-300/60 to-purple-200/30 backdrop-blur-xl border-b border-white/60 rounded-b-[100%] shadow-[0_15px_50px_rgba(168,85,247,0.15)] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] z-0 ${
        activeCategory ? 'opacity-0 -translate-y-full scale-y-50' : 'opacity-100 translate-y-0 scale-y-100'
      }`}></div>
      
      {/* THE KAILER LOGO */}
      <h1 className={`absolute font-black z-[100] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto ${
        activeCategory 
          ? 'top-8 left-10 -translate-x-0 text-5xl text-[#b06cf8] drop-shadow-[0_0_20px_rgba(176,108,248,0.8)] cursor-pointer hover:scale-110 hover:text-[#c48ef9] hover:drop-shadow-[0_0_30px_rgba(176,108,248,1)]' 
          : 'top-[8%] left-1/2 -translate-x-1/2 text-7xl tracking-widest text-slate-900 drop-shadow-sm'
      }`}>
        {activeCategory ? 'K' : 'KAILER'}
      </h1>
      
    </header>
  );
};

export default Header;
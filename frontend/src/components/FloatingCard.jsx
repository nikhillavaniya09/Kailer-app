import React from 'react';

const FloatingCard = ({ category, quote, bgImage, customStyle, rotationClass }) => {
  return (
    <div 
      className={`absolute w-[180px] h-[260px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 group cursor-pointer border border-white/10 hover:border-white/30 hover:scale-110 hover:rotate-0 hover:z-50 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] ${rotationClass}`}
      style={{ 
        ...customStyle, 
        backgroundImage: `url(${bgImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Premium Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060b14] via-[#060b14]/40 to-black/10 flex flex-col p-5 justify-between transition-opacity duration-500 group-hover:from-[#060b14]/90">
        
        {/* Category (e.g., ACTION, HORROR) */}
        <h2 className="text-xl font-black uppercase tracking-widest text-white/90 drop-shadow-md transform transition-transform duration-500 group-hover:-translate-y-1">
          {category}
        </h2>
        
        {/* The attractive quote */}
        <p className="font-serif italic text-xs leading-relaxed text-slate-300 drop-shadow-md transform transition-transform duration-500 group-hover:translate-y-1 group-hover:text-white">
          "{quote}"
        </p>
      </div>
    </div>
  );
};

export default FloatingCard;
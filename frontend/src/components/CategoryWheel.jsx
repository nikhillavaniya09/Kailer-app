import React from 'react';

const CategoryWheel = ({ activeCategory, onCategoryClick }) => {
  
  
  let wheelPositionClasses = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100"; 
  
  if (activeCategory === 'Movies') {
    wheelPositionClasses = "top-1/2 left-[100%] -translate-x-[30%] -translate-y-1/2 scale-75"; 
  } else if (activeCategory === 'Series') {
    wheelPositionClasses = "top-1/2 left-0 -translate-x-[70%] -translate-y-1/2 scale-75"; 
  } else if (activeCategory === 'Music') {
    wheelPositionClasses = "top-0 left-1/2 -translate-x-1/2 -translate-y-[70%] scale-75";
  } else if (activeCategory === 'Books') {
    wheelPositionClasses = "top-[100%] left-1/2 -translate-x-1/2 -translate-y-[30%] scale-75"; 
  } else if (activeCategory === 'Saves') {
    wheelPositionClasses = "top-0 left-[100%] -translate-x-[75%] -translate-y-[25%] scale-75"; 
  }

  // 2. Helper function to handle Active/Hidden states while keeping the base glow logic clean
  const getPetalState = (categoryName) => {
    // Hidden state (when another category is clicked)
    if (activeCategory && activeCategory !== categoryName) {
      return "opacity-0 scale-50 pointer-events-none transition-all duration-300"; 
    }
    // Base style for all petals (Glassmorphic)
    const baseStyle = "opacity-100 scale-100 pointer-events-auto text-slate-200 transition-all duration-500 ease-in-out cursor-pointer flex flex-col items-center justify-center backdrop-blur-md";
    
    // Custom logic to replace solid background with glass and light-up neon on hover
    if (activeCategory === categoryName) {
      return `${baseStyle} scale-125 z-50 bg-[#0f172a]/95 text-white`; // Selected state
    }
    return `${baseStyle} bg-[#0f172a]/70`; // Default state
  };

  return (
    <div className={`absolute w-[400px] h-[400px] transition-all duration-700 ease-in-out z-40 ${wheelPositionClasses}`}>
      
      {/* Background Shape - Dark glass backdrop with subtle glow */}
      <div className={`absolute inset-0 bg-[#060b14]/50 backdrop-blur-md rounded-[3rem] transition-opacity duration-500 ${activeCategory ? 'opacity-0' : 'opacity-100'}`}></div>

      {/* Top: Books (Orange, leaf shape) */}
      <button 
        onClick={() => onCategoryClick('Books')}
        className={`group absolute top-[10%] left-1/2 -translate-x-1/2 w-[140px] h-[140px] z-10 
          rounded-tl-3xl rounded-tr-3xl rounded-bl-[60%] rounded-br-[60%]
          border border-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.3)] 
          hover:shadow-[0_0_45px_rgba(249,115,22,0.8)] hover:scale-105 hover:border-orange-400
          before:absolute before:inset-0 before:rounded-[inherit] before:border-2 before:border-white/20 before:pointer-events-none
          ${getPetalState('Books')}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2 text-orange-400 group-hover:text-orange-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="font-bold tracking-widest text-[10px] uppercase">Books</span>
      </button>

      {/* Bottom: Music (Purple, leaf shape) */}
      <button 
        onClick={() => onCategoryClick('Music')}
        className={`group absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[140px] h-[140px] z-10 
          rounded-bl-3xl rounded-br-3xl rounded-tl-[60%] rounded-tr-[60%]
          border border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.3)] 
          hover:shadow-[0_0_45px_rgba(168,85,247,0.8)] hover:scale-105 hover:border-purple-400
          before:absolute before:inset-0 before:rounded-[inherit] before:border-2 before:border-white/20 before:pointer-events-none
          ${getPetalState('Music')}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <span className="font-bold tracking-widest text-[10px] uppercase">Music</span>
      </button>

      {/* Left: Movies (Red, leaf shape) */}
      <button 
        onClick={() => onCategoryClick('Movies')}
        className={`group absolute top-1/2 left-[10%] -translate-y-1/2 w-[140px] h-[140px] z-10 
          rounded-tl-3xl rounded-bl-3xl rounded-tr-[60%] rounded-br-[60%]
          border border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.3)] 
          hover:shadow-[0_0_45px_rgba(239,68,68,0.8)] hover:scale-105 hover:border-red-400
          before:absolute before:inset-0 before:rounded-[inherit] before:border-2 before:border-white/20 before:pointer-events-none
          ${getPetalState('Movies')}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2 text-red-400 group-hover:text-red-300 transition-colors ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <span className="font-bold tracking-widest text-[10px] uppercase ml-4">Movies</span>
      </button>

      {/* Right: Series (Green, leaf shape) */}
      <button 
        onClick={() => onCategoryClick('Series')}
        className={`group absolute top-1/2 right-[11%] -translate-y-1/2 w-[140px] h-[140px] z-10 
          rounded-tr-3xl rounded-br-3xl rounded-tl-[60%] rounded-bl-[60%]
          border border-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.3)] 
          hover:shadow-[0_0_45px_rgba(34,197,94,0.8)] hover:scale-105 hover:border-green-400
          before:absolute before:inset-0 before:rounded-[inherit] before:border-2 before:border-white/20 before:pointer-events-none
          ${getPetalState('Series')}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2 text-green-400 group-hover:text-green-300 transition-colors mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="font-bold tracking-widest text-[10px] uppercase mr-4">Series</span>
      </button>

      {/* Center: Save (Yellow, polished glass square) */}
      <button 
        onClick={() => onCategoryClick('Saves')}
        className={`group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] z-20 
          rounded-[2rem] border-2 border-yellow-500/80 shadow-[0_0_20px_rgba(234,179,8,0.4)] 
          hover:shadow-[0_0_50px_rgba(234,179,8,1)] hover:scale-110 hover:border-yellow-400
          bg-[#0f172a]/95 backdrop-blur-xl
          before:absolute before:inset-0 before:rounded-[inherit] before:border-2 before:border-white/25 before:pointer-events-none
          ${getPetalState('Saves')}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mb-1 text-yellow-400 group-hover:text-yellow-300 transition-colors" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        <span className="font-bold tracking-wider text-[10px] uppercase text-slate-200 group-hover:text-white">Saved</span>
      </button>

    </div>
  );
};

export default CategoryWheel;
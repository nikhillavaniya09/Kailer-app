import React, { useState } from 'react';
import { getMovieTrailer, getMovieProviders } from '../services/tmdb';

// Helper to match the exact genre colors from MoviesMenu
const getGenreColor = (id) => {
  // Mapping TMDB genre IDs to our specific color index (roughly matching TMDB's list)
  const idToIndex = {
    28: 0,   // Action -> Red
    12: 1,   // Adventure -> Orange
    16: 2,   // Animation -> Amber
    35: 3,   // Comedy -> Yellow
    80: 4,   // Crime -> Lime
    99: 5,   // Documentary -> Green
    18: 6,   // Drama -> Emerald
    10751: 7,// Family -> Teal
    14: 8,   // Fantasy -> Cyan
    36: 9,   // History -> Sky
    27: 10,  // Horror -> Blue
    10402: 11,// Music -> Indigo
    9648: 12, // Mystery -> Violet
    10749: 13,// Romance -> Purple
    878: 14, // Sci-Fi -> Fuchsia
    10770: 15,// TV Movie -> Pink
    53: 16,  // Thriller -> Rose
    10752: 0, // War -> Red
    37: 1     // Western -> Orange
  };
  
  const index = idToIndex[id] !== undefined ? idToIndex[id] : 13; // Default to purple if unknown
  
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
    '#ec4899', '#f43f5e'
  ];
  return colors[index % colors.length];
};

const MovieDetailsModal = ({ movie, onClose, savedItems = [], onSave }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [providers, setProviders] = useState(null);
  const [showProviders, setShowProviders] = useState(false);

  if (!movie) return null;

  const handlePlayTrailer = async () => {
    const key = await getMovieTrailer(movie.id);
    if (key) {
      setTrailerKey(key);
      setIsPlaying(true);
    } else {
      alert("Sorry, no official trailer could be found for this movie!");
    }
  };

  const handleShowProviders = async () => {
    if (!providers) {
      const data = await getMovieProviders(movie.id);
      setProviders(data);
    }
    setShowProviders(!showProviders);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setTrailerKey(null);
    setShowProviders(false);
    setProviders(null);
    onClose();
  };

  const isSaved = savedItems.find(saved => saved.id === movie.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050508]/80 backdrop-blur-xl transition-opacity" onClick={handleClose}>
      
      {/* 
       The Main Modal Container
        It is completely transparent, 
        allowing the poster and the glassy right panel to define the shape.
      */}
      <div 
        className={`relative w-full max-w-5xl rounded-[2.5rem] shadow-[0_25px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ${isPlaying ? 'md:flex-col max-h-[95vh] bg-black border border-white/10' : 'md:flex-row bg-transparent'} transition-all duration-500`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-6 right-6 z-[200] w-12 h-12 bg-black/40 backdrop-blur-md hover:bg-red-600 hover:scale-110 border border-white/20 text-white rounded-full flex items-center justify-center transition-all font-bold text-xl cursor-pointer shadow-lg">
          ✕
        </button>
        
        {/* Visual Section: Poster OR Full-Width Video */}
        <div className={`relative bg-black transition-all duration-500 ${isPlaying ? 'w-full h-[300px] md:h-[500px]' : 'w-full md:w-[45%] h-[400px] md:h-[650px] shrink-0'}`}>
           {isPlaying && trailerKey ? (
             <iframe 
               src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
               title="YouTube Trailer" 
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
               className="w-full h-full absolute inset-0 z-50"
             ></iframe>
           ) : (
             <>
               {movie.poster_path ? (
                 <img src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-500 bg-[#111]">No Image</div>
               )}
               
               {/* Fade gradient so the poster blends perfectly into the glassy panel */}
               <div className={`absolute inset-0 bg-gradient-to-t ${!isPlaying && 'md:bg-gradient-to-r'} from-[#1a1525]/90 via-transparent to-transparent opacity-100 pointer-events-none`}></div>

               {/* Glowing Genre Dots on the large poster */}
               <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 z-20">
                  {movie.genre_ids?.map(id => {
                    const color = getGenreColor(id);
                    return (
                      <span 
                        key={id} 
                        className="w-3.5 h-3.5 rounded-full border border-white/30" 
                        style={{ 
                          backgroundColor: color, 
                          boxShadow: `0 0 15px ${color}` 
                        }}
                      />
                    );
                  })}
                </div>
             </>
           )}
        </div>

        {/* 
          Text Details Section (The Glassy Panel)
          backdrop-blur and a subtle purple glow gradient.
        */}
        <div className={`p-8 md:p-12 flex flex-col justify-center text-white relative z-10 ${isPlaying ? 'w-full p-8' : 'w-full md:w-[55%] bg-[#1a1525]/70 backdrop-blur-3xl border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]'}`}>
          
          <h2 className={`font-black mb-3 tracking-tight drop-shadow-lg ${isPlaying ? 'text-3xl' : 'text-4xl md:text-5xl leading-tight'}`}>{movie.title}</h2>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-lg font-black text-sm drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
              ★ {movie.vote_average.toFixed(1)} / 10
            </span>
            <span className="text-purple-200 font-bold tracking-widest">{movie.release_date?.split('-')[0]}</span>
          </div>

          <p className={`text-gray-300 leading-relaxed font-serif italic ${isPlaying ? 'mb-4 text-md' : 'mb-10 text-lg max-h-[220px] overflow-y-auto transform-gpu overscroll-contain custom-scrollbar pr-4'}`}>
            "{movie.overview}"
          </p>
          
          {/* Action Buttons - Glassy, Hollow, and Glowing */}
          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex flex-wrap gap-4">
              
              {!isPlaying && (
                <button 
                  onClick={handlePlayTrailer} 
                  className="px-8 py-3 bg-[#0f0a14]/60 backdrop-blur-md border border-red-500/50 hover:bg-red-600/20 text-white font-bold rounded-full transition-all flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.4),inset_0_0_10px_rgba(239,68,68,0.1)] hover:border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.6),inset_0_0_15px_rgba(239,68,68,0.2)]"
                >
                  <span className="text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">▶</span> Watch Trailer
                </button>
              )}
              
              {/* The Hollow-to-Solid Glowing Golden Save Button */}
              <button 
                onClick={() => onSave(movie, 'movie')} 
                className={`px-8 py-3 font-bold rounded-full transition-all flex items-center justify-center min-w-[140px] border ${
                  isSaved 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.7),inset_0_0_10px_rgba(255,255,255,0.5)] scale-105' 
                    : 'bg-[#0f0a14]/60 backdrop-blur-md hover:bg-yellow-500/10 text-yellow-500 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                }`}
              >
                {isSaved ? 'Saved' : 'Save'}
              </button>

              {/* Glassy Where to Watch Button */}
              <button 
                onClick={handleShowProviders} 
                className="px-8 py-3 bg-[#0f0a14]/60 backdrop-blur-md border border-purple-500/50 hover:bg-purple-600/20 text-purple-200 font-bold rounded-full transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                Where to Watch
              </button>

            </div>

            {/* The Streaming Providers Dropdown */}
            {showProviders && (
              <div className="mt-4 p-5 bg-[#0a0510]/80 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-fade-in-up">
                <h4 className="font-bold text-purple-300 mb-3 tracking-wider text-sm uppercase">Available Streaming On:</h4>
                
                {providers?.flatrate ? (
                  <div className="flex flex-wrap gap-4">
                    {providers.flatrate.map(provider => (
                      <a 
                        key={provider.provider_id} 
                        href={providers?.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <img 
                          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} 
                          alt={provider.provider_name} 
                          title={provider.provider_name}
                          className="w-12 h-12 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:scale-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] border border-white/10 transition-all cursor-pointer" 
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic">Not currently streaming on major subscriptions. Check VOD to rent or buy.</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
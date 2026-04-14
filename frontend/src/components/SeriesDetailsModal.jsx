import React, { useState, useEffect } from 'react';
import { getTvTrailer, getTvDetails } from '../services/tmdb';

// Helper to match the exact genre colors
const getGenreColor = (id) => {
  const idToIndex = {
    10759: 0, 12: 1, 16: 2, 35: 3, 80: 4, 99: 5, 18: 6, 
    10751: 7, 14: 8, 36: 9, 27: 10, 10402: 11, 9648: 12, 
    10764: 8, 10765: 14, 10768: 1, 10749: 13, 10766: 15, 
    53: 16, 10752: 0, 37: 1
  };
  const index = idToIndex[id] !== undefined ? idToIndex[id] : 13;
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
    '#ec4899', '#f43f5e'
  ];
  return colors[index % colors.length];
};

const SeriesDetailsModal = ({ series, onClose, savedItems = [], onSave }) => {
  const [fullDetails, setFullDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (series) {
      const fetchDetails = async () => {
        const data = await getTvDetails(series.id);
        setFullDetails(data);
      };
      fetchDetails();
    }
  }, [series]);

  if (!series) return null;

  const handlePlayTrailer = async () => {
    const key = await getTvTrailer(series.id);
    if (key) {
      setTrailerKey(key);
      setIsPlaying(true);
    } else {
      alert("Sorry, no official trailer could be found for this series!");
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    setTrailerKey(null);
    setFullDetails(null);
    onClose();
  };

  const seasonsCount = fullDetails ? fullDetails.number_of_seasons : '...';
  const episodesCount = fullDetails ? fullDetails.number_of_episodes : '...';
  const status = fullDetails ? fullDetails.status : '...'; 

  const isSaved = savedItems.find(saved => saved.id === series.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050806]/80 backdrop-blur-xl transition-opacity" onClick={handleClose}>
      
      {/* the no-scrollbar logic */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* Main Modal Container */}
      <div 
        className={`relative w-full max-w-5xl rounded-[2.5rem] shadow-[0_25px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ${isPlaying ? 'md:flex-col max-h-[95vh] bg-black border border-white/10' : 'md:flex-row bg-transparent'} transition-all duration-500`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-6 right-6 z-[200] w-12 h-12 bg-black/40 backdrop-blur-md hover:bg-green-500 hover:scale-110 border border-white/20 text-white rounded-full flex items-center justify-center transition-all font-bold text-xl cursor-pointer shadow-lg">✕</button>
        
        {/* Visual Section: Poster OR Video */}
        <div className={`relative bg-black transition-all duration-500 ${isPlaying ? 'w-full h-[300px] md:h-[500px]' : 'w-full md:w-[45%] h-[400px] md:h-[650px] shrink-0'}`}>
           {isPlaying && trailerKey ? (
             <iframe src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} title="Trailer" frameBorder="0" allowFullScreen className="w-full h-full absolute inset-0 z-50"></iframe>
           ) : (
             <>
               {series.poster_path ? <img src={`https://image.tmdb.org/t/p/w780${series.poster_path}`} alt={series.name} className="w-full h-full object-cover" /> : <div className="text-gray-500 bg-[#111] w-full h-full flex items-center justify-center">No Image</div>}
               <div className={`absolute inset-0 bg-gradient-to-t ${!isPlaying && 'md:bg-gradient-to-r'} from-[#0f1712]/90 via-transparent to-transparent opacity-100 pointer-events-none`}></div>
               
               {/* Glowing Genre Dots on the poster */}
               <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 z-20">
                  {series.genre_ids?.map(id => {
                    const color = getGenreColor(id);
                    return <span key={id} className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}/>
                  })}
                </div>
             </>
           )}
        </div>

        {/* Text Details Section (Glassy Panel) */}
        <div className={`p-8 md:p-12 flex flex-col justify-center text-white relative z-10 ${isPlaying ? 'w-full p-8' : 'w-full md:w-[55%] bg-[#0f1712]/70 backdrop-blur-3xl border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]'}`}>
          <h2 className={`font-black mb-4 tracking-tight drop-shadow-lg ${isPlaying ? 'text-3xl' : 'text-4xl md:text-5xl leading-tight'}`}>{series.name}</h2>
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-lg font-black text-sm drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">★ {series.vote_average.toFixed(1)} / 10</span>
            <span className="px-4 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg font-bold text-sm">{seasonsCount} Seasons</span>
            <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-sm font-semibold">{episodesCount} Episodes</span>
            <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-xs tracking-wider uppercase">{status}</span>
          </div>

          {/* UPGRADE: Summary with removed scrollbar! Changed custom-scrollbar to no-scrollbar */}
          <p className={`text-gray-300 leading-relaxed font-serif italic ${isPlaying ? 'mb-4 text-md' : 'mb-10 text-lg max-h-[220px] overflow-y-auto transform-gpu overscroll-contain no-scrollbar pr-4'}`}>
            "{series.overview}"
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-auto">
            {!isPlaying && (
              
              <button onClick={handlePlayTrailer} className="px-8 py-3 bg-[#0a100c]/60 backdrop-blur-md border border-green-500/50 hover:bg-green-600/20 text-white font-black uppercase text-xs tracking-[0.15em] rounded-full transition-all flex items-center justify-center min-w-[140px] shadow-[0_0_15px_rgba(34,197,94,0.4),inset_0_0_10px_rgba(34,197,94,0.1)] hover:border-green-400 hover:shadow-[0_0_25px_rgba(34,197,94,0.6),inset_0_0_15px_rgba(34,197,94,0.2)]">
                Watch Trailer
              </button>
            )}

            {/* wide tracking for stylish look. */}
            <button 
              onClick={() => onSave(series, 'series')} 
              className={`px-8 py-3 font-black uppercase text-xs tracking-[0.15em] rounded-full transition-all flex items-center justify-center min-w-[140px] border ${
                isSaved 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-[#0a100c] border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.7),inset_0_0_10px_rgba(255,255,255,0.5)] scale-105' 
                  : 'bg-[#0a100c]/60 backdrop-blur-md hover:bg-yellow-500/10 text-yellow-500 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]'
              }`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesDetailsModal;
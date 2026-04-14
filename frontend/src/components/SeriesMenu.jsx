import React, { useState, useEffect } from 'react';
import { getSeriesByGenres, searchSeries } from '../services/tmdb';
import SeriesDetailsModal from './SeriesDetailsModal';
import SkeletonCard from './SkeletonCard';

// Using the exact same color spectrum as Movies for consistency
const getGenreColor = (index) => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
    '#ec4899', '#f43f5e'
  ];
  return colors[index % colors.length];
};

const tvCategories = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation / Anime' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 9648, name: 'Mystery & Horror' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10768, name: 'War & Politics' },
  { id: 10749, name: 'Romance' },
  { id: 10766, name: 'Romance / Soap' }
];

const SeriesMenu = ({ isActive, savedItems = [], onSave }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true); 
      const genreIds = selectedGenres.map(
        name => tvCategories.find(g => g.name === name)?.id
      );
      const fetchedSeries = await getSeriesByGenres(genreIds);
      setSeries(fetchedSeries);
      setIsLoading(false); 
    };
    
    if (searchQuery === '') {
      fetchSeries();
    }
  }, [selectedGenres, isActive, searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    
    setIsLoading(true); 
    setSelectedGenres([]); 
    const results = await searchSeries(searchQuery);
    setSeries(results);
    setIsLoading(false); 
  };

  const toggleGenre = (genreName) => {
    setSearchQuery(''); 
    if (selectedGenres.includes(genreName)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genreName));
    } else {
      setSelectedGenres([...selectedGenres, genreName]);
    }
  };

  return (
    <>
      <style>{`
        @keyframes staggeredPop {
          0% { opacity: 0; transform: scale(0.8) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 
        THE SLIDING CONTENT LAYER (REVERSED)
        Starts at right-0. translate-x-20 ensures it slides in from the RIGHT. 
        Restored standard pr-8 padding so the grid stretches all the way!
      */}
      <div className={`absolute top-0 right-0 w-[92%] h-full z-40 pt-24 pl-12 pr-8 pb-12 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isActive ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-20 pointer-events-none'}`}>

        {/* STATIC LAVENDER GLASS BACKGROUND (Rounded on the left) */}
        <div className="absolute inset-0 z-[-1] bg-white/60 backdrop-blur-3xl overflow-hidden pointer-events-none rounded-l-[4rem] shadow-[-20px_0_50px_rgba(0,0,0,0.05)] border-l border-white/40">
          <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-purple-300/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-emerald-200/40 rounded-full blur-[140px]"></div>
          <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-indigo-200/40 rounded-full blur-[100px]"></div>
        </div>

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10">
          <h2 className="text-4xl font-black tracking-widest text-slate-800 uppercase drop-shadow-sm">
            Discover Series
          </h2>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-1/3 mt-4 md:mt-0 shadow-lg rounded-full">
            <input 
              type="text" 
              placeholder="Search for a TV show..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full px-6 py-3 rounded-l-full bg-white/70 backdrop-blur-lg border border-white/50 border-r-0 focus:outline-none focus:border-green-400 text-slate-800 placeholder-gray-500 transition-colors shadow-inner"
            />
            {/* Neon Green theme */}
            <button type="submit" className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold rounded-r-full hover:from-green-400 hover:to-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all">
              Search
            </button>
          </form>
        </div>

        {/* Genres */}
        <div className="mb-10 relative z-10">
          <div className="flex flex-wrap gap-3">
            {tvCategories.map((genre, index) => {
              const isSelected = selectedGenres.includes(genre.name);
              const color = getGenreColor(index);
              
              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.name)}
                  style={{
                    borderColor: color,
                    color: isSelected ? '#ffffff' : color,
                    backgroundColor: isSelected ? color : 'transparent',
                    boxShadow: isSelected ? `0 0 15px ${color}80` : 'none',
                    animation: `staggeredPop 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                    animationDelay: `${index * 0.04}s`,
                    opacity: 0 
                  }}
                  className={`px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 border-[2px] transform hover:-translate-y-1 bg-white/40 backdrop-blur-md ${isSelected ? 'scale-105 shadow-md' : 'hover:scale-105 hover:bg-white/60'}`}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.boxShadow = `0 0 10px ${color}40`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Movie Grid */}
        <div className="flex-1 overflow-y-auto transform-gpu overscroll-contain pr-4 no-scrollbar relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
              {[...Array(10)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : series.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
              {series.map((show) => (
                <div 
                  key={show.id} 
                  onClick={() => setSelectedSeries(show)}
                  className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out hover:scale-105 hover:z-10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] cursor-pointer bg-slate-900 transform-gpu border border-white/20"
                >
                  {show.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-center p-4 font-bold">{show.name}</div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                    <h4 className="font-black text-lg leading-tight mb-1 drop-shadow-lg">{show.name}</h4>
                    <p className="text-sm text-yellow-400 font-bold mb-3 drop-shadow-md">★ {show.vote_average.toFixed(1)}</p>
                    <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed mb-4">{show.overview}</p>

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {show.genre_ids.map(id => {
                        const genreIndex = tvCategories.findIndex(g => g.id === id);
                        if (genreIndex === -1) return null;
                        const color = getGenreColor(genreIndex);
                        return (
                          <span 
                            key={id} 
                            className="text-[9px] font-bold px-2 py-0.5 rounded-md border bg-black/50 backdrop-blur-sm uppercase tracking-wider"
                            style={{ color: color, borderColor: color }}
                          >
                            {tvCategories[genreIndex].name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-20 transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                    {show.genre_ids.map(id => {
                      const genreIndex = tvCategories.findIndex(g => g.id === id);
                      if (genreIndex === -1) return null;
                      const color = getGenreColor(genreIndex);
                      return (
                        <span 
                          key={id} 
                          className="w-3 h-3 rounded-full border border-white/20" 
                          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                          title={tvCategories[genreIndex].name}
                        />
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-40 flex items-center justify-center text-slate-500 font-bold text-xl drop-shadow-sm">
              No series found. Try another search!
            </div>
          )}
        </div>
      </div>

      <SeriesDetailsModal 
        series={selectedSeries} 
        onClose={() => setSelectedSeries(null)} 
        savedItems={savedItems}
        onSave={onSave}
      />
    </>
  );
};

export default SeriesMenu;
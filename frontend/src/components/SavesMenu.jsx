import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import MovieDetailsModal from './MovieDetailsModal';
import SeriesDetailsModal from './SeriesDetailsModal';
import BookDetailsModal from './BookDetailsModal';
import { ItunesModal } from './TrendingAudio';
import { YoutubeModal } from './FullSongs';

// --- SVG ICONS ---
const IconClose = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>;
const IconPlay = () => <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const IconAll = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>;
const IconMovie = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>;
const IconTv = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const IconBook = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>;
const IconMusic = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>;
const IconSparkle = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>;
const IconDownload = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;

// --- NEON THEME DICTIONARY ---
const THEMES = {
  'All': { border: 'border-slate-500/50', hover: 'hover:border-slate-400', shadow: 'hover:shadow-[0_0_20px_rgba(148,163,184,0.4)]', text: 'text-slate-400', bgActive: 'bg-slate-500/20', borderActive: 'border-slate-400', shadowActive: 'shadow-[0_0_15px_rgba(148,163,184,0.5)]' },
  'movie': { border: 'border-cyan-500/50', hover: 'hover:border-cyan-400', shadow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]', text: 'text-cyan-400', bgActive: 'bg-cyan-500/20', borderActive: 'border-cyan-400', shadowActive: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]' },
  'series': { border: 'border-purple-500/50', hover: 'hover:border-purple-400', shadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]', text: 'text-purple-400', bgActive: 'bg-purple-500/20', borderActive: 'border-purple-400', shadowActive: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]' },
  'book': { border: 'border-green-500/50', hover: 'hover:border-green-400', shadow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]', text: 'text-green-400', bgActive: 'bg-green-500/20', borderActive: 'border-green-400', shadowActive: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]' },
  'playlists': { border: 'border-pink-500/50', hover: 'hover:border-pink-400', shadow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]', text: 'text-pink-400', bgActive: 'bg-pink-500/20', borderActive: 'border-pink-400', shadowActive: 'shadow-[0_0_15px_rgba(236,72,153,0.5)]' },
  'ai_generation': { border: 'border-blue-500/50', hover: 'hover:border-blue-400', shadow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]', text: 'text-blue-400', bgActive: 'bg-blue-500/20', borderActive: 'border-blue-400', shadowActive: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' }
};

const filterTabs = [
  { id: 'All', label: 'All', icon: <IconAll /> },
  { id: 'movie', label: 'Movies', icon: <IconMovie /> },
  { id: 'series', label: 'Series', icon: <IconTv /> },
  { id: 'book', label: 'Books', icon: <IconBook /> },
  { id: 'playlists', label: 'Music', icon: <IconMusic /> },
  { id: 'ai_generation', label: 'AI Creations', icon: <IconSparkle /> }
];

const SavesMenu = ({ isActive, savedItems = [], onSave, onClose }) => {
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistTrack, setSelectedPlaylistTrack] = useState(null);
  const [playbackContext, setPlaybackContext] = useState(null);

  useEffect(() => {
    if (isActive) {
      const localData = localStorage.getItem('kailer_music_playlists');
      if (localData) {
        setPlaylists(JSON.parse(localData));
      }
    }
  }, [isActive]);

  const displayItems = savedItems.filter(saved => {
    if (filter === 'All') return saved.type !== 'music_itunes' && saved.type !== 'music_youtube';
    if (filter === 'playlists') return false; 
    return saved.type === filter;
  });

  const getCardImage = (saved) => {
    try {
      if (saved.type === 'movie' || saved.type === 'series') return `https://image.tmdb.org/t/p/w500${saved.item?.poster_path}`;
      if (saved.type === 'book') return saved.item?.volumeInfo?.imageLinks?.thumbnail;
      if (saved.type === 'ai_generation') return null; 
    } catch (e) { return null; }
    return null;
  };

  const getCardTitle = (saved) => {
    try {
      if (saved.type === 'movie') return saved.item?.title;
      if (saved.type === 'series') return saved.item?.name;
      if (saved.type === 'book') return saved.item?.volumeInfo?.title;
      if (saved.type === 'ai_generation') return saved.item?.title || 'AI Transmission'; 
    } catch (e) { return 'Unknown'; }
    return 'Unknown';
  };

  const hideScrollbar = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  // --- UPGRADE: Restored Local Playback Control ---
  const handleOpenPlaylistTrack = (track, playlistId, index) => {
      const isYoutube = !!track.id?.videoId;
      setSelectedPlaylistTrack({ item: track, type: isYoutube ? 'music_youtube' : 'music_itunes' });
      setPlaybackContext({ playlistId, index });
  };

  const handleNextTrack = () => {
      if (!playbackContext) return;
      const { playlistId, index } = playbackContext;
      const playlist = playlists.find(p => p.id === playlistId);
      if (playlist && index + 1 < playlist.tracks.length) {
          handleOpenPlaylistTrack(playlist.tracks[index + 1], playlistId, index + 1);
      }
  };

  const handlePlaylistItemClick = (index) => {
      if (!playbackContext) return;
      const playlist = playlists.find(p => p.id === playbackContext.playlistId);
      if (playlist) {
          handleOpenPlaylistTrack(playlist.tracks[index], playlist.id, index);
      }
  };

  const handleExportPDF = () => {
    const contentElement = document.getElementById('save-story-content');
    if (!contentElement) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedItem?.item?.title || 'Kailer Export'}</title>
          <style>
            body { font-family: Georgia, serif; line-height: 1.8; color: #000; padding: 40px; max-width: 800px; margin: auto; }
            h1, h2, h3, h4 { font-family: Arial, Helvetica, sans-serif; color: #111; }
            p { margin-bottom: 20px; font-size: 18px; }
            hr { border: 0; border-top: 1px solid #ddd; margin: 40px 0; }
          </style>
        </head>
        <body>
          ${contentElement.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { 
      printWindow.print(); 
      printWindow.close(); 
    }, 500); 
  };

  const waveHeights = [15, 25, 10, 30, 40, 20, 35, 45, 25, 15, 30, 20, 10];

  const updateTrackSettings = (trackId, settings) => {
    const updatedPlaylists = playlists.map(pl => ({
      ...pl,
      tracks: pl.tracks.map(t => {
        const id = t.id?.videoId || t.trackId;
        return id === trackId ? { ...t, ...settings } : t;
      })
    }));
    setPlaylists(updatedPlaylists);
    localStorage.setItem('kailer_music_playlists', JSON.stringify(updatedPlaylists));

    if (selectedPlaylistTrack) {
      const currentId = selectedPlaylistTrack.item.id?.videoId || selectedPlaylistTrack.item.trackId;
      if (currentId === trackId) {
        setSelectedPlaylistTrack({
          ...selectedPlaylistTrack,
          item: { ...selectedPlaylistTrack.item, ...settings }
        });
      }
    }
  };

  return (
    <>
      <div className={`absolute inset-0 w-full h-full z-50 bg-[#0a0a0f] flex flex-col p-12 overflow-hidden transition-all duration-700 ease-in-out print:hidden ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6 mt-8 shrink-0">
          <div>
            <h2 className="text-5xl font-black text-amber-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">My Saves</h2>
            <p className="text-slate-400 mt-2 font-bold tracking-wide uppercase text-xs">Your Curated Digital Stash.</p>
          </div>
          <button onClick={onClose} className="px-6 py-2.5 border border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all z-10 shrink-0 shadow-lg flex items-center gap-2">
            ← Dashboard
          </button>
        </div>

        {/* --- NEON FILTER BAR --- */}
        <div className="flex gap-4 mb-10 relative z-10 shrink-0 flex-wrap">
          {filterTabs.map(tab => {
            const theme = THEMES[tab.id];
            const isActiveTab = filter === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 border ${isActiveTab ? `${theme.bgActive} ${theme.borderActive} ${theme.text} ${theme.shadowActive}` : `bg-transparent border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300`}`}
              >
                {tab.icon} {tab.label}
              </button>
            )
          })}
        </div>

        <div className={`flex-1 overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar} pr-4 relative z-10`}>
          
          {filter !== 'playlists' && displayItems.length === 0 ? (
            <div className="w-full h-40 flex items-center justify-center text-slate-600 uppercase tracking-widest font-black text-sm">
              No Assets Detected
            </div>
          ) : filter !== 'playlists' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 pb-20">
              {displayItems.map(saved => {
                
                // --- DYNAMIC AI THEMES ---
                let theme = THEMES[saved.type] || THEMES['All'];
                let aiLabel = saved.type.replace('_', ' ');
                let isForge = false, isMulti = false, isVibe = false;

                if (saved.type === 'ai_generation') {
                    if (saved.item?.mode === 'forge') {
                        theme = THEMES['movie']; // Cyan
                        aiLabel = 'The Story Forge';
                        isForge = true;
                    } else if (saved.item?.mode === 'multiverse') {
                        theme = THEMES['series']; // Purple
                        aiLabel = 'Multiverse Engine';
                        isMulti = true;
                    } else if (saved.item?.mode === 'vibe') {
                        theme = { border: 'border-teal-500/50', hover: 'hover:border-teal-400', shadow: 'hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]', text: 'text-teal-400' };
                        aiLabel = 'The Vibe Check';
                        isVibe = true;
                    }
                }
                
                return (
                  <div 
                    key={saved.id} 
                    onClick={() => setSelectedItem(saved)} 
                    className={`group relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-[#0f1218] border ${theme.border} ${theme.hover} ${theme.shadow} cursor-pointer transition-all duration-500 flex flex-col items-center justify-center`}
                  >
                    {/* Standard Image Render */}
                    {saved.type !== 'ai_generation' && (
                      <img src={getCardImage(saved)} alt="cover" className={`absolute inset-0 w-full h-full object-cover scale-[1.02] group-hover:scale-110 transition-transform duration-700`} />
                    )}

                    {/* --- DYNAMIC AI SVGS (FIXED DESIGNS) --- */}
                    {saved.type === 'ai_generation' && (
                      <div className="absolute inset-0 w-full h-full bg-[#050b14] overflow-hidden flex items-center justify-center transition-colors">
                        
                        {/* 1. STORY FORGE: The Crossing Lightsabers */}
                        {isForge && (
                          <>
                            <div className="absolute inset-0 bg-cyan-500/20 blur-[50px] transition-all duration-700"></div>
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full object-cover z-10 opacity-80 group-hover:scale-110 transition-transform duration-700 mix-blend-screen">
                              <path d="M-10,20 L110,80" stroke="#0ea5e9" strokeWidth="6" opacity="0.6" filter="blur(3px)" />
                              <path d="M-10,20 L110,80" stroke="#7dd3fc" strokeWidth="2" />
                              <path d="M20,-10 L80,110" stroke="#ec4899" strokeWidth="6" opacity="0.6" filter="blur(3px)" />
                              <path d="M20,-10 L80,110" stroke="#f9a8d4" strokeWidth="2" />
                              <path d="M-10,80 L110,20" stroke="#eab308" strokeWidth="4" opacity="0.5" filter="blur(2px)" />
                              <path d="M-10,80 L110,20" stroke="#fef08a" strokeWidth="1.5" />
                              <path d="M80,-10 L20,110" stroke="#a855f7" strokeWidth="4" opacity="0.5" filter="blur(2px)" />
                              <path d="M80,-10 L20,110" stroke="#d8b4fe" strokeWidth="1.5" />
                              <circle cx="50" cy="50" r="3" fill="#fff" className="animate-pulse" />
                            </svg>
                          </>
                        )}

                        {/* 2. MULTIVERSE ENGINE: Intersecting Orbital Rings */}
                        {isMulti && (
                          <>
                            <div className="absolute inset-0 bg-purple-500/20 blur-[50px] transition-all duration-700"></div>
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full object-cover z-10 opacity-70 group-hover:scale-110 transition-transform duration-700 mix-blend-screen">
                              <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="#c084fc" strokeWidth="1.5" transform="rotate(30 50 50)" opacity="0.8"/>
                              <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="#d946ef" strokeWidth="1.5" transform="rotate(-30 50 50)" opacity="0.8"/>
                              <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="#a855f7" strokeWidth="1.5" transform="rotate(90 50 50)" opacity="0.8"/>
                              <circle cx="50" cy="50" r="4" fill="#fff" className="animate-pulse" />
                              <circle cx="30" cy="30" r="1.5" fill="#fff" className="animate-ping" style={{animationDuration: '2s'}} />
                              <circle cx="70" cy="70" r="1.5" fill="#fff" className="animate-ping" style={{animationDuration: '3s'}} />
                            </svg>
                          </>
                        )}

                        {/* 3. VIBE CHECK: Audio Equalizer Bars */}
                        {isVibe && (
                          <>
                            <div className="absolute inset-0 bg-teal-500/20 blur-[50px] transition-all duration-700"></div>
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full object-cover z-10 opacity-70 group-hover:scale-110 transition-transform duration-700 mix-blend-screen">
                              <rect x="25" y="40" width="5" height="20" rx="2.5" fill="#14b8a6" className="animate-pulse" style={{animationDuration: '0.8s'}}/>
                              <rect x="40" y="25" width="5" height="50" rx="2.5" fill="#34d399" className="animate-pulse" style={{animationDuration: '1.2s'}}/>
                              <rect x="55" y="10" width="5" height="80" rx="2.5" fill="#0ea5e9" className="animate-pulse" style={{animationDuration: '1s'}}/>
                              <rect x="70" y="30" width="5" height="40" rx="2.5" fill="#34d399" className="animate-pulse" style={{animationDuration: '1.5s'}}/>
                            </svg>
                          </>
                        )}
                        
                      </div>
                    )}
                    
                    {/* Delete Button */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSave(saved.item, saved.type); }} 
                        className="w-8 h-8 bg-red-600/80 backdrop-blur-md hover:bg-red-500 border border-red-400/50 text-white rounded-full flex items-center justify-center transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                      >
                        <IconClose />
                      </button>
                    </div>

                    {/* Dark Footer Gradient */}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent p-5 pt-12 text-left z-20 pointer-events-none">
                      <span className={`text-[9px] uppercase font-black mb-1 block tracking-[0.2em] ${theme.text}`}>
                        {aiLabel}
                      </span>
                      <h4 className="font-bold text-white text-sm leading-tight line-clamp-2 drop-shadow-md">{getCardTitle(saved)}</h4>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* --- THE PLAYLIST NEON CARDS --- */}
          {filter === 'playlists' && playlists.length === 0 ? (
             <div className="w-full h-40 flex items-center justify-center text-slate-600 uppercase tracking-widest font-black text-sm">
               No Custom Playlists
             </div>
          ) : filter === 'playlists' && (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-20">
               {playlists.map(pl => {
                 const theme = THEMES['playlists'];
                 return (
                   <div 
                     key={pl.id}
                     onClick={() => setSelectedItem({ type: 'playlist_viewer', item: pl })}
                     className={`group relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#110510] border ${theme.border} ${theme.hover} ${theme.shadow} cursor-pointer transition-all duration-500 flex flex-col`}
                   >
                     <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-pink-600/10 blur-[30px] transition-all duration-700"></div>
                        <svg viewBox="0 0 120 60" className="w-[85%] h-auto z-10 text-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.8)] group-hover:scale-105 transition-transform duration-500">
                           {waveHeights.map((h, i) => (
                              <rect key={i} x={10 + (i * 8)} y={30 - (h / 2)} width="4" height={h} rx="2" fill="currentColor" opacity={0.6 + (Math.random() * 0.4)} />
                           ))}
                           <path d="M 5,30 Q 30,10 60,30 T 115,30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                        </svg>
                     </div>
                     
                     <div className="bg-black/80 backdrop-blur-md p-5 border-t border-white/5 z-20">
                       <span className="text-[9px] uppercase font-black mb-1 block tracking-[0.2em] text-pink-400">Playlist</span>
                       <h4 className="font-bold text-white text-sm uppercase tracking-wide truncate">{pl.name}</h4>
                       <p className="text-slate-400 font-bold text-[10px] mt-1">{pl.tracks.length} Tracks</p>
                     </div>
                   </div>
                 )
               })}
             </div>
          )}
        </div>

        {selectedItem?.type === 'movie' && <MovieDetailsModal movie={selectedItem.item} onClose={() => setSelectedItem(null)} savedItems={savedItems} onSave={onSave} />}
        {selectedItem?.type === 'series' && <SeriesDetailsModal series={selectedItem.item} onClose={() => setSelectedItem(null)} savedItems={savedItems} onSave={onSave} />}
        {selectedItem?.type === 'book' && <BookDetailsModal book={selectedItem.item} onClose={() => setSelectedItem(null)} savedItems={savedItems} onSave={onSave} />}
        
        {/* --- PLAYLIST TRACK VIEWER --- */}
        {selectedItem?.type === 'playlist_viewer' && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
            <div className="w-full max-w-4xl max-h-[85vh] bg-[#0d0714] border border-pink-500/30 rounded-[2rem] p-8 flex flex-col relative shadow-[0_0_50px_rgba(236,72,153,0.15)]" onClick={e => e.stopPropagation()}>
              
              <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 w-10 h-10 bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/20 text-white rounded-full transition-all z-50 flex items-center justify-center">
                <IconClose />
              </button>

              <div className="mb-8 border-b border-pink-500/20 pb-6 pr-12">
                <span className="text-pink-500 font-black text-[10px] tracking-[0.3em] uppercase mb-2 block flex items-center gap-2">
                  <IconMusic /> Custom Compilation
                </span>
                <h2 className="text-4xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]">{selectedItem.item.name}</h2>
                <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-widest">{selectedItem.item.tracks.length} Authenticated Tracks</p>
              </div>

              <div className={`flex-1 overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar} flex flex-col gap-3 pr-2`}>
                  {selectedItem.item.tracks.length === 0 ? (
                      <p className="text-slate-600 text-center my-auto font-black uppercase tracking-widest text-sm">Vault Empty</p>
                  ) : (
                      selectedItem.item.tracks.map((track, idx) => (
                          <div key={idx} className="w-full bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-4 group hover:bg-pink-500/10 hover:border-pink-500/40 transition-all cursor-pointer" onClick={() => handleOpenPlaylistTrack(track, selectedItem.item.id, idx)}>
                              <span className="text-slate-600 font-black text-xs w-6 text-center group-hover:text-pink-500 transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                              <img src={track.artworkUrl100 || track.snippet?.thumbnails?.high?.url} className="w-12 h-12 rounded-lg object-cover shadow-md" alt="cover" />
                              <div className="flex-1 overflow-hidden">
                                  <h4 className="text-white font-bold text-sm truncate group-hover:text-pink-100">{track.trackName || track.snippet?.title?.replace(/&quot;/g, '"').replace(/&#39;/g, "'")}</h4>
                                  <p className="text-slate-400 text-[10px] font-medium tracking-widest uppercase truncate mt-0.5">{track.artistName || track.snippet?.channelTitle}</p>
                              </div>
                              <button className="w-10 h-10 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(236,72,153,0)] group-hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                                  <IconPlay />
                              </button>
                          </div>
                      ))
                  )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- DYNAMIC AI STORY READER & PDF EXPORTER --- */}
      {selectedItem?.type === 'ai_generation' && (() => {
          
          // Determine colors based on the saved mode
          let neonColor = "blue";
          if (selectedItem.item.mode === 'forge') neonColor = "cyan";
          if (selectedItem.item.mode === 'multiverse') neonColor = "purple";
          if (selectedItem.item.mode === 'vibe') neonColor = "teal";

          return (
            <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 animate-fade-in print:bg-white print:p-0">
              <div className={`w-full max-w-6xl h-[85vh] bg-[#0b0c10] border border-${neonColor}-500/30 rounded-[2rem] p-8 flex flex-col relative shadow-[0_0_60px_rgba(var(--tw-colors-${neonColor}-500),0.15)] overflow-hidden print:shadow-none print:border-none print:bg-white print:h-auto print:block`}>
                
                <button onClick={() => setSelectedItem(null)} className={`absolute top-8 right-8 px-5 py-2.5 bg-white/5 border border-white/10 hover:border-${neonColor}-500/50 hover:bg-${neonColor}-500/20 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all z-50 flex items-center gap-2 print:hidden`}>
                  <IconClose /> Close Matrix
                </button>

                <div className="flex w-full h-full gap-8 mt-12 overflow-hidden print:block print:mt-0">
                   
                   {/* LEFT: STORY CONTENT */}
                   <div className="w-2/3 flex flex-col h-full pr-4 overflow-hidden print:w-full print:pr-0">
                      <h2 
                        className={`text-4xl font-black text-transparent line-clamp-2 leading-tight shrink-0 mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] print:text-black`}
                        style={{ WebkitTextStroke: `1px ${neonColor === 'cyan' ? '#22d3ee' : neonColor === 'purple' ? '#c084fc' : '#2dd4bf'}` }}
                      >
                        {selectedItem.item.title}
                      </h2>
                      
                      <div id="save-story-content" className={`flex-1 overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar} text-slate-300 font-serif prose prose-invert max-w-none text-lg leading-relaxed pb-10 print:overflow-visible print:text-black`}>
                        <ReactMarkdown>{selectedItem.item.content}</ReactMarkdown>
                      </div>
                   </div>

                   {/* RIGHT: DYNAMIC DIRECTOR'S CUT PARAMETERS */}
                   <div className="w-1/3 flex flex-col h-full bg-[#13151c] border border-white/5 rounded-2xl p-6 relative overflow-hidden print:hidden">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 shrink-0">Director's Cut Parameters</h3>
                      
                      <div className={`flex-1 overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar} flex flex-col gap-4 pb-4`}>
                         
                         {selectedItem.item.mode === 'forge' && (
                           <>
                             <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0"><h4 className={`text-[10px] uppercase font-black tracking-widest text-${neonColor}-400 mb-2`}>World</h4><p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedItem.item.world || "Default"}</p></div>
                             <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0"><h4 className={`text-[10px] uppercase font-black tracking-widest text-${neonColor}-400 mb-2`}>Protagonist</h4><p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedItem.item.protagonist || "Default"}</p></div>
                             <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0"><h4 className={`text-[10px] uppercase font-black tracking-widest text-${neonColor}-400 mb-2`}>Inciting Incident</h4><p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedItem.item.incitingIncident || "Default"}</p></div>
                           </>
                         )}

                         {selectedItem.item.mode === 'multiverse' && (
                           <>
                             <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0"><h4 className={`text-[10px] uppercase font-black tracking-widest text-${neonColor}-400 mb-2`}>Anchor Universe</h4><p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedItem.item.anchor || "Default"}</p></div>
                             <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0"><h4 className={`text-[10px] uppercase font-black tracking-widest text-${neonColor}-400 mb-2`}>Divergence</h4><p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedItem.item.divergence || "Default"}</p></div>
                             <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0"><h4 className={`text-[10px] uppercase font-black tracking-widest text-${neonColor}-400 mb-2`}>Reality Path</h4><p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedItem.item.path} | {selectedItem.item.tone}</p></div>
                           </>
                         )}

                         {selectedItem.item.mode === 'vibe' && (
                           <>
                             <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0"><h4 className={`text-[10px] uppercase font-black tracking-widest text-${neonColor}-400 mb-2`}>Format</h4><p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedItem.item.format || "Default"}</p></div>
                             <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0"><h4 className={`text-[10px] uppercase font-black tracking-widest text-${neonColor}-400 mb-2`}>Energy & Vibe</h4><p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedItem.item.energy} | {selectedItem.item.atmospheres}</p></div>
                             <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0"><h4 className={`text-[10px] uppercase font-black tracking-widest text-${neonColor}-400 mb-2`}>Time Commitment</h4><p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedItem.item.timeCommitment || "Default"}</p></div>
                           </>
                         )}

                      </div>

                      <button 
                         onClick={handleExportPDF} 
                         className="shrink-0 mt-4 w-full py-4 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/40 hover:border-white rounded-xl text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                      >
                         <IconDownload /> Export PDF
                      </button>
                   </div>

                </div>

              </div>
            </div>
          );
      })()}

      {/* --- RESTORED LOCAL PLAYBACK MODALS --- */}
      {selectedPlaylistTrack?.type === 'music_itunes' && (
          <ItunesModal track={selectedPlaylistTrack.item} onClose={() => setSelectedPlaylistTrack(null)} playlists={playlists} setPlaylists={setPlaylists} startMinimized={true} onTrackFinish={handleNextTrack} activePlaylist={playlists.find(p => p.id === playbackContext?.playlistId)} onPlaylistItemClick={handlePlaylistItemClick} updateTrackSettings={updateTrackSettings} />
      )}
      {selectedPlaylistTrack?.type === 'music_youtube' && (
          <YoutubeModal track={selectedPlaylistTrack.item} onClose={() => setSelectedPlaylistTrack(null)} playlists={playlists} setPlaylists={setPlaylists} startMinimized={true} onTrackFinish={handleNextTrack} activePlaylist={playlists.find(p => p.id === playbackContext?.playlistId)} onPlaylistItemClick={handlePlaylistItemClick} updateTrackSettings={updateTrackSettings} />
      )}
    </>
  );
};

export default SavesMenu;
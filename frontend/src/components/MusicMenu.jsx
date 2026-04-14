import React, { useState, useEffect } from 'react';
import TrendingAudio from './TrendingAudio';
import FullSongs from './FullSongs';

const MusicMenu = ({ isActive, savedItems = [], onSave }) => {
  const [activeMode, setActiveMode] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- STATE ARCHITECTURE ---
  const [queue, setQueue] = useState([]);
  const [playlists, setPlaylists] = useState(() => {
    const localData = localStorage.getItem('kailer_music_playlists');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('kailer_music_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('playlists'); 
  const [viewingPlaylist, setViewingPlaylist] = useState(null); 
  
  const [isSavingQueue, setIsSavingQueue] = useState(false);
  const [queuePlaylistName, setQueuePlaylistName] = useState('');

  const [sidebarTrackToPlay, setSidebarTrackToPlay] = useState(null);
  const [playbackContext, setPlaybackContext] = useState(null); 

  useEffect(() => {
    if (!isActive) {
      setActiveMode(null);
      setIsModalOpen(false);
      setIsSidebarOpen(false);
    }
  }, [isActive]);

  const handleSaveQueueSubmit = (e) => {
    e.preventDefault();
    if (!queuePlaylistName.trim()) return;
    
    const newPlaylist = {
      id: Date.now().toString(),
      name: queuePlaylistName.trim(),
      tracks: [...queue]
    };
    setPlaylists([...playlists, newPlaylist]);
    setQueuePlaylistName('');
    setIsSavingQueue(false);
    setSidebarTab('playlists');
  };

  const removeFromQueue = (indexToRemove) => {
    setQueue(queue.filter((_, index) => index !== indexToRemove));
  };

  const removeFromPlaylist = (playlistId, trackIndexToRemove) => {
    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, tracks: pl.tracks.filter((_, i) => i !== trackIndexToRemove) };
      }
      return pl;
    });
    setPlaylists(updatedPlaylists);
    if (viewingPlaylist && viewingPlaylist.id === playlistId) {
      setViewingPlaylist({ ...viewingPlaylist, tracks: viewingPlaylist.tracks.filter((_, i) => i !== trackIndexToRemove) });
    }
  };

  // --- GLOBAL TRACK SETTINGS SYNCHRONIZER ---
  // When you change a loop on a song, this updates it EVERYWHERE instantly!
  const updateTrackSettings = (trackId, settings) => {
    // 1. Update in Queue
    setQueue(prevQueue => prevQueue.map(t => {
      const id = t.id?.videoId || t.trackId;
      return id === trackId ? { ...t, ...settings } : t;
    }));

    // 2. Update in all Playlists
    setPlaylists(prevPlaylists => prevPlaylists.map(pl => ({
      ...pl,
      tracks: pl.tracks.map(t => {
        const id = t.id?.videoId || t.trackId;
        return id === trackId ? { ...t, ...settings } : t;
      })
    })));

    // 3. Update active sidebar view if open
    if (viewingPlaylist) {
      setViewingPlaylist(prev => ({
        ...prev,
        tracks: prev.tracks.map(t => {
          const id = t.id?.videoId || t.trackId;
          return id === trackId ? { ...t, ...settings } : t;
        })
      }));
    }
  };

  const playTrackFromSidebar = (track, listType, index, listId = null) => {
    const isYoutube = !!track.id?.videoId;
    const mode = isYoutube ? 'youtube' : 'itunes';
    
    setActiveMode(mode);
    setSidebarTrackToPlay({ track, startMinimized: true }); 
    setPlaybackContext({ listType, index, listId });
  };

  const handleNextTrack = () => {
    if (!playbackContext) return;
    const { listType, index, listId } = playbackContext;

    if (listType === 'queue') {
      if (index + 1 < queue.length) {
        playTrackFromSidebar(queue[index + 1], 'queue', index + 1);
      }
    } else if (listType === 'playlist') {
      const playlist = playlists.find(p => p.id === listId);
      if (playlist && index + 1 < playlist.tracks.length) {
        playTrackFromSidebar(playlist.tracks[index + 1], 'playlist', index + 1, listId);
      }
    }
  };

  return (
    <div className={`absolute bottom-0 left-0 w-full h-[85%] z-50 pt-12 px-12 pb-8 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
      
      {/*  no-scrollbar CSS for the sidebar! */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="absolute inset-0 z-[-1] bg-white/60 backdrop-blur-3xl overflow-hidden pointer-events-none rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border-t border-white/40">
        <div className="absolute top-[20%] left-[15%] w-[35vw] h-[35vw] bg-purple-500/30 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[15%] w-[35vw] h-[35vw] bg-orange-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full h-full flex flex-col relative z-10">
        
        <div className={`absolute -top-10 right-4 flex gap-3 transition-all duration-700 z-[100] ${activeMode && !isModalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
          <button onClick={() => setActiveMode('itunes')} className={`px-5 py-2 rounded-full flex items-center justify-center font-black uppercase text-xs tracking-[0.15em] transition-all duration-300 border-2 ${activeMode === 'itunes' ? 'bg-purple-600 text-white border-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.6)] scale-105' : 'bg-white/40 backdrop-blur-md text-purple-600 border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:bg-white/60 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]'}`}>
            Trending
          </button>
          <button onClick={() => setActiveMode('youtube')} className={`px-5 py-2 rounded-full flex items-center justify-center font-black uppercase text-xs tracking-[0.15em] transition-all duration-300 border-2 ${activeMode === 'youtube' ? 'bg-red-600 text-white border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-105' : 'bg-white/40 backdrop-blur-md text-red-600 border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:bg-white/60 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]'}`}>
            Full Songs
          </button>
        </div>

        {!activeMode && (
          <div className="w-full h-full flex flex-col items-center justify-center relative z-10 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-black tracking-widest text-slate-800 mb-16 uppercase drop-shadow-sm">Choose Your Experience</h2>
            
            <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl h-[450px]">
              <div onClick={() => setActiveMode('itunes')} className="flex-1 rounded-[2.5rem] bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 p-8 flex flex-col justify-end relative overflow-hidden group cursor-pointer shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:border-purple-400 hover:shadow-[0_20px_50px_rgba(147,51,234,0.4)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.2)_0%,transparent_60%)] group-hover:bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.4)_0%,transparent_70%)] transition-all duration-500 z-0"></div>
                <div className="absolute top-6 left-6 right-6 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex justify-between items-center z-10">
                  <div className="flex flex-col">
                    <span className="text-purple-400 font-black text-[10px] tracking-[0.3em] uppercase mb-1">Module 01</span>
                    <span className="text-white font-black text-sm tracking-widest uppercase">Editor</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30"><span className="text-purple-300">🎵</span></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                  <h2 className="text-[12rem] font-black text-white opacity-[0.03] transform -rotate-12 translate-y-10 group-hover:scale-110 transition-transform duration-700">WAV</h2>
                </div>
                <div className="relative z-10 mb-6 transition-transform duration-500 group-hover:-translate-y-4">
                  <h3 className="text-5xl font-black text-white mb-3 tracking-tighter drop-shadow-md">Trending Audio</h3>
                  <span className="text-purple-400 font-black uppercase text-xs tracking-[0.3em]">Cut & Download</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                  <p className="text-gray-300 text-sm leading-relaxed font-serif italic">Search high-quality previews, generate waveforms, crop audio, and download .WAV files directly to your device.</p>
                </div>
              </div>

              <div onClick={() => setActiveMode('youtube')} className="flex-1 rounded-[2.5rem] bg-slate-900/90 backdrop-blur-xl border border-red-500/30 p-8 flex flex-col justify-end relative overflow-hidden group cursor-pointer shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:border-red-400 hover:shadow-[0_20px_50px_rgba(220,38,38,0.4)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.2)_0%,transparent_60%)] group-hover:bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.4)_0%,transparent_70%)] transition-all duration-500 z-0"></div>
                <div className="absolute top-6 left-6 right-6 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex justify-between items-center z-10">
                  <div className="flex flex-col">
                    <span className="text-red-400 font-black text-[10px] tracking-[0.3em] uppercase mb-1">Module 02</span>
                    <span className="text-white font-black text-sm tracking-widest uppercase">Player</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30"><span className="text-red-300">🎧</span></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                  <h2 className="text-[12rem] font-black text-white opacity-[0.03] transform -rotate-12 translate-y-10 group-hover:scale-110 transition-transform duration-700">MP4</h2>
                </div>
                <div className="relative z-10 mb-6 transition-transform duration-500 group-hover:-translate-y-4">
                  <h3 className="text-5xl font-black text-white mb-3 tracking-tighter drop-shadow-md">Full Songs</h3>
                  <span className="text-red-400 font-black uppercase text-xs tracking-[0.3em]">Stream & Watch</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                  <p className="text-gray-300 text-sm leading-relaxed font-serif italic">Stream official music videos and full audio tracks directly from YouTube without interruptions.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`w-full h-full relative z-10 transition-opacity duration-500 ${activeMode ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {/* Passed down updateTrackSettings so children can broadcast loop changes! */}
          {activeMode === 'itunes' && <TrendingAudio savedItems={savedItems} onSave={onSave} setIsModalOpen={setIsModalOpen} queue={queue} setQueue={setQueue} playlists={playlists} setPlaylists={setPlaylists} sidebarTrackToPlay={sidebarTrackToPlay} setSidebarTrackToPlay={setSidebarTrackToPlay} onTrackFinish={handleNextTrack} updateTrackSettings={updateTrackSettings} />}
          {activeMode === 'youtube' && <FullSongs savedItems={savedItems} onSave={onSave} setIsModalOpen={setIsModalOpen} queue={queue} setQueue={setQueue} playlists={playlists} setPlaylists={setPlaylists} sidebarTrackToPlay={sidebarTrackToPlay} setSidebarTrackToPlay={setSidebarTrackToPlay} onTrackFinish={handleNextTrack} updateTrackSettings={updateTrackSettings} />}
        </div>
      </div>

      <div className={`absolute right-4 top-[45%] flex flex-col gap-4 z-[90] transition-all duration-500 ${activeMode ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
        <button onClick={() => { setIsSidebarOpen(true); setSidebarTab('playlists'); setViewingPlaylist(null); }} className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-500 hover:scale-110 transition-all group" title="My Playlists">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
        </button>
        <button onClick={() => { setIsSidebarOpen(true); setSidebarTab('queue'); setViewingPlaylist(null); }} className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-400 hover:scale-110 transition-all group" title="Current Queue">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      <div className={`absolute right-0 top-[25%] bottom-[5%] w-[420px] bg-[#0f0f15]/95 backdrop-blur-3xl border-l border-y border-white/10 shadow-[-30px_0_60px_rgba(0,0,0,0.6)] rounded-l-[2.5rem] z-[110] flex flex-col transition-transform duration-[600ms] ease-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div className="flex gap-6 items-center">
            <button onClick={() => { setSidebarTab('playlists'); setViewingPlaylist(null); }} className={`font-black uppercase tracking-widest text-xs transition-all ${sidebarTab === 'playlists' ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] scale-105' : 'text-slate-500 hover:text-slate-300'}`}>Playlists</button>
            <button onClick={() => { setSidebarTab('queue'); setViewingPlaylist(null); }} className={`font-black uppercase tracking-widest text-xs transition-all ${sidebarTab === 'queue' ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)] scale-105' : 'text-slate-500 hover:text-slate-300'}`}>Queue</button>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:bg-white/20 hover:text-white transition-all font-bold">✕</button>
        </div>

        {/* no-scrollbar! */}
        <div className="flex-1 overflow-y-auto transform-gpu overscroll-containp-4 no-scrollbar">
          
          {sidebarTab === 'queue' && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{queue.length} Tracks</span>
                {queue.length > 0 && !isSavingQueue && (
                  <button onClick={() => setIsSavingQueue(true)} className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-all">Save as Playlist</button>
                )}
              </div>
              
              {isSavingQueue && (
                <form onSubmit={handleSaveQueueSubmit} className="flex gap-2 mb-4 p-2 bg-white/5 rounded-xl border border-white/10 animate-fade-in-up">
                  <input type="text" placeholder="Playlist Name..." value={queuePlaylistName} onChange={(e) => setQueuePlaylistName(e.target.value)} autoFocus className="flex-1 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-red-400" />
                  <button type="submit" className="bg-red-500 text-white font-black uppercase text-[10px] px-3 rounded-lg hover:bg-red-400 transition-colors">Save</button>
                  <button type="button" onClick={() => setIsSavingQueue(false)} className="text-slate-400 hover:text-white px-2">✕</button>
                </form>
              )}
              
              {queue.length === 0 ? (
                <p className="text-slate-500 text-sm text-center mt-10 font-serif italic">Your queue is empty.</p>
              ) : (
                queue.map((track, idx) => (
                  <div key={idx} className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 group hover:bg-white/10 transition-colors">
                    <img src={track.artworkUrl100 || track.snippet?.thumbnails?.high?.url} className="w-12 h-12 rounded-lg object-cover" alt="cover" />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-white font-bold text-xs truncate">{track.trackName || track.snippet?.title}</h4>
                      <p className="text-slate-400 text-[10px] font-medium tracking-wide truncate">{track.artistName || track.snippet?.channelTitle}</p>
                    </div>
                    <button onClick={() => playTrackFromSidebar(track, 'queue', idx)} className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    <button onClick={() => removeFromQueue(idx)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">✕</button>
                  </div>
                ))
              )}
            </div>
          )}

          {sidebarTab === 'playlists' && !viewingPlaylist && (
            <div className="flex flex-col gap-3">
              <div className="px-2 mb-2"><span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Your Collections</span></div>
              {playlists.length === 0 ? (
                <p className="text-slate-500 text-sm text-center mt-10 font-serif italic">No custom playlists created yet.</p>
              ) : (
                playlists.map(pl => (
                  <div key={pl.id} onClick={() => setViewingPlaylist(pl)} className="w-full bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between group hover:border-purple-500/50 hover:from-purple-900/40 cursor-pointer transition-all">
                    <div className="flex flex-col">
                      <h4 className="text-white font-black text-sm uppercase tracking-wide">{pl.name}</h4>
                      <p className="text-purple-400 text-xs font-medium">{pl.tracks.length} Tracks</p>
                    </div>
                    <span className="text-purple-500 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                ))
              )}
            </div>
          )}

          {sidebarTab === 'playlists' && viewingPlaylist && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-4 px-2">
                <button onClick={() => setViewingPlaylist(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-purple-600 transition-all font-bold">←</button>
                <h3 className="text-white font-black uppercase tracking-widest text-sm flex-1 truncate">{viewingPlaylist.name}</h3>
              </div>
              
              {viewingPlaylist.tracks.length === 0 ? (
                <p className="text-slate-500 text-sm text-center mt-10 font-serif italic">This playlist is empty.</p>
              ) : (
                viewingPlaylist.tracks.map((track, idx) => (
                  <div key={idx} className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 group hover:bg-white/10 transition-colors">
                    <img src={track.artworkUrl100 || track.snippet?.thumbnails?.high?.url} className="w-12 h-12 rounded-lg object-cover" alt="cover" />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-white font-bold text-xs truncate">{track.trackName || track.snippet?.title}</h4>
                      <p className="text-slate-400 text-[10px] font-medium tracking-wide truncate">{track.artistName || track.snippet?.channelTitle}</p>
                    </div>
                    <button onClick={() => playTrackFromSidebar(track, 'playlist', idx, viewingPlaylist.id)} className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    <button onClick={() => removeFromPlaylist(viewingPlaylist.id, idx)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">✕</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicMenu;
import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { getItunesMusic } from '../services/musicApi';

const musicCategories = ['Pop', 'K-Pop', 'Hip-Hop', 'R&B', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Indie', 'Lo-Fi', 'Country', 'Metal', 'Blues', 'Soul', 'Acoustic'];

const getGenreColor = (index) => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
    '#ec4899', '#f43f5e'
  ];
  return colors[index % colors.length];
};

const getTrackColor = (idString) => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'
  ];
  let hash = 0;
  for (let i = 0; i < String(idString).length; i++) {
    hash = String(idString).charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// --- 1. THE ITUNES WAVEFORM MODAL & MINI PLAYER ---
export const ItunesModal = ({ track, onClose, savedItems = [], onSave, setIsModalOpen, queue, setQueue, playlists, setPlaylists, startMinimized, onTrackFinish, activePlaylist, onPlaylistItemClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [audioDuration, setAudioDuration] = useState(30);
  const [lyrics, setLyrics] = useState('Loading lyrics...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  
  // FIX: Added missing state for the active playlist overlay!
  const [showPlaylistOverlay, setShowPlaylistOverlay] = useState(false);

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const hasLyrics = lyrics !== 'No lyrics found for this specific track.' && lyrics !== 'No lyrics found. (Instrumental or not in database).';

  const onTrackFinishRef = useRef(onTrackFinish);
  const startMinimizedRef = useRef(startMinimized);

  useEffect(() => {
    onTrackFinishRef.current = onTrackFinish;
    startMinimizedRef.current = startMinimized;
  }, [onTrackFinish, startMinimized]);

  useEffect(() => {
    if (track) {
      setIsMinimized(startMinimized || false);
    }
  }, [track, startMinimized]);

  useEffect(() => {
    if (setIsModalOpen) setIsModalOpen(!!track && !isMinimized);
  }, [isMinimized, track?.trackId, setIsModalOpen]);

  useEffect(() => {
    if (!track) return;
    const fetchLyrics = async () => {
      try {
        setLyrics('Searching for lyrics...');
        const res = await fetch(`https://api.lyrics.ovh/v1/${track.artistName}/${track.trackName}`);
        const data = await res.json();
        if (data.lyrics) setLyrics(data.lyrics.replace(/Paroles de la chanson .*\n/i, ''));
        else setLyrics('No lyrics found for this specific track.');
      } catch (err) {
        setLyrics('No lyrics found. (Instrumental or not in database).');
      }
    };
    fetchLyrics();
  }, [track?.trackId]); 

  useEffect(() => {
    if (!track) return;
    if (wavesurfer.current) wavesurfer.current.destroy();

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current, 
      waveColor: '#7e22ce', 
      progressColor: '#c084fc', 
      cursorColor: '#ffffff', 
      barWidth: 3, 
      barRadius: 3, 
      height: 60, 
      normalize: true,
    });
    
    wavesurfer.current.load(track.previewUrl);
    
    wavesurfer.current.on('ready', () => {
      setIsReady(true);
      const duration = wavesurfer.current.getDuration();
      setAudioDuration(duration);
      setEndTime(Math.floor(duration));
      
      if (startMinimizedRef.current) {
        wavesurfer.current.play();
      }
    });

    wavesurfer.current.on('play', () => setIsPlaying(true));
    wavesurfer.current.on('pause', () => setIsPlaying(false));
    
    wavesurfer.current.on('finish', () => {
      setIsPlaying(false);
      if (onTrackFinishRef.current) onTrackFinishRef.current(); 
    });

    return () => { if (wavesurfer.current) wavesurfer.current.destroy(); };
  }, [track?.trackId]); 

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && isReady && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        wavesurfer.current.playPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady]);

  if (!track) return null;
  const artwork = track.artworkUrl100?.replace('100x100bb', '600x600bb');
  const togglePlay = () => { if (wavesurfer.current && isReady) wavesurfer.current.playPause(); };

  const handleCompleteClose = (e) => {
    if (e) e.stopPropagation();
    if (wavesurfer.current) wavesurfer.current.pause();
    onClose();
  };

  const processAndDownloadWav = async (start, end, isFullSong) => {
    if (start >= end) return alert("Start time must be before end time!");
    setIsProcessing(true);
    try {
      const response = await fetch(track.previewUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const duration = end - start;
      const offlineCtx = new OfflineAudioContext(audioBuffer.numberOfChannels, audioCtx.sampleRate * duration, audioCtx.sampleRate);
      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineCtx.destination);
      source.start(0, start, duration);
      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
      const url = URL.createObjectURL(wavBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = isFullSong ? `${track.trackName} - Full.mp3` : `${track.trackName} - Cropped (${start}s-${end}s).wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error processing audio.");
    } finally {
      setIsProcessing(false);
    }
  };

  const bufferToWave = (abuffer, len) => {
    let numOfChan = abuffer.numberOfChannels, length = len * numOfChan * 2 + 44, buffer = new ArrayBuffer(length), view = new DataView(buffer), channels = [], i, sample, offset = 0, pos = 0;
    const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
    const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };
    setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157); setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan); setUint32(abuffer.sampleRate); setUint32(abuffer.sampleRate * 2 * numOfChan); setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4);
    for(i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));
    while(pos < length) {
      for(i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0;
        view.setInt16(pos, sample, true); pos += 2;
      }
      offset++;
    }
    return new Blob([buffer], {type: "audio/wav"});
  };

  const overlayLeft = (startTime / audioDuration) * 100;
  const overlayWidth = ((endTime - startTime) / audioDuration) * 100;

  const handleAddToPlaylist = (playlistId) => {
    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.tracks.find(t => t.trackId === track.trackId)) {
          return { ...pl, tracks: [...pl.tracks, track] };
        }
      }
      return pl;
    });
    if (setPlaylists) setPlaylists(updatedPlaylists);
    setShowPlaylistSelector(false);
  };

  const handleCreateNewPlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const newPlaylist = { id: Date.now().toString(), name: newPlaylistName.trim(), tracks: [track] };
    if (setPlaylists) setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
    setShowPlaylistSelector(false);
  };

  return (
    <>
      <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-lg transition-all duration-500 ${isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={() => setIsMinimized(true)}>
        
        {/* FIX: Added onMouseDown & onClick stopPropagation so sliders don't crash the modal! */}
        <div className={`relative w-full max-w-5xl bg-[#0f0f15] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row border border-white/10 max-h-[90vh] transition-transform duration-500 ${isMinimized ? 'scale-95' : 'scale-100'}`} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <div className="absolute top-6 right-6 z-[200] flex gap-3">
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} className="w-11 h-11 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 text-white rounded-full flex items-center justify-center transition-all font-black text-xl shadow-lg" title="Minimize to floating player">_</button>
            <button onClick={handleCompleteClose} className="w-11 h-11 bg-white/10 backdrop-blur-md hover:bg-red-500 border border-white/10 text-white rounded-full flex items-center justify-center transition-all font-black text-xl shadow-lg" title="Close completely">✕</button>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col bg-black relative">
            <div className={`w-full relative group shrink-0 transition-all duration-500 overflow-hidden ${hasLyrics ? 'h-[250px]' : 'h-full flex-1'}`}>
              <img src={artwork} alt={track.trackName} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300">
                 <button onClick={togglePlay} disabled={!isReady} className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl ${isReady ? 'bg-purple-600 hover:bg-purple-500 hover:scale-110 shadow-[0_0_30px_rgba(147,51,234,0.8)]' : 'bg-slate-700 opacity-50'}`}>
                   {isPlaying ? <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                 </button>
              </div>
            </div>
            {hasLyrics && (
              <div className="flex-1 p-8 bg-[#13131a] overflow-y-auto transform-gpu overscroll-contain no-scrollbar">
                <h4 className="text-purple-500 font-black uppercase text-xs mb-4 tracking-[0.2em] border-b border-purple-500/20 pb-2">Lyrics</h4>
                <p className="text-slate-300 text-base whitespace-pre-line leading-relaxed font-medium pr-4">{lyrics}</p>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between text-white relative z-10 bg-[#0f0f15] overflow-y-auto transform-gpu overscroll-contain no-scrollbar">
            <div>
              <span className="px-4 py-1.5 bg-purple-500/20 border border-purple-500/40 text-purple-400 rounded-lg font-black text-xs uppercase tracking-widest w-max mb-4 block shadow-sm">{track.primaryGenreName}</span>
              <h2 className="text-4xl font-black mb-2 leading-tight drop-shadow-sm">{track.trackName}</h2>
              <h3 className="text-xl text-slate-400 font-medium tracking-wide mb-8">by {track.artistName}</h3>
              <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 relative shadow-sm">
                 <p className="text-slate-400 text-xs mb-4 font-black uppercase tracking-widest">Audio Waveform</p>
                 <div className="relative w-full">
                   <div ref={waveformRef} className="w-full"></div>
                   {isReady && <div className="absolute top-0 bottom-0 bg-gradient-to-b from-purple-400/20 via-purple-500/40 to-purple-400/20 border-l-2 border-r-2 border-purple-300 pointer-events-none transition-all duration-100 shadow-[0_0_20px_rgba(168,85,247,0.5),inset_0_0_20px_rgba(168,85,247,0.5)] backdrop-blur-[1px]" style={{ left: `${overlayLeft}%`, width: `${overlayWidth}%` }}></div>}
                 </div>
              </div>
              <div className="flex flex-col gap-4 mb-8 bg-black/40 border border-white/5 p-6 rounded-2xl shadow-sm">
                 <div className="flex justify-between text-sm font-black text-slate-300 uppercase tracking-wider">
                   <span className="bg-white/10 px-3 py-1 rounded-md border border-white/5">Start: {startTime}s</span>
                   <span className="bg-white/10 px-3 py-1 rounded-md border border-white/5">End: {endTime}s</span>
                 </div>
                 <div className="flex gap-4 items-center mt-2">
                   {/* stopPropagation so dragging sliders doesn't close the modal! */}
                   <input type="range" min="0" max={Math.floor(audioDuration)} value={startTime} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onChange={(e) => setStartTime(Number(e.target.value))} className="w-1/2 accent-purple-500" />
                   <input type="range" min="0" max={Math.floor(audioDuration)} value={endTime} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onChange={(e) => setEndTime(Number(e.target.value))} className="w-1/2 accent-purple-500" />
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 mt-auto relative">
              <button onClick={() => processAndDownloadWav(0, audioDuration, true)} disabled={isProcessing || !isReady} className="w-full py-4 text-white bg-white/5 backdrop-blur-md font-black uppercase tracking-widest text-xs rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_0_10px_rgba(255,255,255,0.1)] hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.4),inset_0_0_15px_rgba(255,255,255,0.2)] hover:border-white transition-all">
                {isProcessing ? 'Processing...' : 'Download'}
              </button>
              <button onClick={() => processAndDownloadWav(startTime, endTime, false)} disabled={isProcessing || !isReady} className="w-full py-4 text-purple-400 bg-purple-900/20 backdrop-blur-md font-black uppercase tracking-widest text-xs rounded-full border border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.3),inset_0_0_10px_rgba(147,51,234,0.1)] hover:text-purple-300 hover:bg-purple-600/20 hover:shadow-[0_0_25px_rgba(147,51,234,0.6),inset_0_0_15px_rgba(147,51,234,0.3)] hover:border-purple-400 transition-all">
                {isProcessing ? 'Processing...' : 'Crop & Download'}
              </button>
              <button onClick={() => setShowPlaylistSelector(true)} className={`w-full py-4 font-black uppercase tracking-widest text-xs rounded-full transition-all border backdrop-blur-md bg-amber-900/10 text-amber-500 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2),inset_0_0_10px_rgba(245,158,11,0.1)] hover:border-amber-400 hover:bg-amber-500/20 hover:shadow-[0_0_25px_rgba(245,158,11,0.4),inset_0_0_15px_rgba(245,158,11,0.2)] hover:text-amber-400`}>
                Save to Playlist
              </button>

              {showPlaylistSelector && (
                <div className="absolute inset-x-0 bottom-full mb-4 bg-[#0f0f15]/95 backdrop-blur-2xl rounded-2xl z-50 flex flex-col p-6 animate-fade-in-up border border-amber-500/30 shadow-[0_-10px_40px_rgba(245,158,11,0.2)]">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-amber-500 font-black uppercase tracking-widest text-sm">Select Playlist</h4>
                    <button onClick={() => setShowPlaylistSelector(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                  </div>
                  <div className="flex-1 overflow-y-auto transform-gpu overscroll-contain no-scrollbar flex flex-col gap-2 mb-4 max-h-[150px]">
                    {playlists.length === 0 ? (
                      <p className="text-slate-500 text-xs italic text-center my-auto">No playlists yet.</p>
                    ) : (
                      playlists.map(pl => (
                        <button key={pl.id} onClick={() => handleAddToPlaylist(pl.id)} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-amber-500/20 border border-white/5 hover:border-amber-500/40 rounded-xl text-white font-bold text-sm transition-all flex justify-between items-center group">
                          {pl.name}
                          <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                        </button>
                      ))
                    )}
                  </div>
                  <form onSubmit={handleCreateNewPlaylist} className="flex gap-2">
                    <input type="text" placeholder="New Playlist Name..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
                    <button type="submit" className="bg-amber-500 text-black font-black uppercase text-xs px-4 rounded-lg hover:bg-amber-400 transition-colors">Create</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div onClick={() => setIsMinimized(false)} className={`fixed bottom-8 right-8 z-[200] w-80 bg-[#0f0f15]/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-2xl p-3 flex items-center gap-4 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:border-purple-500/50 ${isMinimized ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <img src={track.artworkUrl100} className="w-14 h-14 rounded-lg object-cover shadow-md" alt="mini cover" />
        <div className="flex-1 overflow-hidden">
           <h4 className="text-white font-bold text-sm truncate">{track.trackName}</h4>
           <p className="text-purple-400 text-xs font-medium tracking-wide truncate">{track.artistName}</p>
        </div>
        
        {/* The Active Playlist Star Button to TrendingAudio! */}
        {activePlaylist && (
          <button onClick={(e) => { e.stopPropagation(); setShowPlaylistOverlay(true); }} className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-amber-500 transition-colors" title="View Active Playlist">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </button>
        )}

        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-purple-600/20 text-purple-400 rounded-full hover:bg-purple-600 hover:text-white transition-colors">
           {isPlaying ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
        </button>
        
        <button onClick={handleCompleteClose} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white rounded-full hover:bg-white/10 transition-colors">✕</button>
      
        {/* The Playlist Tracklist View to TrendingAudio! */}
        {showPlaylistOverlay && activePlaylist && (
            <div className="absolute bottom-full right-0 mb-4 w-72 bg-[#0f0f15]/95 backdrop-blur-2xl rounded-2xl z-[250] flex flex-col p-4 border border-amber-500/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] cursor-default" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <h4 className="text-amber-500 font-black uppercase tracking-widest text-xs truncate pr-2">{activePlaylist.name}</h4>
                <button onClick={() => setShowPlaylistOverlay(false)} className="text-slate-400 hover:text-white font-bold text-xs">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto transform-gpu overscroll-contain no-scrollbar flex flex-col gap-2 max-h-[250px]">
                {activePlaylist.tracks.map((t, idx) => {
                    const isActiveTrack = t.trackId === track.trackId;
                    return (
                        <div key={idx} onClick={() => onPlaylistItemClick && onPlaylistItemClick(idx)} className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-all cursor-pointer group ${isActiveTrack ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-white/5 border border-white/5 hover:bg-white/10'}`}>
                            {isActiveTrack ? <span className="text-amber-500 animate-pulse text-xs">▶</span> : <span className="text-slate-600 font-black text-[10px] w-2 text-center">{idx + 1}</span>}
                            <div className="overflow-hidden flex-1">
                                <h5 className={`font-bold text-xs truncate ${isActiveTrack ? 'text-amber-400' : 'text-white group-hover:text-amber-300'}`}>{t.trackName}</h5>
                            </div>
                        </div>
                    )
                })}
              </div>
            </div>
        )}
      </div>
    </>
  );
};

// --- 2. THE MAIN TRENDING AUDIO GRID ---
export default function TrendingAudio({ savedItems = [], onSave, setIsModalOpen, queue, setQueue, playlists, setPlaylists, sidebarTrackToPlay, setSidebarTrackToPlay, onTrackFinish }) {
  const [activeQuery, setActiveQuery] = useState('Pop'); 
  const [searchInput, setSearchInput] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const [startMinimized, setStartMinimized] = useState(false);
  const [hoveredTrackId, setHoveredTrackId] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null); 
  
  const [gridPlaylistSelectorTrack, setGridPlaylistSelectorTrack] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  // Automatically load the track passed from the sidebar!
  useEffect(() => {
    if (sidebarTrackToPlay && !sidebarTrackToPlay.track?.id?.videoId) { 
      setStartMinimized(sidebarTrackToPlay.startMinimized || false);
      setSelectedTrack(sidebarTrackToPlay.track);
      if (setSidebarTrackToPlay) setSidebarTrackToPlay(null);
    }
  }, [sidebarTrackToPlay, setSidebarTrackToPlay]);

  useEffect(() => {
    const fetchMusic = async () => {
      const fetchedTracks = await getItunesMusic(activeQuery);
      setTracks(fetchedTracks);
    };
    fetchMusic();
  }, [activeQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() !== '') setActiveQuery(searchInput);
  };

  const handleOpenTrack = (track) => {
    setStartMinimized(false); 
    setSelectedTrack(track);
  };

  const handleCloseTrack = () => {
    setSelectedTrack(null);
  };

  const handleAddToQueue = (e, track) => {
    e.stopPropagation();
    setQueue([...queue, track]);
  };

  const handleOpenPlaylistSelector = (e, track) => {
    e.stopPropagation();
    setGridPlaylistSelectorTrack(track);
  };

  const handleGridAddToPlaylist = (playlistId) => {
    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.tracks.find(t => t.trackId === gridPlaylistSelectorTrack.trackId)) {
          return { ...pl, tracks: [...pl.tracks, gridPlaylistSelectorTrack] };
        }
      }
      return pl;
    });
    setPlaylists(updatedPlaylists);
    setGridPlaylistSelectorTrack(null);
  };

  const handleGridCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const newPlaylist = { id: Date.now().toString(), name: newPlaylistName.trim(), tracks: [gridPlaylistSelectorTrack] };
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
    setGridPlaylistSelectorTrack(null);
  };

  return (
    <div className="w-full h-full flex flex-col animate-fade-in-up relative">
      <style>{`
        @keyframes staggeredPop { 0% { opacity: 0; transform: scale(0.8) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* UPGRADE: Removed dummy box overlap padding, placed on header parent instead */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pt-4 relative z-10 pr-[240px]">
        <h2 className="text-4xl font-black tracking-widest text-slate-800 uppercase drop-shadow-sm">Trending Audio</h2>
        <form onSubmit={handleSearch} className="flex w-full md:w-[40%] mt-4 md:mt-0 shadow-lg rounded-full">
          <input type="text" placeholder="Search artists, songs..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full px-6 py-3 rounded-l-full bg-white/70 backdrop-blur-lg border border-white/50 border-r-0 focus:outline-none focus:border-purple-400 text-slate-800 placeholder-gray-500 transition-colors shadow-inner" />
          <button type="submit" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-bold rounded-r-full hover:from-purple-500 hover:to-fuchsia-400 shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all">Search</button>
        </form>
      </div>

      <div className="mb-10 relative z-10 pr-[240px]">
        <div className="flex flex-wrap gap-3">
          {musicCategories.map((category, index) => {
            const isSelected = activeQuery === category;
            const color = getGenreColor(index);
            return (
              <button key={category} onClick={() => { setActiveQuery(category); setSearchInput(''); }} style={{ borderColor: color, color: isSelected ? '#ffffff' : color, backgroundColor: isSelected ? color : 'transparent', boxShadow: isSelected ? `0 0 15px ${color}80` : 'none', animation: `staggeredPop 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards`, animationDelay: `${index * 0.04}s`, opacity: 0 }} className={`px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 border-[2px] transform hover:-translate-y-1 bg-white/40 backdrop-blur-md ${isSelected ? 'scale-105 shadow-md' : 'hover:scale-105 hover:bg-white/60'}`} onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.boxShadow = `0 0 10px ${color}40`; }} onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.boxShadow = 'none'; }}>
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto transform-gpu overscroll-contain pr-4 no-scrollbar relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 pb-20">
          {tracks.map((track) => {
            const highResImage = track.artworkUrl100?.replace('100x100bb', '400x400bb');
            const trackGlowColor = getTrackColor(track.trackId);
            const isHovered = hoveredTrackId === track.trackId;

            return (
              <div key={track.trackId} onMouseEnter={() => setHoveredTrackId(track.trackId)} onMouseLeave={() => { setHoveredTrackId(null); setHoveredAction(null); }} onClick={() => handleOpenTrack(track)} className="group relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-500 cursor-pointer bg-[#f8f5fc] border border-white/60 flex flex-col transform-gpu hover:scale-105 hover:z-10">
                <div className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none opacity-60 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0" style={{ background: `radial-gradient(circle at bottom left, ${trackGlowColor}60 0%, ${trackGlowColor}10 50%, transparent 80%)` }} />
                <img src={highResImage} alt={track.trackName} className="w-full h-full object-cover z-10" />
                
                <div className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-all duration-300 z-20 flex flex-col justify-center items-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                  <button onClick={(e) => handleOpenPlaylistSelector(e, track)} onMouseEnter={() => setHoveredAction('playlist')} onMouseLeave={() => setHoveredAction(null)} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 hover:bg-amber-500 flex items-center justify-center text-white transition-colors border border-white/20 hover:border-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </button>
                  <button onClick={(e) => handleAddToQueue(e, track)} onMouseEnter={() => setHoveredAction('queue')} onMouseLeave={() => setHoveredAction(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-red-500 flex items-center justify-center text-white transition-colors border border-white/20 hover:border-red-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <span className={`text-white font-bold bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.8)] px-8 py-2.5 rounded-full transform transition-all duration-300 ${hoveredAction ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>Play</span>
                  <div className={`absolute bottom-6 left-0 w-full text-center transition-all duration-300 ${hoveredAction ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <span className={`font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full ${hoveredAction === 'playlist' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)]'}`}>
                      {hoveredAction === 'playlist' ? 'Save to Playlist' : 'Add to Queue'}
                    </span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-10 text-white z-10 transition-opacity duration-300 group-hover:opacity-0">
                  <h4 className="font-black text-sm truncate leading-tight drop-shadow-md">{track.trackName}</h4>
                  <p className="text-xs text-purple-300 truncate font-medium tracking-wide">{track.artistName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {gridPlaylistSelectorTrack && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-3xl animate-fade-in-up">
          <div className="w-[400px] bg-[#0f0f15] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.1)] rounded-[2rem] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-amber-500 font-black uppercase tracking-widest text-sm">Save to Playlist</h4>
              <button onClick={() => setGridPlaylistSelectorTrack(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="flex items-center gap-4 mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
              <img src={gridPlaylistSelectorTrack.artworkUrl100} className="w-12 h-12 rounded-md object-cover" />
              <div className="overflow-hidden">
                <h5 className="text-white font-bold text-sm truncate">{gridPlaylistSelectorTrack.trackName}</h5>
                <p className="text-slate-400 text-xs truncate">{gridPlaylistSelectorTrack.artistName}</p>
              </div>
            </div>
            <div className="flex-1 max-h-[200px] overflow-y-auto transform-gpu overscroll-contain no-scrollbar flex flex-col gap-2 mb-6">
              {playlists.length === 0 ? (
                <p className="text-slate-500 text-xs italic text-center my-auto">No playlists yet.</p>
              ) : (
                playlists.map(pl => (
                  <button key={pl.id} onClick={() => handleGridAddToPlaylist(pl.id)} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-amber-500/20 border border-white/5 hover:border-amber-500/40 rounded-xl text-white font-bold text-sm transition-all flex justify-between items-center group">
                    {pl.name}
                    <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                  </button>
                ))
              )}
            </div>
            <form onSubmit={handleGridCreatePlaylist} className="flex gap-2">
              <input type="text" placeholder="New Playlist Name..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500" />
              <button type="submit" className="bg-amber-500 text-black font-black uppercase text-xs px-6 rounded-lg hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.4)]">Create</button>
            </form>
          </div>
        </div>
      )}

      <ItunesModal 
        track={selectedTrack} onClose={handleCloseTrack} savedItems={savedItems} onSave={onSave} 
        setIsModalOpen={setIsModalOpen} queue={queue} setQueue={setQueue} 
        playlists={playlists} setPlaylists={setPlaylists} 
        startMinimized={startMinimized} 
        onTrackFinish={onTrackFinish}
      />
    </div>
  );
}
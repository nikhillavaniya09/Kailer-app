import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateStoryForgeActOne, generateStoryForgeActThree, generateMultiverseReality, generateVibeCheck, generateRandomIdea } from '../services/ai';

// --- SVG ICONS---
const IconClose = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>;
const IconBack = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>;
const IconHome = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const IconDice = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>;
const IconRefresh = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>;
const IconForge = () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const IconMulti = () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>;
const IconVibe = () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>;
const IconSave = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>;
const IconDownload = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;
const IconSparkle = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>;
const IconSpinner = () => <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const IconSearch = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const IconArrowDownRight = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>;

const worldIdeas = ["Sprawling Cyberpunk City", "Underwater Research Base", "Cursed Medieval Forest", "Abandoned Bio-Lab"];
const protagonistIdeas = ["A burned-out detective", "An AI learning to lie", "A rogue royal in hiding", "A cynical ghost hunter"];
const hookIdeas = ["A package arrives with their own finger", "The sun doesn't rise today", "Everyone forgets the current year", "Their reflection blinks first"];
const anchorIdeas = ["The Matrix Trilogy", "Harry Potter & The Philosopher's Stone", "Dune (Book/Movie)"];
const divergenceIdeas = ["A key character survives", "The antagonist wins", "A specific item is never found"];

const mainLoadingPhrases = ["Cooking the Perfect Reality for you...", "Are you ready to face the Consequences?", "Every Story has something hidden in it...", "Altering the Reality for you...", "Getting into the Mirror dimension..."];
const forgeLoadingPhrases = ["Refining the world...", "Deciding the character...", "Plotting the hook...", "Weaving the narrative..."];
const multiLoadingPhrases = ["Setting up reference theme...", "Plotting the pinpoint moment...", "Working on new reality...", "Calculating ripple effects..."];
const vibeLoadingPhrases = ["Scanning your frequency...", "Checking the archives...", "Analyzing emotional resonance...", "Finding the perfect match..."];

// --- Explicit Tailwind Configurations! ---
const THEME_CONFIG = {
  forge: { text: 'text-cyan-400', border: 'border-cyan-500/30', gradient: 'from-cyan-400 to-blue-500', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]', hoverGlow: 'hover:shadow-[0_0_25px_rgba(34,211,238,0.7)]', buttonBg: 'bg-cyan-500/20' },
  multiverse: { text: 'text-purple-400', border: 'border-purple-500/30', gradient: 'from-purple-400 to-fuchsia-500', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]', hoverGlow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]', buttonBg: 'bg-purple-500/20' },
  vibe: { text: 'text-teal-400', border: 'border-teal-500/30', gradient: 'from-teal-400 to-emerald-500', glow: 'shadow-[0_0_15px_rgba(20,184,166,0.5)]', hoverGlow: 'hover:shadow-[0_0_25px_rgba(20,184,166,0.7)]', buttonBg: 'bg-teal-500/20' },
};

const AiTheater = ({ isOpen, onClose, savedItems = [], onSave }) => {
  const [activeMode, setActiveMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAct3Loading, setIsAct3Loading] = useState(false); 
  const [loadingIndex, setLoadingIndex] = useState(0); 
  const [mainLoadingText, setMainLoadingText] = useState(mainLoadingPhrases[0]);
  const [aiResponse, setAiResponse] = useState('');
  const [rollingDice, setRollingDice] = useState(null);
  const [currentSaveId, setCurrentSaveId] = useState(null);
  const [forgePhase, setForgePhase] = useState(1);
  
  const [vibeBackdrop, setVibeBackdrop] = useState(null);
  const [vibeMatchPct, setVibeMatchPct] = useState('95%');
  const [format, setFormat] = useState('Movie'); 
  const [energy, setEnergy] = useState('Chill'); 
  const [atmospheres, setAtmospheres] = useState(['Adrenaline Rush']); 
  const [timeCommitment, setTimeCommitment] = useState('Average');
  
  const [vibeMode, setVibeMode] = useState('Vibe Check'); 
  const [vibeReference, setVibeReference] = useState('');
  const [vibePlot, setVibePlot] = useState('');

  const [forgeStep, setForgeStep] = useState(1);
  const [forgeWorld, setForgeWorld] = useState('');
  const [forgeProtagonist, setForgeProtagonist] = useState('');
  const [forgeHook, setForgeHook] = useState('');

  const [multiAnchor, setMultiAnchor] = useState('');
  const [multiDivergence, setMultiDivergence] = useState('');
  const [multiPath, setMultiPath] = useState('Dystopian Collapse'); 
  const [multiTone, setMultiTone] = useState('Psychological Horror'); 
  const [multiComplexMode, setMultiComplexMode] = useState(false);

  const isDivergenceUnlocked = multiAnchor.trim().length > 0;
  const isRealityUnlocked = multiDivergence.trim().length > 0;
  const currentMultiStep = multiComplexMode ? 3 : (isRealityUnlocked ? 3 : (isDivergenceUnlocked ? 2 : 1));

  const activeTheme = THEME_CONFIG[activeMode] || THEME_CONFIG.forge;

  useEffect(() => {
    let interval;
    if (isLoading || isAct3Loading) {
      interval = setInterval(() => setLoadingIndex((prev) => prev + 1), 2500); 
    } else {
      setLoadingIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading, isAct3Loading]);

  const handleClose = () => {
    setActiveMode(null);
    setForgeStep(1); 
    setForgePhase(1);
    setAiResponse(''); 
    setVibeBackdrop(null);
    setCurrentSaveId(null);
    setVibeMode('Vibe Check');
    setVibeReference('');
    setVibePlot('');
    setMultiComplexMode(false);
    onClose();
  };

  const toggleAtmosphere = (opt) => {
    if (atmospheres.includes(opt)) setAtmospheres(atmospheres.filter(a => a !== opt));
    else if (atmospheres.length < 2) setAtmospheres([...atmospheres, opt]);
  };

  const handleAiDice = async (type, setterFunction, context = "") => {
    setRollingDice(type); 
    const newIdea = await generateRandomIdea(type, context);
    setterFunction(newIdea);
    setRollingDice(null); 
  };

  const triggerLoading = () => {
    setMainLoadingText(mainLoadingPhrases[Math.floor(Math.random() * mainLoadingPhrases.length)]);
    setIsLoading(true);
  };

  const executeStoryForgeActOne = async () => {
    triggerLoading();
    setCurrentSaveId(null); 
    const response = await generateStoryForgeActOne(forgeWorld, forgeProtagonist, forgeHook);
    setAiResponse(response);
    setForgePhase(1); 
    setIsLoading(false);
  };

  const executeStoryForgeActThree = async (choice) => {
    setMainLoadingText(mainLoadingPhrases[Math.floor(Math.random() * mainLoadingPhrases.length)]);
    setIsAct3Loading(true); 
    const actThreeResponse = await generateStoryForgeActThree(aiResponse, choice);
    
    // --- STORY CLEANUP ---
    // This removes the "**Option A:**" block from the AI's previous memory
    const cleanedPreviousStory = aiResponse.replace(/\*\*Option A:\*\*[\s\S]*/i, '').trim();
    
    // We seamlessly append Act 3 without printing the option they chose to the text
    const newStory = cleanedPreviousStory + `\n\n---\n\n` + actThreeResponse;
    
    setAiResponse(newStory);
    setForgePhase(2); 
    setIsAct3Loading(false);

    if (currentSaveId && onSave) {
       onSave({ id: currentSaveId, title: displayTitle, content: newStory, mode: activeMode, world: forgeWorld, protagonist: forgeProtagonist, incitingIncident: forgeHook }, 'ai_generation', true);
    }
  };

  const executeMultiverse = async () => {
    triggerLoading();
    setCurrentSaveId(null);
    const response = await generateMultiverseReality(multiAnchor, multiDivergence, multiPath, multiTone, multiComplexMode);
    setAiResponse(response);
    setIsLoading(false);
  };

  const executeVibeCheck = async () => {
    triggerLoading();
    setCurrentSaveId(null);
    const contextList = savedItems.map(item => item.type + ": " + (item.item.title || item.item.name || item.item.trackName || "Unknown")).join(", ");
    const plotToSend = vibeMode === 'Vibe Check' ? '' : vibePlot;
    const response = await generateVibeCheck(format, energy, atmospheres, timeCommitment, contextList, vibeReference, vibeMode, plotToSend);
    
    const titleMatch = response.match(/^#+\s*([^\n]+)/);
    if (titleMatch && (format === 'Movie' || format === 'TV Series')) {
      const cleanTitle = titleMatch[1].replace(/\*/g, '').trim();
      const tmdbType = format === 'Movie' ? 'movie' : 'tv';
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/${tmdbType}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}`);
        const data = await res.json();
        if (data.results?.[0]?.backdrop_path) {
          setVibeBackdrop(`https://image.tmdb.org/t/p/original${data.results[0].backdrop_path}`);
        }
      } catch (e) {}
    }
    
    const matchPct = response.match(/Match:\s*(\d+(\.\d+)?%)/i);
    if (matchPct) setVibeMatchPct(matchPct[1]);
    
    const cleanResponse = response.replace(/Match:\s*\d+(\.\d+)?%\n*/i, '').trim();
    setAiResponse(cleanResponse);
    setIsLoading(false);
  };

  let displayTitle = "Kailer AI Transmission";
  if (aiResponse) {
    const match = aiResponse.match(/^#+\s*([^\n]+)/);
    if (match) displayTitle = match[1].replace(/\*/g, '').trim(); 
  }

  const handleExportPDF = () => {
    // We now fetch ONLY the text content wrapper, ignoring UI buttons and pills
    const contentElement = document.getElementById('story-text-content');
    if (!contentElement) return;

    let htmlContent = contentElement.innerHTML;

    // Fail-safe cleanup for Phase 1 exports (if user exports before choosing Act 3)
    // This strips any lingering "Option A" buttons from the raw HTML string
    if (activeMode === 'forge' && forgePhase === 1) {
      htmlContent = htmlContent.replace(/(<p>)?<strong>Option A:<\/strong>[\s\S]*/i, '');
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${displayTitle}</title>
          <style>
            body { font-family: Georgia, serif; line-height: 1.8; color: #000; padding: 40px; max-width: 800px; margin: auto; }
            h1, h2, h3, h4 { font-family: Arial, Helvetica, sans-serif; color: #111; }
            p { margin-bottom: 20px; font-size: 18px; }
            hr { border: 0; border-top: 1px solid #ddd; margin: 40px 0; }
          </style>
        </head>
        <body>
          ${htmlContent}
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

  const handleSaveToLibrary = async () => {
    const saveId = currentSaveId || `ai_${Date.now()}`;
    if (!currentSaveId) setCurrentSaveId(saveId);

    let params = {};
    if (activeMode === 'forge') params = { world: forgeWorld, protagonist: forgeProtagonist, incitingIncident: forgeHook };
    if (activeMode === 'multiverse') params = { anchor: multiAnchor, divergence: multiDivergence, path: multiPath, tone: multiTone };
    if (activeMode === 'vibe') params = { format, energy, atmospheres: atmospheres.join(", "), timeCommitment, vibeMode, reference: vibeReference, plot: vibePlot };

    if (activeMode === 'forge' && forgePhase === 1) {
      // First save what we have
      if (onSave) onSave({ id: saveId, title: displayTitle, content: aiResponse, mode: activeMode, ...params }, 'ai_generation', !!currentSaveId);
      alert("Saved to Library! (Secretly generating an ending in the background...)");

      // Auto-generate the ending for the save
      const randomOption = ["Option A", "Option B", "Option C"][Math.floor(Math.random() * 3)];
      const actThreeResponse = await generateStoryForgeActThree(aiResponse, randomOption);
      
      // Clean up the background save exactly like the active UI
      const cleanedPreviousStory = aiResponse.replace(/\*\*Option A:\*\*[\s\S]*/i, '').trim();
      const fullStory = cleanedPreviousStory + `\n\n---\n\n` + actThreeResponse;
      
      if (onSave) onSave({ id: saveId, title: displayTitle, content: fullStory, mode: activeMode, ...params }, 'ai_generation', true);
      return;
    }

    if (onSave) {
      onSave({ id: saveId, title: displayTitle, content: aiResponse, mode: activeMode, ...params }, 'ai_generation', !!currentSaveId);
      alert("Saved to Library!");
    }
  };

  const hideScrollbar = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";
  let currentPhrases = vibeLoadingPhrases;
  if (activeMode === 'forge') currentPhrases = forgeLoadingPhrases;
  if (activeMode === 'multiverse') currentPhrases = multiLoadingPhrases;

  return (
    <div className={`fixed inset-0 z-[100] bg-[#05080f]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}`}>
      
      {/* AMBIENT GLOW */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${activeMode === 'forge' ? 'bg-cyan-600/10' : activeMode === 'multiverse' ? 'bg-purple-600/10' : 'bg-teal-600/10'}`}></div>

      {activeMode === 'vibe' && aiResponse && vibeBackdrop && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <img src={vibeBackdrop} alt="Backdrop" className="w-full h-full object-cover opacity-20 mix-blend-screen" />
          <div className="absolute inset-0 bg-[#0a0f1a]/60 backdrop-blur-sm"></div>
        </div>
      )}

      {/* --- MAIN UI CONTAINER --- */}
      <div className={`w-full max-w-[95vw] h-[85vh] bg-[#0a0f1a]/80 backdrop-blur-xl border ${activeTheme.border} rounded-[2rem] p-6 md:p-8 flex flex-col relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500`}>
        
        {/* --- TOP HEADER NAVIGATION --- */}
        <div className="absolute top-6 left-6 right-6 flex justify-between z-50 pointer-events-none">
          <div className="pointer-events-auto">
             {activeMode && !isLoading && !aiResponse && (
               <button onClick={() => { setActiveMode(null); setForgeStep(1); }} className={`px-5 py-2.5 bg-white/5 backdrop-blur-md ${activeTheme.buttonBg} ${activeTheme.text} font-bold rounded-full transition-all flex items-center gap-2 border border-white/10 shadow-lg text-xs uppercase tracking-widest hover:-translate-y-0.5`}>
                 <IconBack /> Back to Menu
               </button>
             )}
          </div>
          <div className="pointer-events-auto">
             <button onClick={handleClose} className={`px-5 py-2.5 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white font-bold rounded-full transition-all flex items-center gap-2 border border-white/10 hover:border-white/40 shadow-lg text-xs uppercase tracking-widest hover:-translate-y-0.5`}>
               <IconClose /> Close
             </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up mt-8">
            <h2 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${activeTheme.gradient} mb-4 animate-pulse tracking-wide text-center max-w-2xl drop-shadow-lg leading-tight py-2`}>
              {mainLoadingText}
            </h2>
            <p className={`${activeTheme.text} text-lg font-bold tracking-widest uppercase transition-opacity duration-500`} key={loadingIndex}>
              {currentPhrases[loadingIndex % currentPhrases.length]}
            </p>
          </div>
        )}

        {/* --- THE UNIFIED READING ROOM --- */}
        {!isLoading && aiResponse && (
          <div className="flex w-full h-full gap-8 relative overflow-hidden pt-14">
            
            {/* Left Side: The Story/Text */}
            <div className="w-2/3 flex flex-col h-full border-r border-white/5 pr-8 overflow-hidden">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5 shrink-0">
                <h2 
                  className={`text-4xl font-black text-transparent line-clamp-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                  style={{ WebkitTextStroke: `1px ${activeMode === 'forge' ? '#22d3ee' : activeMode === 'multiverse' ? '#c084fc' : '#34d399'}` }}
                >
                  {displayTitle}
                </h2>
              </div>
              
              <div id="story-content" className={`flex-1 overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar} text-slate-300 prose prose-invert max-w-none text-xl leading-loose font-serif pb-12 prose-h1:hidden`}>
                {activeMode === 'vibe' && vibeMatchPct && (
                  <div className="inline-block bg-teal-500/20 border border-teal-500 text-teal-300 font-black px-4 py-1.5 rounded-full text-sm mb-6 tracking-widest shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                    {vibeMatchPct} MATCH
                  </div>
                )}
                
                {/* PDF ISOLATION WRAPPER */}
                <div id="story-text-content">
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
                
                {isAct3Loading && (
                  <div className="mt-12 mb-8 p-8 border border-cyan-500/30 bg-cyan-900/10 rounded-2xl flex flex-col items-center justify-center animate-pulse">
                    <h3 className="text-2xl font-black text-cyan-400 mb-2 font-sans drop-shadow-md">{mainLoadingText}</h3>
                    <p className="text-cyan-500 font-sans tracking-wide">{currentPhrases[loadingIndex % currentPhrases.length]}</p>
                  </div>
                )}

                {activeMode === 'forge' && forgePhase === 1 && !isAct3Loading && (
                  <div className="mt-16 mb-8 pt-8 border-t border-white/5 flex flex-col items-center justify-center animate-fade-in-up font-sans">
                    <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Choose the Protagonist's Fate:</p>
                    <div className="flex flex-wrap justify-center gap-6">
                      <button onClick={() => executeStoryForgeActThree("Option A")} className="px-10 py-4 bg-white/5 backdrop-blur-md hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-white font-black rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]">OPTION A</button>
                      <button onClick={() => executeStoryForgeActThree("Option B")} className="px-10 py-4 bg-white/5 backdrop-blur-md hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-white font-black rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]">OPTION B</button>
                      <button onClick={() => executeStoryForgeActThree("Option C")} className="px-10 py-4 bg-white/5 backdrop-blur-md hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-white font-black rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]">OPTION C</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Director's Cut Sidebar */}
            <div className="w-1/3 shrink-0 flex flex-col h-full bg-[#0a0a0f] border border-white/5 rounded-3xl p-6 relative shadow-inner overflow-hidden">
              
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Director's Cut Parameters</h3>
                <button onClick={() => {setAiResponse(''); setForgePhase(1); setCurrentSaveId(null); setVibeBackdrop(null); setMultiComplexMode(false);}} className={`w-8 h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white hover:text-white hover:border-white hover:bg-white/20 transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]`} title="Generate Another">
                  <IconRefresh />
                </button>
              </div>
              
              <div className={`flex-1 overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar} flex flex-col gap-4 pb-4`}>
                {activeMode === 'forge' && (
                  <>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-cyan-500 font-black block uppercase tracking-widest mb-2">World</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{forgeWorld}</p></div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-cyan-500 font-black block uppercase tracking-widest mb-2">Protagonist</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{forgeProtagonist}</p></div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-cyan-500 font-black block uppercase tracking-widest mb-2">Inciting Incident</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{forgeHook}</p></div>
                  </>
                )}

                {activeMode === 'multiverse' && (
                  <>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-purple-500 font-black block uppercase tracking-widest mb-2">Anchor Universe</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{multiAnchor}</p></div>
                    {multiComplexMode ? (
                       <div className="bg-[#c084fc]/10 p-4 rounded-xl border border-[#c084fc]/30 shadow-[0_0_15px_rgba(192,132,252,0.2)]"><span className="text-[10px] text-[#c084fc] font-black block uppercase tracking-widest mb-2">Mode</span><p className="text-xs text-slate-300 font-bold leading-relaxed">Deep Lore Analysis</p></div>
                    ) : (
                      <>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-purple-500 font-black block uppercase tracking-widest mb-2">Divergence</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{multiDivergence}</p></div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-purple-500 font-black block uppercase tracking-widest mb-2">Reality Path</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{multiPath} | {multiTone}</p></div>
                      </>
                    )}
                  </>
                )}

                {activeMode === 'vibe' && (
                  <>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-teal-500 font-black block uppercase tracking-widest mb-2">Format</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{format}</p></div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-teal-500 font-black block uppercase tracking-widest mb-2">Energy & Vibe</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{energy} | {atmospheres.join(", ")}</p></div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-teal-500 font-black block uppercase tracking-widest mb-2">Time Commitment</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{timeCommitment}</p></div>
                    {vibeReference && <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-teal-500 font-black block uppercase tracking-widest mb-2">Reference</span><p className="text-xs text-slate-300 font-medium leading-relaxed">{vibeReference}</p></div>}
                    {vibeMode !== 'Vibe Check' && vibePlot && <div className="bg-white/5 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-teal-500 font-black block uppercase tracking-widest mb-2">{vibeMode}</span><p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-3">{vibePlot}</p></div>}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 shrink-0 pt-4 border-t border-white/5 mt-auto">
                <button onClick={handleSaveToLibrary} className={`w-full py-4 bg-white/5 backdrop-blur-md hover:${activeTheme.buttonBg} text-white rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-[10px] border ${activeTheme.border} ${activeTheme.glow} ${activeTheme.hoverGlow}`}>
                  <IconSave /> Save to Library
                </button>
                <button onClick={handleExportPDF} className={`w-full py-4 bg-white/5 backdrop-blur-md hover:${activeTheme.buttonBg} text-white rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-[10px] border ${activeTheme.border} ${activeTheme.glow} ${activeTheme.hoverGlow}`}>
                  <IconDownload /> Export as PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN HUB LANDING (The Big Three) --- */}
        {!isLoading && !aiResponse && !activeMode && (
          <div className={`flex flex-col items-center justify-center h-full animate-fade-in-up overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar}`}>
            <div className="mb-12 text-center">
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-teal-400 mb-4 tracking-tight drop-shadow-lg">The Neural Experience</h2>
              <p className="text-slate-400 text-lg font-bold tracking-widest uppercase">Get your premium story to life.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-8">
              {/* THE STORY FORGE */}
              <button onClick={() => setActiveMode('forge')} className="group relative flex flex-col items-center justify-center text-center p-10 bg-[#0f1218] border border-cyan-500/30 rounded-[2rem] hover:border-cyan-400 transition-all duration-500 hover:-translate-y-4 shadow-[0_10px_30px_rgba(6,182,212,0.1)] hover:shadow-[0_20px_50px_rgba(6,182,212,0.4)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.15),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.25),transparent_80%)] transition-all duration-500 z-0"></div>
                <div className="text-cyan-500 mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10">
                  <IconForge />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors z-10 drop-shadow-sm">The Story Forge</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed z-10">Co-write a massive, epic story. Establish the world, protagonist, and plot twists.</p>
              </button>

              {/* MULTIVERSE ENGINE */}
              <button onClick={() => setActiveMode('multiverse')} className="group relative flex flex-col items-center justify-center text-center p-10 bg-[#0f1218] border border-purple-500/30 rounded-[2rem] hover:border-purple-400 transition-all duration-500 hover:-translate-y-4 shadow-[0_10px_30px_rgba(168,85,247,0.1)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.4)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_80%)] transition-all duration-500 z-0"></div>
                <div className="text-purple-500 mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10">
                  <IconMulti />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors z-10 drop-shadow-sm">Multiverse Engine</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed z-10">Alter a single variable in your favorite media and witness the alternate reality.</p>
              </button>

              {/* THE VIBE CHECK */}
              <button onClick={() => setActiveMode('vibe')} className="group relative flex flex-col items-center justify-center text-center p-10 bg-[#0f1218] border border-teal-500/30 rounded-[2rem] hover:border-teal-400 transition-all duration-500 hover:-translate-y-4 shadow-[0_10px_30px_rgba(20,184,166,0.1)] hover:shadow-[0_20px_50px_rgba(20,184,166,0.4)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.15),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.25),transparent_80%)] transition-all duration-500 z-0"></div>
                <div className="text-teal-500 mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(20,184,166,0.8)] z-10">
                  <IconVibe />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-teal-300 transition-colors z-10 drop-shadow-sm">The Vibe Check</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed z-10">Dial in your exact mood, energy, and time to get a premium, spoiler-free recommendation.</p>
              </button>
            </div>
          </div>
        )}

        {/* --- OPTION 1: THE STORY FORGE SETUP --- */}
        {!isLoading && !aiResponse && activeMode === 'forge' && (
          <div className="flex flex-col h-full animate-fade-in-up max-w-4xl mx-auto w-full pt-16">
            <div className="text-center mb-4 shrink-0">
              <h2 className="text-4xl font-black text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">The Story Forge</h2>
              <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest mt-4">
                <span className={`transition-colors ${forgeStep === 1 ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-slate-600"}`}>1. World</span>
                <span className="text-slate-700">→</span>
                <span className={`transition-colors ${forgeStep === 2 ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-slate-600"}`}>2. Protagonist</span>
                <span className="text-slate-700">→</span>
                <span className={`transition-colors ${forgeStep === 3 ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-slate-600"}`}>3. The Hook</span>
              </div>
            </div>

            <div className={`flex-1 flex flex-col justify-center w-full overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar} mb-4`}>
              {forgeStep === 1 && (
                <div className="animate-fade-in-up w-full">
                  <label className="text-white font-black mb-2 block text-3xl">The World</label>
                  <p className="text-cyan-500/80 text-xs tracking-wide mb-6 font-bold uppercase">Are we in a grounded, modern-day city, or a secluded location with dark secrets?</p>
                  <div className="relative">
                    <textarea value={forgeWorld} onChange={(e) => setForgeWorld(e.target.value)} placeholder="Describe the setting..." className={`w-full bg-[#0a0a0f] border ${forgeWorld.trim().length > 0 ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-white/10'} rounded-2xl p-6 pr-20 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all resize-none min-h-[120px] text-lg leading-relaxed ${hideScrollbar}`}/>
                    <button onClick={() => handleAiDice('world', setForgeWorld)} disabled={rollingDice === 'world'} className="absolute bottom-6 right-6 w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 text-cyan-400 rounded-full disabled:opacity-50 transition-all hover:scale-110 shadow-lg">
                      {rollingDice === 'world' ? <IconSpinner /> : <IconDice />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4 items-center">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mr-2">Quick Start:</span>
                    {worldIdeas.map((chip, i) => (<button key={i} onClick={() => setForgeWorld(chip)} className="px-5 py-2 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/50 rounded-full text-xs font-bold text-slate-300 hover:text-cyan-100 transition-all">{chip}</button>))}
                  </div>
                </div>
              )}
              {forgeStep === 2 && (
                <div className="animate-fade-in-up w-full">
                  <label className="text-white font-black mb-2 block text-3xl">The Protagonist</label>
                  <p className="text-cyan-500/80 text-xs tracking-wide mb-6 font-bold uppercase">Who is our lead, and what is the one fear or flaw they are running from?</p>
                  <div className="relative">
                    <textarea value={forgeProtagonist} onChange={(e) => setForgeProtagonist(e.target.value)} placeholder="Describe your main character..." className={`w-full bg-[#0a0a0f] border ${forgeProtagonist.trim().length > 0 ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-white/10'} rounded-2xl p-6 pr-20 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all resize-none min-h-[120px] text-lg leading-relaxed ${hideScrollbar}`}/>
                    <button onClick={() => handleAiDice('protagonist', setForgeProtagonist)} disabled={rollingDice === 'protagonist'} className="absolute bottom-6 right-6 w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 text-cyan-400 rounded-full disabled:opacity-50 transition-all hover:scale-110 shadow-lg">
                      {rollingDice === 'protagonist' ? <IconSpinner /> : <IconDice />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4 items-center">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mr-2">Quick Start:</span>
                    {protagonistIdeas.map((chip, i) => (<button key={i} onClick={() => setForgeProtagonist(chip)} className="px-5 py-2 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/50 rounded-full text-xs font-bold text-slate-300 hover:text-cyan-100 transition-all">{chip}</button>))}
                  </div>
                </div>
              )}
              {forgeStep === 3 && (
                <div className="animate-fade-in-up w-full">
                  <label className="text-white font-black mb-2 block text-3xl">The Hook</label>
                  <p className="text-cyan-500/80 text-xs tracking-wide mb-6 font-bold uppercase">What is the single inciting incident that ruins their normal routine today?</p>
                  <div className="relative">
                    <textarea value={forgeHook} onChange={(e) => setForgeHook(e.target.value)} placeholder="Describe the incident..." className={`w-full bg-[#0a0a0f] border ${forgeHook.trim().length > 0 ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-white/10'} rounded-2xl p-6 pr-20 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all resize-none min-h-[120px] text-lg leading-relaxed ${hideScrollbar}`}/>
                    <button onClick={() => handleAiDice('hook', setForgeHook)} disabled={rollingDice === 'hook'} className="absolute bottom-6 right-6 w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 text-cyan-400 rounded-full disabled:opacity-50 transition-all hover:scale-110 shadow-lg">
                      {rollingDice === 'hook' ? <IconSpinner /> : <IconDice />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4 items-center">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mr-2">Quick Start:</span>
                    {hookIdeas.map((chip, i) => (<button key={i} onClick={() => setForgeHook(chip)} className="px-5 py-2 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/50 rounded-full text-xs font-bold text-slate-300 hover:text-cyan-100 transition-all">{chip}</button>))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between shrink-0 w-full items-center">
              {forgeStep > 1 ? (
                <button onClick={() => setForgeStep(forgeStep - 1)} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10 shadow-sm text-sm">
                  Back to {forgeStep === 2 ? 'World' : 'Protagonist'}
                </button>
              ) : <div></div>}
              
              {forgeStep < 3 ? (
                <button 
                  onClick={() => setForgeStep(forgeStep + 1)} 
                  disabled={(forgeStep === 1 && !forgeWorld.trim()) || (forgeStep === 2 && !forgeProtagonist.trim())} 
                  className={`px-10 py-3 rounded-xl font-black transition-all duration-300 text-sm ${((forgeStep === 1 && forgeWorld.trim()) || (forgeStep === 2 && forgeProtagonist.trim())) ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] hover:-translate-y-1' : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/10'}`}
                >
                  {forgeStep === 1 ? 'Design Protagonist' : 'Design Plot'} →
                </button>
              ) : (
                <button 
                  onClick={executeStoryForgeActOne} 
                  disabled={!forgeHook.trim()} 
                  className={`px-10 py-3 rounded-xl font-black transition-all duration-300 text-sm ${forgeHook.trim() ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.8)] hover:-translate-y-1' : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/10'}`}
                >
                  <span className="flex items-center gap-2">Generate the Story <IconSparkle /></span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* OPTION 2: MULTIVERSE ENGINE SETUP */}
        {!isLoading && !aiResponse && activeMode === 'multiverse' && (
          <div className="flex flex-col h-full animate-fade-in-up">
            
            <div className="text-center shrink-0 mb-2 pt-6">
              <h2 className="text-3xl font-black text-purple-400 mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">The Multiverse Engine</h2>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-300 bg-purple-900/20 py-2 px-5 rounded-full border border-purple-500/20 inline-flex transition-all">
                <span className={currentMultiStep >= 1 ? "text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "text-slate-500"}>1. Anchor Media</span> 
                <span className="text-purple-600/50 px-2">→</span>
                <span className={currentMultiStep >= 2 ? "text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all" : "text-slate-500 transition-all"}>2. Divergence Point</span> 
                <span className="text-purple-600/50 px-2">→</span>
                <span className={currentMultiStep >= 3 ? "text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all" : "text-slate-500 transition-all"}>3. Define Reality</span> 
              </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 overflow-y-auto transform-gpu overscroll-contain p-1 pt-2 ${hideScrollbar}`}>
              
              <div className={`bg-[#0a0a0f] border rounded-[1.5rem] p-4 flex flex-col transition-all duration-500 ${multiComplexMode ? 'border-[#c084fc] shadow-[0_0_15px_rgba(192,132,252,0.4)]' : 'border-purple-500/30 shadow-inner'}`}>
                <h3 className="text-purple-400 font-black uppercase tracking-widest text-[11px] mb-1">Select Source Universe</h3>
                <p className="text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-3">Movie, Series, Book, Game</p>
                <div className="relative mb-2">
                  <div className="absolute left-3 top-2.5 text-purple-500"><IconSearch /></div>
                  <input 
                    type="text" value={multiAnchor} onChange={(e) => setMultiAnchor(e.target.value)}
                    placeholder="Search media..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Popular Anchors</span>
                  {anchorIdeas.map((chip, i) => (
                    <button key={i} onClick={() => setMultiAnchor(chip)} className="text-left text-xs font-bold text-slate-300 bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 rounded-xl py-1.5 px-3 transition-all hover:text-purple-200 shadow-sm">
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`bg-[#0a0a0f] border rounded-[1.5rem] p-4 flex flex-col transition-all duration-500 ${multiComplexMode ? 'border-[#c084fc] shadow-[0_0_15px_rgba(192,132,252,0.4)]' : 'border-purple-500/30 shadow-inner'} ${isDivergenceUnlocked ? 'opacity-100 scale-100' : 'opacity-30 pointer-events-none grayscale-[80%] scale-[0.98]'}`}>
                <h3 className="text-purple-400 font-black uppercase tracking-widest text-[11px] mb-1">Pinpoint the Moment</h3>
                <p className="text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-3">The "What If?" to reverse</p>
                <div className="relative mb-3 flex-1 min-h-[80px]">
                  <textarea 
                    value={multiDivergence} onChange={(e) => setMultiDivergence(e.target.value)}
                    disabled={multiComplexMode}
                    className={`w-full h-full bg-white/5 border border-white/10 rounded-xl p-3 pr-12 text-white text-xs font-medium focus:outline-none focus:border-purple-500 transition-colors resize-none shadow-inner ${hideScrollbar} ${multiComplexMode ? 'opacity-30 cursor-not-allowed' : ''}`}
                  />
                  <button onClick={() => handleAiDice('divergence', setMultiDivergence, multiAnchor)} disabled={rollingDice === 'divergence' || multiComplexMode} className="absolute bottom-2 right-2 text-purple-400 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 p-1.5 rounded-full disabled:opacity-50 transition-all hover:scale-110 shadow-lg">
                    {rollingDice === 'divergence' ? <IconSpinner /> : <IconDice />}
                  </button>
                </div>
                
                {/* DEEP LORE TOGGLE BUTTON */}
                <button 
                  onClick={() => setMultiComplexMode(!multiComplexMode)}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${multiComplexMode ? 'bg-[#c084fc]/20 border-[#c084fc] text-[#c084fc] shadow-[0_0_15px_rgba(192,132,252,0.4)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}
                >
                  {multiComplexMode ? 'Deep Lore Mode Active' : 'Describe the Plot & Universe'}
                </button>
                
              </div>

              <div className={`bg-[#0a0a0f] border border-purple-500/30 rounded-[1.5rem] p-4 flex flex-col shadow-inner transition-all duration-500 ${isRealityUnlocked && !multiComplexMode ? 'opacity-100 scale-100' : 'opacity-30 pointer-events-none grayscale-[80%] scale-[0.98]'}`}>
                <h3 className="text-purple-400 font-black uppercase tracking-widest text-[11px] mb-4">Define New Reality</h3>
                
                <div className="mb-4">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 block">Path Result</span>
                  <div className="flex flex-col gap-2">
                    {['Peaceful Utopia', 'Chaos & Destruction', 'A Hidden Power Rises'].map(opt => (
                      <button 
                        key={opt} onClick={() => setMultiPath(opt)}
                        disabled={multiComplexMode}
                        className={`py-2 px-2 text-[10px] font-black uppercase tracking-widest text-center rounded-xl transition-all border ${multiPath === opt ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white shadow-sm'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 block">Genre / Tone Shift</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['Action-Thriller', 'Political Intrigue', 'Psych Horror', 'Keep Original'].map(opt => (
                      <button 
                        key={opt} onClick={() => setMultiTone(opt)}
                        disabled={multiComplexMode}
                        className={`py-2 px-1 text-[9px] font-black uppercase tracking-widest text-center rounded-xl transition-all border ${multiTone === opt ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white shadow-sm'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`bg-[#0a0a0f] border-2 border-purple-500/50 rounded-[1.5rem] p-5 flex flex-col shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 ${isRealityUnlocked && !multiComplexMode ? 'opacity-100 scale-100' : 'opacity-30 pointer-events-none grayscale-[80%] scale-[0.98]'}`}>
                <h3 className="text-white font-black uppercase tracking-widest text-[11px] mb-1">Calculate Convergence</h3>
                <p className="text-purple-500 text-[9px] mb-4 font-black uppercase tracking-[0.2em]">Quantum Branch Preview</p>
                
                <div className={`flex-1 flex flex-col gap-4 text-sm text-slate-300 overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar}`}>
                  <div>
                    <span className="text-purple-400 font-black uppercase tracking-widest text-[10px] flex items-center gap-1.5 mb-2 border-b border-purple-500/20 pb-1.5">
                      <span className="text-base text-purple-600"><IconArrowDownRight /></span> Character Impact
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] font-medium leading-relaxed">
                      <li>Detail evolutionary shift of major characters.</li>
                      <li>Calculate new alliances and betrayals.</li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-purple-400 font-black uppercase tracking-widest text-[10px] flex items-center gap-1.5 mb-2 border-b border-purple-500/20 pb-1.5">
                      <span className="text-base text-purple-600"><IconArrowDownRight /></span> World Consequences
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] font-medium leading-relaxed">
                      <li>Map changes to global politics/geography.</li>
                      <li>Identify missing or altered technology.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-4 flex justify-center shrink-0">
              <button 
                onClick={executeMultiverse}
                disabled={!multiAnchor || (!multiComplexMode && !multiDivergence)}
                className="px-10 py-3 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all hover:scale-105 flex items-center gap-2"
              >
                <span className="flex items-center gap-2">Generate Deep Lore <IconSparkle /></span>
              </button>
            </div>

          </div>
        )}

        {/* OPTION 3: THE VIBE CHECK SETUP */}
        {!isLoading && !aiResponse && activeMode === 'vibe' && (
          <div className={`flex flex-col h-full animate-fade-in-up overflow-y-auto transform-gpu overscroll-contain ${hideScrollbar} max-w-4xl mx-auto w-full pt-16 pb-10`}>
            <div className="text-center mb-6 shrink-0">
              <h2 className="text-4xl font-black text-teal-400 mb-2 drop-shadow-[0_0_10px_rgba(20,184,166,0.4)]">The Vibe Check</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Set your parameters. Let the AI do the rest.</p>
            </div>

            <div className="flex-1 flex flex-col gap-6 w-full px-8">
              
              <div>
                <label className="text-slate-500 font-black mb-3 block uppercase tracking-[0.2em] text-xs text-center">What are we consuming?</label>
                <div className="flex p-1.5 bg-[#0a0a0f] shadow-inner rounded-2xl border border-white/5">
                  {['Movie', 'TV Series', 'Book', 'Video Game'].map(opt => (
                    <button key={opt} onClick={() => setFormat(opt)} className={`flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${format === opt ? 'bg-teal-500/20 border border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'text-slate-500 hover:text-white border border-transparent'}`}>{opt}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-black mb-2 block uppercase tracking-[0.2em] text-xs text-center">Reference (Optional)</label>
                <input 
                  type="text" 
                  value={vibeReference} 
                  onChange={(e) => setVibeReference(e.target.value)} 
                  placeholder="e.g., Movies like Inception, Games like Skyrim..." 
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-3 text-white text-xs font-medium focus:outline-none focus:border-teal-500 transition-colors shadow-inner text-center"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-slate-500 font-black mb-3 block uppercase tracking-[0.2em] text-xs text-center">Cognitive Energy Level</label>
                  <div className="flex flex-col gap-2 p-1.5 bg-[#0a0a0f] shadow-inner rounded-2xl border border-white/5 h-full">
                    {['Turn off my brain', 'Chill', 'Deep Focus & Theories'].map(opt => (
                      <button key={opt} onClick={() => setEnergy(opt)} className={`flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${energy === opt ? 'bg-teal-500/20 border border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'text-slate-500 hover:text-white border border-transparent'}`}>{opt}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 font-black mb-1 block uppercase tracking-[0.2em] text-xs text-center">Desired Atmosphere</label>
                  <p className="text-teal-500/70 text-[9px] uppercase tracking-widest text-center mb-3 font-black">Select up to 2</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Creeping Dread', 'Adrenaline Rush', 'Cozy Comfort', 'Mind-Bending', 'Tearjerker', 'Laugh Out Loud'].map(opt => (
                      <button key={opt} onClick={() => toggleAtmosphere(opt)} className={`py-3 px-2 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all border ${atmospheres.includes(opt) ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-[#0a0a0f] shadow-inner border-white/5 text-slate-500 hover:border-white/20 hover:text-white'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-black mb-3 block uppercase tracking-[0.2em] text-xs text-center">Time Commitment</label>
                <div className="flex p-1.5 bg-[#0a0a0f] shadow-inner rounded-2xl border border-white/5">
                  {['Quick Bite', 'Average', 'Deep Lore'].map(opt => (
                    <button key={opt} onClick={() => setTimeCommitment(opt)} className={`flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${timeCommitment === opt ? 'bg-teal-500/20 border border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'text-slate-500 hover:text-white border border-transparent'}`}>{opt}</button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a0a0f] border border-white/5 rounded-[1.5rem] p-6 shadow-inner flex flex-col gap-6">
                <div>
                  <label className="text-slate-500 font-black mb-3 block uppercase tracking-[0.2em] text-xs text-center">AI Objective</label>
                  <div className="flex p-1.5 bg-[#0a0a0f] shadow-inner rounded-2xl border border-white/5">
                    {['Vibe Check', 'Find the plot', 'Analyse the idea'].map(opt => (
                      <button key={opt} onClick={() => setVibeMode(opt)} className={`flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${vibeMode === opt ? 'bg-teal-500/20 border border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'text-slate-500 hover:text-white border border-transparent'}`}>{opt}</button>
                    ))}
                  </div>
                </div>

                <div className={`transition-all duration-300 ${vibeMode === 'Vibe Check' ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                   <label className="text-slate-500 font-black mb-2 block uppercase tracking-[0.2em] text-xs text-center">Describe the Plot/Idea</label>
                   <textarea 
                     value={vibePlot} 
                     onChange={(e) => setVibePlot(e.target.value)} 
                     placeholder={vibeMode === 'Find the plot' ? "Describe the movie you forgot (e.g., 'A guy wakes up in a maze...')" : "Pitch your unique story idea (e.g., 'A cyberpunk detective who...')" } 
                     className={`w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-4 text-white text-xs font-medium focus:outline-none focus:border-teal-500 transition-colors resize-none min-h-[100px] shadow-inner ${hideScrollbar}`} 
                     disabled={vibeMode === 'Vibe Check'}
                   />
                </div>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex justify-center shrink-0">
              <button onClick={executeVibeCheck} className="px-12 py-3 bg-teal-500 hover:bg-teal-400 text-black font-black text-sm uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:shadow-[0_0_50px_rgba(20,184,166,0.6)] transition-all hover:scale-105 flex items-center gap-3">
                <span className="flex items-center gap-2">Analyze My Vibe <IconSparkle /></span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AiTheater;
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryWheel from './components/CategoryWheel';
import FloatingCard from './components/FloatingCard';
import MoviesMenu from './components/MoviesMenu';
import BooksMenu from './components/BooksMenu';
import SeriesMenu from './components/SeriesMenu';
import MusicMenu from './components/MusicMenu';
import SavesMenu from './components/SavesMenu';
import AiTheater from './components/AiTheater';

// ---------------------------------------------------------

// ---------------------------------------------------------
import kailerLogo from './assets/Kailer-logo.png';

const floatingCardsData = [
  { id: 1, category: 'Action', quote: 'Revenge is a dish best served cold.', bgImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop', style: { left: '5%', top: '10%', zIndex: 10 }, rotationClass: '-rotate-6' },
  { id: 2, category: 'Horror', quote: 'We all go a little mad sometimes.', bgImage: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=400&auto=format&fit=crop', style: { left: '12%', top: '30%', zIndex: 12 }, rotationClass: 'rotate-6' },
  { id: 3, category: 'Dark', quote: 'I am the shadows.', bgImage: 'https://i.pinimg.com/736x/4a/e0/48/4ae0482947bff06737c802e3833094e5.jpg?q=80&w=400&auto=format&fit=crop', style: { left: '4%', top: '50%', zIndex: 11 }, rotationClass: '-rotate-3' },
  { id: 4, category: 'Fantasy', quote: 'Not all those who wander are lost.', bgImage: 'https://i.pinimg.com/originals/21/6b/ae/216bae43b9ad7fab11f5ba6e697d3122.jpg?q=80&w=400&auto=format&fit=crop', style: { right: '8%', top: '22%', zIndex: 10 }, rotationClass: 'rotate-6' },
  { id: 5, category: 'Mystery', quote: 'The world is full of obvious things.', bgImage: 'https://img.pikbest.com/backgrounds/20191124/fantasy-interstellar-starry-sky-star-river-fantasy-banner-background_2763077.jpg!w700wp?q=80&w=400&auto=format&fit=crop', style: { right: '14%', top: '42%', zIndex: 12 }, rotationClass: '-rotate-6' },
  { id: 6, category: 'Jazz', quote: 'Where words fail, music speaks.', bgImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop', style: { right: '6%', top: '62%', zIndex: 11 }, rotationClass: 'rotate-3' },
  { id: 7, category: 'K-Pop', quote: 'Shining through the city with a little funk and soul.', bgImage: 'https://dynamic.brandcrowd.com/template/preview/design/d9854590-6cc8-4459-ac96-e1aa1c5aa79f?v=4&designTemplateVersion=1&size=design-preview-wide-2x&layout=auto-1-1?q=80&w=400&auto=format&fit=crop', style: { left: '70%', bottom: '2%', transform: 'translateX(-50%)', zIndex: 5 }, rotationClass: '-rotate-2' }
];

function App() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // State to track if the image fails to load
  const [logoError, setLogoError] = useState(false);

  const [savedItems, setSavedItems] = useState(() => {
    try {
      const localData = localStorage.getItem('kailer_saves_v2');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Save memory corrupted, resetting:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('kailer_saves_v2', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleSave = (item, type, isUpdate = false) => {
    if (!item) return; 
    let id = item.id;
    if (type === 'music_itunes') id = item.trackId;
    if (type === 'music_youtube') id = item.id?.videoId;
    if (type === 'ai_generation') id = item.id;

    const exists = savedItems.find(saved => saved.id === id);

    if (isUpdate && exists) {
      setSavedItems(savedItems.map(saved => saved.id === id ? { id, type, item } : saved));
      return;
    }

    if (exists) {
      setSavedItems(savedItems.filter(saved => saved.id !== id));
    } else {
      setSavedItems([...savedItems, { id, type, item }]);
    }
  };

  const handleCategorySelect = (category) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  return (
    <div className="w-screen h-screen bg-white relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className={`absolute inset-0 transition-opacity duration-[800ms] pointer-events-none z-0 ${activeCategory ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[15%] left-[3%] w-[10vw] h-[10vw] bg-[#a88ec9] rounded-full opacity-30 blur-[40px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[45%] left-[8%] w-[6vw] h-[6vw] bg-[#9375b8] rounded-full opacity-20 blur-[30px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-[20%] right-[5%] w-[12vw] h-[12vw] bg-[#a88ec9] rounded-full opacity-30 blur-[50px] animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-[25%] right-[10%] w-[8vw] h-[8vw] bg-[#9375b8] rounded-full opacity-20 blur-[40px] animate-pulse" style={{ animationDuration: '7s' }}></div>
        
        {/* Precise corner cloud framing the AI button */}
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[400px] bg-purple-500/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
      </div>

      <Header activeCategory={activeCategory} />

      {/* Floating Posters */}
      <div className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out z-10 ${activeCategory ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {floatingCardsData.map((card) => (
          <FloatingCard 
            key={card.id} 
            category={card.category} 
            quote={card.quote} 
            bgImage={card.bgImage} 
            customStyle={card.style}
            rotationClass={card.rotationClass}
          />
        ))}
      </div>

      {/* Menu Components */}
      <MoviesMenu isActive={activeCategory === 'Movies'} savedItems={savedItems} onSave={handleSave} />
      <BooksMenu isActive={activeCategory === 'Books'} savedItems={savedItems} onSave={handleSave} />
      <SeriesMenu isActive={activeCategory === 'Series'} savedItems={savedItems} onSave={handleSave} />
      <MusicMenu isActive={activeCategory === 'Music'} savedItems={savedItems} onSave={handleSave} />
      <SavesMenu isActive={activeCategory === 'Save' || activeCategory === 'Saves'} savedItems={savedItems} onSave={handleSave} onClose={() => handleCategorySelect(null)} />

      {/* Central Hub */}
      <CategoryWheel activeCategory={activeCategory} onCategoryClick={handleCategorySelect} />

      {/* The Glassy, Glowing AI Button */}
      <div 
        className={`absolute bottom-12 left-12 z-40 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${activeCategory || isChatOpen ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}`}
      >
        <button 
          onClick={() => setIsChatOpen(true)}
          className="group relative flex items-center gap-5 bg-[#1a1d29]/60 backdrop-blur-xl px-10 py-5 w-[440px] rounded-[2rem] border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3),inset_0_0_10px_rgba(168,85,247,0.1)] transition-all duration-500 hover:scale-[1.02] hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.6),inset_0_0_20px_rgba(168,85,247,0.3)]"
        >
          {/* Rounded Rectangle Logo Container */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8a7f3e] to-[#5e5627] flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-white/10 relative">
            
            {/* 
              If the logo imports successfully AND hasn't errored out, show the image.
              Otherwise, show the glowing lavender 'K'. 
            */}
            {kailerLogo && !logoError ? (
              <img 
                src={kailerLogo} 
                alt="AI Logo" 
                className="w-full h-full object-cover" 
                onError={() => setLogoError(true)} // Triggers fallback if image breaks
              />
            ) : (
              <span className="text-3xl font-black text-[#e8d5fc] drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]">
                K
              </span>
            )}
            
          </div>
          
          <div className="flex flex-col text-left">
            <span className="text-cyan-400 font-bold tracking-[0.15em] uppercase text-[10px] mb-1 drop-shadow-sm">
              Summon the Ultimate Kailer
            </span>
            <span className="text-white text-[15px] font-black tracking-tight group-hover:text-purple-200 transition-colors drop-shadow-sm leading-tight">
              Cook another Dimension with Unique Reality
            </span>
          </div>
        </button>
      </div>

      <AiTheater isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} savedItems={savedItems} onSave={handleSave} />

    </div>
  );
}

export default App;
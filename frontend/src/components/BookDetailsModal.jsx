import React from 'react';


const getBookColor = (idString) => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'
  ];
  let hash = 0;
  for (let i = 0; i < idString.length; i++) {
    hash = idString.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const BookDetailsModal = ({ book, onClose, savedItems = [], onSave }) => {
  if (!book) return null;

  const info = book.volumeInfo;
  const coverImage = info.imageLinks?.thumbnail?.replace('http:', 'https:') || null;
  const author = info.authors ? info.authors.join(', ') : 'Unknown Author';
  const pageCount = info.pageCount ? `${info.pageCount} Pages` : 'Unknown Pages';
  const rating = info.averageRating ? `${info.averageRating} / 5` : 'No Rating';
  
  // Combine links: if preview isn't there, fall back to the general info link
  const bookLink = info.previewLink || info.infoLink;

  const isSaved = savedItems.find(saved => saved.id === book.id);
  
  // Get the unique glow color for this book
  const bookGlowColor = getBookColor(book.id);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/70 backdrop-blur-xl transition-opacity"
      onClick={onClose}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Modal Container - Soft shaded lavender */}
      <div 
        className="relative w-full max-w-5xl bg-[#ebe5f3] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row border border-white/80 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-[200] w-12 h-12 bg-white/60 backdrop-blur-md hover:bg-orange-500 hover:scale-110 border border-slate-300 hover:border-orange-400 text-slate-800 hover:text-white rounded-full flex items-center justify-center transition-all font-bold text-xl cursor-pointer shadow-sm"
        >
          ✕
        </button>
        
        {/* Left Side: Book Cover with Ambient Blurred Background */}
        <div className="w-full md:w-[45%] h-[300px] md:h-[650px] relative flex items-center justify-center p-8 shrink-0 overflow-hidden">
           
           {/* Ambient Blurred Poster Background */}
           {coverImage && (
             <div 
               className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl scale-125"
               style={{ backgroundImage: `url(${coverImage})` }}
             ></div>
           )}
           
           {/* Whitish Glass Overlay to keep it bright but muted */}
           <div className="absolute inset-0 bg-white/50 backdrop-blur-lg"></div>

           {/* The Soft Radial Glow (Kept for magical touch) */}
           <div 
              className="absolute bottom-0 left-0 w-full h-[70%] pointer-events-none opacity-50 mix-blend-multiply z-0"
              style={{
                background: `radial-gradient(circle at bottom left, ${bookGlowColor}60 0%, ${bookGlowColor}10 50%, transparent 80%)`
              }}
            />

           {/* 
             Using 'max-h-full' ensures it uses its native resolution, keeping it perfectly crisp.
           */}
           {coverImage ? (
             <img 
               src={coverImage} 
               alt={info.title} 
               className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-10 rounded-r-md transition-transform duration-700 hover:scale-105" 
             />
           ) : (
             <div className="text-slate-500 font-serif italic z-10">No Cover Available</div>
           )}
        </div>

        {/* Right Side: Details & Buttons */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center relative z-10 bg-[#ebe5f3]/80 backdrop-blur-3xl border-l border-white/60 shadow-[-20px_0_40px_rgba(0,0,0,0.02)]">
          <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-slate-800 drop-shadow-sm leading-tight">{info.title}</h2>
          <h3 className="text-xl md:text-2xl text-orange-600 font-serif italic mb-6">by {author}</h3>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 rounded-lg font-black text-sm">
              ★ {rating}
            </span>
            <span className="px-4 py-1.5 bg-white/60 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold shadow-sm">
              {pageCount}
            </span>
            <span className="px-4 py-1.5 bg-white/60 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold shadow-sm">
              {info.publishedDate?.split('-')[0] || 'Unknown Year'}
            </span>
          </div>

          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Synopsis</h3>
          
          <p className="text-slate-700 text-lg mb-8 leading-relaxed max-h-[220px] overflow-y-auto transform-gpu overscroll-contain no-scrollbar font-serif italic pr-4">
            {info.description || "No synopsis available for this book."}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-auto">
            {/* "About Book" Button with Glowing Orange Border */}
            {bookLink && (
              <a 
                href={bookLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white/30 backdrop-blur-md border border-orange-500/50 text-orange-600 font-black uppercase text-xs tracking-[0.15em] rounded-full transition-all flex items-center justify-center min-w-[140px] shadow-[0_0_15px_rgba(249,115,22,0.3),inset_0_0_10px_rgba(249,115,22,0.1)] hover:border-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.5),inset_0_0_15px_rgba(249,115,22,0.2)] hover:scale-105"
              >
                About Book
              </a>
            )}
            
            {/* Save Button */}
            <button 
              onClick={() => onSave(book, 'book')} 
              className={`px-8 py-3 font-black uppercase text-xs tracking-[0.15em] rounded-full transition-all flex items-center justify-center min-w-[140px] border ${
                isSaved 
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6),inset_0_0_10px_rgba(255,255,255,0.5)] scale-105' 
                  : 'bg-white/30 backdrop-blur-md hover:bg-amber-500/10 text-amber-600 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
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

export default BookDetailsModal;
import React, { useState, useEffect } from 'react';
import { getBooksByGenres, searchBooks } from '../services/googleBooks';
import BookDetailsModal from './BookDetailsModal'; 
import SkeletonCard from './SkeletonCard';

// Color spectrum for Genres
const getGenreColor = (index) => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', 
    '#ec4899', '#f43f5e'
  ];
  return colors[index % colors.length];
};

// Generates a consistent random color from the spectrum based on the Book's ID
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

const bookCategories = [
  'Fiction', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Science Fiction', 'History', 
  'Horror', 'Biography', 'Self-Help', 'Poetry', 'Philosophy', 'Art', 'Science', 
  'Travel', 'Religion', 'Psychology', 'Business'
];

const BooksMenu = ({ isActive, savedItems = [], onSave }) => {
  const [selectedGenres, setSelectedGenres] = useState(['Fiction']); 
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      if (isActive && selectedGenres.length > 0 && searchQuery === '') {
        setIsLoading(true); 
        const fetchedBooks = await getBooksByGenres(selectedGenres);
        setBooks(fetchedBooks);
        setIsLoading(false); 
      } else if (selectedGenres.length === 0 && searchQuery === '') {
        setBooks([]);
      }
    };
    fetchBooks();
  }, [selectedGenres, isActive, searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    
    setIsLoading(true); 
    setSelectedGenres([]); 
    const results = await searchBooks(searchQuery);
    setBooks(results);
    setIsLoading(false); 
  };

  const toggleGenre = (genre) => {
    setSearchQuery(''); 
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
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

      {/* THE SLIDING CONTENT LAYER (DOWNWARD ANIMATION) */}
      <div className={`absolute top-0 left-0 w-full h-[92%] z-40 pt-24 px-12 pb-12 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-20 pointer-events-none'}`}>

        {/* THE TIMED LOGO 'K' */}
        <h1 className={`absolute top-8 left-10 font-black text-5xl text-[#b06cf8] drop-shadow-[0_0_20px_rgba(176,108,248,0.8)] z-[100] cursor-default hover:scale-110 hover:text-[#c48ef9] hover:drop-shadow-[0_0_30px_rgba(176,108,248,1)] pointer-events-auto transition-opacity ${isActive ? 'opacity-100 duration-500 delay-[550ms]' : 'opacity-0 duration-0 delay-0'}`}>
          K
        </h1>

        {/* STATIC LAVENDER GLASS BACKGROUND */}
        <div className="absolute inset-0 z-[-1] bg-white/60 backdrop-blur-3xl overflow-hidden pointer-events-none rounded-b-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b border-white/40">
          <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-purple-300/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-orange-200/40 rounded-full blur-[140px]"></div>
          <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-indigo-200/40 rounded-full blur-[100px]"></div>
        </div>

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 pl-[120px] md:pl-0">
          <h2 className="text-4xl font-black tracking-widest text-slate-800 uppercase drop-shadow-sm ml-[120px] md:ml-0">
            Discover Books
          </h2>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-1/3 mt-4 md:mt-0 shadow-lg rounded-full relative z-20">
            <input 
              type="text" 
              placeholder="Search for a book or author..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full px-6 py-3 rounded-l-full bg-white/70 backdrop-blur-lg border border-white/50 border-r-0 focus:outline-none focus:border-orange-400 text-slate-800 placeholder-gray-500 transition-colors shadow-inner"
            />
            <button type="submit" className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-r-full hover:from-orange-400 hover:to-amber-400 shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all">
              Search
            </button>
          </form>
        </div>

        {/* Genres */}
        <div className="mb-10 relative z-10">
          <div className="flex flex-wrap gap-3">
            {bookCategories.map((category, index) => {
              const isSelected = selectedGenres.includes(category);
              const color = getGenreColor(index);
              
              return (
                <button
                  key={category}
                  onClick={() => toggleGenre(category)}
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
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Book Grid */}
        <div className="flex-1 overflow-y-auto transform-gpu overscroll-contain pr-4 no-scrollbar relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-20">
              {[...Array(12)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-20">
              {books.map((book) => {
                const info = book.volumeInfo;
                const coverImage = info.imageLinks?.thumbnail?.replace('http:', 'https:');
                const author = info.authors ? info.authors[0] : 'Unknown Author';
                
                // Fetch the unique glow color for this specific book
                const bookGlowColor = getBookColor(book.id);

                return (
                  <div 
                    key={book.id} 
                    onClick={() => setSelectedBook(book)} 
                    className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out hover:scale-105 hover:z-10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] cursor-pointer bg-[#f8f5fc] border border-white/60 flex flex-col transform-gpu"
                  >
                    {/* The Magical Bottom-Left Glow */}
                    <div 
                      className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none opacity-60 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0"
                      style={{
                        background: `radial-gradient(circle at bottom left, ${bookGlowColor}60 0%, ${bookGlowColor}10 50%, transparent 80%)`
                      }}
                    />

                    {/* Book Cover Area */}
                    <div className="w-full h-[75%] flex items-center justify-center p-4 z-10 relative">
                      {coverImage ? (
                        <img src={coverImage} alt={info.title} className="max-h-full max-w-full object-contain drop-shadow-lg rounded-sm transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="text-slate-400 text-sm text-center px-2 font-serif italic">No Cover</div>
                      )}
                    </div>
                    
                    {/* Info Area */}
                    <div className="w-full h-[25%] p-3 flex flex-col justify-start z-10 bg-white/40 backdrop-blur-sm border-t border-white/50 transition-opacity duration-300 group-hover:opacity-0">
                      <h4 className="font-black text-sm text-slate-800 line-clamp-2 leading-tight">{info.title}</h4>
                      <p className="text-xs text-slate-500 truncate font-serif italic mt-1">{author}</p>
                    </div>
                    
                    {/* Dark, smoky glassy hover overlay */}
                    <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center z-20 rounded-2xl">
                      <span className="font-black text-orange-400 mb-3 tracking-widest uppercase text-xs drop-shadow-md">View Details</span>
                      <p className="text-xs text-gray-200 line-clamp-6 leading-relaxed font-serif italic drop-shadow-sm">
                        {info.description || "No description available."}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-40 flex items-center justify-center text-slate-500 font-bold text-xl drop-shadow-sm">
              No books found. Try adjusting your search or genres!
            </div>
          )}
        </div>
      </div>

      <BookDetailsModal 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)} 
        savedItems={savedItems}
        onSave={onSave}
      />
    </>
  );
};

export default BooksMenu;
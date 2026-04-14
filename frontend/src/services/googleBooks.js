const BASE_URL = 'https://www.googleapis.com/books/v1';

// Grab the API key from your .env file
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

// We now pass an array of genres instead of just one
export const getBooksByGenres = async (genres) => {
  try {
    if (!genres || genres.length === 0) return []; // Don't search if nothing is selected

    // This creates the AND logic: "subject:Fiction+subject:Fantasy"
    const query = genres.map(g => `subject:${g}`).join('+');
    
    // API KEY ADDED HERE to the end of the URL
    const response = await fetch(`${BASE_URL}/volumes?q=${query}&maxResults=40&orderBy=relevance&key=${API_KEY}`);
    
    if (!response.ok) {
        throw new Error(`Google API rate limit or error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items || []; 
  } catch (error) {
    console.error("Error fetching books by genre:", error);
    return [];
  }
};

// --- NEW: Search Books by Text Query ---
export const searchBooks = async (query) => {
  try {
    if (!query || query.trim() === '') return [];
    
    // API KEY ADDED HERE to the end of the URL
    const response = await fetch(`${BASE_URL}/volumes?q=${encodeURIComponent(query)}&maxResults=40&orderBy=relevance&key=${API_KEY}`);
    
    if (!response.ok) {
        throw new Error(`Google API rate limit or error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items || []; 
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
};
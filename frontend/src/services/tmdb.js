// This grabs your hidden key
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// 1. Fetch the official list of genres
export const getGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres; // Returns an array of { id, name }
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

// 2. Fetch movies based on selected genres (AND logic using commas)
export const getMoviesByGenres = async (genreIds) => {
  try {
    // If genres are selected, join their IDs with a comma (TMDB uses commas for AND logic)
    const genreQuery = genreIds.length > 0 ? `&with_genres=${genreIds.join(',')}` : '';
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc${genreQuery}`);
    const data = await response.json();
    return data.results; // Returns an array of movie objects
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

// --- NEW: Search Movies by Text Query ---
export const searchMovies = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

// 3. Fetch the movie's official YouTube trailer
export const getMovieTrailer = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    
    // TMDB returns a list of videos (interviews, teasers). We only want the official YouTube Trailer.
    const trailer = data.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
    
    return trailer ? trailer.key : null; // Returns the specific YouTube video ID
  } catch (error) {
    console.error("Error fetching trailer:", error);
    return null;
  }
};

// 4. Fetch streaming providers (Where to Watch)
export const getMovieProviders = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
    const data = await response.json();
    
    // Providers change by country. Let's use 'US' as the default for now.
    // 'flatrate' is TMDB's term for streaming subscriptions (Netflix, Hulu, etc.)
    return data.results?.US || null; 
  } catch (error) {
    console.error("Error fetching providers:", error);
    return null;
  }
};

// --- TV SERIES FUNCTIONS ---

// Fetch TV Genres
export const getTvGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres; 
  } catch (error) {
    console.error("Error fetching TV genres:", error);
    return [];
  }
};

// Fetch TV Shows based on genres
export const getSeriesByGenres = async (genreIds) => {
  try {
    const genreQuery = genreIds.length > 0 ? `&with_genres=${genreIds.join(',')}` : '';
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc${genreQuery}`);
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error("Error fetching series:", error);
    return [];
  }
};

// --- NEW: Search TV Series by Text Query ---
export const searchSeries = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error("Error searching series:", error);
    return [];
  }
};

// Fetch Full TV Details (This gives us Seasons and Episodes!)
export const getTvDetails = async (seriesId) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching TV details:", error);
    return null;
  }
};

// Fetch TV Trailer
export const getTvTrailer = async (seriesId) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${seriesId}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    const trailer = data.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
    return trailer ? trailer.key : null;
  } catch (error) {
    console.error("Error fetching TV trailer:", error);
    return null;
  }
};
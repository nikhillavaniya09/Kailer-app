// --- ITUNES API (For Cropping & Downloading) ---
export const getItunesMusic = async (query) => {
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=24`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching iTunes:", error);
    return [];
  }
};

// --- YOUTUBE API (For Full Songs) ---
const YOUTUBE_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const getYoutubeMusic = async (query) => {
  try {
    // We forcefully append "official song audio" to trick YouTube into only returning music videos!
    const forcedQuery = query + ' official song audio';
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=24&q=${encodeURIComponent(forcedQuery)}&type=video&key=${YOUTUBE_KEY}`);
    const data = await response.json();
    
    if (data.error) console.error("YouTube API Error:", data.error.message);
    return data.items || [];
  } catch (error) {
    console.error("Error fetching YouTube:", error);
    return [];
  }
};
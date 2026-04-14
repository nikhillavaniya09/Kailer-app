import React from 'react';

const SkeletonCard = () => {
  return (
    // The "animate-pulse" is the Tailwind magic that makes it throb softly!
    <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-800/50 animate-pulse border border-gray-700/50 flex flex-col shadow-md">
      {/* The main image placeholder area */}
      <div className="w-full h-full bg-gray-700/30"></div>
      
      {/* The bottom text area placeholder */}
      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent flex flex-col gap-2">
        {/* Title placeholder (longer) */}
        <div className="h-4 bg-gray-600/50 rounded-full w-3/4"></div>
        {/* Subtitle placeholder (shorter) */}
        <div className="h-3 bg-gray-600/50 rounded-full w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
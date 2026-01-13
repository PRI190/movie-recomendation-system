
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MOCK_MOVIES, ALL_GENRES } from './constants';
import { Movie, UserStats, RecommendationResult } from './types';
import { calculateRecommendations } from './services/recommendationEngine';
import { AudioService } from './services/audioService';

const App: React.FC = () => {
  // State
  const [userStats, setUserStats] = useState<UserStats>({
    wishlist: [],
    watchHistory: [],
    dailyHoursPerGenre: { "Sci-Fi": 3, "Action": 1, "Drama": 0.5 }
  });
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);

  // Recognition ref
  const recognitionRef = useRef<any>(null);

  // Initialize recommendations
  useEffect(() => {
    const results = calculateRecommendations(MOCK_MOVIES, userStats);
    setRecommendations(results);
  }, [userStats]);

  // Voice Command Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        handleVoiceCommand(transcript);
      };
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log("Voice Command Received:", command);
    if (command.includes('next')) {
      setSelectedMovieIndex(prev => Math.min(prev + 1, recommendations.length - 1));
      AudioService.speak("Next movie selected");
    } else if (command.includes('previous')) {
      setSelectedMovieIndex(prev => Math.max(prev - 1, 0));
      AudioService.speak("Previous movie selected");
    } else if (command.includes('read') || command.includes('details')) {
      const m = recommendations[selectedMovieIndex].movie;
      AudioService.speak(`${m.title}. Rating ${m.rating}. Summary: ${m.description}`);
    } else if (command.includes('wishlist')) {
      const m = recommendations[selectedMovieIndex].movie;
      addToWishlist(m.id);
      AudioService.speak(`Added ${m.title} to your wishlist.`);
    } else if (command.includes('toggle mode')) {
      setIsAccessibilityMode(prev => !prev);
      AudioService.speak(`Accessibility mode ${!isAccessibilityMode ? 'on' : 'off'}`);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      AudioService.speak("Voice commands activated. You can say: next, previous, read details, or add to wishlist.");
    }
    setIsListening(!isListening);
  };

  const addToWishlist = (id: string) => {
    setUserStats(prev => ({
      ...prev,
      wishlist: prev.wishlist.includes(id) ? prev.wishlist : [...prev.wishlist, id]
    }));
  };

  const markWatched = (id: string) => {
    setUserStats(prev => ({
      ...prev,
      watchHistory: prev.watchHistory.includes(id) ? prev.watchHistory : [...prev.watchHistory, id]
    }));
  };

  const getStatusColor = (status: Movie['status']) => {
    if (isAccessibilityMode) {
      switch (status) {
        case 'favorite': return 'high-contrast-red';
        case 'watched': return 'high-contrast-black';
        default: return 'high-contrast-white';
      }
    }
    switch (status) {
      case 'favorite': return 'bg-red-600 border-red-400';
      case 'watched': return 'bg-black border-gray-700 opacity-60 grayscale';
      default: return 'bg-gray-800 border-gray-600';
    }
  };

  return (
    <div className={`transition-all duration-300 ${isAccessibilityMode ? 'bg-black' : 'bg-gray-950'} min-h-screen p-4 md:p-8`}>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className={`text-4xl font-extrabold flex items-center gap-3 ${isAccessibilityMode ? 'text-white' : 'text-blue-400'}`}>
            <i className="fas fa-eye"></i> Inclusive-Vision
          </h1>
          <p className={`${isAccessibilityMode ? 'text-white' : 'text-gray-400'} mt-2`}>
            AI-Powered Movie Recommendations for Everyone
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button 
            onClick={() => setIsAccessibilityMode(!isAccessibilityMode)}
            className={`px-6 py-2 rounded-full font-bold border-2 transition-all ${isAccessibilityMode ? 'bg-white text-black border-white' : 'bg-gray-800 text-white border-blue-500 hover:bg-blue-900'}`}
          >
            {isAccessibilityMode ? 'Switch to Standard UI' : 'Switch to High-Contrast UI'}
          </button>
          
          <button 
            onClick={toggleListening}
            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 border-2 transition-all ${isListening ? 'bg-red-500 border-red-600 animate-pulse' : 'bg-green-600 border-green-700 hover:bg-green-500'}`}
          >
            <i className={`fas ${isListening ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
            {isListening ? 'Voice Control Active' : 'Start Voice Control'}
          </button>
        </div>
      </header>

      {/* Main Grid/List View */}
      <div className={isAccessibilityMode ? "max-w-4xl mx-auto space-y-6" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
        {recommendations.map((res, index) => (
          <div 
            key={res.movie.id}
            className={`
              relative rounded-xl overflow-hidden border-4 transition-all duration-300
              ${getStatusColor(res.movie.status)}
              ${index === selectedMovieIndex && isAccessibilityMode ? 'ring-8 ring-blue-500 scale-105' : 'scale-100'}
              ${!isAccessibilityMode && 'shadow-2xl hover:scale-105'}
            `}
          >
            {/* Visual Mode Image */}
            {!isAccessibilityMode && (
              <img 
                src={res.movie.imageUrl} 
                alt={res.movie.title} 
                className="w-full h-48 object-cover"
              />
            )}

            <div className={`p-6 ${isAccessibilityMode ? 'flex flex-col gap-4' : ''}`}>
              <div className="flex justify-between items-start">
                <h2 className={`font-bold leading-tight ${isAccessibilityMode ? 'text-3xl' : 'text-xl'}`}>
                  {res.movie.title}
                </h2>
                <span className={`px-2 py-1 rounded text-sm font-bold ${isAccessibilityMode ? 'bg-yellow-400 text-black' : 'bg-blue-500'}`}>
                  {res.movie.rating}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {res.movie.genre.map(g => (
                  <span key={g} className={`text-xs uppercase font-bold px-2 py-0.5 rounded border ${isAccessibilityMode ? 'border-white bg-transparent' : 'bg-gray-700 border-gray-600'}`}>
                    {g}
                  </span>
                ))}
              </div>

              <p className={`mt-4 line-clamp-2 ${isAccessibilityMode ? 'text-xl' : 'text-sm text-gray-400'}`}>
                {res.movie.description}
              </p>

              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => addToWishlist(res.movie.id)}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all border-2 ${isAccessibilityMode ? 'bg-white text-black border-black' : 'bg-blue-600 border-blue-400 hover:bg-blue-500'}`}
                >
                  <i className="fas fa-plus mr-2"></i> Wishlist
                </button>
                <button 
                  onClick={() => markWatched(res.movie.id)}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all border-2 ${isAccessibilityMode ? 'bg-white text-black border-black' : 'bg-gray-700 border-gray-500 hover:bg-gray-600'}`}
                >
                   Watched
                </button>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-xs uppercase tracking-widest font-bold">
                <span>Status: {res.movie.status}</span>
                {res.score > 20 && <span className="text-yellow-400"><i className="fas fa-fire mr-1"></i> Hot Recommendation</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Panel / Legend */}
      <section className="mt-12 p-6 rounded-2xl bg-gray-900 border border-gray-800">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Legend & System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-red-600 rounded-full border-2 border-white"></div>
            <div>
              <p className="font-bold">Red (Favorite)</p>
              <p className="text-sm text-gray-400">Genres you watch &gt;1hr daily</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black rounded-full border-2 border-white"></div>
            <div>
              <p className="font-bold">Black (Watched)</p>
              <p className="text-sm text-gray-400">Movies already in your history</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white rounded-full border-2 border-black"></div>
            <div>
              <p className="font-bold">White (Discovery)</p>
              <p className="text-sm text-gray-400">New content to explore</p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Controls Help (Visual Only for Mode) */}
      {!isAccessibilityMode && (
        <div className="fixed bottom-6 right-6 p-4 bg-gray-800 border border-blue-500 rounded-xl shadow-2xl max-w-xs">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <i className="fas fa-keyboard text-blue-400"></i> Voice Shortcuts
          </h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>"Next" / "Previous" to navigate</li>
            <li>"Read details" for audio description</li>
            <li>"Add to wishlist" to save movie</li>
            <li>"Toggle mode" to switch high-contrast</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;

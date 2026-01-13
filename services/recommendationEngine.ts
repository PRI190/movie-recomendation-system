
import { Movie, UserStats, RecommendationResult } from '../types';

export const calculateRecommendations = (
  movies: Movie[], 
  userStats: UserStats
): RecommendationResult[] => {
  // 1. Identify Top Genres based on hours
  const favoriteGenres = Object.entries(userStats.dailyHoursPerGenre)
    .filter(([_, hours]) => hours > 1)
    .map(([genre]) => genre);

  return movies.map(movie => {
    let score = 0;
    let reason = "Recommended based on your interests.";

    // Logic: Genre Similarity
    const matchingGenres = movie.genre.filter(g => userStats.dailyHoursPerGenre[g] && userStats.dailyHoursPerGenre[g] > 0);
    score += matchingGenres.length * 10;

    // Logic: Daily Hours Multiplier (The "Weightage Multiplier")
    matchingGenres.forEach(g => {
      const hours = userStats.dailyHoursPerGenre[g] || 0;
      score += (hours * 5); // Boost based on hours spent
    });

    // Logic: Wishlist Multiplier
    if (userStats.wishlist.includes(movie.id)) {
      score *= 1.5;
      reason = "Prioritized from your Wishlist.";
    }

    // Logic: Penalize already watched
    if (userStats.watchHistory.includes(movie.id)) {
      score -= 100;
    }

    // Assign status based on the "Status Color System" rules
    let status: Movie['status'] = 'discovery';
    if (userStats.watchHistory.includes(movie.id)) {
      status = 'watched';
    } else if (movie.genre.some(g => favoriteGenres.includes(g))) {
      status = 'favorite';
    }

    return {
      movie: { ...movie, status },
      score,
      reason
    };
  })
  .sort((a, b) => b.score - a.score);
};

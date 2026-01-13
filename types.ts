
export interface Movie {
  id: string;
  title: string;
  genre: string[];
  description: string;
  rating: number;
  year: number;
  imageUrl: string;
  status: 'favorite' | 'watched' | 'discovery';
}

export interface UserStats {
  wishlist: string[];
  watchHistory: string[];
  dailyHoursPerGenre: Record<string, number>;
}

export interface RecommendationResult {
  movie: Movie;
  score: number;
  reason: string;
}


import { Movie } from './types';

export const ALL_GENRES = ["Sci-Fi", "Action", "Drama", "Comedy", "Thriller", "Horror", "Documentary"];

export const MOCK_MOVIES: Movie[] = [
  { id: '1', title: 'Interstellar', genre: ['Sci-Fi', 'Drama'], description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', rating: 8.7, year: 2014, imageUrl: 'https://picsum.photos/seed/inter/400/600', status: 'discovery' },
  { id: '2', title: 'The Dark Knight', genre: ['Action', 'Thriller'], description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.', rating: 9.0, year: 2008, imageUrl: 'https://picsum.photos/seed/batman/400/600', status: 'discovery' },
  { id: '3', title: 'Inception', genre: ['Sci-Fi', 'Action'], description: 'A thief who steals corporate secrets through the use of dream-sharing technology.', rating: 8.8, year: 2010, imageUrl: 'https://picsum.photos/seed/inception/400/600', status: 'discovery' },
  { id: '4', title: 'Pulp Fiction', genre: ['Thriller', 'Crime'], description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.', rating: 8.9, year: 1994, imageUrl: 'https://picsum.photos/seed/pulp/400/600', status: 'discovery' },
  { id: '5', title: 'The Martian', genre: ['Sci-Fi', 'Drama'], description: 'An astronaut becomes stranded on Mars after his team assume him dead.', rating: 8.0, year: 2015, imageUrl: 'https://picsum.photos/seed/martian/400/600', status: 'discovery' },
  { id: '6', title: 'Parasite', genre: ['Drama', 'Thriller'], description: 'Greed and class discrimination threaten the newly formed symbiotic relationship.', rating: 8.5, year: 2019, imageUrl: 'https://picsum.photos/seed/parasite/400/600', status: 'discovery' },
  { id: '7', title: 'The Social Network', genre: ['Drama', 'Biography'], description: 'As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook.', rating: 7.8, year: 2010, imageUrl: 'https://picsum.photos/seed/social/400/600', status: 'discovery' },
  { id: '8', title: 'Blade Runner 2049', genre: ['Sci-Fi', 'Action'], description: 'A young Blade Runner\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.', rating: 8.0, year: 2017, imageUrl: 'https://picsum.photos/seed/blade/400/600', status: 'discovery' }
];

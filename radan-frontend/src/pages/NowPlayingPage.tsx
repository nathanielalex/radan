import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGenres, type GenreResponse } from "@/services/genreService";
import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { getMoviesPlaying, type Movie } from "@/services/movieService";
import { Link } from "react-router";

// const allMovies: Movie[] = [
//   {
//     id: 1,
//     title: "Cosmic Odyssey",
//     genre: "Sci-Fi",
//     duration: "2h 30m",
//     rating: 8.8,
//     imageUrl: "https://placehold.co/500x750/1a202c/ffffff?text=Cosmic+Odyssey",
//   },
//   {
//     id: 2,
//     title: "Echoes of the Past",
//     genre: "Drama",
//     duration: "2h 15m",
//     rating: 8.2,
//     imageUrl:
//       "https://placehold.co/500x750/2d3748/ffffff?text=Echoes+of+the+Past",
//   },
//   {
//     id: 3,
//     title: "The Last Stand",
//     genre: "Action",
//     duration: "2h 5m",
//     rating: 7.9,
//     imageUrl: "https://placehold.co/500x750/4a5568/ffffff?text=The+Last+Stand",
//   },
//   {
//     id: 4,
//     title: "Midnight Laughter",
//     genre: "Comedy",
//     duration: "1h 45m",
//     rating: 7.5,
//     imageUrl:
//       "https://placehold.co/500x750/718096/ffffff?text=Midnight+Laughter",
//   },
//   {
//     id: 5,
//     title: "Realm of Shadows",
//     genre: "Fantasy",
//     duration: "2h 40m",
//     rating: 9.1,
//     imageUrl:
//       "https://placehold.co/500x750/1a202c/ffffff?text=Realm+of+Shadows",
//   },
//   {
//     id: 6,
//     title: "Silicon Dreams",
//     genre: "Sci-Fi",
//     duration: "2h 10m",
//     rating: 8.5,
//     imageUrl: "https://placehold.co/500x750/2d3748/ffffff?text=Silicon+Dreams",
//   },
//   {
//     id: 7,
//     title: "The Forgotten City",
//     genre: "Adventure",
//     duration: "2h 25m",
//     rating: 8.1,
//     imageUrl:
//       "https://placehold.co/500x750/4a5568/ffffff?text=The+Forgotten+City",
//   },
//   {
//     id: 8,
//     title: "Just One More Joke",
//     genre: "Comedy",
//     duration: "1h 35m",
//     rating: 6.9,
//     imageUrl: "https://placehold.co/500x750/718096/ffffff?text=Just+One+More",
//   },
//   {
//     id: 9,
//     title: "Ocean's Heist",
//     genre: "Action",
//     duration: "2h 00m",
//     rating: 7.8,
//     imageUrl: "https://placehold.co/500x750/1a202c/ffffff?text=Ocean's+Heist",
//   },
//   {
//     id: 10,
//     title: "A Poet's Heart",
//     genre: "Drama",
//     duration: "2h 5m",
//     rating: 8.4,
//     imageUrl: "https://placehold.co/500x750/2d3748/ffffff?text=A+Poet's+Heart",
//   },
//   {
//     id: 11,
//     title: "Galaxy Racers",
//     genre: "Sci-Fi",
//     duration: "1h 55m",
//     rating: 7.2,
//     imageUrl: "https://placehold.co/500x750/4a5568/ffffff?text=Galaxy+Racers",
//   },
//   {
//     id: 12,
//     title: "The Cursed Labyrinth",
//     genre: "Fantasy",
//     duration: "2h 20m",
//     rating: 8.0,
//     imageUrl:
//       "https://placehold.co/500x750/718096/ffffff?text=Cursed+Labyrinth",
//   },
// ];

// const genres = [
//   "All Genres",
//   "Action",
//   "Adventure",
//   "Comedy",
//   "Drama",
//   "Fantasy",
//   "Sci-Fi",
// ];

const MovieCard = ({ movie }: { movie: Movie }) => (
  <Card className="w-full overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex flex-col">
    <CardContent className="p-0 flex-grow">
      <div className="aspect-[4/5] w-full relative">
        <img
          src={`${import.meta.env.VITE_IMAGE_URL}/${movie.posterUrl}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {movie.genres.map((genre) => genre.name).join(", ")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{movie.duration}m</p>
      </div>
    </CardContent>
    <CardFooter>
      <Link to={`/movies/${movie.id}`} className="w-full">
        <Button className="w-full">Book Seats</Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function NowPlayingPage() {
  const [selectedGenre, setSelectedGenre] = useState("All Genres");

  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<GenreResponse[]>([]);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [genreData, movieData] = await Promise.all([
          getGenres(),
          getMoviesPlaying(),
        ]);
        setGenres(genreData);
        setMovies(movieData);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMsg =
            error.response?.data?.message || "Failed to fetch data.";
          setError(errorMsg);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMovies = useMemo(() => {
    if (selectedGenre === "All Genres") return movies;

    return movies.filter((movie) =>
      movie.genres.some((genre) => genre.name === selectedGenre)
    );
  }, [selectedGenre, movies]);

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="py-12 md:py-16 px-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Now Playing
        </h1>
        <p className="text-lg text-muted-foreground">
          Find the best movies currently in theaters.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Genre</label>
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all-genres" value="All Genres">
                All Genres
              </SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.name}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteMovie, getAllMovies, type Movie } from "@/services/movieService";
import axios from "axios";
import { FilePenLine, PlusCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Interstellar",
    duration: 169,
    posterUrl: "https://example.com/posters/interstellar.jpg",
    genres: [
      { id: 1, name: "Sci-Fi" },
      { id: 2, name: "Drama" },
      { id: 3, name: "Adventure" },
    ],
  },
  {
    id: 2,
    title: "The Dark Knight",
    duration: 152,
    posterUrl: "https://example.com/posters/dark-knight.jpg",
    genres: [
      { id: 4, name: "Action" },
      { id: 5, name: "Crime" },
      { id: 2, name: "Drama" },
    ],
  },
  {
    id: 3,
    title: "Inception",
    duration: 148,
    posterUrl: "https://example.com/posters/inception.jpg",
    genres: [
      { id: 1, name: "Sci-Fi" },
      { id: 6, name: "Thriller" },
      { id: 4, name: "Action" },
    ],
  },
  {
    id: 4,
    title: "La La Land",
    duration: 128,
    posterUrl: "https://example.com/posters/lalaland.jpg",
    genres: [
      { id: 7, name: "Romance" },
      { id: 8, name: "Musical" },
      { id: 2, name: "Drama" },
    ],
  },
  {
    id: 5,
    title: "The Grand Budapest Hotel",
    duration: 99,
    posterUrl: "https://example.com/posters/grand-budapest.jpg",
    genres: [
      { id: 9, name: "Comedy" },
      { id: 10, name: "Mystery" },
      { id: 11, name: "Crime" },
    ],
  },
];


export default function DashboardMovies() {
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingMovieId, setDeletingMovieId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const movieData = await getAllMovies();
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

  const handleDelete = async (movieId: number) => {
    try {
      await deleteMovie(movieId);
      toast("Movie deleted successfully");
      setDeletingMovieId(null); // Close popover
      setTimeout(() => {
        window.location.reload();
      }, 1500); // 1.5 seconds delay
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Failed to delete movie.";
        toast(errorMsg);
      } else if (error instanceof Error) {
        toast(error.message);
      } else {
        console.error(error);
      }
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Movies</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/dashboard/movies/add">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Movie
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.id}</TableCell>
                  <TableCell className="font-medium">{m.title}</TableCell>
                  <TableCell>
                    {m.genres.map((genre) => genre.name).join(", ")}
                  </TableCell>
                  <TableCell>{m.duration}m</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FilePenLine className="h-4 w-4" />
                    </Button>
                    <Popover
                      open={deletingMovieId === m.id}
                      onOpenChange={(open) =>
                        setDeletingMovieId(open ? m.id : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          aria-label={`Delete ${m.title}`}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-3">
                        <p className="mb-2 text-sm">
                          Are you sure you want to delete this movie?
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingMovieId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(m.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

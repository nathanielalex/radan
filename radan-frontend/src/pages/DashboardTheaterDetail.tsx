import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMoviesWithoutScheduleForTheater, type Movie } from "@/services/movieService";
import { getSchedulesByTheater, type MovieTheaterSchedule } from "@/services/movieTheaterScheduleService";
import {
  getTheaterDetail,
  type TheaterDetailResponse,
} from "@/services/theaterService";
import axios from "axios";
import { PlusCircle, ArrowLeft, FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";

const mockMovieTheaterSchedule: MovieTheaterSchedule[] = [
  {
    movieId: 1,
    movieTitle: "Inception",
    theaterId: 101,
    releaseDate: "2025-09-01",
    endDate: "2025-09-30",
  },
  {
    movieId: 2,
    movieTitle: "The Matrix",
    theaterId: 102,
    releaseDate: "2025-09-05",
    endDate: "2025-09-25",
  },
  {
    movieId: 3,
    movieTitle: "Interstellar",
    theaterId: 103,
    releaseDate: "2025-08-28",
    endDate: "2025-09-20",
  },
  {
    movieId: 4,
    movieTitle: "Oppenheimer",
    theaterId: 101,
    releaseDate: "2025-09-10",
    endDate: "2025-10-01",
  },
  {
    movieId: 5,
    movieTitle: "The Dark Knight",
    theaterId: 104,
    releaseDate: "2025-09-03",
    endDate: "2025-09-17",
  },
];

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    duration: 148,
    posterUrl: "https://example.com/posters/inception.jpg",
    genres: [
      { id: 1, name: "Sci-Fi" },
      { id: 2, name: "Thriller" },
    ],
  },
  {
    id: 2,
    title: "The Matrix",
    duration: 136,
    posterUrl: "https://example.com/posters/matrix.jpg",
    genres: [
      { id: 1, name: "Sci-Fi" },
      { id: 3, name: "Action" },
    ],
  },
  {
    id: 3,
    title: "Interstellar",
    duration: 169,
    posterUrl: "https://example.com/posters/interstellar.jpg",
    genres: [
      { id: 1, name: "Sci-Fi" },
      { id: 4, name: "Drama" },
    ],
  },
  {
    id: 4,
    title: "The Dark Knight",
    duration: 152,
    posterUrl: "https://example.com/posters/dark-knight.jpg",
    genres: [
      { id: 3, name: "Action" },
      { id: 5, name: "Crime" },
    ],
  },
  {
    id: 5,
    title: "Oppenheimer",
    duration: 180,
    posterUrl: "https://example.com/posters/oppenheimer.jpg",
    genres: [
      { id: 4, name: "Drama" },
      { id: 6, name: "Biography" },
    ],
  },
];

const mockTheaterDetail: TheaterDetailResponse = {
  id: 101,
  name: "Galaxy Cinema Central",
  location: "Downtown, Metro City",
  studioTypeDetailDTOs: [
    {
      studioTypeName: "Standard",
      studioNames: ["Studio 1", "Studio 2", "Studio 3"],
      price: 50000,
      holidayPrice: 65000,
    },
    {
      studioTypeName: "IMAX",
      studioNames: ["Studio IMAX A"],
      price: 75000,
      holidayPrice: 95000,
    },
    {
      studioTypeName: "4DX",
      studioNames: ["Studio 4DX B"],
      price: 85000,
      holidayPrice: 105000,
    },
    {
      studioTypeName: "VIP",
      studioNames: ["Studio VIP Lounge"],
      price: 100000,
      holidayPrice: 130000,
    },
  ],
};

export default function DashboardTheaterDetail() {
  const { theaterId } = useParams();
  const [theater, setTheater] =
    useState<TheaterDetailResponse>(mockTheaterDetail);
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [schedules, setSchedules] = useState<MovieTheaterSchedule[]>(
    mockMovieTheaterSchedule
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!theaterId) {
          return;
        }

        const [theaterData, movieData, scheduleData] = await Promise.all([
          getTheaterDetail(Number(theaterId)),
          getMoviesWithoutScheduleForTheater(Number(theaterId)),
          getSchedulesByTheater(Number(theaterId)),
        ]);

        setTheater(theaterData);
        setMovies(movieData);
        setSchedules(scheduleData);
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
  }, [theaterId]);

  // Logic to find movies that are available to be played but aren't currently
  // const nowPlayingMovieIds = new Set(nowPlayingMovies.map((m) => m.id));
  // const availableMovies = allMovies.filter(
  //   (m) => !nowPlayingMovieIds.has(m.id)
  // );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/theaters">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{theater.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {theater.location}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Movies</CardTitle>
          <CardDescription>
            Add movies from the database to this theater's playlist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Genre</TableHead>
                <TableHead className="hidden sm:table-cell">Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {movie.genres.map((genre) => genre.name).join(", ")}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {movie.duration} min
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to={`/dashboard/theaters/${theaterId}/add/${movie.id}`}
                    >
                      <Button variant="outline" size="sm" className="gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        Add to Theater
                      </Button>
                    </Link>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive-foreground"
                      aria-label="Remove Movie"
                    >
                      <Trash className="h-4 w-4" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
              {movies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    All available movies are already playing.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theater's Playlist</CardTitle>
          <CardDescription>Movies in this theater's playlist.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">
                  Release Date
                </TableHead>
                <TableHead className="hidden sm:table-cell">End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((movie) => (
                <TableRow key={movie.movieId}>
                  <TableCell className="font-medium">
                    {movie.movieTitle}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {movie.releaseDate}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {movie.endDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive-foreground"
                      aria-label="Remove Movie"
                    >
                      <FilePenLine className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {schedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No movies are currently playing.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Theater Details</CardTitle>
          <Button
            className="btn btn-sm btn-outline"
            onClick={() => {
              /* handle edit click */
            }}
          >
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Studio Type</TableHead>
                <TableHead>Studios</TableHead>
                <TableHead>Price (Weekday)</TableHead>
                <TableHead>Price (Weekend)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {theater.studioTypeDetailDTOs.map((type) => (
                <TableRow key={type.studioTypeName}>
                  <TableCell className="font-medium">
                    {type.studioTypeName}
                  </TableCell>
                  <TableCell>{type.studioNames.join(", ")}</TableCell>
                  <TableCell>{formatCurrency(type.price)}</TableCell>
                  <TableCell>{formatCurrency(type.holidayPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

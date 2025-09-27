import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { useEffect, useState } from "react";
import axios from "axios";
import { getMoviesPlaying, type Movie } from "@/services/movieService";

type HeroSectionProps = {
  nowPlayingMovies: Movie[];
};

const HeroSection = ({ nowPlayingMovies }: HeroSectionProps) => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-36">
      <div className="px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Ultimate Movie Experience Awaits
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Discover the latest blockbusters, find showtimes, and book your
                seats in advance. All in one place.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="px-8 py-6 text-base">Book Now</Button>
              <Button variant="outline" className="px-8 py-6 text-base">
                View Theaters
              </Button>
            </div>
          </div>

          {/* Carousel replacing the static image */}
          <div className="mx-auto w-full max-w-md rounded-xl border bg-background p-4 shadow-lg">
            <Carousel
              plugins={[Autoplay({ delay: 2000 })]}
              opts={{ loop: true }}
            >
              <CarouselContent>
                {nowPlayingMovies.map((movie) => (
                  <CarouselItem key={movie.id} className="basis-full">
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        src={`${import.meta.env.VITE_IMAGE_URL}/${
                          movie.posterUrl
                        }`}
                        alt={movie.title}
                        className="rounded-lg object-cover shadow-md"
                      />
                      <h3 className="text-lg font-semibold">{movie.title}</h3>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

const MovieCard = ({ movie }: { movie: Movie }) => (
  <Card className="w-full overflow-hidden transition-transform duration-300 ease-in-out">
    <CardContent className="p-0">
      <div className="aspect-[2/3] w-full">
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
        <p className="text-xs text-muted-foreground mt-1">{movie.duration}</p>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Book Seats</Button>
    </CardFooter>
  </Card>
);

type NowPlayingSectionProps = {
  nowPlayingMovies: Movie[];
};

const NowPlayingSection = ({ nowPlayingMovies }: NowPlayingSectionProps) => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Now Playing in Theaters
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Check out the latest movies hitting the big screen this week.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="gap-6">
              {nowPlayingMovies.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="flex-[0_0_calc(33.333%_-_1rem)]" // 3 items visible with gap accounted
                >
                  <MovieCard movie={movie} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
              &#8592;
            </CarouselPrevious>
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
              &#8594;
            </CarouselNext>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const movieData = await getMoviesPlaying();
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

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="">
      <HeroSection nowPlayingMovies={movies} />
      <NowPlayingSection nowPlayingMovies={movies}/>
    </div>
  );
}

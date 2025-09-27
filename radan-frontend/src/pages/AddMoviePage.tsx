import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { getCasts } from "@/services/castService";
import { getGenres } from "@/services/genreService";
import {
  createMovie,
  type Cast,
  type CreateMoviePayload,
  type Genre,
} from "@/services/movieService";
import { navigateTo } from "@/utils/navigation";
import axios from "axios";
import { ChevronLeft, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LoadingPage } from "./LoadingPage";
import { Link } from "react-router";
import { ErrorPage } from "./ErrorPage";

// const genres: Genre[] = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Adventure" },
//   { id: 3, name: "Comedy" },
//   { id: 4, name: "Drama" },
//   { id: 5, name: "Horror" },
//   { id: 6, name: "Romance" },
//   { id: 7, name: "Science Fiction" },
//   { id: 8, name: "Fantasy" },
//   { id: 9, name: "Thriller" },
//   { id: 10, name: "Animation" },
// ];

// const casts: Cast[] = [
//   { id: 1, name: "Leonardo DiCaprio" },
//   { id: 2, name: "Scarlett Johansson" },
//   { id: 3, name: "Tom Hanks" },
//   { id: 4, name: "Natalie Portman" },
//   { id: 5, name: "Robert Downey Jr." },
//   { id: 6, name: "Emma Stone" },
//   { id: 7, name: "Denzel Washington" },
//   { id: 8, name: "Margot Robbie" },
//   { id: 9, name: "Christian Bale" },
//   { id: 10, name: "Jennifer Lawrence" },
// ];

export default function AddMoviePage() {
  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    duration: "",
    director: "",
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedCasts, setSelectedCasts] = useState<Cast[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [genreData, castData] = await Promise.all([
          getGenres(),
          getCasts(),
        ]);

        setGenres(genreData);
        setCasts(castData);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPosterFile(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //add more validation
    if (!posterFile) {
      toast("Please upload a poster image.");
      return;
    }

    const payload: CreateMoviePayload = {
      title: formData.title,
      duration: formData.duration,
      synopsis: formData.synopsis,
      director: formData.director,
      genreIds: selectedGenres.map((genre) => genre.id.toString()),
      castIds: selectedCasts.map((cast) => cast.id.toString()),
      posterImage: posterFile,
    };

    try {
      const response = await createMovie(payload);
      console.log(response);
      toast("Movie created successfully");
      setTimeout(() => {
        navigateTo("/dashboard/movies");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Failed to create movie.";
        toast(errorMsg);
      } else if (error instanceof Error) {
        toast(error.message);
      } else {
        console.error(error);
      }
    }
  };

  if (loading) return <LoadingPage />;
  // if (error) return <ErrorPage />;

  const previewUrl = posterFile
    ? URL.createObjectURL(posterFile)
    : "https://placehold.co/500x750/334155/ffffff?text=Poster";

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col p-4 md:p-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/movies">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Add New Movie
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button type="submit" size="sm">
                Save Movie
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Poster Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <img
                    src={previewUrl}
                    alt="Poster"
                    className="aspect-[2/3] w-full rounded-lg object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="col-span-3"
                      onClick={handleButtonClick}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Upload
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Movie Details</CardTitle>
                <CardDescription>
                  Fill in the details for the new movie.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g. Cosmic Odyssey"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-3 mt-4">
                  <Label htmlFor="synopsis">Synopsis</Label>
                  <Textarea
                    id="synopsis"
                    placeholder="A brief summary of the movie..."
                    value={formData.synopsis}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="grid gap-3">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="e.g. 150"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="director">Director</Label>
                    <Input
                      id="director"
                      type="text"
                      placeholder="e.g. Aria Vance"
                      value={formData.director}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid gap-3 mt-4">
                  <Label htmlFor="genres">Genres</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {selectedGenres.length > 0
                          ? selectedGenres.map((genre) => genre.name).join(", ")
                          : "Select genres"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search genres..." />
                        <CommandList>
                          {genres.map((genre) => (
                            <CommandItem
                              key={genre.id}
                              value={genre.name}
                              onSelect={() => {
                                setSelectedGenres((prev) =>
                                  prev.some((g) => g.id === genre.id)
                                    ? prev.filter((g) => g.id !== genre.id)
                                    : [...prev, genre]
                                );
                              }}
                            >
                              <span>{genre.name}</span>
                              {selectedGenres.some(
                                (g) => g.id === genre.id
                              ) && <X className="ml-auto h-4 w-4 opacity-50" />}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {selectedGenres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedGenres.map((genre) => (
                        <Badge
                          key={genre.id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {genre.name}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedGenres((prev) =>
                                prev.filter((g) => g.id !== genre.id)
                              )
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid gap-3 mt-4">
                  <Label htmlFor="casts">Casts</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {selectedCasts.length > 0
                          ? selectedCasts.map((cast) => cast.name).join(", ")
                          : "Select casts"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search casts..." />
                        <CommandList>
                          {casts.map((cast) => (
                            <CommandItem
                              key={cast.id}
                              value={cast.name}
                              onSelect={() => {
                                setSelectedCasts((prev) =>
                                  prev.some((c) => c.id === cast.id)
                                    ? prev.filter((c) => c.id !== cast.id)
                                    : [...prev, cast]
                                );
                              }}
                            >
                              <span>{cast.name}</span>
                              {selectedCasts.some((c) => c.id === cast.id) && (
                                <X className="ml-auto h-4 w-4 opacity-50" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {selectedCasts.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCasts.map((cast) => (
                        <Badge
                          key={cast.id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {cast.name}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCasts((prev) =>
                                prev.filter((c) => c.id !== cast.id)
                              )
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button type="submit" size="sm">
            Save Movie
          </Button>
        </div>
      </form>
    </main>
  );
}

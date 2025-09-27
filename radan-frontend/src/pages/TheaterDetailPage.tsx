import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Clock } from "lucide-react";
import { useParams } from "react-router";

interface TheaterBranch {
  id: string;
  name: string;
  location: string;
  auditoriums: number;
  city: string;
  studioTypes: string[];
}

const mockTheaters: TheaterBranch[] = [
  {
    id: "TH001",
    name: "Cinema XXI AEON Mall",
    location: "AEON Mall BSD City",
    auditoriums: 8,
    city: "South Tangerang",
    studioTypes: ["Regular", "Premium", "IMAX"],
  },
  {
    id: "TH002",
    name: "CGV Teras Kota",
    location: "Teras Kota, BSD",
    auditoriums: 6,
    city: "South Tangerang",
    studioTypes: ["Regular", "4DX", "Velvet"],
  },
  {
    id: "TH003",
    name: "Cinepolis Living World",
    location: "Living World, Alam Sutera",
    auditoriums: 10,
    city: "South Tangerang",
    studioTypes: ["Regular", "VIP"],
  },
  {
    id: "TH004",
    name: "Cinema XXI Gandaria City",
    location: "Gandaria City Mall",
    auditoriums: 8,
    city: "Jakarta",
    studioTypes: ["Regular", "The Premiere"],
  },
  {
    id: "TH005",
    name: "CGV Grand Indonesia",
    location: "Grand Indonesia",
    auditoriums: 11,
    city: "Jakarta",
    studioTypes: ["Regular", "Starium", "SphereX"],
  },
  {
    id: "TH006",
    name: "Cinepolis Paris Van Java",
    location: "Paris Van Java Mall",
    auditoriums: 9,
    city: "Bandung",
    studioTypes: ["Regular", "Macro XE"],
  },
];

const todaySchedule: {
  theaterId: string;
  movies: { movieId: number; showtimes: string[] }[];
}[] = [
  {
    theaterId: "TH001",
    movies: [
      { movieId: 1, showtimes: ["12:30", "15:30", "18:30", "21:30"] },
      { movieId: 2, showtimes: ["13:00", "16:00", "19:00", "22:00"] },
      { movieId: 5, showtimes: ["14:00", "17:00", "20:00"] },
    ],
  },
  {
    theaterId: "TH002",
    movies: [{ movieId: 3, showtimes: ["12:15", "15:00", "17:45", "20:30"] }],
  },
  {
    theaterId: "TH003",
    movies: [
      { movieId: 1, showtimes: ["12:00", "15:00", "18:00", "21:00"] },
      { movieId: 3, showtimes: ["13:30", "16:30", "19:30"] },
    ],
  },
  {
    theaterId: "TH004",
    movies: [
      { movieId: 2, showtimes: ["12:45", "15:45", "18:45", "21:45"] },
      { movieId: 5, showtimes: ["13:15", "16:15", "19:15"] },
    ],
  },
];

interface MovieDetails {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  synopsis: string;
  director: string;
  cast: string[];
  posterUrl: string;
  bannerUrl: string;
  status?: "Now Playing" | "Coming Soon";
}

const mockMovies: MovieDetails[] = [
  {
    id: 1,
    title: "Cosmic Odyssey",
    genre: "Sci-Fi",
    duration: "150 min",
    rating: 8.8,
    status: "Now Playing",
    synopsis: "A thrilling journey across galaxies.",
    director: "Aria Vance",
    cast: ["Leo Caspian"],
    posterUrl: "https://placehold.co/500x750/1a202c/ffffff?text=Cosmic+Odyssey",
    bannerUrl: "",
  },
  {
    id: 2,
    title: "Midnight Heist",
    genre: "Thriller",
    duration: "115 min",
    rating: 8.2,
    status: "Now Playing",
    synopsis: "A crew of thieves attempts the impossible.",
    director: "Jax Teller",
    cast: ["Nina Petrova"],
    posterUrl: "https://placehold.co/500x750/1a202c/ffffff?text=Midnight+Heist",
    bannerUrl: "",
  },
  {
    id: 3,
    title: "Echoes of the Past",
    genre: "Drama",
    duration: "130 min",
    rating: 9.1,
    status: "Now Playing",
    synopsis: "A historian uncovers a dark secret.",
    director: "Lena Romanoff",
    cast: ["Ivan Dragov"],
    posterUrl: "https://placehold.co/500x750/1a202c/ffffff?text=Echoes+of+Past",
    bannerUrl: "",
  },
  {
    id: 4,
    title: "Galactic Frontiers",
    genre: "Sci-Fi",
    duration: "165 min",
    rating: 0,
    status: "Coming Soon",
    synopsis: "",
    director: "",
    cast: [],
    posterUrl: "",
    bannerUrl: "",
  },
  {
    id: 5,
    title: "The Last Stand",
    genre: "Action",
    duration: "125 min",
    rating: 7.9,
    status: "Now Playing",
    synopsis: "One man against an army.",
    director: "Marcus Cole",
    cast: ["Rico Vega"],
    posterUrl: "https://placehold.co/500x750/1a202c/ffffff?text=The+Last+Stand",
    bannerUrl: "",
  },
];

const studioPricing: {
  [key: string]: { name: string; price: number; holidayPrice: number };
} = {
  Regular: { name: "Regular", price: 50000, holidayPrice: 65000 },
  Premium: { name: "Premium", price: 75000, holidayPrice: 90000 },
  IMAX: { name: "IMAX", price: 90000, holidayPrice: 110000 },
  "4DX": { name: "4DX", price: 100000, holidayPrice: 125000 },
  Velvet: { name: "Velvet", price: 150000, holidayPrice: 180000 },
  VIP: { name: "VIP", price: 80000, holidayPrice: 100000 },
  "The Premiere": { name: "The Premiere", price: 120000, holidayPrice: 150000 },
  Starium: { name: "Starium", price: 85000, holidayPrice: 105000 },
  SphereX: { name: "SphereX", price: 95000, holidayPrice: 115000 },
  "Macro XE": { name: "Macro XE", price: 70000, holidayPrice: 85000 },
};

export default function TheaterDetailPage() {
  const {theaterId} = useParams();
  const theater = mockTheaters.find((t) => t.id === theaterId);
  const schedule = todaySchedule.find((s) => s.theaterId === theaterId);
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  if (!theater) {
    return (
      <div className="container py-8">
        Theater not found.
      </div>
    );
  }

  const moviesPlaying = schedule
    ? schedule.movies
        .map((movieSchedule) => {
          const movieDetails = mockMovies.find(
            (m) => m.id === movieSchedule.movieId
          );
          return { ...movieDetails, showtimes: movieSchedule.showtimes };
        })
        .filter((m) => m.id)
    : [];

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Theaters List
        </Button>
        <h1 className="text-4xl font-bold tracking-tight">{theater.name}</h1>
        <p className="text-lg text-muted-foreground">{theater.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Studio Pricing</CardTitle>
              <CardDescription>Ticket prices for today.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Studio</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Holiday</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {theater.studioTypes.map((type) => {
                    const pricing = studioPricing[type];
                    return pricing ? (
                      <TableRow key={type}>
                        <TableCell className="font-medium">
                          {pricing.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(pricing.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(pricing.holidayPrice)}
                        </TableCell>
                      </TableRow>
                    ) : null;
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Now Playing Today</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {moviesPlaying.length > 0 ? (
              moviesPlaying.map((movie) => (
                <Card key={movie.id} className="overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="aspect-[2/3] w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {movie.genre}
                    </p>
                    <div className="flex items-center text-sm mt-1">
                      <Clock className="h-3 w-3 mr-1" /> {movie.duration}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p>No movies scheduled for today at this theater.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

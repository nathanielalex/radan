import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCities, type CityResponse } from "@/services/cityService";
import { getMovieDetail, type MovieDetail } from "@/services/movieService";
import axios from "axios";
import { Clock, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { LoadingPage } from "./LoadingPage";
import {
  getTheatersAvailable,
  type TheatersAvailableResponse,
} from "@/services/theaterService";
import { getAvailableSeats } from "@/services/showtimeSeatService";
import { ErrorPage } from "./ErrorPage";
import { formatTimeToHHMM } from "@/utils/time";
import { useBookingStore } from "@/stores/bookingStore";
import { navigateTo } from "@/utils/navigation";
import { formatPrice } from "@/utils/price";

// const mockMovieDetail: MovieDetail = {
//   id: 1,
//   title: "Cosmic Odyssey",
//   genres: [
//     { id: 9, name: "Comedy" },
//     { id: 10, name: "Mystery" },
//     { id: 11, name: "Crime" },
//   ],
//   duration: 120,
//   synopsis:
//     "After discovering a mysterious artifact, a brilliant but disgraced scientist must lead a team on a perilous journey across the galaxy to uncover its secrets before it falls into the wrong hands. The fate of humanity hangs in the balance as they face unknown dangers and challenge the very fabric of space and time.",
//   director: "Aria Vance",
//   casts: [
//     { id: 9, name: "Chris Evans" },
//     { id: 10, name: "Natalie" },
//     { id: 11, name: "Robert" },
//   ],
//   posterUrl: "https://placehold.co/500x750/1a202c/ffffff?text=Cosmic+Odyssey",
// };

// interface Showtime {
//   time: string;
//   price: number;
// }

// interface TheaterSchedule {
//   id: number;
//   name: string;
//   location: string;
//   city: string;
//   showtimes: Record<string, Showtime[]>; // key = studio type
// }

// const theaterSchedules: TheaterSchedule[] = [
//   {
//     id: 101,
//     name: "Cinema XXI",
//     location: "AEON Mall BSD City, South Tangerang",
//     city: "Jakarta",
//     showtimes: {
//       Regular: [
//         { time: "12:30", price: 50000 },
//         { time: "15:15", price: 50000 },
//         { time: "18:00", price: 60000 },
//         { time: "20:45", price: 60000 },
//       ],
//     },
//   },
//   {
//     id: 102,
//     name: "CGV",
//     location: "Teras Kota, South Tangerang",
//     city: "Jakarta",
//     showtimes: {
//       Regular: [
//         { time: "13:00", price: 45000 },
//         { time: "15:40", price: 45000 },
//         { time: "18:20", price: 55000 },
//         { time: "21:00", price: 55000 },
//       ],
//       Premium: [
//         { time: "14:00", price: 70000 },
//         { time: "19:30", price: 75000 },
//       ],
//     },
//   },
//   {
//     id: 103,
//     name: "Cinepolis",
//     location: "Living World, South Tangerang",
//     city: "Bandung",
//     showtimes: {
//       Regular: [
//         { time: "12:45", price: 40000 },
//         { time: "14:50", price: 40000 },
//         { time: "17:30", price: 50000 },
//         { time: "19:45", price: 50000 },
//       ],
//       Deluxe: [{ time: "21:50", price: 60000 }],
//     },
//   },
//   {
//     id: 104,
//     name: "Cinema XXI The Premiere",
//     location: "Bintaro Xchange Mall, South Tangerang",
//     city: "South Tangerang",
//     showtimes: {
//       "The Premiere": [
//         { time: "13:15", price: 100000 },
//         { time: "16:00", price: 100000 },
//         { time: "18:45", price: 150000 },
//       ],
//     },
//   },
// ];

// const cities = ["South Tangerang", "Jakarta", "Bandung"]; // Replace with dynamic list if needed
export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  // State for data
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [theaters, setTheaters] = useState<TheatersAvailableResponse[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityResponse | null>(null);

  // State for UI and booking logic
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<{
    id: number;
    time: string;
    price: number;
    theater: string;
    studioType: string;
  } | null>(null);
  const [seatCount, setSeatCount] = useState(1);
  const [availableSeats, setAvailableSeats] = useState(0);

  const { setTheaterName, setSeatsSelected, setStartTime, setPrice, setMovieTitle, setPosterUrl } = useBookingStore();

  // --- Refactored useEffect Hooks ---

  // Effect 1: Fetch initial movie details and all available cities
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!movieId) return;

      try {
        setLoading(true);
        const [movieData, cityData] = await Promise.all([
          getMovieDetail(Number(movieId)),
          getCities(),
        ]);

        setMovieDetail(movieData);
        setCities(cityData);

        // Set the first city as the default selected city
        if (cityData.length > 0) {
          setSelectedCity(cityData[0]);
        }
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to load movie details. Please try again.";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [movieId]);

  // Effect 2: Fetch available theaters whenever the selected city changes
  useEffect(() => {
    const fetchTheaters = async () => {
      if (!movieId || !selectedCity) return;

      try {
        // You might want a more granular loading state here
        const theaterData = await getTheatersAvailable(
          Number(movieId),
          selectedCity.id
        );
        // console.log(theaterData)
        setTheaters(theaterData);
      } catch (err) {
        //TODO: fix error
        console.error("Failed to fetch theaters:", err);
        setTheaters([]); // Clear theaters on error
      }
    };

    fetchTheaters();
  }, [selectedCity, movieId]);

  // Effect 3: Fetch available seats when a showtime is selected
  useEffect(() => {
    const fetchSeats = async () => {
      if (!selectedShowtime) return;

      try {
        setSeatCount(1); // Reset seat count for new selection
        const seatData = await getAvailableSeats(selectedShowtime.id);
        setAvailableSeats(seatData);
      } catch (err) {
        //TODO: fix error
        console.error("Failed to fetch available seats:", err);
        setAvailableSeats(0); // Reset on error
      }
    };

    fetchSeats();
  }, [selectedShowtime]);

  const handleButtonClick = () => {

    if (selectedShowtime && movieDetail) {
      setSeatsSelected(seatCount);
      setTheaterName(selectedShowtime.theater);
      setStartTime(selectedShowtime.time);
      setPrice(selectedShowtime.price);
      setMovieTitle(movieDetail?.title);
      setPosterUrl(movieDetail?.posterUrl);
      navigateTo(`/booking/${selectedShowtime.id}`)
    } else {
      console.log("showtime has not been selected")
    }
      
  };

  // --- Helper Functions ---
  const totalPrice = formatPrice((selectedShowtime?.price || 0) * seatCount);
  const increment = () =>
    setSeatCount((prev) => Math.min(prev + 1, availableSeats));
  const decrement = () => setSeatCount((prev) => Math.max(1, prev - 1));

  // --- Render Logic ---

  if (loading) return <LoadingPage />;
  if (error || !movieDetail) return <ErrorPage />;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Details Section */}
        <section className="relative py-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[300px_1fr] gap-8 md:gap-12">
            <div className="row-start-1 md:col-start-1">
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}/${
                  movieDetail.posterUrl
                }`}
                alt={`Poster for ${movieDetail.title}`}
                className="rounded-xl aspect-[2/3] w-full max-w-xs mx-auto md:max-w-none shadow-2xl"
              />
            </div>
            <div className="flex flex-col justify-end md:pb-12 row-start-2 md:col-start-2 md:row-start-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter">
                {movieDetail.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-muted-foreground">
                <span>
                  {movieDetail.genres.map((genre) => genre.name).join(", ")}
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {movieDetail.duration} minutes
                </span>
              </div>
              <p className="mt-4 text-base leading-relaxed max-w-prose">
                {movieDetail.synopsis}
              </p>
              <div className="mt-6 space-y-1">
                <p>
                  <strong className="font-semibold">Director:</strong>{" "}
                  {movieDetail.director}
                </p>
                <p>
                  <strong className="font-semibold">Cast:</strong>{" "}
                  {movieDetail.casts.map((cast) => cast.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section className="py-16 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Schedule
          </h2>
          <div className="mb-4 flex flex-row items-center space-x-4">
            <span>Select City</span>
            <Select
              value={selectedCity?.id.toString() || ""}
              onValueChange={(value) => {
                const city =
                  cities.find((c) => c.id.toString() === value) || null;
                setSelectedCity(city);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-muted-foreground mb-8">
            Showing today,{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            in <strong>{selectedCity?.name || "..."}</strong>
          </p>
          <div className="space-y-4 max-w-4xl mx-auto">
            {theaters.length > 0 ? (
              theaters.map((theater) => (
                <Accordion key={theater.id} type="single" collapsible>
                  <AccordionItem value={`theater-${theater.id}`}>
                    <AccordionTrigger>
                      <div className="text-left">
                        <p className="font-semibold text-lg">{theater.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {theater.location}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {theater.showtimeOverviewDTOs.map((overview) => (
                        <div key={overview.studioType} className="mb-4">
                          <h4 className="font-medium mb-2">
                            {overview.studioType}
                          </h4>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {overview.showtimeDTOs.map((time) => (
                              <Button
                                variant="outline"
                                key={time.id}
                                className="flex flex-col h-auto py-2"
                                onClick={() => {
                                  setSelectedShowtime({
                                    id: time.id,
                                    time: time.startTime,
                                    price: overview.price,
                                    theater: theater.name,
                                    studioType: overview.studioType,
                                  });
                                  setOpenDialog(true);
                                }}
                              >
                                <span className="font-semibold text-base">
                                  {formatTimeToHHMM(time.startTime)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatPrice(overview.price)}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No available showtimes in this city.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Booking Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Please confirm the number of seats for this showtime.
            </DialogDescription>
          </DialogHeader>

          {selectedShowtime && (
            <div className="py-6 space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-xl">{movieDetail.title}</h4>
                <p className="text-muted-foreground">
                  {selectedShowtime.theater} - {selectedShowtime.studioType}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-semibold">{formatTimeToHHMM(selectedShowtime.time)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Seats</label>
                <div className="flex items-center justify-between border rounded-md p-2">
                  <p className="text-sm text-muted-foreground">
                    {availableSeats} seats available
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={decrement}
                      disabled={seatCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold w-8 text-center">
                      {seatCount}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={increment}
                      disabled={seatCount >= availableSeats}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="font-bold text-xl">{totalPrice}</p>
            </div>
            <Button className="px-8 py-5" onClick={handleButtonClick}>Confirm Booking</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
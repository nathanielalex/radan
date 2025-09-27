import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  getBookingsByUser,
} from "@/services/bookingService";
import { getUserIdFromToken } from "@/utils/token";
import axios from "axios";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { useAuthStore } from "@/stores/authStore";

// interface UserBooking {
//   id: string;
//   movieId: number;
//   theaterId: string;
//   date: string;
//   time: string;
//   seats: string[];
//   total: number;
//   status: "Upcoming" | "Completed";
//   qrCodeUrl: string;
// }

// const mockUserBookings: UserBooking[] = [
//   {
//     id: "UB001",
//     movieId: 1,
//     theaterId: "TH001",
//     date: "2025-09-15",
//     time: "18:30",
//     seats: ["E5", "E6"],
//     total: 180000,
//     status: "Upcoming",
//     qrCodeUrl: "https://placehold.co/200x200/000000/FFFFFF?text=QR+Code",
//   },
//   {
//     id: "UB002",
//     movieId: 2,
//     theaterId: "TH004",
//     date: "2025-09-14",
//     time: "19:15",
//     seats: ["C1", "C2", "C3"],
//     total: 150000,
//     status: "Upcoming",
//     qrCodeUrl: "https://placehold.co/200x200/000000/FFFFFF?text=QR+Code",
//   },
//   {
//     id: "UB003",
//     movieId: 5,
//     theaterId: "TH001",
//     date: "2025-08-20",
//     time: "20:00",
//     seats: ["F10"],
//     total: 65000,
//     status: "Completed",
//     qrCodeUrl: "https://placehold.co/200x200/000000/FFFFFF?text=QR+Code",
//   },
// ];

// interface TheaterBranch {
//   id: string;
//   name: string;
//   location: string;
//   auditoriums: number;
//   city: string;
//   studioTypes: string[];
// }

// const mockTheaters: TheaterBranch[] = [
//   {
//     id: "TH001",
//     name: "Cinema XXI AEON Mall",
//     location: "AEON Mall BSD City",
//     auditoriums: 8,
//     city: "South Tangerang",
//     studioTypes: ["Regular", "Premium", "IMAX"],
//   },
//   {
//     id: "TH002",
//     name: "CGV Teras Kota",
//     location: "Teras Kota, BSD",
//     auditoriums: 6,
//     city: "South Tangerang",
//     studioTypes: ["Regular", "4DX", "Velvet"],
//   },
//   {
//     id: "TH003",
//     name: "Cinepolis Living World",
//     location: "Living World, Alam Sutera",
//     auditoriums: 10,
//     city: "South Tangerang",
//     studioTypes: ["Regular", "VIP"],
//   },
//   {
//     id: "TH004",
//     name: "Cinema XXI Gandaria City",
//     location: "Gandaria City Mall",
//     auditoriums: 8,
//     city: "Jakarta",
//     studioTypes: ["Regular", "The Premiere"],
//   },
//   {
//     id: "TH005",
//     name: "CGV Grand Indonesia",
//     location: "Grand Indonesia",
//     auditoriums: 11,
//     city: "Jakarta",
//     studioTypes: ["Regular", "Starium", "SphereX"],
//   },
//   {
//     id: "TH006",
//     name: "Cinepolis Paris Van Java",
//     location: "Paris Van Java Mall",
//     auditoriums: 9,
//     city: "Bandung",
//     studioTypes: ["Regular", "Macro XE"],
//   },
// ];

// interface MovieDetails {
//   id: number;
//   title: string;
//   genre: string;
//   duration: string;
//   rating: number;
//   synopsis: string;
//   director: string;
//   cast: string[];
//   posterUrl: string;
//   bannerUrl: string;
//   status?: "Now Playing" | "Coming Soon";
// }

// const mockMovies: MovieDetails[] = [
//   {
//     id: 1,
//     title: "Cosmic Odyssey",
//     genre: "Sci-Fi",
//     duration: "150 min",
//     rating: 8.8,
//     status: "Now Playing",
//     synopsis: "A thrilling journey across galaxies.",
//     director: "Aria Vance",
//     cast: ["Leo Caspian"],
//     posterUrl: "https://placehold.co/500x750/1a202c/ffffff?text=Cosmic+Odyssey",
//     bannerUrl: "",
//   },
//   {
//     id: 2,
//     title: "Midnight Heist",
//     genre: "Thriller",
//     duration: "115 min",
//     rating: 8.2,
//     status: "Now Playing",
//     synopsis: "A crew of thieves attempts the impossible.",
//     director: "Jax Teller",
//     cast: ["Nina Petrova"],
//     posterUrl: "https://placehold.co/500x750/1a202c/ffffff?text=Midnight+Heist",
//     bannerUrl: "",
//   },
//   {
//     id: 3,
//     title: "Echoes of the Past",
//     genre: "Drama",
//     duration: "130 min",
//     rating: 9.1,
//     status: "Now Playing",
//     synopsis: "A historian uncovers a dark secret.",
//     director: "Lena Romanoff",
//     cast: ["Ivan Dragov"],
//     posterUrl: "https://placehold.co/500x750/1a202c/ffffff?text=Echoes+of+Past",
//     bannerUrl: "",
//   },
//   {
//     id: 4,
//     title: "Galactic Frontiers",
//     genre: "Sci-Fi",
//     duration: "165 min",
//     rating: 0,
//     status: "Coming Soon",
//     synopsis: "",
//     director: "",
//     cast: [],
//     posterUrl: "",
//     bannerUrl: "",
//   },
//   {
//     id: 5,
//     title: "The Last Stand",
//     genre: "Action",
//     duration: "125 min",
//     rating: 7.9,
//     status: "Now Playing",
//     synopsis: "One man against an army.",
//     director: "Marcus Cole",
//     cast: ["Rico Vega"],
//     posterUrl: "https://placehold.co/500x750/1a202c/ffffff?text=The+Last+Stand",
//     bannerUrl: "",
//   },
// ];

interface Booking {
  movieTitle: number;
  status: string;
  theaterName: number;
  showtimeDate: string;
  showtime: string;
  totalPrice: number;
  seatNumbers: string[];
}

function getBookingStatus(showtimeDate: string): "Upcoming" | "Completed" {
  const today = new Date();
  const bookingDate = new Date(showtimeDate);

  // Remove time part by setting to midnight for accurate date comparison
  today.setHours(0, 0, 0, 0);
  bookingDate.setHours(0, 0, 0, 0);

  return bookingDate >= today ? "Upcoming" : "Completed";
}

export default function MyBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!token) {
          return;
        }
        const userId = getUserIdFromToken(token);

        if(!userId) return;

        const bookingData = await getBookingsByUser(Number(userId));
        const bookingDataWithStatus = bookingData.map(booking => ({
        ...booking,
        status: getBookingStatus(booking.showtimeDate),
      }));
      setBookings(bookingDataWithStatus);
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

  const [activeTab, setActiveTab] = useState<"Upcoming" | "Completed">(
    "Upcoming"
  );

  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="py-8 md:py-16 px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">My Bookings</h1>
      <p className="text-muted-foreground mb-6">
        View your upcoming and past movie tickets.
      </p>

      <div className="flex border-b mb-6">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("Upcoming")}
          className={`rounded-none border-b-2 ${
            activeTab === "Upcoming"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Upcoming
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("Completed")}
          className={`rounded-none border-b-2 ${
            activeTab === "Completed"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Past
        </Button>
      </div>

      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card
              key={`${booking.movieTitle} - ${booking.showtimeDate} - ${booking.showtime}`}
              className="overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <Badge
                    variant={
                      booking.status === "Upcoming" ? "default" : "secondary"
                    }
                    className="mb-2"
                  >
                    {booking.status}
                  </Badge>
                  <CardTitle className="text-2xl mb-1">
                    {booking.movieTitle}
                  </CardTitle>
                  <p className="text-muted-foreground font-medium">
                    {booking.theaterName}
                  </p>
                  {/* <p className="text-muted-foreground text-sm">
                      {theater.location}
                    </p> */}

                  <div className="border-t my-4"></div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-semibold">{booking.showtimeDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-semibold">{booking.showtime}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Seats</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {booking.seatNumbers.map((seat) => (
                          <Badge key={seat} variant="outline">
                            {seat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/40 p-6 md:w-56 flex flex-col items-center justify-center gap-4">
                  <img
                    src={"/Example-QR-code.webp"}
                    alt="QR Code"
                    className="w-36 h-36 rounded-lg"
                  />
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    E-Ticket
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p>No {activeTab.toLowerCase()} bookings found.</p>
        )}
      </div>
    </div>
  );
}

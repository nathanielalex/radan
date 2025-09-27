import { Button } from "@/components/ui/button";
import {
  getShowtimeSeatsByShowtime,
  type ShowtimeSeat,
} from "@/services/showtimeSeatService";
import { useBookingStore } from "@/stores/bookingStore";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { formatPrice } from "@/utils/price";
import { navigateTo } from "@/utils/navigation";

// Types based on the new database schema
// interface Seat {
//   id: number;
//   showtime_id: number;
//   seat_number: string;
//   row_number: number;
//   column_number: number;
//   is_booked: boolean;
// }

// interface BookingInfo {
//   movieTitle: string;
//   theaterName: string;
//   showtime: string;
//   ticketPrice: number;
//   seatCountRequired: number;
// }

// A new type for the status of a seat on the frontend
type SeatStatus = "available" | "selected" | "unavailable";

// Mock backend API response updated to the new schema
// Note: Seats like A3, A4, B5 are missing, which will create gaps.
// const mockApiResponse = {
//   showtimeId: "st_1a2b3c",
//   movieTitle: "Cosmic Odyssey",
//   theaterName: "Cinema XXI",
//   showtime: "18:00",
//   ticketPrice: 60000,
//   seatCountRequired: 4,
//   seats: [
//     {
//       id: 1,
//       showtime_id: 1,
//       seat_number: "A1",
//       row_number: 1,
//       column_number: 1,
//       is_booked: false,
//     },
//     {
//       id: 2,
//       showtime_id: 1,
//       seat_number: "A2",
//       row_number: 1,
//       column_number: 2,
//       is_booked: true,
//     },
//     // A3, A4 are missing (aisle)
//     {
//       id: 5,
//       showtime_id: 1,
//       seat_number: "A3",
//       row_number: 1,
//       column_number: 4,
//       is_booked: false,
//     },
//     {
//       id: 6,
//       showtime_id: 1,
//       seat_number: "A4",
//       row_number: 1,
//       column_number: 5,
//       is_booked: false,
//     },
//     {
//       id: 7,
//       showtime_id: 1,
//       seat_number: "A5",
//       row_number: 1,
//       column_number: 7,
//       is_booked: false,
//     },
//     {
//       id: 8,
//       showtime_id: 1,
//       seat_number: "A6",
//       row_number: 1,
//       column_number: 8,
//       is_booked: true,
//     },
//     {
//       id: 9,
//       showtime_id: 1,
//       seat_number: "B1",
//       row_number: 2,
//       column_number: 1,
//       is_booked: false,
//     },
//     {
//       id: 10,
//       showtime_id: 1,
//       seat_number: "B2",
//       row_number: 2,
//       column_number: 2,
//       is_booked: false,
//     },
//     {
//       id: 11,
//       showtime_id: 1,
//       seat_number: "B3",
//       row_number: 2,
//       column_number: 4,
//       is_booked: true,
//     },
//     {
//       id: 12,
//       showtime_id: 1,
//       seat_number: "B4",
//       row_number: 2,
//       column_number: 5,
//       is_booked: false,
//     },
//     // B5 is missing
//     {
//       id: 14,
//       showtime_id: 1,
//       seat_number: "B5",
//       row_number: 2,
//       column_number: 7,
//       is_booked: false,
//     },
//     {
//       id: 15,
//       showtime_id: 1,
//       seat_number: "B6",
//       row_number: 2,
//       column_number: 8,
//       is_booked: false,
//     },
//     {
//       id: 17,
//       showtime_id: 1,
//       seat_number: "C1",
//       row_number: 3,
//       column_number: 1,
//       is_booked: false,
//     },
//     {
//       id: 18,
//       showtime_id: 1,
//       seat_number: "C2",
//       row_number: 3,
//       column_number: 2,
//       is_booked: false,
//     },
//     {
//       id: 19,
//       showtime_id: 1,
//       seat_number: "C3",
//       row_number: 3,
//       column_number: 3,
//       is_booked: false,
//     },
//     {
//       id: 20,
//       showtime_id: 1,
//       seat_number: "C4",
//       row_number: 3,
//       column_number: 4,
//       is_booked: false,
//     },
//     {
//       id: 21,
//       showtime_id: 1,
//       seat_number: "C5",
//       row_number: 3,
//       column_number: 5,
//       is_booked: true,
//     },
//     {
//       id: 22,
//       showtime_id: 1,
//       seat_number: "C6",
//       row_number: 3,
//       column_number: 6,
//       is_booked: false,
//     },
//     {
//       id: 23,
//       showtime_id: 1,
//       seat_number: "C7",
//       row_number: 3,
//       column_number: 7,
//       is_booked: false,
//     },
//     {
//       id: 24,
//       showtime_id: 1,
//       seat_number: "C8",
//       row_number: 3,
//       column_number: 8,
//       is_booked: false,
//     },
//   ],
// };

export default function SeatSelectionPage() {
  const { showtimeId } = useParams();
  // const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  // const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<ShowtimeSeat[]>([]);
  const { theaterName, seatsSelected, startTime, price, setSeats, setSeatIds } =
    useBookingStore();
  const [showtimeSeats, setShowtimeSeats] = useState<ShowtimeSeat[]>([]);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        setLoading(true);
        if (!showtimeId) {
          return;
        }
        const data = await getShowtimeSeatsByShowtime(Number(showtimeId));

        setShowtimeSeats(data);
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

    fetchSeatData();
  }, [showtimeId]);

  // Memoize the grid calculation to avoid re-running on every render
  const seatGrid = useMemo(() => {
    if (showtimeSeats.length === 0) return [];

    const maxRow = Math.max(...showtimeSeats.map((s) => s.rowNumber));
    const maxCol = Math.max(...showtimeSeats.map((s) => s.columnNumber));

    const grid: (ShowtimeSeat | null)[][] = [];

    for (let i = 1; i <= maxRow; i++) {
      const row: (ShowtimeSeat | null)[] = [];
      for (let j = 1; j <= maxCol; j++) {
        const seat = showtimeSeats.find(
          (s) => s.rowNumber === i && s.columnNumber === j
        );
        row.push(seat || null); // Push seat or null if it's a gap
      }
      grid.push(row);
    }
    return grid;
  }, [showtimeSeats]);

  const handleSeatClick = (seat: ShowtimeSeat) => {
    setSelectedSeats((prev) => {
      const alreadySelected = prev.some((s) => s.id === seat.id);
      if (alreadySelected) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (prev.length < seatsSelected) {
        return [...prev, seat];
      }
      return prev;
    });
  };

  const totalPrice = formatPrice(price * selectedSeats.length);

  const seatStatusClasses = {
    available:
      "text-muted-foreground/50 hover:text-primary hover:bg-primary/10 cursor-pointer",
    selected: "bg-primary text-primary-foreground cursor-pointer",
    unavailable:
      "bg-destructive text-destructive-foreground cursor-not-allowed",
  };

  const handleButtonClick = () => {
    if (selectedSeats.length > 0) {
      setSeats(selectedSeats.map((s) => s.seatNumber));
      setSeatIds(selectedSeats.map((s) => s.id));
      navigateTo(`/payment`);
    } else {
      console.log("seats have not been selected");
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="container pb-32 pt-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Select Your Seats</h1>
        <p className="text-muted-foreground">
          {theaterName} - {startTime}
        </p>
        <div className="mt-4 bg-secondary/50 inline-block px-4 py-2 rounded-lg">
          <p className="font-semibold">
            {selectedSeats.length} / {seatsSelected} seats selected
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Screen */}
        <div className="w-full max-w-2xl">
          <div className="h-2 bg-primary/20 w-full rounded-t-full"></div>
          <div className="h-8 border-x-4 border-b-4 border-primary/20 w-full flex items-center justify-center">
            <p className="text-sm font-semibold text-primary/80 tracking-widest">
              SCREEN
            </p>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="flex flex-col gap-2 my-8">
          {seatGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row gap-2 justify-center">
              {row.map((seat, colIndex) => {
                if (!seat) {
                  // This is a gap/aisle, render a placeholder
                  return <div key={colIndex} className="w-8 h-8" />;
                }

                const currentStatus: SeatStatus = seat.isBooked
                  ? "unavailable"
                  : selectedSeats.some((s) => s.id === seat.id)
                  ? "selected"
                  : "available";

                return (
                  <div
                    key={seat.id}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${seatStatusClasses[currentStatus]}`}
                    onClick={() =>
                      currentStatus !== "unavailable" && handleSeatClick(seat)
                    }
                  >
                    <span className="text-xs">{seat.seatNumber}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded border bg-card"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded bg-primary"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded bg-destructive"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
        <div className="container p-4 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm">
              Seats:{" "}
              <span className="font-semibold text-foreground">
                {selectedSeats
                  .map((seat) => seat.seatNumber)
                  .sort()
                  .join(", ") || "None"}
              </span>
            </p>
            <p className="text-muted-foreground text-sm">
              Total:{" "}
              <span className="font-bold text-xl text-foreground">
                {totalPrice}
              </span>
            </p>
          </div>
          <Button
            className="px-10 py-6"
            disabled={selectedSeats.length !== seatsSelected}
            onClick={handleButtonClick}
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}

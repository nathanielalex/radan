import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/bookingStore";
import { formatPrice } from "@/utils/price";
import { CheckCircle, Download } from "lucide-react";
import { Link } from "react-router";

// const bookingInfo = {
//   movie: {
//     title: "The Amazing Movie",
//     posterUrl: "https://placehold.co/200x300/ffffff/1a202c?text=Movie+Poster",
//   },
//   theater: {
//     name: "Cinema XYZ",
//     location: "Jl. Example No. 123, Jakarta",
//   },
//   showtime: {
//     time: "19:30",
//     price: 45000, // Price per seat in IDR
//   },
//   seatCount: 2,
//   selectedSeats: ["A1", "A2"],
// };

export default function SuccessPage() {
  // const { movie, theater, showtime, seatCount, selectedSeats } = bookingInfo;
  const {
    movieTitle,
    theaterName,
    startTime,
    seatsSelected,
    seats,
    price,
    posterUrl,
  } = useBookingStore();

  const totalPrice = formatPrice((price + 5000) * seatsSelected);

  return (
    <div className="container py-12 flex flex-col items-center text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
      <p className="text-muted-foreground max-w-md mt-2">
        Your tickets have been purchased successfully.
      </p>

      <div className="w-full max-w-lg border bg-card rounded-lg mt-8">
        <div className="p-6">
          <img
            src="/Example-QR-code.webp"
            alt="QR Code"
            className="w-40 h-40 mx-auto rounded-lg"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Scan this QR code at the theater
          </p>
        </div>
        <div className="border-t p-6 text-left">
          <div className="flex gap-4">
            <img
              src={`${import.meta.env.VITE_IMAGE_URL}/${posterUrl}`}
              alt={movieTitle}
              className="w-24 h-36 rounded-md"
            />
            <div>
              <h4 className="font-bold text-lg">{movieTitle}</h4>
              <p className="text-sm text-muted-foreground">{theaterName}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm font-bold">{startTime}</p>
            </div>
          </div>
        </div>
        <div className="border-t p-6 space-y-2 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Seats ({seatsSelected})
            </span>
            <span className="font-semibold">{seats.join(", ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Price</span>
            <span className="font-bold">{totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full max-w-lg">
        <Button className="w-full py-6 flex items-center gap-2" size="lg">
          <Download className="h-4 w-4" /> Download Ticket
        </Button>
        <Link to="/">
          <Button variant="outline" className="w-full py-6" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

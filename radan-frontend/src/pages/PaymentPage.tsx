import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBooking, type BookingRequest } from "@/services/bookingService";
import { useAuthStore } from "@/stores/authStore";
import { useBookingStore } from "@/stores/bookingStore";
import { navigateTo } from "@/utils/navigation";
import { formatPrice } from "@/utils/price";
import { getUserIdFromToken } from "@/utils/token";
import axios from "axios";
import { ChevronLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";

// const bookingInfo = {
//   showtimeId: "st_1a2b3c",
//   movie: "Cosmic Odyssey",
//   theater: "Cinema XXI",
//   showtime: "18:00",
//   ticketPrice: 60000,
//   seatCount: 2,
//   selectedSeats: ["a1", "b1"],
//   price: 1000
// };

export default function PaymentPage() {
  const { theaterName, seatsSelected, startTime, price, movieTitle, posterUrl, seats, seatIds } = useBookingStore();
  const token = useAuthStore((state) => state.token);

  const ticketPrice = price * seatsSelected;
  const convenienceFee = 5000 * seatsSelected;
  const totalPrice = ticketPrice + convenienceFee;

  const handleSubmit = async () => {
    //add more validation

    if(!token) {
      return;
    }
    const userId = getUserIdFromToken(token);

    if(!userId) {
      return
    }

    const payload: BookingRequest = {
      userId: Number(userId),
      showtimeSeatIds: seatIds,
    };
    console.log(payload);

    try {
      const response = await createBooking(payload);
      console.log(response);
      toast("Booking created successfully");
      setTimeout(() => {
        navigateTo("/success");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Failed to create booking.";
        toast(errorMsg);
      } else if (error instanceof Error) {
        toast(error.message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="py-12 px-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-left">
          <h1 className="text-2xl font-bold">Payment</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Options */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="font-semibold mb-4">Select Payment Method</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="credit-card"
                    className="font-medium flex items-center gap-2"
                  >
                    <CreditCard className="h-5 w-5" /> Credit/Debit Card
                  </label>
                  <input
                    type="radio"
                    id="credit-card"
                    name="payment-method"
                    defaultChecked
                    className="accent-primary"
                  />
                </div>
                <div className="mt-4 space-y-3">
                  <Input placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM / YY" />
                    <Input placeholder="CVV" />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-between">
                <label htmlFor="e-wallet" className="font-medium">
                  E-Wallet
                </label>
                <input
                  type="radio"
                  id="e-wallet"
                  name="payment-method"
                  className="accent-primary"
                />
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-between">
                <label htmlFor="virtual-account" className="font-medium">
                  Virtual Account
                </label>
                <input
                  type="radio"
                  id="virtual-account"
                  name="payment-method"
                  className="accent-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg bg-card sticky top-28">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="flex gap-4">
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}/${posterUrl}`}
                  alt={movieTitle}
                  className="w-24 h-36 rounded-md"
                />
                <div>
                  <h4 className="font-semibold">{movieTitle}</h4>
                  <p className="text-sm text-muted-foreground">{theaterName}</p>
                </div>
              </div>
            </div>
            <div className="border-t p-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span>
                  {new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  &bull; {startTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span>{seats.join(", ")}</span>
              </div>
            </div>
            <div className="border-t p-6 space-y-2 text-sm">
              <h4 className="font-semibold mb-2">Price Details</h4>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Ticket Price ({seatsSelected}x)
                </span>
                <span>{formatPrice(ticketPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Convenience Fee</span>
                <span>{formatPrice(convenienceFee)}</span>
              </div>
            </div>
            <div className="border-t p-6 bg-secondary/50 rounded-b-lg">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Price</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSubmit} className="w-full lg:w-auto px-12 py-6 text-base">
          Confirm Payment
        </Button>
      </div>
    </div>
  );
};

import { create } from "zustand";

interface BookingState {
  theaterName: string;
  seatsSelected: number;
  startTime: string;
  price: number;
  movieTitle: string;
  posterUrl: string;
  seats: string[];
  seatIds: number[];
}

interface BookingStore extends BookingState {
  setTheaterName: (name: string) => void;
  setSeatsSelected: (count: number) => void;
  setStartTime: (time: string) => void;
  setPrice: (p: number) => void;
  setMovieTitle: (title: string) => void;
  setPosterUrl: (url: string) => void;
  setSeats: (seats: string[]) => void;
  setSeatIds: (ids: number[]) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  theaterName: "",
  seatsSelected: 0,
  startTime: "",
  price: 0,
  movieTitle: "",
  posterUrl: "",
  seats: [],
  seatIds: [],

  setTheaterName: (name) => set({ theaterName: name }),
  setSeatsSelected: (count) => set({ seatsSelected: count }),
  setStartTime: (time) => set({ startTime: time }),
  setPrice: (p) => set({ price: p }),
  setMovieTitle: (movie) => set({ movieTitle: movie }),
  setPosterUrl: (url) => set({ posterUrl: url }),
  setSeats: (s) => set({ seats: s }),
  setSeatIds: (id) => set({ seatIds: id }),
  reset: () =>
    set({
      theaterName: "",
      seatsSelected: 0,
      startTime: "",
      price: 0,
      movieTitle: "",
      posterUrl: "",
      seats: [],
      seatIds: [],
    }),
}));

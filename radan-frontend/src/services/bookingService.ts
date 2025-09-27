import { useAuthStore } from "@/stores/authStore";
import { navigateTo } from "@/utils/navigation";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/bookings`;

const api = axios.create({
  baseURL: API_URL,
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //Redirect to login if unauthorized
      navigateTo("/login");
    }
    return Promise.reject(error);
  }
);

export interface BookingRequest {
  userId: number;
  showtimeSeatIds: number[];
}

export interface BookingResponse {
  movieTitle: number;
  theaterName: number;
  showtimeDate: string;
  showtime: string;
  totalPrice: number;
  seatNumbers: string[];
}

export const createBooking = async (
  payload: BookingRequest
): Promise<BookingResponse> => {
  try {
    const response = await api.post<BookingResponse>("", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create booking"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

export const getBookingsByUser = async (id: number): Promise<BookingResponse[]> => {
  try {
    const response = await api.get<BookingResponse[]>(`/user/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get bookings"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};
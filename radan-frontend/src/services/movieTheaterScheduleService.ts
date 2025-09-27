import { useAuthStore } from "@/stores/authStore";
import { navigateTo } from "@/utils/navigation";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/movie-theater-schedule`;

const api = axios.create({
  baseURL: API_URL,
});

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

export interface ShowtimeRequest {
  studioId: number;
  startTime: string;
}

export interface CreateSchedulePayload {
  movieId: string;
  theaterId: string;
  releaseDate: string;
  endDate: string;
  showtimes: ShowtimeRequest[];
}

export interface CreateScheduleResponse {
  movieId: number;
  theaterId: number;
  releaseDate: string;
  endDate: string;
}

export const createSchedule = async (
  payload: CreateSchedulePayload
): Promise<CreateScheduleResponse> => {
  try {
    const response = await api.post<CreateScheduleResponse>("", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create theater"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

export interface MovieTheaterSchedule {
  movieId: number;
  movieTitle: string;
  theaterId: number;
  releaseDate: string;
  endDate: string;
}

export const getSchedulesByTheater = async (
  theaterId: number
): Promise<MovieTheaterSchedule[]> => {
  try {
    const response = await api.get<MovieTheaterSchedule[]>(
      `theater/${theaterId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get schedules");
    }
    throw new Error("Unexpected error occurred");
  }
};
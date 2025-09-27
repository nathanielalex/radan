import { useAuthStore } from "@/stores/authStore";
import { navigateTo } from "@/utils/navigation";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/theaters`;

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

export interface PriceRequest {
  studioTypeId: number;
  price: number;
  holidayPrice: number;
}

export interface StudioRequest {
  name: string;
  studioTypeId: number;
  studioLayoutId: number;
}

export interface CreateTheaterPayload {
  name: string;
  location: string;
  cityId: number;
  studios: StudioRequest[];
  prices: PriceRequest[];
}

export interface CreateTheaterResponse {
  name: string;
  id: number;
  location: string;
}

export const createTheater = async (
  payload: CreateTheaterPayload
): Promise<CreateTheaterResponse> => {
  try {
    const response = await api.post<CreateTheaterResponse>("", payload);
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

export interface Showtime {
  id: number;
  startTime: string;
}

export interface ShowtimeOverview {
  studioType: string;
  showtimeDTOs: Showtime[];
  price: number;
}

export interface TheatersAvailableResponse {
  id: number;
  name: string;
  location: string;
  showtimeOverviewDTOs: ShowtimeOverview[];
}

export const getTheatersAvailable = async (
  movieId: number,
  cityId: number
): Promise<TheatersAvailableResponse[]> => {
  try {
    const response = await api.get<TheatersAvailableResponse[]>("/available", {
      params: { movieId, cityId },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get theaters"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

export interface Theater {
  id: number;
  name: string;
  location: string;
}

export const getAllTheaters = async (): Promise<Theater[]> => {
  try {
    const response = await api.get<Theater[]>("");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get theaters"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

export interface StudioTypeDetail {
  studioTypeName: string;
  studioNames: string[];
  price: number;
  holidayPrice: number;
}

export interface TheaterDetailResponse {
  id: number;
  name: string;
  location: string;
  studioTypeDetailDTOs: StudioTypeDetail[];
}

export const getTheaterDetail = async (
  theaterId: number
): Promise<TheaterDetailResponse> => {
  try {
    const response = await api.get<TheaterDetailResponse>(`/${theaterId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get theater details"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

export const getTheatersByCity = async (
  cityId: number
): Promise<TheaterDetailResponse[]> => {
  try {
    const response = await api.get<TheaterDetailResponse[]>(`/city/${cityId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get theaters"
      );
    }
    throw new Error("Unexpected error occurred");
  }
};

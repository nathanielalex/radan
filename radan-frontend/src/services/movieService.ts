import { useAuthStore } from "@/stores/authStore";
import { navigateTo } from "@/utils/navigation";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/movies`;

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

export interface CreateMoviePayload {
  title: string;
  duration: string;
  synopsis: string;
  director: string;
  genreIds: string[];
  castIds: string[];
  posterImage: File;
}

export interface CreateMovieResponse {
  title: string;
  duration: number;
  id: number;
  posterUrl: string;
}

export interface Cast {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export const createMovie = async (
  payload: CreateMoviePayload
): Promise<CreateMovieResponse> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("duration", payload.duration);
  formData.append("synopsis", payload.synopsis);
  formData.append("director", payload.director);

  payload.genreIds.forEach((genre) => {
    formData.append("genreIds", genre);
  });

  payload.castIds.forEach((cast) => {
    formData.append("castIds", cast);
  });

  formData.append("posterImage", payload.posterImage);

  const response = await api.post<CreateMovieResponse>("", formData);
  return response.data;
};

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  duration: number; //in minutes
  posterUrl: string;
  genres: Genre[];
}

export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<Movie[]>("");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get movies");
    }
    throw new Error("Unexpected error occurred");
  }
};

export const getMoviesPlaying = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<Movie[]>("/playing");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get movies");
    }
    throw new Error("Unexpected error occurred");
  }
};

export interface Cast {
  id: number;
  name: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  duration: number; //in minutes
  posterUrl: string;
  genres: Genre[];
  synopsis: string,
  director: string,
  casts: Cast[];
}

export const getMovieDetail = async (id: number): Promise<MovieDetail> => {
  try {
    const response = await api.get<MovieDetail>(`/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get movie");
    }
    throw new Error("Unexpected error occurred");
  }
};

export const getMoviesWithoutScheduleForTheater = async (
  theaterId: number
): Promise<Movie[]> => {
  try {
    const response = await api.get<Movie[]>(`theater/${theaterId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get movies");
    }
    throw new Error("Unexpected error occurred");
  }
};

export const deleteMovie = async (id: number): Promise<void> => {
  try {
    await api.delete<Movie>(`/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete movie");
    }
    throw new Error("Unexpected error occurred");
  }
};
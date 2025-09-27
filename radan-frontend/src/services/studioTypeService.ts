import { useAuthStore } from "@/stores/authStore";
import { navigateTo } from "@/utils/navigation";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/studio-types`;

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

export interface StudioTypeResponse {
  id: number;
  name: string;
}

export const getStudioTypes = async (): Promise<StudioTypeResponse[]> => {
  try {
    const response = await api.get<StudioTypeResponse[]>("");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get studio types");
    }
    throw new Error("Unexpected error occurred");
  }
};

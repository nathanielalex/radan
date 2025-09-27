import { getRoleFromToken } from "@/utils/token";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  role: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isLoggedIn: false,
      login: (token: string) => {
        const role = getRoleFromToken(token);
        set(() => ({
          token,
          role,
          isLoggedIn: true,
        }));
      },
      logout: () =>
        set(() => ({
          token: null,
          role: null,
          isLoggedIn: false,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  nombre: string;
  email: string;
  isPremium: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      login: (user, token) => set({ isLoggedIn: true, user, token }),
      logout: () => set({ isLoggedIn: false, user: null, token: null }),
    }),
    {
      name: 'dumtak-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

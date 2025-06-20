import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserState {
  token: string | null;
  user: User | null;
  setAuth: (data: { token: string; user: User }) => void;
  updateUser: (updatedData: Partial<User>) => void; // Принимаем частичные данные
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      // --- ИСПРАВЛЕННАЯ ВЕРСИЯ ---
      // Эта функция теперь безопасно обновляет поля пользователя
      updateUser: (updatedData) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedData } : null
      })),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'user-auth-storage' }
  )
);
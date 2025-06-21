import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { useCartStore } from './cartStore'; // <-- Импортируем хранилище корзины

interface UserState {
  token: string | null;
  user: User | null;
  setAuth: (data: { token: string; user: User }) => void;
  updateUser: (updatedData: Partial<User>) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      updateUser: (updatedData) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedData } : null
      })),
      // --- УЛУЧШЕННАЯ ФУНКЦИЯ ВЫХОДА ---
      logout: () => {
        // Очищаем хранилище пользователя
        set({ token: null, user: null });
        // Очищаем и хранилище корзины
        useCartStore.getState().clearCart(); // Мы добавим эту функцию в cartStore
      },
    }),
    {
      name: 'user-auth-storage',
    }
  )
);
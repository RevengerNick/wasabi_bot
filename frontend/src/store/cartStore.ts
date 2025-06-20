// src/store/cartStore.ts
import { create } from 'zustand';
import type { Product } from '../types';

// Описываем, как будет выглядеть товар в корзине
export interface CartItem extends Product {
  quantity: number;
}

// Описываем состояние и действия
interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  
  addItem: (product) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    if (existingItem) {
      // Если товар уже есть, увеличиваем его количество
      const updatedItems = state.items.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      return { items: updatedItems };
    } else {
      // Если товара нет, добавляем его с количеством 1
      return { items: [...state.items, { ...product, quantity: 1 }] };
    }
  }),
  
  decreaseQuantity: (productId) => set((state) => {
    const existingItem = state.items.find(item => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      // Если товара больше одного, уменьшаем количество
      const updatedItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
      return { items: updatedItems };
    } else {
      // Если товар один или его нет, полностью удаляем его из корзины
      return { items: state.items.filter(item => item.id !== productId) };
    }
  }),

  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.id !== productId),
  })),
}));
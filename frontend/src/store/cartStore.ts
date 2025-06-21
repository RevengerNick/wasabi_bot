// frontend/src/store/cartStore.ts
import { create } from 'zustand';
import type { CartItem, Product } from '../types';
import * as api from '../services/api';
import { debounce } from 'lodash'; // Используем готовую надежную реализацию


interface CartState {
  items: CartItem[];
  // Действия, которые обновляют UI мгновенно
  optimistic_addItem: (product: Product) => void;
  optimistic_decreaseQuantity: (productId: number) => void;
  // Действие для синхронизации с БД
  removeItem: (productId: number) => void;
  syncWithDB: () => Promise<void>;
  clearCart: () => void;
}

// Создаем debounced-функцию для отправки обновлений на сервер
// Она будет ждать 1 секунду после последнего вызова перед отправкой
const debouncedUpdateCart = debounce(async (productId: number, quantity: number) => {
  try {
    await api.updateCart(productId, quantity);
  } catch (error) {
    console.error("Не удалось синхронизировать корзину:", error);
    // Здесь можно добавить логику отката или показа ошибки пользователю
  }
}, 1000);


export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  optimistic_addItem: (product) => {
    const existingItem = get().items.find(item => item.id === product.id);
    let newQuantity = 1;

    if (existingItem) {
      newQuantity = existingItem.quantity + 1;
      const updatedItems = get().items.map(item =>
        item.id === product.id ? { ...item, quantity: newQuantity } : item
      );
      set({ items: updatedItems });
    } else {
      set({ items: [...get().items, { ...product, quantity: 1 }] });
    }
    // Отправляем изменения на бэкенд с задержкой
    debouncedUpdateCart(product.id, newQuantity);
  },

  optimistic_decreaseQuantity: (productId) => {
    const existingItem = get().items.find(item => item.id === productId);
    if (!existingItem) return;

    let newQuantity = existingItem.quantity - 1;

    if (newQuantity > 0) {
        const updatedItems = get().items.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        set({ items: updatedItems });
    } else {
        set({ items: get().items.filter(item => item.id !== productId) });
    }
    // Отправляем изменения на бэкенд с задержкой
    debouncedUpdateCart(productId, newQuantity);
  },

  removeItem: (productId) => {
    // 1. Оптимистично удаляем из UI
    set((state) => ({ items: state.items.filter(item => item.id !== productId) }));
    // 2. Отправляем на бэкенд команду удалить товар (отправив количество 0)
    debouncedUpdateCart(productId, 0);
  },
  
  syncWithDB: async () => {
    try {
        const serverCart = await api.getCart();
        if (serverCart && serverCart.items) {
          
            const clientItems = serverCart.items.map((item: any) => ({
                ...item.product,
                quantity: item.quantity,
            }));
            set({ items: clientItems });
        }
    } catch (error) {
        console.error("Ошибка при загрузке корзины с сервера:", error);
    }
  },


  clearCart: () => {
    // TODO: Очищать корзину и на сервере
    set({ items: [] });
  },
}));
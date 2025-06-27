import { create } from 'zustand';
import type { Address } from '../types'; // Убедитесь, что тип Address есть в types/index.ts
import * as api from '../services/api';

interface AddressData {
name: string;
fullAddress: string;
latitude?: number;
longitude?: number;
}

interface AddressState {
  addresses: Address[];
  fetchAddresses: () => Promise<void>;
  addAddress: (data: AddressData) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  fetchAddresses: async () => {
    try {
      const addresses = await api.getAddresses();
      set({ addresses });
    } catch (error) {
      console.error("Не удалось загрузить адреса:", error);
    }
  },
  addAddress: async (data) => {
const newAddress = await api.addAddress(data);
set({ addresses: [newAddress, ...get().addresses] });
},
  deleteAddress: async (id) => {
    set({ addresses: get().addresses.filter(a => a.id !== id) }); // Оптимистично удаляем из UI
    try {
      await api.deleteAddress(id);
    } catch (error) {
      console.error("Не удалось удалить адрес:", error);
      get().fetchAddresses(); // Если ошибка - перезагружаем список с сервера
    }
  },
}));
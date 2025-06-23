// frontend/src/store/checkoutStore.ts
import { create } from 'zustand';

interface CheckoutState {
  selectedAddress: string | null;
  setSelectedAddress: (address: string) => void;
  clearAddress: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  selectedAddress: null,
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  clearAddress: () => set({ selectedAddress: null }),
}));
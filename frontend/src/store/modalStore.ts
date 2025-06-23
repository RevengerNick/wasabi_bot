// frontend/src/store/modalStore.ts
import { create } from 'zustand';
import type { Product } from '../types';

interface ModalState {
  isProductModalOpen: boolean;
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isProductModalOpen: false,
  selectedProduct: null,
  openProductModal: (product) => set({ selectedProduct: product, isProductModalOpen: true }),
  closeProductModal: () => set({ isProductModalOpen: false, selectedProduct: null }),
}));
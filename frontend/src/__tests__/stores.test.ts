// frontend/src/__tests__/stores.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useUserStore } from '../store/userStore';
import { useCartStore } from '../store/cartStore';
import { useModalStore } from '../store/modalStore';
//import * as api from '../services/api';

const mockUser = { id: 'uuid-1', telegram_id: '123', first_name: 'Test', iat: 0, exp: 0 };
const mockToken = 'jwt-test-token';
const mockProduct = { id: 101, name: 'Филадельфия', price: 500, image_url: '', description: '' };

describe('Zustand Stores Logic', () => {

  beforeEach(() => {
    act(() => {
      useUserStore.getState().logout();
      useCartStore.getState().clearCart();
      useModalStore.getState().closeProductModal();
      vi.clearAllMocks();
    });
  });

  // --- Тесты для useUserStore ---
  describe('useUserStore', () => {
    it('should set token and user on setAuth', () => {
      act(() => {
        useUserStore.getState().setAuth({ token: mockToken, user: mockUser });
      });
      expect(useUserStore.getState().token).toBe(mockToken);
      expect(useUserStore.getState().user).toEqual(mockUser);
    });
  });

  // --- Тесты для useCartStore ---
  describe('useCartStore', () => {
    it('should add a new item to the cart', () => {
      act(() => {
        useCartStore.getState().optimistic_addItem(mockProduct);
      });
      const { items } = useCartStore.getState();
      expect(items.length).toBe(1);
      expect(items[0]).toEqual({ ...mockProduct, quantity: 1 });
    });

    it('should increase quantity if item already exists', () => {
      act(() => {
        useCartStore.getState().optimistic_addItem(mockProduct);
        useCartStore.getState().optimistic_addItem(mockProduct);
      });
      expect(useCartStore.getState().items[0].quantity).toBe(2);
    });
  });

  // --- Тесты для useModalStore ---
  describe('useModalStore', () => {
    it('should open modal and set product', () => {
      act(() => {
        useModalStore.getState().openProductModal(mockProduct);
      });
      expect(useModalStore.getState().isProductModalOpen).toBe(true);
      expect(useModalStore.getState().selectedProduct).toEqual(mockProduct);
    });
  });
});
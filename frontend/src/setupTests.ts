import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ---
// Мы передаем второй аргумент в vi.mock - фабрику, которая возвращает
// объект, где КАЖДОЕ свойство является мок-функцией vi.fn().
vi.mock('../services/api', () => ({
    // Теперь мы можем безопасно обращаться к любому из этих методов в тестах
    baseURL: '',
    loginViaTelegram: vi.fn(),
    loginViaPhone: vi.fn(),
    updateUserPhone: vi.fn(),
    getCategories: vi.fn(),
    getProductsByCategoryId: vi.fn(),
    searchProducts: vi.fn(),
    getCart: vi.fn(),
    updateCart: vi.fn(),
    createOrder: vi.fn(),
    getOrderHistory: vi.fn(),
    getAddresses: vi.fn(),
    addAddress: vi.fn(),
    deleteAddress: vi.fn(),
    deleteMe: vi.fn(),
}));

// Мок Telegram SDK остается без изменений
vi.mock('@telegram-apps/sdk', () => ({
  retrieveLaunchParams: () => ({
    initDataRaw: 'test-init-data'
  })
}));
// src/services/api.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '../store/userStore';
import type { Category, Product, User } from '../types';

export const baseURL = '/api'; // <-- ЭКСПОРТИРУЕМ ЭТУ КОНСТАНТУ

const apiClient = axios.create({ baseURL: `${baseURL}` });
// --- Функции для работы с API ---

apiClient.interceptors.request.use((config) => {
    const token = useUserStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const loginViaTelegram = async (initData: string) => {
    const response = await apiClient.post('/auth/telegram-login', { initData });
    const { token } = response.data;
    if (token) {
      const user: User = jwtDecode(token);
      useUserStore.getState().setAuth({ token, user });
    }
    return response;
};

export const loginViaPhone = async (phoneNumber: string, code: string) => {
    const response = await apiClient.post('/auth/phone-login', { phoneNumber, code });
    const { token } = response.data;
    if (token) {
      const user: User = jwtDecode(token);
      useUserStore.getState().setAuth({ token, user });
    }
    return response;
};
export const updateUserPhone = async (phoneNumber: string): Promise<User> => {
    // Отправляем запрос на бэкенд
    const response = await apiClient.post<User>('/users/update-phone', { phoneNumber });
    
    // ПОСЛЕ успешного ответа, обновляем наше глобальное хранилище
    useUserStore.getState().updateUser(response.data);
    
    return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await apiClient.get<Category[]>('/categories');
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении категорий:", error);
        // Пробрасываем ошибку дальше, чтобы компонент мог ее обработать
        throw error;
    }
};

export const getProductsByCategoryId = async (categoryId: number): Promise<Product[]> => {
    try {
        const response = await apiClient.get<Product[]>(`/products?category_id=${categoryId}`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении продуктов для категории ${categoryId}:`, error);
        throw error;
    }
};

export const deleteMe = async () => {
    return apiClient.delete('/users/delete-me');
};

// TODO: Добавить функцию для аутентификации
// export const loginUser = async (initData: string) => { ... }
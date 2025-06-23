// src/services/api.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '../store/userStore';
import type { Category, Product, User} from '../types';


export const baseURL = 'https://api.revenger.dev'; // <-- ЭКСПОРТИРУЕМ ЭТУ КОНСТАНТУ

const apiClient = axios.create({ baseURL: `${baseURL}`,
headers:{
    "ngrok-skip-browser-warning": true
}});
// --- Функции для работы с API ---

apiClient.interceptors.request.use((config) => {
    const token = useUserStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
  // Если ответ успешный (статус 2xx), просто возвращаем его
  (response) => response,
  // Если ответ с ошибкой
  (error) => {
    // Проверяем, что ошибка связана с ответом от сервера и статус код - 401
    if (error.response && error.response.status === 401) {
      console.log("Получена ошибка 401. Токен невалиден. Выполняем выход...");
      // Вызываем нашу функцию logout, которая очистит все данные
      useUserStore.getState().logout();
      // Можно также перезагрузить страницу для полной уверенности
      window.location.href = '/'; 
    }
    // Пробрасываем ошибку дальше, чтобы ее можно было обработать в компоненте (например, показать toast)
    return Promise.reject(error);
  }
);

export const loginViaTelegram = async (initData: string) => {
    const response = await apiClient.post('/auth/telegram-login', { initData });
    const { token } = response.data;
    if (token) {
      const user: User = jwtDecode(token);
      useUserStore.getState().setAuth({ token, user });
    }
    return response;
};

export const sayToServer = async (text: string) => {
    await apiClient.post('/users/send', { text });
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

export const getCart = async () => {
    const response = await apiClient.get('/cart');
    return response.data;
};

export const updateCart = async (productId: number, quantity: number) => {
    const response = await apiClient.post('/cart', { productId, quantity });
    return response.data;
};

export const createOrder = async (details: { address: string; contactPhone: string }) => {
    const response = await apiClient.post('/orders', details);
    return response.data;
};

export const getOrderHistory = async () => {
    const response = await apiClient.get('/orders/history');
    return response.data;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
    const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
};
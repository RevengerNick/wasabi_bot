export interface Category {
    id: number;
    name: string;
    order_index: number;
    image_url: string;
    description: string;
    // Добавляем новое поле для подсчета продуктов
    _count?: {
        products: number;
    };
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    rating?: number;       // опционально
    reviewsCount?: number; // опционально
}

export interface User {
  id: number;
  first_name: string | null;
  telegram_id: string;
  phone_number?: string | null;
  // Добавьте iat и exp, так как они стандартны для JWT
  iat: number;
  exp: number;
}
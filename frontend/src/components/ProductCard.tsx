// frontend/src/components/ProductCard.tsx
import React from 'react';
import type { Product } from '../types';
import { useModalStore } from '../store/modalStore';
import { baseURL } from '../services/api'; // <-- Импортируем baseURL

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const openProductModal = useModalStore((state) => state.openProductModal);
    
    // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ---
    // Строим полный, абсолютный URL для изображения
    const fullImageUrl = `${baseURL}${product.image_url}`;

    return (
        <div 
            onClick={() => openProductModal(product)} 
            className="flex flex-col w-40 shrink-0 text-center cursor-pointer group"
        >
            <img 
                src={fullImageUrl} // <-- Используем полный URL
                alt={product.name}
                className="w-40 h-40 rounded-lg object-cover mb-4 transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col items-center">
                <span className="text-brand-dark text-base font-bold">{product.name}</span>
                {/* Заменяем описание на цену для более чистого вида */}
                <span className="text-brand-green-light text-sm font-semibold mt-1">
                    {product.price.toLocaleString('ru-RU')} сум
                </span>
            </div>
        </div>
    );
};

export default ProductCard;
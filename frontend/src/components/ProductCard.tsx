// frontend/src/components/ProductCard.tsx
import React from 'react';
import type { Product } from '../types';
import { useModalStore } from '../store/modalStore';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const openProductModal = useModalStore((state) => state.openProductModal);
    // Наш API теперь не добавляет baseURL, поэтому строим его здесь
    const fullImageUrl = `https://api.revenger.dev/${product.image_url}`;

    return (
        // --- ГЛАВНОЕ ИЗМЕНЕНИЕ: Убираем w-40 и shrink-0 ---
        <div 
            onClick={() => openProductModal(product)} 
            className="flex flex-col text-center cursor-pointer group"
        >
            {/* Картинка теперь будет квадратной благодаря aspect-square */}
            <img 
                src={fullImageUrl}
                alt={product.name}
                className="w-full aspect-square rounded-lg object-cover mb-3 transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col items-center">
                <span className="text-brand-dark text-base font-bold">{product.name}</span>
                <span className="text-brand-green-light text-sm font-semibold mt-1">
                    {product.price.toLocaleString('ru-RU')} сум
                </span>
            </div>
        </div>
    );
};

export default ProductCard;
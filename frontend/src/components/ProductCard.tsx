// src/components/ProductCard.tsx
import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="flex flex-col w-40 shrink-0">
            <img src={product.image_url} className="w-40 h-40 rounded-lg object-cover mb-4" />
            <div className="flex flex-col items-start">
                <span className="text-brand-dark text-base font-bold">{product.name}</span>
                <span className="text-brand-green-light text-sm">{product.description}</span>
            </div>
        </div>
    );
};

export default ProductCard;
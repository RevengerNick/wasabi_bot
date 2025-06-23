// frontend/src/components/ProductListItem.tsx
import React from 'react';
import type { Product } from '../types';
import QuantityControl from './QuantityControl';
import { useModalStore } from '../store/modalStore';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const openProductModal = useModalStore((state) => state.openProductModal);
  // Строим полный, абсолютный URL для изображения
  const fullImageUrl = `https://api.revenger.dev/${product.image_url}`;

  return (
    // Вся карточка - одна большая кнопка для открытия модального окна
    <div onClick={() => openProductModal(product)} className="flex items-start gap-4 border-b pb-6 w-full cursor-pointer">
      
      {/* --- ИСПРАВЛЕНИЕ ВЕРСТКИ --- */}
      <div className="flex-1 flex flex-col min-w-0"> {/* Используем правильный min-w-0 */}
        
          <h3 className="text-brand-dark font-bold text-lg truncate">
            {product.name}
          </h3>
          <p className="text-brand-green-light text-sm mt-1 mb-3 h-10 line-clamp-2">
            {product.description || 'Состав не указан.'}
          </p>
        
        {/* Кнопки +/- не должны вызывать открытие модального окна */}
        <div 
          onClick={(e) => { e.stopPropagation(); }} 
          className="mt-auto"
        >
          <QuantityControl product={product} />
        </div>
      </div>
      
      {/* --- УБИРАЕМ ЛИШНИЙ <Link> --- */}
      {/* Картинка - это просто картинка, а не ссылка */}
      <img 
        src={fullImageUrl}
        alt={product.name}
        className="w-28 h-28 object-cover rounded-lg bg-gray-100 flex-shrink-0" 
      />
    </div>
  );
};

export default ProductListItem;
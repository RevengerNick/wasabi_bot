// frontend/src/components/DesktopProductListItem.tsx
import React from 'react';
import type { Product } from '../types';
import QuantityControl from './QuantityControl';
import { useModalStore } from '../store/modalStore';

interface DesktopProductListItemProps {
  product: Product;
}

const DesktopProductListItem: React.FC<DesktopProductListItemProps> = ({ product }) => {
  const openProductModal = useModalStore((state) => state.openProductModal);
  const fullImageUrl = `https://api.revenger.dev/${product.image_url}`;

  return (
    <div className="grid grid-cols-3 gap-6 items-center border-b py-6">
      {/* 1. Картинка */}
      <div 
        onClick={() => openProductModal(product)} 
        className="cursor-pointer col-span-1"
      >
        <img src={fullImageUrl} alt={product.name} className="w-full h-32 object-cover rounded-lg" />
      </div>
      
      {/* 2. Название и описание */}
      <div 
        onClick={() => openProductModal(product)}
        className="cursor-pointer col-span-1"
      >
        <h3 className="text-xl font-bold text-brand-dark">{product.name}</h3>
        <p className="text-gray-600 mt-1 text-sm line-clamp-2">
          {product.description || 'Состав не указан'}
        </p>
      </div>

      {/* 3. Цена и кнопки */}
      <div className="col-span-1 flex justify-end">
        <QuantityControl product={product} />
      </div>
    </div>
  );
};

export default DesktopProductListItem;
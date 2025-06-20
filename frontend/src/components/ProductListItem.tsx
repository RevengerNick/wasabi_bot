// src/components/ProductListItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import QuantityControl from './QuantityControl';
import { baseURL } from '../services/api';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const fullImageUrl = `${baseURL}/${product.image_url}`;

  return (
    <div className="flex items-start gap-4 border-b pb-6 w-full">
      <div className="flex-1 flex flex-col min-w-30">
        
        <Link to={`/product/${product.id}`} className="flex-grow">
          <h3 className="text-brand-dark font-bold text-lg truncate">
            {product.name}
          </h3>
          <p className="text-brand-green-light text-sm mt-1 mb-3 h-10 line-clamp-2">
            {product.description || 'Состав не указан.'}
          </p>
        </Link>
        
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
          className="mt-auto"
        >
          <QuantityControl product={product} />
        </div>
      </div>
      
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <img 
          src={fullImageUrl}
          alt={product.name}
          className="w-40 h-28 object-cover rounded-lg bg-gray-100" 
        />
      </Link>
    </div>
  );
};

export default ProductListItem;
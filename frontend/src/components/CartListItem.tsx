// src/components/CartListItem.tsx
import React from 'react';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import type { CartItem } from '@/types';
import { baseURL } from '../services/api';

interface CartListItemProps {
  item: CartItem;
}

const CartListItem: React.FC<CartListItemProps> = ({ item }) => {
  const { optimistic_addItem, optimistic_decreaseQuantity, removeItem } = useCartStore();
  const fullImageUrl = `${baseURL}/${item.image_url}`;

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img 
        src={fullImageUrl} 
        alt={item.name} 
        className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <h3 className="font-bold text-brand-dark truncate">{item.name}</h3>
        <p className="text-sm text-brand-green-light mt-1">
          {item.price.toLocaleString('ru-RU')} сум
        </p>
        
        {/* Блок управления количеством */}
        <div className="flex items-center gap-4 mt-2">
          <button 
            onClick={() => optimistic_decreaseQuantity(item.id)} 
            className="bg-brand-gray p-2 rounded-full text-brand-dark transition-transform active:scale-90"
          >
            <FiMinus size={14} />
          </button>
          <span className="font-bold text-lg">{item.quantity}</span>
          <button 
            onClick={() => optimistic_addItem(item)} 
            className="bg-brand-gray p-2 rounded-full text-brand-dark transition-transform active:scale-90"
          >
            <FiPlus size={14} />
          </button>
        </div>
      </div>
      
      {/* Кнопка полного удаления товара */}
      <button 
        onClick={() => removeItem(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <FiTrash2 size={20} />
      </button>
    </div>
  );
};

export default CartListItem;
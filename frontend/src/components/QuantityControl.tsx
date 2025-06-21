// src/components/QuantityControl.tsx
import React from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types';

interface QuantityControlProps {
  product: Product;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ product }) => {
  const items = useCartStore((state) => state.items);
  // --- ИСПОЛЬЗУЕМ НОВЫЕ ФУНКЦИИ ---
  const addItem = useCartStore((state) => state.optimistic_addItem);
  const decreaseQuantity = useCartStore((state) => state.optimistic_decreaseQuantity);

  const itemInCart = items.find(item => item.id === product.id);
  const quantity = itemInCart ? itemInCart.quantity : 0;

  if (quantity === 0) {
    return (
      <button onClick={() => addItem(product)} className="bg-brand-gray text-brand-dark text-sm font-bold py-2 px-4 rounded-lg transition-all">
        {product.price.toLocaleString('ru-RU')} сум
      </button>
    );
  }

  const totalPrice = (product.price * quantity).toLocaleString('ru-RU');
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3 bg-brand-gray rounded-lg p-1">
        <button onClick={() => decreaseQuantity(product.id)} className="p-1"><FiMinus size={16} /></button>
        <span className="font-bold text-lg w-5 text-center">{quantity}</span>
        <button onClick={() => addItem(product)} className="p-1"><FiPlus size={16} /></button>
      </div>
      <div className="text-right">
        <span className="font-bold text-brand-dark text-lg">{totalPrice} сум</span>
      </div>
    </div>
  );
};

export default QuantityControl;
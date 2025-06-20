// src/components/QuantityControl.tsx
import React from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types';

interface QuantityControlProps {
  product: Product;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ product }) => {
  // Получаем состояние и действия из нашего глобального хранилища
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const itemInCart = items.find(item => item.id === product.id);
  const quantity = itemInCart ? itemInCart.quantity : 0;

  // Если товара нет в корзине, показываем кнопку с ценой
  if (quantity === 0) {
    return (
      <button
        onClick={() => addItem(product)}
        className="bg-brand-gray min-w-30 h-10 max-w-[30vw] text-brand-dark text-md font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-300 transform active:scale-95"
      >
        {product.price.toLocaleString('ru-RU')} сум
      </button>
    );
  }

  // Если товар в корзине, показываем счетчик
  const totalPrice = (product.price * quantity).toLocaleString('ru-RU');
  return (
    <div className="flex items-center justify-between min-w-30 h-10 w-full">
      <div className="flex items-center gap-3 bg-brand-gray rounded-lg p-1">
        <button onClick={() => decreaseQuantity(product.id)} className="p-2 hover:bg-gray-300 rounded-lg"><FiMinus size={16} /></button>
        <span className="font-bold text-lg w-5 text-center">{quantity}</span>
        <button onClick={() => addItem(product)} className="p-2 hover:bg-gray-300 rounded-lg"><FiPlus size={16} /></button>
      </div>
      <div className="text-right">
        <span className="font-bold text-brand-dark text-lg">{totalPrice} сум</span>
      </div>
    </div>
  );
};

export default QuantityControl;
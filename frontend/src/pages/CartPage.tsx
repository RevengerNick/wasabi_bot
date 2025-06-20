// src/pages/CartPage.tsx
import React from 'react';
import Header from '../components/Header';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';

const CartPage: React.FC = () => {
    const { items, addItem, decreaseQuantity, removeItem } = useCartStore();

    const totalCost = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header title="Корзина" showCloseButton={true} />
            
            {items.length === 0 ? (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500">Ваша корзина пуста</p>
                </div>
            ) : (
                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                            {/* ... верстка элемента корзины ... */}
                            <div className="flex items-center gap-3">
                                <button onClick={() => decreaseQuantity(item.id)}><FiMinus /></button>
                                <span>{item.quantity}</span>
                                <button onClick={() => addItem(item)}><FiPlus /></button>
                                <button onClick={() => removeItem(item.id)}><FiTrash2 className="text-red-500" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {items.length > 0 && (
                <div className="p-4 bg-white border-t">
                    <h3 className="text-lg font-bold">Итого: {totalCost.toLocaleString('ru-RU')} сум</h3>
                    <button className="w-full bg-brand-green text-white font-bold py-3 mt-2 rounded-lg">Оформить заказ</button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
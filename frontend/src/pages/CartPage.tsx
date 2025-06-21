// src/pages/CartPage.tsx
import React from 'react';
import Header from '../components/Header';
import { useCartStore } from '../store/cartStore';
import CartListItem from '../components/CartListItem'; // <-- Импортируем наш новый компонент
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const CartPage: React.FC = () => {
    const { items } = useCartStore();
    const user = useUserStore(state => state.user);
    const navigate = useNavigate();

const handleCheckout = () => {
        if (!user?.phone_number) {
            // Если номера нет, отправляем на страницу его обновления/ввода
            alert("Для оформления заказа необходимо указать номер телефона в профиле.");
            navigate('/update-phone'); // Мы создадим эту страницу
        } else {
            // Если номер есть, переходим к оформлению
            navigate('/checkout');
        }
    };

    // Считаем общую стоимость корзины
    const totalCost = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header title="Корзина" showCloseButton={true} />
            
            {/* Основной контент */}
            <div className="flex-grow p-4 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-full pt-20">
                        <h2 className="text-xl font-bold text-brand-dark">Ваша корзина пуста</h2>
                        <p className="text-gray-500 mt-2">Самое время добавить что-нибудь вкусное!</p>
                        <button 
                            onClick={() => navigate('/menu')}
                            className="mt-6 bg-brand-green text-white font-bold py-3 px-6 rounded-lg"
                        >
                            Перейти в меню
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map(item => (
                            <CartListItem key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>

            {/* "Липкий" футер с кнопкой. Появляется, только если в корзине есть товары */}
            {items.length > 0 && (
                <div className="p-4 bg-white border-t border-gray-100 shadow-t-lg sticky bottom-0">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Итого:</span>
                        <span className="text-2xl font-bold text-brand-dark">
                            {totalCost.toLocaleString('ru-RU')} сум
                        </span>
                    </div>
                    <button onClick={handleCheckout} className="w-full bg-brand-green text-white font-bold py-3 rounded-lg text-lg">
                        Оформить заказ
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
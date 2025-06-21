// frontend/src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const CheckoutPage: React.FC = () => {
    const { items, clearCart } = useCartStore();
    const user = useUserStore((state) => state.user);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const totalCost = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCreateOrder = async () => {
        if (!address) {
            alert('Пожалуйста, введите адрес доставки');
            return;
        }
        setLoading(true);
        try {
            const newOrder = await api.createOrder({ address, contactPhone: user!.phone_number! });
            alert(`Ваш заказ №${newOrder.public_id} успешно создан!`);
            clearCart();
            navigate('/');
        } catch (error) {
            alert('Не удалось создать заказ.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="Оформление заказа" showBackButton={true} />
            <div className="p-4 space-y-6">
                {/* Секция "Состав заказа" */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-2">Ваш заказ</h3>
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm py-1">
                            <span>{item.name} x {item.quantity}</span>
                            <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} сум</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t">
                        <span>Итого:</span>
                        <span>{totalCost.toLocaleString()} сум</span>
                    </div>
                </div>

                {/* Секция "Данные доставки" */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-2">Данные для доставки</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Номер телефона</label>
                        <input type="text" readOnly value={user?.phone_number || ''} className="w-full mt-1 p-2 bg-gray-100 rounded-md" />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Адрес доставки</label>
                        <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} className="w-full mt-1 p-2 border rounded-md" />
                    </div>
                </div>

                <button onClick={handleCreateOrder} disabled={loading} className="w-full bg-brand-green text-white font-bold py-3 rounded-lg">
                    {loading ? 'Обработка...' : 'Заказать'}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
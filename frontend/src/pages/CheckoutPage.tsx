// frontend/src/pages/CheckoutPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { useAddressStore } from '../store/addressStore';
import { useCheckoutStore } from '../store/checkoutStore'; // Импортируем наш стор для адреса с карты
import * as api from '../services/api';
import { FiMapPin } from 'react-icons/fi';

const CheckoutPage: React.FC = () => {
    const user = useUserStore((state) => state.user);
    const { clearCart } = useCartStore();
    const { addresses, fetchAddresses } = useAddressStore();
    
    // Получаем адрес, выбранный на карте, и функцию его очистки
    const { selectedAddress: addressFromMap, clearAddress } = useCheckoutStore();

    // Локальное состояние для выбора адреса
    const [deliveryAddress, setDeliveryAddress] = useState('');
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    // --- ГЛАВНАЯ ЛОГИКА ---
    // Если мы вернулись со страницы карты, используем этот адрес
    useEffect(() => {
        if (addressFromMap) {
            setDeliveryAddress(addressFromMap);
        }
    }, [addressFromMap]);

    //const totalCost = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCreateOrder = async () => {
        if (!deliveryAddress) {
            alert('Пожалуйста, выберите или укажите адрес доставки');
            return;
        }
        setLoading(true);
        try {
            const newOrder = await api.createOrder({ 
                address: deliveryAddress, 
                contactPhone: user!.phone_number! 
            });
            alert(`Ваш заказ №${newOrder.public_id} успешно создан!`);
            clearCart();
            clearAddress(); // Очищаем адрес с карты после успешного заказа
            navigate('/orders');
        } catch (error) {
            alert('Не удалось создать заказ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="Оформление заказа" showBackButton={true} />
            <div className="p-4 space-y-6">
                {/* ... (Секция "Состав заказа") ... */}

                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-2">Данные для доставки</h3>
                    {/* ... (Поле с номером телефона) ... */}
                    
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Адрес доставки</label>
                        <p className="text-xs text-gray-500 mb-2">Выберите сохраненный адрес или укажите на карте.</p>

                        <select 
                            value={deliveryAddress} 
                            onChange={e => setDeliveryAddress(e.target.value)}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-white"
                        >
                            <option value="" disabled>Выберите из сохраненных...</option>
                            {addresses.map(addr => (
                                <option key={addr.id} value={addr.full_address}>
                                    {addr.full_address}
                                </option>
                            ))}
                        </select>
                        <Link to="/addresses" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                            Управлять текстовыми адресами
                        </Link>
                    </div>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">ИЛИ</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <Link to="/select-address">
                        <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-lg text-brand-green hover:bg-green-50">
                            <FiMapPin /> Выбрать точный адрес на карте
                        </button>
                    </Link>
                    
                    {/* Показываем выбранный адрес, если он был выбран на карте */}
                    {addressFromMap && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
                            <span className="font-semibold">Адрес с карты:</span> {addressFromMap}
                        </div>
                    )}
                </div>

                <button onClick={handleCreateOrder} disabled={loading || !deliveryAddress} className="w-full bg-brand-green text-white font-bold py-3 rounded-lg disabled:bg-gray-400">
                    {loading ? 'Обработка...' : 'Заказать'}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
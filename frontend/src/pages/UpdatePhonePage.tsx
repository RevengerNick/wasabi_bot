// frontend/src/pages/UpdatePhonePage.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import * as api from '../services/api';

export const UpdatePhonePage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Простая валидация
        if (phone.length < 9) {
            setError('Пожалуйста, введите корректный номер телефона.');
            return;
        }
        
        setLoading(true);
        setError('');

        try {
            // Вызываем API для обновления номера
            await api.updateUserPhone(phone);
        } catch (err) {
            setError('Не удалось обновить номер. Попробуйте снова.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="Подтверждение номера" showBackButton={true} />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold mb-2 text-center text-brand-dark">Ваш номер телефона</h2>
                        <p className="text-center text-gray-600 mb-6">Он необходим для оформления и подтверждения заказа.</p>
                        
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Номер телефона</label>
                        <input
                            id="phone"
                            type="tel"
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+998 XX XXX XX XX"
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                            required
                            autoFocus 
                        />
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full mt-6 py-3 px-4 bg-brand-green text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all"
                        >
                            {loading ? 'Сохранение...' : 'Сохранить и продолжить'}
                        </button>
                        
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePhonePage;
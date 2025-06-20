import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import * as api from '../services/api';

const LoginPage: React.FC = () => {
    const [step, setStep] = useState(1); // 1: ввод номера, 2: ввод кода
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(loading)
        if (WebApp.initData && WebApp.initData.length > 0) {
            api.loginViaTelegram(WebApp.initData)
                .catch(err => {
                    console.error("Ошибка тихого входа:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 9) {
            setError('Неверный формат номера');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code !== '121212') {
            setError('Неверный код');
            return;
        }
        try {
            // Теперь эта функция обновит состояние, и App.tsx сам перерисуется
            await api.loginViaPhone(phone, code)
            await api.updateUserPhone(phone);
        } catch (err) {
            console.log(err)
            setError('Не удалось обновить номер.');
        }
    };
    
    // Этот компонент показывается только если пользователь УЖЕ вошел через Telegram,
    // но ему нужно ввести номер. Или если он в браузере.
    // Сценарий, где он сначала вводит номер для создания аккаунта, мы пока не реализуем для простоты.
    // Вместо этого мы реализуем обновление номера для УЖЕ существующего пользователя.

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                {step === 1 ? (
                    <form onSubmit={handlePhoneSubmit}>
                        <h2 className="text-2xl font-bold mb-2 text-center">Подтверждение</h2>
                        <p className="text-center text-gray-600 mb-6">Введите ваш номер телефона для продолжения.</p>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Номер телефона</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+998 XX XXX XX XX"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button type="submit" className="w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Получить код
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleCodeSubmit}>
                        <h2 className="text-2xl font-bold mb-2 text-center">Введите код</h2>
                        <p className="text-center text-gray-600 mb-6">Мы отправили (условно) код на номер {phone}.</p>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Код подтверждения</label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="121212"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button type="submit" className="w-full mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            Подтвердить
                        </button>
                    </form>
                )}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
// frontend/src/pages/AboutPage.tsx
import React from 'react';
import Header from '../components/Header';
import { FiCoffee, FiPackage, FiZap } from 'react-icons/fi';

const AboutPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="О нас" showBackButton={true} />
            
            <div className="p-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-brand-dark mb-2">Wasabi MVP</h1>
                    <p className="text-lg text-brand-green-light">
                        Ваш идеальный выбор для наслаждения изысканным вкусом японской кухни.
                    </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 text-gray-700">
                    <p>
                        Этот проект был создан как MVP (Minimum Viable Product) с целью демонстрации современных подходов в веб-разработке и создания удобного сервиса для заказа суши.
                    </p>
                    <p>
                        Мы верим, что технологии должны делать жизнь проще и вкуснее. Поэтому мы разработали этот интуитивно понятный интерфейс, который работает одинаково хорошо как в Telegram, так и в обычном браузере.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-center mt-10 mb-6">Наши принципы</h2>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <FiZap size={40} className="mx-auto text-brand-green mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Скорость</h3>
                        <p className="text-sm text-gray-600">Оптимизированный интерфейс и быстрая серверная логика для мгновенного отклика.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <FiPackage size={40} className="mx-auto text-brand-green mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Надежность</h3>
                        <p className="text-sm text-gray-600">Синхронизация корзины и данных между устройствами в реальном времени.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <FiCoffee size={40} className="mx-auto text-brand-green mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Удобство</h3>
                        <p className="text-sm text-gray-600">Адаптивный дизайн и интуитивно понятная навигация для лучшего пользовательского опыта.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
import React from 'react';
import { FiCreditCard, FiMapPin, FiBell, FiLogOut, FiTrash2, FiList } from 'react-icons/fi';
import Header from '../components/Header';
import ProfileMenuItem from '../components/ProfileMenuItem';
import { useUserStore } from '../store/userStore';
import * as api from '../services/api';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    // Получаем пользователя и функцию выхода из нашего глобального хранилища
    const { user, logout } = useUserStore();

    // Обработчик для простого выхода
    const handleLogout = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            logout();
            // После вызова logout(), App.tsx автоматически перенаправит на LoginPage
        }
    };

    // Обработчик для удаления аккаунта
    const handleDeleteAccount = async () => {
        if (window.confirm('ВЫ УВЕРЕНЫ? Это действие нельзя будет отменить. Все ваши данные будут удалены.')) {
            try {
                await api.deleteMe();
                alert('Ваш аккаунт был успешно удален.');
                logout(); // Очищаем хранилище на фронте после удаления на бэке
            } catch (error) {
                console.error("Ошибка при удалении аккаунта:", error);
                alert('Не удалось удалить аккаунт. Пожалуйста, попробуйте снова.');
            }
        }
    };

    // Если по какой-то причине пользователя нет, показываем заглушку
    if (!user) {
        return (
            <div className="bg-white min-h-screen">
                <Header title="Профиль" />
                <p className="text-center p-8">Не удалось загрузить данные пользователя.</p>
            </div>
        );
    }

    const accountItems = [
        { icon: FiCreditCard, label: 'Способы оплаты' },
        { icon: FiMapPin, label: 'Адреса' },
        { icon: FiBell, label: 'Уведомления' },
    ];
    
     const displayId = user.telegram_id 
        ? `Telegram ID: ${user.telegram_id}` 
        : `Client ID: ${user.id.substring(0, 8).toUpperCase()}`;

     return (
        <div className="bg-white min-h-screen">
            <Header title="Профиль" />
            <div className="flex flex-col items-center p-4 border-b">
                <img 
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.id}`} // Аватарку генерируем по неизменному UUID
                    className="w-24 h-24 rounded-full" 
                    alt="User avatar" 
                />
                <h2 className="text-2xl font-bold mt-4">{user.first_name || 'Пользователь'}</h2>
                <p className="text-gray-600">{user.phone_number || 'Номер не указан'}</p>
                {/* Отображаем наш новый, безопасный ID */}
                <p className="text-xs text-gray-400 mt-2">{displayId}</p>
            </div>
            
            <div className="px-4 mt-4">
                
                <h3 className="text-lg font-bold text-brand-dark mb-2">Аккаунт</h3>
                <Link to="/orders">
    <ProfileMenuItem icon={FiList} label="История заказов" />
</Link>
                {accountItems.map(item => <ProfileMenuItem key={item.label} icon={item.icon} label={item.label} />)}
                
                {/* Секция "Опасная зона" */}
                <h3 className="text-lg font-bold text-red-600 mt-6 mb-2">Опасная зона</h3>
                
                {/* Кнопка выхода */}
                <div onClick={handleLogout} className="flex items-center gap-4 py-3 cursor-pointer hover:bg-gray-50 rounded-lg">
                    <div className="bg-gray-200 p-2 rounded-lg"><FiLogOut className="w-6 h-6 text-gray-600" /></div>
                    <span className="text-brand-dark text-base">Выйти</span>
                </div>
                
                {/* Кнопка удаления */}
                <div onClick={handleDeleteAccount} className="flex items-center gap-4 py-3 cursor-pointer hover:bg-red-50 rounded-lg">
                    <div className="bg-red-100 p-2 rounded-lg"><FiTrash2 className="w-6 h-6 text-red-600" /></div>
                    <span className="text-red-600 text-base">Удалить аккаунт</span>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
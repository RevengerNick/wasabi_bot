import React from 'react';
import { Link } from 'react-router-dom'; // <-- Добавляем Link
import { 
    FiCreditCard, FiMapPin, FiBell, FiList, 
    FiInfo, FiMail, // <-- Новые иконки
    FiLogOut, FiTrash2 
} from 'react-icons/fi';
import Header from '../components/Header';
import ProfileMenuItem from '../components/ProfileMenuItem';
import { useUserStore } from '../store/userStore';
import * as api from '../services/api';
import { useScreenSize } from '../hooks/useScreenSize';

const ProfilePage: React.FC = () => {
    const { isDesktop } = useScreenSize();
    const { user, logout } = useUserStore();
    const handleLogout = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            logout();
        }
    };

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
    
     const orderItems = [
        { to: "/orders", icon: FiList, label: 'История заказов' }
    ];

    const infoItems = [
        { to: "/about", icon: FiInfo, label: 'О приложении' },
        { to: "/contact", icon: FiMail, label: 'Связаться с нами' },
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
            
            <div className="px-4 mt-4 space-y-6 "> {/* Добавляем space-y-6 для красивых отступов между блоками */}
                
                {/* --- СЕКЦИЯ АККАУНТ --- */}
                <div>
                    <h3 className="text-lg font-bold text-brand-dark mb-2">Аккаунт</h3>
                    {accountItems.map(item => <ProfileMenuItem key={item.label} icon={item.icon} label={item.label} />)}
                </div>
                
                {/* --- СЕКЦИЯ ЗАКАЗЫ --- */}
                <div>
                    <h3 className="text-lg font-bold text-brand-dark mb-2">Заказы</h3>
                    {orderItems.map(item => (
                        <Link to={item.to} key={item.label}>
                            <ProfileMenuItem icon={item.icon} label={item.label} />
                        </Link>
                    ))}
                </div>

                {/* --- НОВАЯ СЕКЦИЯ "ИНФОРМАЦИЯ" --- */}
                {!isDesktop &&
                <div>
                    <h3 className="text-lg font-bold text-brand-dark mb-2">Информация</h3>
                    {infoItems.map(item => (
                        <Link to={item.to} key={item.label}>
                            <ProfileMenuItem icon={item.icon} label={item.label} />
                        </Link>
                    ))}
                </div>}

                {/* --- СЕКЦИЯ "ОПАСНАЯ ЗОНА" --- */}
                <div className="pt-4 border-t">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Управление аккаунтом</h3>
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
            
        </div>
    );
};

export default ProfilePage;
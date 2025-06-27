// src/components/DesktopHeader.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {  FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import ProfileModal from './ProfileModal';

const DesktopHeader: React.FC = () => {
  // Получаем общее количество товаров из нашего глобального хранилища
  const totalItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  // Ссылки для центральной навигации
  const navLinks = [
    { to: '/menu', label: 'Меню' },
    { to: '/orders', label: 'История заказов' },
    { to: '/about', label: 'О нас' },
    { to: '/contact', label: 'Контакты' },
  ];

  return (
    <>
    <header className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* === Левая часть: Логотип === */}
        <div className="flex-1 flex justify-start">
          <NavLink to="/" className="text-xl font-bold text-brand-dark flex items-center gap-2">
            🍣
            <span>Sushi House</span>
          </NavLink>
        </div>

        {/* === Центральная часть: Навигация === */}
        <div className="flex-2 flex justify-center items-center gap-8">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-gray-600 hover:text-brand-dark transition-colors pb-1 ${
                  isActive ? 'font-bold text-brand-dark border-b-2 border-brand-dark' : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* === Правая часть: Иконки действий === */}
        <div className="flex-1 flex justify-end items-center gap-6">          
          <NavLink to="/cart" className="relative">
            <FiShoppingCart className="w-6 h-6 text-gray-600 hover:text-brand-dark transition-colors" />
            {/* Бейдж с количеством товаров. Появляется, только если в корзине что-то есть. */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </NavLink>
          
          <button onClick={() => setProfileModalOpen(true)}>
            {/* Используем аватар, как на вашем макете */}
            <img 
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/S9Zqf2i8j3/3iv992fp_expires_30_days.png" 
              alt="User Profile" 
              className="w-9 h-9 rounded-full cursor-pointer border-2 border-transparent hover:border-brand-green transition-all" 
            />
          </button>
        </div>
      </nav>
    </header>
    <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
    
  );
};

export default DesktopHeader;
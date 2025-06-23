// src/components/BottomNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi';

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: FiHome, label: 'Главная' },
    { to: '/menu', icon: FiGrid, label: 'Меню' },
    { to: '/cart', icon: FiShoppingCart, label: 'Корзина' },
    { to: '/profile', icon: FiUser, label: 'Профиль' },
  ];

  // Стили для активной и неактивной ссылки
  const activeStyle = { color: '#d9d9d9' };
  const inactiveStyle = { color: '#ffffff' };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-green-800 shadow-t rounded-t-3xl z-30">
      <div className="flex justify-around items-start self-stretch pt-2 px-2">
        {navItems.map(item => (
          <NavLink 
            key={item.to}
            to={item.to}
            style={({ isActive }) => isActive ? activeStyle : inactiveStyle}
           className={({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 w-1/4 rounded-t-3xl p-1 mx-1 transition-all duration-200 hover:bg-green-600 ${
      isActive ? 'bg-green-700 text-white' : 'text-gray-200'
    }`
  }
  >
            <item.icon className="w-6 h-6" />
            <span className="text-s font-bold text-white">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
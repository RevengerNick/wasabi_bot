import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiX } from 'react-icons/fi';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    showCloseButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton, showCloseButton }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center self-stretch bg-white p-4 gap-6 sticky top-0 z-10 border-b border-gray-100">
            {showBackButton && <FiArrowLeft onClick={() => navigate(-1)} className="w-6 h-6 text-gray-800 cursor-pointer" />}
            {showCloseButton && <FiX onClick={() => navigate('/')} className="w-6 h-6 text-gray-800 cursor-pointer" />}
            
            <h1 className="flex-1 text-gray-800 text-lg font-bold text-center">
                {title}
            </h1>

            {/* Пустышка для выравнивания заголовка по центру, если иконка только одна */}
            {(showBackButton || showCloseButton) && <div className="w-6 h-6"></div>}
        </div>
    );
};

export default Header;
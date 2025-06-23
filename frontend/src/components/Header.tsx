// frontend/src/components/Header.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiX } from 'react-icons/fi';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    showCloseButton?: boolean;
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton, showCloseButton, children }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center self-stretch bg-white p-4 sticky top-0 z-10 border-b rounded-2xl">
            
            {/* Левый блок: ВСЕГДА занимает место под иконку */}
            <div className="size-8 flex items-center justify-center">
              {showBackButton && <FiArrowLeft onClick={() => navigate(-1)} className="w-6 h-6 text-gray-800 cursor-pointer" />}
              {showCloseButton && <FiX onClick={() => navigate('/')} className="w-6 h-6 text-gray-800 cursor-pointer" />}
            </div>

            <h1 className="flex-1 text-gray-800 text-lg font-bold text-center">
                {title}
            </h1>

            {/* Правый блок: ВСЕГДА занимает место под иконку */}
            <div className="size-8 flex items-center justify-center">
              {children ? <Link to="/search">{children}</Link> : null}
            </div>
        </div>
    );
};

export default Header;
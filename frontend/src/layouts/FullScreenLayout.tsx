// src/layouts/FullScreenLayout.tsx
import React from 'react';

interface FullScreenLayoutProps {
  children: React.ReactNode;
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({ children }) => {
  return (
    // Этот layout просто занимает весь экран
    // h-screen и w-screen на мобильных устройствах
    // min-h-screen на десктопе
    <div className="w-screen h-screen min-h-screen bg-gray-100">
      {children}
    </div>
  );
};
export default FullScreenLayout;
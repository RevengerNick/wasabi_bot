// src/layouts/MobileLayout.tsx
import React from 'react';
import BottomNav from '../components/BottomNav';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    // Убираем max-w-lg и mx-auto. Теперь этот layout будет растягиваться на всю ширину.
    <div className="font-sans bg-white min-h-screen">
      <main className="pb-24">
        {children}
      </main>
      {/* Нижняя навигация остается на месте */}
      <BottomNav />
    </div>
  );
};

export default MobileLayout;
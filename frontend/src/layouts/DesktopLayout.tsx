// src/layouts/DesktopLayout.tsx
import React from 'react';
import DesktopHeader from '../components/DesktopHeader';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <DesktopHeader />
      {/* Контент центрируется, а фон занимает все пространство */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DesktopLayout;
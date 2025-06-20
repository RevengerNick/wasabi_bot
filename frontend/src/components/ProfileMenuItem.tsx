// src/components/ProfileMenuItem.tsx
import React from 'react';

interface ProfileMenuItemProps {
  icon: React.ElementType; // Позволяет передавать компонент иконки как пропс
  label: string;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ icon: Icon, label }) => {
  return (
    <div className="flex items-center gap-4 py-3 cursor-pointer hover:bg-gray-50 rounded-lg">
      <div className="bg-brand-gray p-2 rounded-lg">
        <Icon className="w-6 h-6 text-brand-green-light" />
      </div>
      <span className="text-brand-dark text-base">{label}</span>
    </div>
  );
};

export default ProfileMenuItem;
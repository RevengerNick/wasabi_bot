// src/components/Tabs.tsx
import React from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabClick(tab)}
          className={`py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === tab
              ? 'border-b-2 border-brand-dark text-brand-dark'
              : 'text-gray-500 hover:text-brand-dark'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
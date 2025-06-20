// src/components/CategoryCard.tsx
import React from 'react';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="flex flex-1 flex-col pb-3 gap-3 cursor-pointer">
      <img
        src={category.image_url}
        className="self-stretch h-[173px] object-cover rounded-lg" // object-cover лучше чем fill
      />
      <div className="flex flex-col items-start self-stretch">
        <span className="text-[#0F1614] text-base font-bold">{category.name}</span>
        <span className="text-[#5E8C75] text-sm">{category.description}</span>
      </div>
    </div>
  );
};

export default CategoryCard;
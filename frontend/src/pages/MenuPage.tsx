// src/pages/MenuPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import CategoryCard from '../components/CategoryCard';
import type { Category } from '../types';
import * as api from '../services/api';

const MenuPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await api.getCategories();

        // --- ВОТ ВТОРОЕ ГЛАВНОЕ ИЗМЕНЕНИЕ ---
        const categoriesWithProducts = data
            // 1. Фильтруем: оставляем только те категории, где есть продукты
            .filter(cat => cat._count && cat._count.products > 0)
            // 2. Мапим: добавляем полный URL картинки и описание (как и раньше)
            .map(cat => ({
                ...cat,
                image_url: `${api.baseURL}/images/${cat.name}.jpg`,
                description: `Все из категории "${cat.name}"`
            }));

        setCategories(categoriesWithProducts);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить категории. Пожалуйста, попробуйте позже.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ... остальная часть компонента без изменений
  const chunkArray = (array: Category[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };
  const categoryPairs = chunkArray(categories, 2);

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="flex items-center self-stretch bg-white py-3 px-4 gap-6 sticky top-0 z-10 border-b rounded-2xl">
        <div className='size-8'></div>
        <h1 className="flex-1 text-gray-800 text-lg font-bold text-center">Меню</h1>
        <Link to={'/search'} className=' rounded-2xl p-2 hover:bg-gray-200 transition-all duration-200'>
          <FiSearch  className="w-6 h-6 text-gray-800" />
        </Link>
      </div>

      <div className="flex flex-col self-stretch p-4 gap-4">
        {loading && <p className="text-center text-gray-500 py-10">Загрузка категорий...</p>}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}
        
        {!loading && !error && categories.length === 0 && (
            <p className="text-center text-gray-500 py-10">Нет доступных категорий с товарами.</p>
        )}

        {!loading && !error && categoryPairs.map((pair, index) => (
          <div key={index} className="flex items-start self-stretch gap-4">
            {pair.map((category) => (
              <Link to={`/menu/${category.id}`} key={category.id} className="flex-1">
                <CategoryCard category={category} />
              </Link>
            ))}
            {pair.length === 1 && <div className="flex-1"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
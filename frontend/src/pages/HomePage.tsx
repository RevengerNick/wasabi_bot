// frontend/src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';
import * as api from '../services/api';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [popularItems, setPopularItems] = useState<Product[]>([]);

    useEffect(() => {
        const fetchPopularItems = async () => {
            // Для примера возьмем товары из категории "Роллы" (ID 1)
            try {
                const products = await api.getProductsByCategoryId(1);
                setPopularItems(products.slice(0, 4)); // Показываем только первые 4
            } catch (error) {
                console.error("Не удалось загрузить популярные товары:", error);
            }
        };
        fetchPopularItems();
    }, []);

    return (
        <div className="bg-gray-50">
            {/* --- Секция Hero --- */}
            <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-white text-center">
                <img 
                    src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1948&auto=format&fit=crop"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    alt="Assorted sushi on a plate"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
                <div className="relative z-20 p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Вкусные суши с доставкой к вам</h1>
<p className="mt-4 max-w-lg mx-auto">Закажите суши онлайн с доставкой или на вынос.</p>
                    <button 
                        onClick={() => navigate('/menu')}
                        className="mt-8 bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105"
                    >
                        Заказать
                    </button>
                </div>
            </div>

            {/* --- Секция Popular Items --- */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center text-brand-dark mb-8">Популярные позиции</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {popularItems.map(product => (
                        <ProductCard key={product.id} product={{...product, image_url: `/${product.image_url}`}} />
                    ))}
                </div>
            </div>

             {/* --- Секция About Us --- */}
             <div className="text-center py-12 bg-white">
                <h2 className="text-3xl font-bold text-brand-dark mb-4">About Us</h2>
                <p className="max-w-2xl mx-auto text-gray-600">
                    Мы готовим свежие, высококачественные суши из отборных ингредиентов. Наша любовь к настоящей японской кухне вдохновляет нас создавать незабываемые вкусовые впечатления — где бы вы ни находились: дома или в пути.
                </p>
             </div>
        </div>
    );
};

export default HomePage;
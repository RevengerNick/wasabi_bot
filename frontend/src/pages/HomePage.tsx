// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';
import * as api from '../services/api';

const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    
    // TODO: В будущем эти данные должны приходить со специальных эндпоинтов /api/featured и /api/popular
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        // Пока таких эндпоинтов нет, просто возьмем первые несколько продуктов из первой категории
        const fetchInitialProducts = async () => {
            const products = await api.getProductsByCategoryId(1); // Предположим, что категория 1 - Роллы
            setFeaturedProducts(products.slice(0, 4)); // Берем первые 4
        };
        fetchInitialProducts();
    }, []);

    return (
        <div className="flex flex-col bg-white">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/S9Zqf2i8j3/rzizhdws_expires_30_days.png" className="w-full h-52 object-cover" alt="Sushi banner"/>
            
            <div className="p-4 -mt-8 relative z-10">
                <div className="flex items-center bg-white shadow-md rounded-lg p-1">
                    <div className="p-2"><FiSearch className="w-6 h-6 text-brand-green-light" /></div>
                    <input
                        placeholder="Search for dishes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-brand-green-light placeholder-brand-green-light focus:outline-none"
                    />
                </div>
            </div>

            <div className="px-4 mt-4">
                <h2 className="text-brand-dark text-2xl font-bold mb-4">Featured Items</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {featuredProducts.map(product => (
                         <div key={product.id} className="flex-shrink-0">
                            <ProductCard product={{...product, image_url: `${api.baseURL}/${product.image_url}`}} />
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-4 mt-auto">
                <button 
                  onClick={() => navigate('/menu')}
                  className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Order Now
                </button>
            </div>
        </div>
    );
};

export default HomePage;
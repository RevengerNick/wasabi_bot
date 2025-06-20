// src/pages/ProductListPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import type { Product } from '../types';
import * as api from '../services/api';
import ProductListItem from '../components/ProductListItem'; // <-- Импортируем наш новый компонент

const ProductListPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!categoryId) return;
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await api.getProductsByCategoryId(Number(categoryId));
                setProducts(data);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить товары.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    return (
        <div className="flex flex-col bg-white min-h-screen">
            <Header title="Меню" showBackButton={true} />
            <div className="p-4">
                <h2 className="text-brand-dark text-2xl font-bold mb-4">Продукты</h2>
                
                {loading && <p className="text-center text-gray-500 py-10">Загрузка товаров...</p>}
                {error && <p className="text-center text-red-500 py-10">{error}</p>}

                <div className="flex flex-col gap-6">
                    {/* Теперь мы просто мапим массив и рендерим один компонент */}
                    {!loading && !error && products.map(product => (
                        <ProductListItem key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
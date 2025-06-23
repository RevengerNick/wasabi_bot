// frontend/src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductListItem from '../components/ProductListItem';
import { FiSearch } from 'react-icons/fi';
import type { Product } from '../types';
import * as api from '../services/api';
import { useDebounce } from 'use-debounce';

const SearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Используем debounce, чтобы запрос отправлялся через 500мс после того, как пользователь перестал печатать
    const [debouncedQuery] = useDebounce(query, 500);

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.trim() === '') {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const data = await api.searchProducts(debouncedQuery);
                setResults(data);
            } catch (error) {
                console.error("Ошибка поиска:", error);
            } finally {
                setLoading(false);
            }
        };
        performSearch();
    }, [debouncedQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        // Обновляем URL "на лету"
        setSearchParams({ q: e.target.value }, { replace: true });
    };

    return (
        <div className="flex flex-col bg-white min-h-screen">
            <Header title="Поиск" showBackButton={true} />
            
            {/* Поле ввода */}
            <div className="p-4 sticky top-0 bg-white z-10 border-b">
                <div className="flex items-center bg-brand-gray rounded-lg p-1">
                    <div className="p-2"><FiSearch className="w-6 h-6 text-brand-green-light" /></div>
                    <input
                        type="search"
                        placeholder="Название или ингредиент..."
                        value={query}
                        onChange={handleInputChange}
                        className="flex-1 bg-transparent text-brand-dark placeholder-gray-500 focus:outline-none"
                        autoFocus
                    />
                </div>
            </div>

            {/* Результаты */}
            <div className="p-4">
                {loading && <p className="text-center text-gray-500">Поиск...</p>}
                {!loading && debouncedQuery && results.length === 0 && (
                    <p className="text-center text-gray-500">Ничего не найдено.</p>
                )}
                <div className="flex flex-col gap-6">
                    {results.map(product => (
                        <ProductListItem key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default SearchPage;
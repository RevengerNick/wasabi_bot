// frontend/src/pages/OrderHistoryPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import OrderItem from '../components/OrderItem';
import * as api from '../services/api';

// Определяем, какие статусы к какой вкладке относятся
const TABS_CONFIG = {
  'Новые': ['new', 'confirmed'],
  'Текущие': ['in_delivery'],
  'Прошлые': ['completed', 'canceled'],
};

const OrderHistoryPage: React.FC = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Новые');

    useEffect(() => {
        api.getOrderHistory()
            .then(data => setAllOrders(data))
            .catch(err => console.error("Ошибка загрузки истории заказов:", err))
            .finally(() => setLoading(false));
    }, []);

    // Используем useMemo для эффективной фильтрации.
    // Список будет пересчитываться только когда меняется activeTab или allOrders.
    const filteredOrders = useMemo(() => {
        const statusesForTab = TABS_CONFIG[activeTab as keyof typeof TABS_CONFIG];
        return allOrders.filter((order: any) => statusesForTab.includes(order.status));
    }, [activeTab, allOrders]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="История заказов" showBackButton={true} />
            
            <div className="bg-white">
                <Tabs 
                    tabs={Object.keys(TABS_CONFIG)} 
                    activeTab={activeTab} 
                    onTabClick={setActiveTab} 
                />
            </div>
            
            <div className="p-4 flex-grow">
                {loading && <p className="text-center text-gray-500 py-10">Загрузка истории...</p>}

                {!loading && filteredOrders.length === 0 && (
                    <p className="text-center text-gray-500 py-10">
                        В этой категории заказов нет.
                    </p>
                )}

                {!loading && filteredOrders.length > 0 && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        {filteredOrders.map((order: any) => (
                            <OrderItem key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
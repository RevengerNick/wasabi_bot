// src/components/OrderItem.tsx
import React from 'react';
// Установите date-fns для форматирования даты: npm install date-fns
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface OrderItemProps {
  order: any; // Временно any, потом можно создать тип Order
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  // Функция для красивого отображения статуса
  const getStatusLabel = (status: string) => {
    switch(status) {
        case 'new': return { label: 'Новый', color: 'text-blue-600' };
        case 'confirmed': return { label: 'Подтвержден', color: 'text-yellow-600' };
        case 'in_delivery': return { label: 'В доставке', color: 'text-purple-600' };
        case 'completed': return { label: 'Завершен', color: 'text-green-600' };
        case 'canceled': return { label: 'Отменен', color: 'text-red-600' };
        default: return { label: status, color: 'text-gray-600' };
    }
  };

  const statusInfo = getStatusLabel(order.status);
  const formattedDate = format(new Date(order.created_at), 'dd MMMM yyyy, HH:mm', { locale: ru });

  return (
    <div className="py-4 border-b">
      <div className="flex justify-between items-center mb-1">
        <span className={`font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
        <span className="font-bold text-lg text-brand-dark">{order.total_price.toLocaleString('ru-RU')} сум</span>
      </div>
      <p className="text-sm text-gray-500">Заказ #{order.public_id}</p>
      <p className="text-sm text-gray-500">{order.delivery_address} • {formattedDate}</p>
    </div>
  );
};

export default OrderItem;
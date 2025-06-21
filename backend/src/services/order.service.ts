// backend/src/services/order.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface DeliveryDetails {
    address: string;
    contactPhone: string;
}

/**
 * Превращает активную корзину пользователя в полноценный заказ.
 */
export const createOrderFromCart = async (userId: string, details: DeliveryDetails) => {
    // 1. Находим активную корзину
    const cart = await prisma.order.findFirst({
        where: { user_id: userId, status: 'cart' },
        include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
        throw new Error('Корзина пуста или не найдена');
    }

    // 2. Считаем итоговую сумму на сервере, чтобы избежать подделки
    const productIds = cart.items.map(item => item.product_id);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    
    const totalPrice = cart.items.reduce((acc, item) => {
        const product = products.find(p => p.id === item.product_id);
        return acc + (product?.price || 0) * item.quantity;
    }, 0);

    // 3. Обновляем заказ: меняем статус, добавляем детали доставки и цену
    return prisma.order.update({
        where: { id: cart.id },
        data: {
            status: 'new', // Новый статус - "Новый заказ"
            delivery_address: details.address,
            contact_phone: details.contactPhone,
            total_price: totalPrice,
            final_price: totalPrice, // Пока без скидок
            created_at: new Date(),
        },
    });
};

/**
 * Получает историю заказов пользователя (все, кроме активной корзины).
 */
export const getOrderHistoryByUserId = async (userId: string) => {
    return prisma.order.findMany({
        where: {
            user_id: userId,
            NOT: { status: 'cart' },
        },
        orderBy: { created_at: 'desc' },
        include: { items: { include: { product: true } } },
    });
};
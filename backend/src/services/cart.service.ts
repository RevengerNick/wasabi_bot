// backend/src/services/cart.service.ts
import { PrismaClient, Order } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Находит или создает активную корзину для пользователя.
 */
async function findOrCreateCart(userId: string): Promise<Order> {
    const existingCart = await prisma.order.findFirst({
        where: {
            user_id: userId,
            status: 'cart',
        },
    });

    if (existingCart) {
        return existingCart;
    }

    return prisma.order.create({
        data: {
            user_id: userId,
            status: 'cart',
            total_price: 0,
            final_price: 0,
            contact_phone: '', // Будет заполнено при оформлении
        },
    });
}

/**
 * Получает корзину пользователя со всеми товарами.
 */
export const getCartByUserId = async (userId: string) => {
    const cart = await findOrCreateCart(userId);
    return prisma.order.findUnique({
        where: { id: cart.id },
        include: {
            items: { // Включаем товары в корзине
                include: {
                    product: true, // И информацию о самом продукте
                },
                orderBy: { id: 'asc' },
            },
        },
    });
};

/**
 * Добавляет, обновляет или удаляет товар в корзине.
 */
export const upsertItemInCart = async (userId: string, productId: number, quantity: number) => {
    const cart = await findOrCreateCart(userId);

    if (quantity <= 0) {
        // Если количество 0 или меньше, удаляем товар из корзины
        await prisma.orderItem.deleteMany({
            where: {
                order_id: cart.id,
                product_id: productId,
            },
        });
    } else {
        // Используем upsert: обновить, если есть, или создать, если нет
        await prisma.orderItem.upsert({
            where: {
                order_id_product_id: { // Уникальный ключ для связи
                    order_id: cart.id,
                    product_id: productId,
                },
            },
            update: { quantity: quantity },
            create: {
                order_id: cart.id,
                product_id: productId,
                quantity: quantity,
                price_at_order: (await prisma.product.findUnique({ where: { id: productId } }))?.price || 0,
            },
        });
    }

    // Возвращаем обновленную корзину
    return getCartByUserId(userId);
};
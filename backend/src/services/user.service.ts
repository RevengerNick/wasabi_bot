// backend/src/services/user.service.ts
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Находит пользователя по Telegram ID или создает нового, если он не найден.
 */
export const findOrCreateUserByTelegram = async (telegramUser: any): Promise<User> => {
    // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ---
    // Явно преобразуем ID в BigInt перед использованием
    const telegramIdAsString = String(telegramUser.id);

    // Сначала ищем пользователя
    const existingUser = await prisma.user.findUnique({
        where: { telegram_id: telegramIdAsString }
    });

    if (existingUser) {
        // Если нашли, просто возвращаем его, возможно, обновив имя
        return prisma.user.update({
            where: { id: existingUser.id },
            data: { 
                first_name: telegramUser.first_name,
                username: telegramUser.username,
            }
        });
    }

    // Если не нашли - создаем
    return prisma.user.create({
        data: {
            telegram_id: telegramIdAsString,
            first_name: telegramUser.first_name,
            username: telegramUser.username,
        },
    });
};


/**
 * Находит пользователя по номеру телефона.
 */
export const findUserByPhone = async (phoneNumber: string): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { phone_number: phoneNumber },
    });
};

/**
 * Создает нового пользователя на основе номера телефона.
 */
export const createUserByPhone = async (phoneNumber: string): Promise<User> => {
    return prisma.user.create({
        data: {
            phone_number: phoneNumber,
            first_name: `User ${phoneNumber.slice(-4)}`
        }
    });
};

/**
 * --- ВОТ НЕДОСТАЮЩАЯ ФУНКЦИЯ ---
 * Обновляет номер телефона для существующего пользователя по его ID.
 */
export const mergeOrUpdateUser = async (currentUserId: string, phoneNumber: string): Promise<User> => {
    return prisma.$transaction(async (tx) => {
        const existingUserWithPhone = await tx.user.findUnique({
            where: { phone_number: phoneNumber },
        });

        const currentUser = await tx.user.findUnique({ where: { id: currentUserId } });
        if (!currentUser) throw new Error("Текущий пользователь не найден");

        if (existingUserWithPhone && existingUserWithPhone.id !== currentUserId) {
            // СЦЕНАРИЙ СЛИЯНИЯ
            await tx.order.updateMany({
                where: { user_id: currentUserId },
                data: { user_id: existingUserWithPhone.id },
            });
            
            // Удаляем временный аккаунт
            await tx.user.delete({ where: { id: currentUserId } });

            // Обновляем основной аккаунт, добавляя в него telegram_id
            // Проверяем, что telegram_id не null перед обновлением
            if (currentUser.telegram_id) {
                await tx.user.update({
                    where: { id: existingUserWithPhone.id },
                    data: { telegram_id: currentUser.telegram_id },
                });
            }
            
            return (await tx.user.findUnique({where: {id: existingUserWithPhone.id}}))!;

        } else {
            // СЦЕНАРИЙ ОБНОВЛЕНИЯ
            return tx.user.update({
                where: { id: currentUserId },
                data: { phone_number: phoneNumber },
            });
        }
    });
};

export const deleteUserById = async (userId: string): Promise<User> => {
    return prisma.user.delete({
        where: { id: userId },
    });
};
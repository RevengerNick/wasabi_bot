// backend/src/services/user.service.ts
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Находит пользователя по Telegram ID или создает нового, если он не найден.
 */
export const findOrCreateUserByTelegram = async (telegramUser: any): Promise<User> => {
    return prisma.user.upsert({
        where: { telegram_id: BigInt(telegramUser.id) },
        update: { first_name: telegramUser.first_name, username: telegramUser.username },
        create: {
            telegram_id: BigInt(telegramUser.id),
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
    const pseudoTelegramId = BigInt(Date.now());
    return prisma.user.create({
        data: {
            phone_number: phoneNumber,
            telegram_id: pseudoTelegramId,
            first_name: `User ${phoneNumber.slice(-4)}`
        }
    });
};

/**
 * --- ВОТ НЕДОСТАЮЩАЯ ФУНКЦИЯ ---
 * Обновляет номер телефона для существующего пользователя по его ID.
 */
export const updateUserPhone = async (userId: number, phoneNumber: string): Promise<User> => {
    return prisma.user.update({
        where: { id: userId },
        data: { phone_number: phoneNumber },
    });
};

export const deleteUserById = async (userId: number): Promise<User> => {
    return prisma.user.delete({
        where: { id: userId },
    });
};
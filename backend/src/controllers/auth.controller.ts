import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service';
import { validateTelegramData } from '../utils/telegramValidator';
import { User } from '@prisma/client'; // Импортируем тип User

// --- НОВАЯ УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ---
const generateTokenAndRespond = (res: Response, user: User) => {
    // 1. Создаем объект с полезной нагрузкой для токена
    const payload: any = {
        id: user.id, // ID обязателен
    };
    // 2. Добавляем поля, только если они существуют
    if (user.telegram_id) payload.telegram_id = user.telegram_id.toString();
    if (user.phone_number) payload.phone_number = user.phone_number;
    if (user.first_name) payload.first_name = user.first_name;

    // 3. Подписываем токен
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    // 4. Отправляем ответ
    res.status(200).json({ token });
};
// Переименовываем для ясности
export const loginWithTelegram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { initData } = req.body;
        console.log(initData)
        if (!initData) {
            res.status(400).json({ message: 'initData не предоставлены' });
            return;
        }
        const { isValid, user: telegramUser } = validateTelegramData(initData, process.env.BOT_TOKEN!);
        if (!isValid || !telegramUser?.id) {
            res.status(403).json({ message: 'Невалидные данные' });
            return;
        }
        const userInDb = await userService.findOrCreateUserByTelegram(telegramUser);
        generateTokenAndRespond(res, userInDb);
    } catch (error) {
        console.log(error)
        next(error);
    }
};

export const loginWithPhone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phoneNumber, code } = req.body;
        if (!phoneNumber || !code) {
            res.status(400).json({ message: 'Номер телефона и код обязательны' });
            return;
        }
        if (code !== '121212') {
            res.status(403).json({ message: 'Неверный код подтверждения' });
            return;
        }

        let user = await userService.findUserByPhone(phoneNumber);
        if (!user) {
            user = await userService.createUserByPhone(phoneNumber);
        }
        generateTokenAndRespond(res, user);
    } catch (error) {
        next(error);
    }
};
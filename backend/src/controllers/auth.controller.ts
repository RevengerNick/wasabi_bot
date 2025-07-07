// backend/src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service';
import { validateTelegramData } from '../utils/telegramValidator';
import { User } from '@prisma/client';

// Универсальная функция для генерации токена и ответа
const generateTokenAndRespond = (res: Response, user: User) => {
    // --- ИСПРАВЛЕНИЕ: Убираем token_version ---
    const payload: any = { id: user.id };
    
    if (user.telegram_id) payload.telegram_id = user.telegram_id;
    
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    // Возвращаем и токен, и полного пользователя
    res.status(200).json({ token, user });
};
export const loginWithTelegram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { initData } = req.body;
        if (!initData) {
            res.status(400).json({ message: 'initData не предоставлены' });
            return;
        }
        const { isValid, user: telegramUser } = validateTelegramData(initData, process.env.BOT_TOKEN!);
        if (!isValid || !telegramUser?.id) {
            res.status(403).json({ message: 'Невалидные данные Telegram' });
            return;
        }
        const userInDb = await userService.findOrCreateUserByTelegram(telegramUser);
        generateTokenAndRespond(res, userInDb);
    } catch (error) {
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
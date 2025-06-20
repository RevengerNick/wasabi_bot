import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service';
import { validateTelegramData } from '../utils/telegramValidator';

// Переименовываем для ясности
export const loginWithTelegram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { initData } = req.body;
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
        const tokenPayload = { id: userInDb.id, telegram_id: userInDb.telegram_id.toString() };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: '7d' });
        res.status(200).json({ token });
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
        
        // --- ИСПРАВЛЕНО: Логика вынесена в сервис ---
        if (!user) {
            user = await userService.createUserByPhone(phoneNumber);
        }

        const tokenPayload = { id: user.id, telegram_id: user.telegram_id.toString() };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: '7d' });
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};
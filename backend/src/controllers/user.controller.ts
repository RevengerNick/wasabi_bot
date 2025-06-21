// backend/src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

// Express не передает типы в req.user по умолчанию, мы должны расширить их
// Создайте файл @types/express/index.d.ts в корне проекта backend и добавьте в него:
// declare namespace Express { export interface Request { user?: { id: number; telegram_id: string; }; } }
export const updatePhone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phoneNumber } = req.body;
        const userId = req.user?.id; // Получаем ID пользователя из JWT токена

        if (!userId || !phoneNumber) {
            res.status(400).json({ message: 'Отсутствует ID пользователя или номер телефона' });
            return;
        }

        const updatedUser = await userService.updateUserPhone(userId, phoneNumber);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(400).json({ message: 'Отсутствует ID пользователя' });
            return;
        }
        await userService.deleteUserById(userId);
        res.status(200).json({ message: 'Пользователь успешно удален' });
    } catch (error) {
        next(error);
    }
};

export const sendData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(req.body)
    res.status(200).json({ message: 'OK' });
    return;
};
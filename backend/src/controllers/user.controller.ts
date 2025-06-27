import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import * as userService from '../services/user.service';

// Копируем эту функцию сюда для использования
const generateTokenAndRespond = (res: Response, user: User) => {
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(200).json({ token, user });
};

export const updatePhone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phoneNumber } = req.body;
        // req.user теперь содержит ПОЛНОГО пользователя благодаря middleware
        const userId = req.user?.id;

        if (!userId || !phoneNumber) {
            res.status(400).json({ message: 'Отсутствует ID пользователя или номер телефона' });
            return;
        }

        const updatedUser = await userService.mergeOrUpdateUser(userId, phoneNumber);
        
        // Генерируем новый токен с обновленными данными
        generateTokenAndRespond(res, updatedUser);
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
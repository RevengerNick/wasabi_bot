// backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Токен не предоставлен' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; [key: string]: any };

        // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ---
        // Ищем пользователя в БД по ID из токена.
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        // Если пользователь не найден в БД (например, был удален), токен недействителен.
        if (!user) {
            res.status(401).json({ message: 'Пользователь не найден, токен недействителен' });
            return;
        }

        // Прикрепляем к запросу ПОЛНОГО пользователя из БД.
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Невалидный или просроченный токен' });
    }
};
// backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

declare global {
  namespace Express {
    interface Request {
      user?: User; // Тип User из Prisma уже может быть null, но мы сделаем его опциональным
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Токен не предоставлен' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        // Если пользователь был удален, но токен еще жив, возвращаем ошибку
        if (!user) {
            res.status(401).json({ message: 'Пользователь не найден' });
            return;
        }

        // --- ИСПРАВЛЕНИЕ ---
        // Теперь тип 'User' (не null) полностью соответствует типу 'User | undefined'
        req.user = user;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Невалидный или просроченный токен' });
    }
};
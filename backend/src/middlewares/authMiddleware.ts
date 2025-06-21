import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Убедимся, что секрет загружен
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не определен в .env файле!');
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // 1. Получаем заголовок Authorization
    const authHeader = req.headers.authorization;

    // 2. Проверяем, что он есть и в правильном формате (Bearer <token>)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Если нет - отправляем 401 и прекращаем обработку
        res.status(401).json({ message: 'Токен не предоставлен или имеет неверный формат' });
        return;
    }

    // 3. Извлекаем сам токен
    const token = authHeader.split(' ')[1];

    try {
        
        console.log(token)
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; telegram_id: string };
        
        // 5. Если все хорошо, прикрепляем данные из токена к объекту запроса
        req.user = decoded;
        
        // 6. Передаем управление следующему обработчику в цепочке (нашему контроллеру)
        next();
    } catch (error) {
        // 7. Если jwt.verify выбросил ошибку, ловим ее и отправляем 401
        console.error("Ошибка верификации токена:", error);
        res.status(401).json({ message: 'Невалидный или просроченный токен' });
    }
};
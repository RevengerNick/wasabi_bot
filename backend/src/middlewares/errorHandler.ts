// src/middlewares/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

// Интерфейс для расширения стандартного объекта Error
export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction // next нужен, даже если не используется, для сигнатуры express
) => {
  console.error('💥 Произошла ошибка:', err);

  // Если у ошибки нет статуса, ставим 500 (Internal Server Error)
  const statusCode = err.status || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
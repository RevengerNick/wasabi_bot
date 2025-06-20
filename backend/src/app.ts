import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import apiRoutes from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

const imagesPath = path.join(__dirname, 'public/images');
console.log('Статическая папка:', imagesPath);

// Статическая раздача
app.use('/images', express.static(imagesPath));
// Подключаем все API роуты
app.use(apiRoutes);

// Подключаем глобальный обработчик ошибок
app.use(errorHandler);

export default app;
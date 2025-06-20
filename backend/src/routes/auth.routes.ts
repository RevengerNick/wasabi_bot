import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();
router.post('/telegram-login', authController.loginWithTelegram); // Для входа из Telegram
router.post('/phone-login', authController.loginWithPhone);       // Для входа из браузера

export default router;
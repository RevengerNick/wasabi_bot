// backend/src/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/authMiddleware'; // Мы создадим этот middleware сейчас

const router = Router();
// Этот роут будет защищен: доступ только для аутентифицированных пользователей
router.post('/update-phone', authMiddleware, userController.updatePhone);
router.delete('/delete-me', authMiddleware, userController.deleteCurrentUser);
router.post('/send', userController.sendData)
export default router;
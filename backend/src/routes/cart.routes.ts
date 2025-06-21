// backend/src/routes/cart.routes.ts
import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware); // Все роуты в этом файле требуют аутентификации

router.get('/', cartController.getCart);
router.post('/', cartController.updateCart);

export default router;
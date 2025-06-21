// backend/src/routes/order.routes.ts
import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/history', orderController.getOrderHistory);

export default router;
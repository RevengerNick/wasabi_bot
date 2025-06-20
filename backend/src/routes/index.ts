import { Router } from 'express';
import authRoutes from './auth.routes';
import menuRoutes from './menu.routes';
import userRoutes from './user.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/', menuRoutes); // /categories, /products
router.use('/users', userRoutes);

export default router;
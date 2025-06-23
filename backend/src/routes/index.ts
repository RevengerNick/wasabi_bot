import { Router } from 'express';
import authRoutes from './auth.routes';
import menuRoutes from './menu.routes';
import userRoutes from './user.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/', menuRoutes); // /categories, /products
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);    


export default router;
import { Router } from 'express';
import * as menuController from '../controllers/menu.controller';

const router = Router();
router.get('/categories', menuController.getCategories);
router.get('/products', menuController.getProducts);

export default router;
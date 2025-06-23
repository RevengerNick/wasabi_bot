import { Router } from 'express';
import * as menuController from '../controllers/menu.controller';

const router = Router();
router.get('/categories', menuController.getCategories);
router.get('/products', menuController.getProducts);
router.get('/search', menuController.search);

export default router;
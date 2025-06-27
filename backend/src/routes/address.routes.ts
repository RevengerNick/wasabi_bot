import { Router } from 'express';
import * as addressController from '../controllers/address.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware); // Все роуты здесь защищены

router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.delete('/:addressId', addressController.removeAddress);

export default router;
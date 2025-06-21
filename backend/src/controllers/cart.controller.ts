// backend/src/controllers/cart.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cart.service';

export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const cart = await cartService.getCartByUserId(userId);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const updateCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { productId, quantity } = req.body;
        const updatedCart = await cartService.upsertItemInCart(userId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        next(error);
    }
};
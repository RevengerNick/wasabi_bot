// backend/src/controllers/order.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { address, contactPhone } = req.body;
        const newOrder = await orderService.createOrderFromCart(userId, { address, contactPhone });
        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
};

export const getOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const orders = await orderService.getOrderHistoryByUserId(userId);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};
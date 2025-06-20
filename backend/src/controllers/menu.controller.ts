// src/controllers/menu.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as menuService from '../services/menu.service';

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await menuService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { category_id } = req.query;
        if (!category_id) {
            res.status(400).json({ message: 'Необходимо указать category_id' });
            return;
        }
        const products = await menuService.getProductsByCategoryId(Number(category_id));
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};
// backend/src/controllers/address.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as addressService from '../services/address.service';

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addresses = await addressService.getAddressesByUserId(req.user!.id);
        res.status(200).json(addresses);
    } catch (error) { next(error); }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, fullAddress, latitude, longitude } = req.body;
        const newAddress = await addressService.addAddress(req.user!.id, {
            name,
            fullAddress,
            latitude,
            longitude,
        });
        res.status(201).json(newAddress);
    } catch (error) { next(error); }
};
export const removeAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { addressId } = req.params;
        await addressService.deleteAddress(req.user!.id, addressId);
        res.status(204).send(); // 204 No Content - успешное удаление
    } catch (error) { next(error); }
};
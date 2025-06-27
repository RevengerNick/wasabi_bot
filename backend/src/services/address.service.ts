// backend/src/services/address.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface AddressData {
    name: string;
    fullAddress: string;
    latitude?: number;
    longitude?: number;
}
// Получаем все адреса для конкретного пользователя
export const getAddressesByUserId = (userId: string) => {
    return prisma.address.findMany({
        where: { user_id: userId },
        orderBy: { id: 'desc' }, // Новые адреса сверху
    });
};

// Добавляем новый адрес для пользователя
export const addAddress = (userId: string, data: AddressData) => {
    return prisma.address.create({
        data: {
            user_id: userId,
            name: data.name,
            full_address: data.fullAddress,
            latitude: data.latitude,
            longitude: data.longitude,
        },
    });
};
// Удаляем адрес, убедившись, что он принадлежит пользователю
export const deleteAddress = (userId: string, addressId: string) => {
    return prisma.address.delete({
        where: {
            id: addressId,
            user_id: userId, // Дополнительная проверка безопасности
        },
    });
};
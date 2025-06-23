import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllCategories = async () => {
    return prisma.category.findMany({
        orderBy: { order_index: 'asc' },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });
};

export const getProductsByCategoryId = async (categoryId: number) => {
    return prisma.product.findMany({
        where: { category_id: categoryId },
    });
};

export const searchProducts = async (query: string) => {
    return prisma.product.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: query,
                    },
                },
                {
                    description: {
                        contains: query,
                    },
                },
            ],
        },
    });
};
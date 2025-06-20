
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Инициализируем Prisma Client
const prisma = new PrismaClient();

// Описываем типы данных для нашего JSON файла для строгой типизации
interface ProductData {
    name: string;
    price: number;
    composition: string;
    imageUrl: string;
}

interface ScrapedData {
    [categoryName: string]: ProductData[];
}

async function main() {
    console.log(`🔵 Начало процесса заполнения базы данных...`);

    // 1. Читаем и парсим JSON-файл с данными
    const jsonPath = path.join(__dirname, 'products.json');
    if (!fs.existsSync(jsonPath)) {
        throw new Error(`Файл 'products.json' не найден в папке 'prisma'. Убедитесь, что вы его туда скопировали.`);
    }
    const scrapedData: ScrapedData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`✅ Файл 'products.json' успешно прочитан.`);

    let categoryOrderIndex = 1;

    // 2. Итерируемся по каждой категории из JSON-файла
    for (const categoryName in scrapedData) {
        
        // Используем upsert: он либо создает новую запись, либо обновляет существующую.
        // Это делает скрипт безопасным для повторного запуска (не создаст дубликаты).
        const category = await prisma.category.upsert({
            where: { name: categoryName }, // Ищем категорию по уникальному имени
            update: {
                // Если категория уже существует, мы можем что-то обновить.
                // В данном случае ничего не меняем, если нашли.
                order_index: categoryOrderIndex,
            },
            create: {
                // Если категория не найдена, создаем ее
                name: categoryName,
                order_index: categoryOrderIndex,
            },
        });

        console.log(`[Категория] Создана или найдена: ${category.name}`);
        categoryOrderIndex++;

        const products = scrapedData[categoryName];

        // 3. Итерируемся по каждому продукту в текущей категории
        for (const productData of products) {
            
            // Проверяем, что у продукта есть имя, иначе пропускаем
            if (!productData.name) continue;

            // Используем upsert для продуктов
            await prisma.product.upsert({
                where: { name: productData.name }, // Ищем продукт по уникальному имени
                update: {
                    // Если продукт найден, обновляем его данные
                    price: productData.price,
                    description: productData.composition || "", // Состав идет в описание
                    image_url: productData.imageUrl,
                    category_id: category.id, // Обновляем связь на всякий случай
                },
                create: {
                    // Если продукт не найден, создаем его
                    name: productData.name,
                    price: productData.price,
                    description: productData.composition || "", // Поле 'composition' из JSON -> поле 'description' в БД
                    image_url: productData.imageUrl, // Локальный путь к фото
                    category_id: category.id, // Привязываем продукт к ID созданной категории
                },
            });
            console.log(`  -> [Продукт] Создан или обновлен: ${productData.name}`);
        }
    }

    console.log(`\n🟢 Процесс заполнения базы данных успешно завершен.`);
}

// Стандартная обертка для выполнения асинхронной функции main
// и корректной обработки ошибок и отключения от БД.
main()
    .catch((e) => {
        console.error('🔴 Произошла ошибка во время заполнения базы данных:', e);
        process.exit(1);
    })
    .finally(async () => {
        // Обязательно отключаемся от базы данных в конце
        await prisma.$disconnect();
    });
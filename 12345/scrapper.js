// scraper.js
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fs = require("fs");

// --- ВАШИ ДАННЫЕ ---
const apiId = 20707116; // Замените на ваш apiId (число)
const apiHash = "051390c52e881b566e42d61c7d2d6773"; // Замените на ваш apiHash
const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNTEBu5uSizq/0jIvbCOvt5otHMHiOVW7mDqpJfSP1t8E3/tuyyQvB3QuIkygjHvrUbBFZlFUdsgMOYZKcWqrEkXHJd9BS0U7t5YyqcxHjfHtIp77DSM6RMAuJgKUipwbEnQrWFqgDtB6fOFvfZ2D6C7nWBZll8kH8plcYhF/XmfzeFQ4xtlVWhBZp+27CFHsRaymSkvh3g7TG6soGN0IiFcI0d4fN7RbeYsMaUHLr7JJCXDSKrihQAlx/1GYC1aCc5Zyxmt4IgiSameZMzqGO197HTAMznfgHz7KW2LsA2St62U2sKk4MR5ekODN7+GwA2k4MCv1YN5LgeXyaTJLGNaaG5o="); // Оставьте пустым для первого запуска

// --- НАСТРОЙКИ ПАРСЕРА ---
const targetBot = "wasabisushi_uzbot"; // @username бота, которого парсим

const categoryEmojiMap = {
  'Холодные Блюда': '🥘 Холодные Блюда',
  'Жаренные Роллы': '🍘 Жаренные Роллы',
  'Кимпаб': '🌸 Кимпаб',
  'Горячка': '🔥 Горячка',
  'Новинки': '🔥 Новинки',
  'Хлеб': '🍞 Хлеб',
  'Гунканы': '🥙 Гунканы',
  'Онигири': '🍙 Онигири',
  'Напитки': '🥤 Напитки',
  'Роллы': '🥢 Роллы',
  'Суши': '🍣 Суши',
  'Салаты': '🍜 Салаты',
  'Сеты': '🍱 Сеты',
  'Соуса': '🧂 Соуса',
  'Запеченные': '🥧 Запеченные',
  'Мини Роллы': '🥢 Мини Роллы',
};
// Этот список нужно составить вручную, посмотрев на кнопки в боте
const categoriesToParse = Object.keys(categoryEmojiMap);

// Функция для задержки
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    if (!fs.existsSync('images')) fs.mkdirSync('images');

    console.log("Запуск клиента...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text("Введите номер телефона: "),
        password: async () => await input.text("Введите пароль (2FA), если есть: "),
        phoneCode: async () => await input.text("Введите код из Telegram: "),
        onError: (err) => console.log(err),
    });

    console.log("Вы успешно подключились!");
    if (!stringSession.value) {
        console.log("Ваша сессия (скопируйте и вставьте в код для будущих запусков):");
        console.log(client.session.save());
    }

    const allProducts = {};

    // ID последнего обработанного сообщения. Все что до него - игнорируем.
    let lastProcessedMessageId = 0;

    // Получаем самое последнее сообщение, чтобы установить начальную точку отсчета
    const initialMessages = await client.getMessages(targetBot, { limit: 1 });
    if (initialMessages.length > 0) {
        lastProcessedMessageId = initialMessages[0].id;
        console.log(`Установлена начальная точка отсчета: ID сообщения ${lastProcessedMessageId}`);
    }

    // Проходим по каждой категории
    for (const categoryName of categoriesToParse) {
        console.log(`\n--- Парсинг категории: ${categoryName} ---`);
        
        const messageToSend = categoryEmojiMap[categoryName];
        
        // Отправляем команды
        await client.sendMessage(targetBot, { message: messageToSend });
        await sleep(2000);
        await client.sendMessage(targetBot, { message: "Список 📋" });
        console.log("Отправлена команда 'Список 📋', ожидание продуктов...");
        await sleep(5000);

        // Получаем последние сообщения
        const messages = await client.getMessages(targetBot, { limit: 100 });
        
        // Временное хранилище для продуктов ТЕКУЩЕЙ категории
        const currentCategoryProducts = [];
        
        // Обрабатываем сообщения от НОВЫХ к СТАРЫМ
        for (const msg of messages) {
            // !!! ГЛАВНОЕ ИСПРАВЛЕНИЕ !!!
            // Если мы дошли до сообщения, которое уже обрабатывали, останавливаемся.
            if (msg.id <= lastProcessedMessageId) {
                break;
            }

            if (msg && msg.photo && msg.text) {
                const text = msg.text;
                const lines = text.split('\n').filter(line => line.trim() !== '');

                if (lines.length >= 2 && lines[0].startsWith('Название:') && lines[lines.length - 1].startsWith('Цена:')) {
                    const name = lines[0].replace('Название:', '').trim();
                    const priceString = lines[lines.length - 1].replace(/Цена:|сум/g, '').trim();
                    const price = parseInt(priceString.replace(/\s|,00/g, ''), 10);

                    let composition = "";
                    const compStartIndex = lines.findIndex(l => l.startsWith('Состав:'));
                    if (compStartIndex !== -1) {
                        composition = lines.slice(compStartIndex + 1, lines.length - 1).join(', ').trim();
                    }
                    
                    const safeFileName = name.replace(/[\/\?<>\\:\*\|"]/g, '_');
                    const imagePath = `images/${safeFileName}.jpg`;

                    // Скачиваем фото
                    await client.downloadMedia(msg.photo, { outputFile: imagePath });

                    const product = { name, price, composition, imageUrl: imagePath };
                    currentCategoryProducts.push(product);
                    console.log(`  [+] Найден товар: ${product.name}`);
                }
            }
        }
        
        // Так как мы читали сообщения от новых к старым, переворачиваем массив,
        // чтобы продукты были в том порядке, в котором их прислал бот.
        allProducts[categoryName] = currentCategoryProducts.reverse();

        // Обновляем ID последнего обработанного сообщения
        if (messages.length > 0) {
            lastProcessedMessageId = messages[0].id;
        }

        console.log(`\n--- Категория "${categoryName}" завершена. Ожидание 60 секунд... ---`);
        await sleep(5000); // 60 секунд ожидания
    }

    // Сохраняем все в JSON файл
    fs.writeFileSync('products.json', JSON.stringify(allProducts, null, 2));
    console.log("\n✅ Все данные и изображения успешно сохранены! Смешивания больше нет.");

    await client.disconnect();
}

main();
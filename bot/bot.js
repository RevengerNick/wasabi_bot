require('dotenv').config(); // Загружаем переменные окружения из .env файла
const { Telegraf, Markup } = require('telegraf');

const token = process.env.BOT_TOKEN;
if (!token) {
    throw new Error('BOT_TOKEN must be provided!');
}

const webAppUrl = process.env.FRONT_URL;

const bot = new Telegraf(token);

// Создаем основную клавиатуру с помощью Markup
const mainKeyboard = Markup.keyboard([
    [{ text: '✅ Заказать', web_app: { url: webAppUrl } }],
    ['🛒 Корзина', 'ℹ️ О нас'],
    ['📖 История заказов']
]).resize(); // .resize() делает кнопки более компактными

// Обработка команды /start
bot.start((ctx) => {
    ctx.reply(
        `Здравствуйте, ${ctx.from.first_name}! 👋\n\nДобро пожаловать в наш суши-бот. Чтобы сделать заказ, нажмите кнопку ниже.`,
        mainKeyboard
    );
});

// Обработка нажатий на кнопки через bot.hears()
bot.hears('🛒 Корзина', (ctx) => {
    ctx.reply('Ваша корзина пока пуста. Нажмите "Заказать", чтобы выбрать что-нибудь вкусное!');
});

bot.hears('ℹ️ О нас', (ctx) => {
    // Используем parse_mode: 'MarkdownV2' или 'HTML' для форматирования
    ctx.replyWithHTML(
        '🍣 <b>Wasabi Sushi</b>\n\n' +
        '<b>График работы:</b> 11:00 - 23:00\n' +
        'Без выходных\n\n' +
        '📞 +998901234567\n\n' +
        '📍 <b>Адрес:</b> г. Ташкент, ул. Какая-то, 1'
    );
});

bot.hears('📖 История заказов', (ctx) => {
    ctx.reply('Чтобы увидеть историю заказов, пожалуйста, войдите с помощью вашего номера телефона в приложении (кнопка "Заказать").');
});

bot.launch();

console.log('Бот успешно запущен на Telegraf!');

// Включаем graceful stop, чтобы бот корректно завершал работу
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
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
    ['ℹ️ О нас'],
]).resize(); // .resize() делает кнопки более компактными

// Обработка команды /start
bot.start((ctx) => {
  ctx.reply(
    `🍣 Добро пожаловать в Wasabi Sushi!\n\nНажмите кнопку "Меню" слева внизу, чтобы начать.`,
        mainKeyboard
  );
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

bot.launch();

console.log('Бот успешно запущен на Telegraf!');

// Включаем graceful stop, чтобы бот корректно завершал работу
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '7675089519:AAG8jNGsWZ3Sc7Ll4oyeonrNm-DVXr3FpuA';

const bot = new TelegramBot(TOKEN, { polling: true });

const quotes = [
  'Лежачего полицейского знаешь? Я уложил',
	'Фильмы ужасов знаешь? Я испугал',
	'Лучше с пацанками катку чем на даче копать грядку',
	'Однажды я подрался с батей, он ударил меня по лицу макбуком. Не ожидал от него такой техники',
	'Никогда не уступаю бабушкам место в автобусе, потому что бабки в жизни не  главное',
	'Позвоночник знаете? Я позвонил',
];

// Обработчик команды /quote
bot.onText(/\/quote@EugeneS322/, (msg) => {
  const chatId = msg.chat.id;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)].replace(/\?/g, '?\n');
  bot.sendMessage(chatId, randomQuote);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Напиши /quote@EugeneS322, чтобы получить житейскую мудрость.');
});

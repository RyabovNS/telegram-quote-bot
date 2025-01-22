import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('Нужно указать адрес к базе данных MongoDB');

mongoose
  // .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const quoteSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
});

const Quote = mongoose.model('Quote', quoteSchema);

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) throw new Error('Чтобы локально запустить бота, нужно создать в папке с проектом создать файл .env, где указать токен бота');

const bot = new TelegramBot(TOKEN, { polling: true });


// const quotes = [
//   'Лежачего полицеdotenv.йского знаешь?\nЯ уложил',
// 	'Фильмы ужасов знаешь?\nЯ испугал',
// 	'Лучше с пацанками катку чем на даче копать грядку',
// 	'Однажды я подрался с батей, он ударил меня по лицу макбуком. Не ожидал от него такой техники',
// 	'Никогда не уступаю бабушкам место в автобусе, потому что бабки в жизни не  главное',
// 	'Позвоночник знаете?\nЯ позвонил',
//   'Антон, лавку САС!',
//   'Аленченко, что там у тебя?\nРучка упала...\nЩас ты сам у меня упадёшь!',
//   'А что смешного?\nДень открытых дверей что ли?',
//   'Запомните, а то забудите!\nКорень крышует X',
//   'Напоминание типов домов:\n1. Модульный\n2. Панельный\n3. Куриный',
//   'Житейская мудрость:\nЕсли доверху залить чайник водой, он сгорит.\n© Мудрец',
//   'Пацан без мата как солдат без автомата',
//   'Мужчины идут на подвиги ради дам.Ради не дам не идут',
//   'Сокур!\nЩас выгоню ВОН!!!',
//   'Рябов!\nЩас выгоню ВОН!!!',
//   'Астахов!\nЩас выгоню ВОН!!!',
//   'Фёдоров!\nЩас выгоню ВОН!!!',
//   'Мне нельзя думать, потому что могу передумать',
//   'Взял нож - режь, взял дошик - ешь',
//   'Если заблудился в лесу, иди домой',
//   'Марианскую впадину знаешь?\nЭто я упал',
//   'Шаг в лево, шаг в право - два шага',
//   'Когда изобрели первый телефон\nу меня уже было два пропущенных',
//   'Однажды я качал прес под водой, с тех пор её называют пресной',
// ];

/**
 * Случайная цитата
 */
bot.onText(/\/quote/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const count = await Quote.countDocuments();
    if (count === 0) {
      bot.sendMessage(chatId, 'Цитат пока нет. Добавьте первую с помощью команды /addquote.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * count);
    const randomQuote = await Quote.findOne().skip(randomIndex);

    if (randomQuote) {
      bot.sendMessage(chatId, `"${randomQuote.text}" — ${randomQuote.author}`);
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
    bot.sendMessage(chatId, 'Ошибка при получении цитаты.');
  }
});

/**
 * Случайная цитата с указанием автора
 */
bot.onText(/\/quote@(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!match || !match[1]) {
    bot.sendMessage(chatId, 'Укажите автора после команды. Например: /quote@ИмяАвтора');
    return;
  }

  const author = match[1].trim();

  try {
    const quotesByAuthor = await Quote.find({ author: new RegExp(`^${author}$`, 'i') });

    if (quotesByAuthor.length === 0) {
      bot.sendMessage(chatId, `Цитаты от автора "${author}" не найдены.`);
      return;
    }

    const randomQuote =
      quotesByAuthor[Math.floor(Math.random() * quotesByAuthor.length)];

    bot.sendMessage(chatId, `"${randomQuote.text}" — ${randomQuote.author}`);
  } catch (error) {
    console.error('Error fetching quotes by author:', error);
    bot.sendMessage(chatId, 'Ошибка при получении цитат.');
  }
});

bot.onText(/\/addquote "([^"]+)" "([^"]+)"/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!match || match.length < 3) {
    bot.sendMessage(
      chatId,
      `Неправильный формат команды. Используйте:\n/addquote "Автор цитаты" "Текст цитаты"`
    );
    return;
  }

  const author = match[1];
  const text = match[2];

  
  try {
    const newQuote = new Quote({ author, text });
    await newQuote.save();

    bot.sendMessage(chatId, `Цитата успешно добавлена:\n"${text}" — ${author}`);
  } catch (error) {
    console.error('Error saving quote:', error);
    bot.sendMessage(chatId, 'Ошибка при добавлении цитаты.');
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Напиши /quote, чтобы получить житейскую мудрость.');
});

import { Telegraf } from "telegraf";
import { QuoteModel } from "../models/Quote";

export const commandHandler = (bot: Telegraf) => {
  bot.command("start", (ctx) => {
		ctx.reply("Напиши /quote, чтобы получить житейскую мудрость.");
  });

  // Команда для получения случайной цитаты
  bot.command("quote", async (ctx) => {
    try {
      const quotes = await QuoteModel.find();
      if (quotes.length === 0) {
        ctx.reply("Цитат пока нет. Добавьте первую с помощью команды /addquote.");
        return;
      }

      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];

      ctx.reply(`${randomQuote.text}\n${randomQuote.author}`);
    } catch (error) {
      console.error("Ошибка при получении цитаты:", error);
      ctx.reply("Произошла ошибка при получении цитаты.");
    }
  });

  // Команда для получения случайной цитаты конкретного автора
  bot.command("quoteauthor", async (ctx) => {
    try {
      const messageParts = ctx.message.text.split(" ");
      if (messageParts.length !== 2) {
        ctx.reply("Используйте формат: /quoteauthor @author");
        return;
      }

      const author = messageParts[1];

      const quotes = await QuoteModel.find({ author });
      if (quotes.length === 0) {
        ctx.reply(`Для ${author} пока нет цитат.`);
        return;
      }

      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];

      ctx.reply(`Цитата от ${author}: "${randomQuote.text}"`);
    } catch (error) {
      console.error("Ошибка при получении цитаты:", error);
      ctx.reply("Произошла ошибка при получении цитаты.");
    }
  });

  // Команда для добавления цитаты
  bot.command("addquote", async (ctx) => {
    try {
      const messageParts = ctx.message.text.split(" ");
      if (messageParts.length < 3) {
        ctx.reply("Используйте формат: /addquote @author Цитата");
        return;
      }

      const author = messageParts[1];
      const quoteText = messageParts.slice(2).join(" ");

      // Сохранение цитаты в базе данных
      await QuoteModel.create({ author, text: quoteText });

      ctx.reply(`Цитата добавлена: "${quoteText}" от ${author}`);
    } catch (error) {
      console.error("Ошибка при добавлении цитаты:", error);
      ctx.reply("Произошла ошибка при добавлении цитаты.");
    }
  });
};

const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for any kind of message. There are different kinds of messages
bot.on('message', (msg, match) => {
    // Starting message
    if (msg.text === "/start") {
        bot.sendMessage(msg.chat.id, 'Received your message');
    }
});
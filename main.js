const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

require("./bot")(bot);    // Подключает админ-логику
require("./callback/buyer")(bot);  // Подключает buyer-логику
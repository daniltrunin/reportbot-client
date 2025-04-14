module.exports = (bot) => {
    // service functions
    const { getUserRole } = require("./services/getUserRole");

    // Кнопки
    const createButtons = require("./buttons/buyerButtons");
    let { startBtn } = createButtons();

    // Listen for any kind of message. There are different kinds of messages

    bot.on("message", async (msg) => {
        if (msg.text === "/start") {
            const res = await getUserRole(msg.from.id);

            if (!res.message.includes("admin") || !res.message.includes("manager") || !res.message.includes("buyer")) {
                bot.sendMessage(msg.from.id, `Нет доступа`)
            }

            if (res.message.includes("admin")) {
                bot.sendMessage(msg.from.id, `Доступ есть! Твоя роль - ${res.message.join(", ")}`)
            }

            if (res.message.includes("manager")) {
                bot.sendMessage(msg.from.id, `Доступ есть! Твоя роль - ${res.message.join(", ")}`)
            }

            if (res.message.includes("buyer")) {
                bot.sendMessage(msg.from.id, `Доступ есть! Твоя роль - ${res.message.join(", ")}`, {
                    reply_markup: startBtn
                })
            }
        }
    })
}

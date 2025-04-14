module.exports = (bot) => {
    // Messages
    const { getMessage } = require("../messages/buyer");

    // service functions
    const { getUserRole } = require("../services/getUserRole");

    bot.on("message", async (msg) => {
        const res = await getUserRole(msg.from.id);

        if (res.message.includes("buyer")) {
            if (msg.text === "Отправить отчёт") {
                const message = await getMessage();
                bot.sendMessage(msg.from.id, message)
            }
        }
    })
}

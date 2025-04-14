module.exports = (bot) => {
    // Messages
    const { getSendReportMsg, getReportMsg } = require("../messages/buyer");

    // states
    let userStates = {};

    // service functions
    const { getUserRole } = require("../services/getUserRole");

    bot.on("message", async (msg) => {
        const res = await getUserRole(msg.from.id);
        if (!res.message.includes("buyer")) return;

        if (msg.text === "Отправить отчёт") {
            userStates[msg.from.id] = "waiting_for_report"
            const message = await getSendReportMsg();
            bot.sendMessage(msg.from.id, message)
            return;
        }

        if (userStates[msg.from.id] === "waiting_for_report") {
            const report = msg.text;
            const message = await getReportMsg(report);
            bot.sendMessage(msg.from.id, message)
            userStates[msg.from.id] = null;
        }
    })
}

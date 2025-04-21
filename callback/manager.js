const { parse } = require("dotenv");

module.exports = (bot) => {
    // Messages
    const { getStartManagerMsg, getReceiveSingleReportMsg } = require("../messages/manager");

    // service functions
    const { getUserRole } = require("../services/getUserRole");
    const { receiveAllReportsByCurrentday } = require("../services/receiveAllReportsByCurrentday")
    const { getAllManagers } = require("../services/getAllManagers")

    // Кнопки
    const createButtons = require("../buttons/managerButtons");
    let { startBtn } = createButtons();

    // Listen for any kind of message. There are different kinds of messages
    bot.on("message", async (msg) => {
        if (msg.text === "/start") {
            const res = await getUserRole(msg.from.id);
            const startMsg = getStartManagerMsg(res)

            const managers = await getAllManagers();
            const managersArray = [managers.message]
            const createButtonsForManagers = require("../buttons/managerButtons");
            const { startBtn } = createButtonsForManagers(managersArray);

            if (res.message.includes("manager")) {
                bot.sendMessage(msg.from.id, startMsg, {
                    parse_mode: "HTML",
                    reply_markup: startBtn
                })
            }
        }
    })

    bot.on("callback_query", async (query) => {
        if (query.data === "get_full_report") {
            const res = await receiveAllReportsByCurrentday();
            const reports = res.reports;
            if (!reports || reports.length === 0) {
                return bot.sendMessage(query.from.id, "Сегодня пока нет отчётов", {
                    parse_mode: "HTML"
                });
            };
            for (const report of reports) {
                const message = getReceiveSingleReportMsg(report);
                await bot.sendMessage(query.from.id, message, {
                    parse_mode: "HTML"
                });

                // Задержка 300 мс между сообщениями
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    })
}

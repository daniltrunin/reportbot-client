module.exports = (bot) => {
    // service functions
    const { getUserRole } = require("./services/getUserRole");
    const { receiveAllReportsByCurrentday } = require("./services/receiveAllReportsByCurrentday")

    // messages
    const { getReceiveSingleReportMsg } = require("./messages/manager");

    // Кнопки
    const { createButtonsForAdmin } = require("./buttons/adminButtons");
    let { startBtn } = createButtonsForAdmin();

    // Listen for any kind of message. There are different kinds of messages

    bot.on("message", async (msg) => {
        if (msg.text === "/start") {
            const res = await getUserRole(msg.from.id);

            if (!res || !res.message || !Array.isArray(res.message) || !res.message.includes("admin")) {
                return
            }

            if (!res.message.includes("admin") &&
                !res.message.includes("manager") &&
                !res.message.includes("buyer")) {
                return
            }

            if (res.message.includes("admin")) {
                bot.sendMessage(msg.from.id, `<b>Бот для отчётности — Баинг Отдел</b>

Твоя роль - <b>${res.message.join(", ")}</b>

Кнопка «Весь отчёт за сегодняшний день» <i>получить отчёт за сегодняшний день по каждому байеру</i>`, {
                    parse_mode: "HTML",
                    reply_markup: startBtn
                })
            }
        }
    })

    bot.on("callback_query", async (query) => {
        if (query.data === "get_full_report_admin") {
            const res = await receiveAllReportsByCurrentday();
            const reports = res.reports;
            if (!reports || reports.length === 0) {
                return bot.sendMessage(query.from.id, "Сегодня пока нет отчётов", {
                    parse_mode: "HTML"
                });
            };
            for (const report of reports) {
                const { createButtonOfBuyerDm } = require("./buttons/managerButtons");
                const { buyerDm } = createButtonOfBuyerDm(report);
                const message = getReceiveSingleReportMsg(report);
                await bot.sendMessage(query.from.id, message, {
                    parse_mode: "HTML",
                    reply_markup: buyerDm
                });
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    })
}

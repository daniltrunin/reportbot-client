const { parse } = require("dotenv");

module.exports = (bot) => {
    // Messages
    const { getStartManagerMsg, getReceiveSingleReportMsg } = require("../messages/manager");

    // service functions
    const { getUserRole } = require("../services/getUserRole");
    const { receiveAllReportsByCurrentday } = require("../services/receiveAllReportsByCurrentday")
    const { getAllManagers } = require("../services/getAllManagers")
    const { getAllTags } = require("../services/getAllTags");

    // Listen for any kind of message. There are different kinds of messages
    bot.on("message", async (msg) => {
        if (msg.text === "/start") {
            const res = await getUserRole(msg.from.id);
            const startMsg = getStartManagerMsg(res)

            const managers = await getAllManagers();
            const { createButtonsForManagers } = require("../buttons/managerButtons");
            const { startBtn } = createButtonsForManagers(managers.message);

            if (res.message.includes("manager")) {
                bot.sendMessage(msg.from.id, startMsg, {
                    parse_mode: "HTML",
                    reply_markup: startBtn
                })
            }
        }
    })

    bot.on("callback_query", async (query) => {
        // полный отчёт о всех баерах всех команд
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
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // получаем список всех тегов и возможность получить отчёт по баерам конкретного тимлида
        if (query.data.startsWith("get_data_of_manager_")) {
            const teamName = query.data.slice("get_data_of_manager_".length);
            const tags = await getAllTags()
            const { createButtonsForTags } = require("../buttons/managerButtons");
            const { teamLeadBtn } = createButtonsForTags(tags.message, teamName);

            bot.sendMessage(query.from.id, "Выбрать тег или полный отчёт команды", {
                parse_mode: "HTML",
                reply_markup: teamLeadBtn
            })
        }

        // отчёты какой-то конкретной команды
        // if (query.data.startsWith("get_reports_of_team_")) {
        //     const teamName = query.data.slice("get_reports_of_team_".length);
        //     const reports = await receiveAllReportsByTeamOnCurrentDay(teamName);
        //     if (reports.reports.length === 0) {
        //         return bot.sendMessage(query.from.id, `Сегодня пока нет отчётов от команды ${teamName}`, {
        //             parse_mode: "HTML"
        //         });
        //     };
        //     for (const report of reports.reports) {
        //         const message = getReceiveSingleReportMsg(report);
        //         await bot.sendMessage(query.from.id, message, {
        //             parse_mode: "HTML"
        //         });
        //         await new Promise(resolve => setTimeout(resolve, 500));
        //     }
        // }
    })
}

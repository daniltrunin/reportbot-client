const { parse } = require("dotenv");

module.exports = (bot) => {
    // Messages
    const { getStartManagerMsg, getReceiveSingleReportMsg, getDataOfManagerMsg, getBuyersListByTeamAndNameMsg } = require("../messages/manager");

    // states
    let userChosenTeamForFindingReports = {};
    let userChosenTagForFindingReports = {};

    // service functions
    const { getUserRole } = require("../services/getUserRole");
    const { receiveAllReportsByCurrentday } = require("../services/receiveAllReportsByCurrentday")
    const { receiveAllReportsByTeamOnCurrentDay } = require("../services/receiveAllReportsByTeamOnCurrentDay")
    const { getAllManagers } = require("../services/getAllManagers")
    const { getAllTags } = require("../services/getAllTags");
    const { getBuyersByTags } = require("../services/getBuyersByTags")
    const { getBuyersByTagsAndBuyerName } = require("../services/getBuyersByTagsAndBuyerName");
    const { getReportsByDateTagsBuyerTeam } = require("../services/getReportsByDateTagsBuyerTeam")

    // Listen for any kind of message. There are different kinds of messages
    bot.on("message", async (msg) => {
        if (msg.text === "/start") {
            const res = await getUserRole(msg.from.id);
            if (!res || !res.message || !Array.isArray(res.message) || !res.message.includes("manager")) {
                return
            }

            if (res.message.includes("manager")) {
                const startMsg = getStartManagerMsg(res)
                const managers = await getAllManagers();
                const { createButtonsForManagers } = require("../buttons/managerButtons");
                const { startBtn } = createButtonsForManagers(managers.message);
                bot.sendMessage(msg.from.id, startMsg, {
                    parse_mode: "HTML",
                    reply_markup: startBtn
                })
            }

            delete userChosenTeamForFindingReports[msg.from.id];
            delete userChosenTagForFindingReports[msg.from.id];
        }
    })

    bot.on("callback_query", async (query) => {
        if (query.data === "on_start") {
            const res = await getUserRole(query.from.id);
            const startMsg = getStartManagerMsg(res)

            const managers = await getAllManagers();
            const { createButtonsForManagers } = require("../buttons/managerButtons");
            const { startBtn } = createButtonsForManagers(managers.message);

            if (res.message.includes("manager")) {
                bot.sendMessage(query.from.id, startMsg, {
                    parse_mode: "HTML",
                    reply_markup: startBtn
                })
            }

            delete userChosenTeamForFindingReports[query.from.id];
            delete userChosenTagForFindingReports[query.from.id];
        }

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
                const { createButtonOfBuyerDm } = require("../buttons/managerButtons");
                const { buyerDm } = createButtonOfBuyerDm(report);
                const message = getReceiveSingleReportMsg(report);
                await bot.sendMessage(query.from.id, message, {
                    parse_mode: "HTML",
                    reply_markup: buyerDm
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

            userChosenTeamForFindingReports[query.from.id] = teamName

            const message = getDataOfManagerMsg(teamName)

            bot.sendMessage(query.from.id, message, {
                parse_mode: "HTML",
                reply_markup: teamLeadBtn
            })
        }

        // полный отчёт за день какой-то конкретной команды
        if (query.data.startsWith("get_full_report_by_team_")) {
            const teamName = query.data.slice("get_full_report_by_team_".length);
            const reports = await receiveAllReportsByTeamOnCurrentDay(teamName);
            if (reports.reports.length === 0) {
                return bot.sendMessage(query.from.id, `Сегодня ещё нет отчётов от команды ${teamName}`, {
                    parse_mode: "HTML"
                });
            };
            for (const report of reports.reports) {
                const { createButtonOfBuyerDm } = require("../buttons/managerButtons");
                const { buyerDm } = createButtonOfBuyerDm(report);
                const message = getReceiveSingleReportMsg(report);
                await bot.sendMessage(query.from.id, message, {
                    parse_mode: "HTML",
                    reply_markup: buyerDm
                });
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // получить список байеров по команде и тегу
        if (query.data.startsWith("get_buyers_by_tag_")) {
            const tagName = query.data.slice("get_buyers_by_tag_".length);

            const res = await getBuyersByTags(tagName, userChosenTeamForFindingReports[query.from.id]);
            const resMessage = res.message
            let allBuyers = []
            resMessage.map((obj) => allBuyers.push(obj.user_id.username))
            let uniqueBuyers = new Set(allBuyers);
            let uniqueBuyersArray = [...uniqueBuyers]
            console.log(`Список байеров ${resMessage}`)

            const { createButtonsOfBuyersList } = require("../buttons/managerButtons");
            const { buyersListByTeamAndName } = createButtonsOfBuyersList(uniqueBuyersArray)

            const message = getBuyersListByTeamAndNameMsg(resMessage, userChosenTeamForFindingReports[query.from.id], tagName)

            await bot.sendMessage(query.from.id, message, {
                parse_mode: "HTML",
                reply_markup: buyersListByTeamAndName
            });

            userChosenTagForFindingReports[query.from.id] = tagName;
        }

        // получить все даты по команде, тегу и имени байера
        if (query.data.startsWith("get_buyer_list_reports_by_team_and_tag_by_")) {
            const buyerName = query.data.slice("get_buyer_list_reports_by_team_and_tag_by_".length);
            const tagName = userChosenTagForFindingReports[query.from.id];

            const res = await getBuyersByTagsAndBuyerName(tagName, userChosenTeamForFindingReports[query.from.id], buyerName);
            const reports = res.message.map((r) => r.dateRU)
            const reportsSet = new Set(reports)
            const reportsArray = [...reportsSet];

            const { createButtonsOfBuyerDates } = require("../buttons/managerButtons");
            const { buyerDatesOfReports } = createButtonsOfBuyerDates(reportsArray, buyerName);

            bot.sendMessage(query.from.id, `Отчёты байера <i>${buyerName}</i> по тегу <i>${tagName}</i>`, {
                parse_mode: "HTML",
                reply_markup: buyerDatesOfReports
            });
        }

        if (query.data.startsWith("get_report_from_buyer_on_day_")) {
            const parts = query.data.split("get_report_from_buyer_on_day_")[1].split("_");
            const date = parts[0];
            const tag = userChosenTagForFindingReports[query.from.id];
            const buyer = parts.slice(1).join("_");
            const team = userChosenTeamForFindingReports[query.from.id]

            const res = await getReportsByDateTagsBuyerTeam(date, tag, buyer, team);
            const reports = res.message

            if (!reports || reports.length === 0) {
                return bot.sendMessage(query.from.id, "Возникла ошибка, отчёт не найден", {
                    parse_mode: "HTML"
                });
            };
            for (const report of reports) {
                const { createButtonOfBuyerDm } = require("../buttons/managerButtons");
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

module.exports = (bot) => {
    // Messages
    const {
        getStartBuyerMsg,
        getSendReportMsg,
        getReportMsg,
        getAcceptSendReportToServerMsg,
        getSavedYourTextNowChooseTagsMsg,
        getShowYourChosenTagsAndChosenTextMsg } = require("../messages/buyer");

    // Buttons
    const createButtons = require("../buttons/buyerButtons");
    let { startBtn, chooseTextForReport, chooseTextAndTagForReport } = createButtons();

    // states
    let userStates = {};
    // Сообщение отчёта которое пользователь написал в процессе создания отчёта
    let userReports = {};
    // Теги которые пользователь выбрал в процессе создания отчёта
    let userChosenTags = {};

    // service functions
    const { getUserRole } = require("../services/getUserRole");
    const { getBuyerTeams } = require("../services/getBuyerTeams");
    const { getAllTags } = require("../services/getAllTags");
    const { setReport } = require("../services/setReport");

    bot.on("message", async (msg) => {
        if (msg.text === "/start") {
            const res = await getUserRole(msg.from.id);
            if (!res || !res.message || !Array.isArray(res.message) || !res.message.includes("buyer")) {
                return
            }

            if (res.message.includes("buyer")) {
                const message = getStartBuyerMsg(res);
                bot.sendMessage(msg.from.id, message, {
                    parse_mode: "HTML",
                    reply_markup: startBtn
                })
            }
        }

        // нажал отправить отчёт
        if (msg.text === "Отправить отчёт" ||
            msg.text === "отправить отчёт" ||
            msg.text === "отправить отчет" ||
            msg.text === "Отправить отчет") {
            userStates[msg.from.id] = "sending_text_to_report"
            const message = await getSendReportMsg();
            bot.sendMessage(msg.from.id, message, {
                parse_mode: "HTML"
            })
            return;
        }

        // отправил текст в ответ на отчёт и тебе предложило выбрать тег
        if (userStates[msg.from.id] === "sending_text_to_report") {
            userReports[msg.from.id] = msg.text;
            const message = await getReportMsg(userReports[msg.from.id]);
            bot.sendMessage(msg.from.id, message, {
                parse_mode: "HTML",
                reply_markup: chooseTextForReport
            })
            userStates[msg.from.id] = null;
        }
    })

    bot.on("callback_query", async (query) => {
        // подтвердил отправленный текст и получил выбор тегов
        if (query.data === "accept_text_of_report") {
            userStates[query.from.id] = "choosing_tags"
            const res = await getAllTags();
            const tags = res.message.map((e) => e);

            const createButtonsForTags = require("../buttons/buyerButtons");
            const { chooseTagForReport } = createButtonsForTags(tags);

            const message = getSavedYourTextNowChooseTagsMsg();
            bot.sendMessage(query.from.id, message, {
                parse_mode: "HTML",
                reply_markup: chooseTagForReport
            })
        }

        if (query.data === "decline_sending_report") {
            const res = await getUserRole(query.from.id);
            if (!res.message.includes("buyer")) return;

            if (res.message.includes("buyer")) {
                const message = getStartBuyerMsg(res);
                bot.sendMessage(query.from.id, message, {
                    parse_mode: "HTML",
                    reply_markup: startBtn
                })
            }

            delete userStates[query.from.id];
            delete userReports[query.from.id];
            delete userChosenTags[query.from.id];
        }

        if (query.data.startsWith("tag_to_send_")) {
            const tagName = query.data.slice("tag_to_send_".length);
            const userId = query.from.id;

            // Если пользователь нажал на уже выбранный тег — снимаем выбор
            if (userChosenTags[userId] === tagName) {
                userChosenTags[userId] = null;
            } else {
                userChosenTags[userId] = tagName;
            }

            const selectedTag = userChosenTags[userId];

            const res = await getAllTags();
            const allTags = res.message;

            const newButtons = createButtons(allTags.map(tag => ({
                ...tag,
                selected: selectedTag === tag.tag_name
            }))).chooseTagForReport;

            const currentMarkup = query.message.reply_markup;

            const stringify = obj => JSON.stringify(obj);
            if (!currentMarkup || stringify(newButtons) !== stringify(currentMarkup)) {
                await bot.editMessageReplyMarkup(newButtons, {
                    chat_id: query.from.id,
                    message_id: query.message.message_id
                });
            }
        }

        if (query.data === "accept_chosen_tags") {
            const message = getShowYourChosenTagsAndChosenTextMsg(userChosenTags[query.from.id], userReports[query.from.id])
            bot.sendMessage(query.from.id, message, {
                parse_mode: "HTML",
                reply_markup: chooseTextAndTagForReport
            })
        }

        if (query.data === "accept_send_report_to_server") {
            const message = await getAcceptSendReportToServerMsg();
            const teams = await getBuyerTeams(query.from.id);
            if (!userReports[query.from.id]) {
                return bot.sendMessage(query.from.id, "Ошибка. Не найден отчёт для отправки");
            }
            const report = {
                "user_id": query.from.id,
                "message": userReports[query.from.id],
                "tags": userChosenTags[query.from.id],
                "teams": teams.message,
                "media": []
            }
            await setReport(report);
            bot.sendMessage(query.from.id, message, {
                parse_mode: "HTML"
            })
            delete userStates[query.from.id];
            delete userReports[query.from.id];
            delete userChosenTags[query.from.id];
        }
    })
}

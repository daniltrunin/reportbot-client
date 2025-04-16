module.exports = (bot) => {
    // Messages
    const { getSendReportMsg, getReportMsg, getAcceptSendReportToServerMsg } = require("../messages/buyer");

    // Buttons
    const createButtons = require("../buttons/buyerButtons");
    let { chooseTextForReport, chooseTextAndTagForReport } = createButtons();

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
        const res = await getUserRole(msg.from.id);
        if (!res.message.includes("buyer")) return;

        // нажал отправить отчёт
        if (msg.text === "Отправить отчёт" ||
            msg.text === "отправить отчёт" ||
            msg.text === "отправить отчет" ||
            msg.text === "Отправить отчет") {
            userStates[msg.from.id] = "sending_text_to_report"
            const message = await getSendReportMsg();
            bot.sendMessage(msg.from.id, message)
            return;
        }

        // отправил текст в ответ на отчёт и тебе предложило выбрать тег
        if (userStates[msg.from.id] === "sending_text_to_report") {
            userReports[msg.from.id] = msg.text;
            const message = await getReportMsg(userReports[msg.from.id]);
            bot.sendMessage(msg.from.id, message, {
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

            bot.sendMessage(query.from.id, "Отлично, я сохранил твой текст. Теперь выберите один или несколько тегов", {
                reply_markup: chooseTagForReport
            })
        }

        if (query.data.startsWith("tag_to_send_")) {
            // Получаем имя тега
            const tagName = query.data.slice("tag_to_send_".length);
            // Создаём массив выбранных тегов, если его ещё нет
            if (!userChosenTags[query.from.id]) userChosenTags[query.from.id] = [];
            // Проверяем, выбран ли этот тег уже
            const index = userChosenTags[query.from.id].indexOf(tagName);
            // Если тег ещё не выбран — добавляем
            if (index === -1) {
                userChosenTags[query.from.id].push(tagName);
                // Если тег уже выбран — убираем из массива
            } else {
                userChosenTags[query.from.id].splice(index, 1); // remove tag
            }
            // Получаем все доступные теги
            const res = await getAllTags();
            const allTags = res.message;
            // Формируем кнопки с учётом выбранных тегов
            const { chooseTagForReport } = createButtons(allTags.map(tag => ({
                ...tag,
                selected: userChosenTags[query.from.id].includes(tag.tag_name)
            })));
            // Обновляем клавиатуру в текущем сообщении
            await bot.editMessageReplyMarkup(chooseTagForReport, {
                chat_id: query.from.id,
                message_id: query.message.message_id
            });
        }

        if (query.data === "accept_chosen_tags") {
            bot.sendMessage(query.from.id, `Выбранные теги: ${userChosenTags[query.from.id]}
                
Текст отчёта: ${userReports[query.from.id]}`, {
                reply_markup: chooseTextAndTagForReport
            })
        }

        if (query.data === "accept_send_report_to_server") {
            const message = await getAcceptSendReportToServerMsg();
            const teams = await getBuyerTeams(query.from.id);
            if (!userReports[query.from.id]) {
                return bot.sendMessage(query.from.id, "Ошибка. Не найден отчёт для отправки.");
            }
            const report = {
                "user_id": query.from.id,
                "message": userReports[query.from.id],
                "tags": userChosenTags[query.from.id],
                "teams": teams.message,
                "media": []
            }
            await setReport(report);
            bot.sendMessage(query.from.id, message)
            delete userReports[query.from.id];
        }
    })
}

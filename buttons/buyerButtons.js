const createButtons = (tags = []) => {
    return {
        startBtn: {
            keyboard: [
                [{ text: "Отправить отчёт", callback_data: "send_report" }]
            ],
            resize_keyboard: true
        },
        chooseTextForReport: {
            inline_keyboard: [
                [{ text: "Да, сохранить", callback_data: "accept_text_of_report" }],
                [{ text: "Нет, отменить", callback_data: "decline_text_of_report" }]
            ]
        },
        chooseTagForReport: {
            inline_keyboard: [
                ...tags.map(tag => [
                    { text: tag.selected ? `✅ ${tag.tag_name}` : tag.tag_name, callback_data: `tag_to_send_${tag.tag_name}` }
                ]),
                [{ text: "Подтвердить выбранные теги", callback_data: "accept_chosen_tags" }]]
        },
        chooseTextAndTagForReport: {
            inline_keyboard: [
                [{ text: "Отправить отчёт", callback_data: "accept_send_report_to_server" }]
            ]
        }
    }

}

module.exports = createButtons;
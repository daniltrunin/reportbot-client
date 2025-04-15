const createButtons = (tags = []) => {
    return {
        startBtn: {
            keyboard: [
                [{ text: "Отправить отчёт", callback_data: "send_report" }]
            ],
            resize_keyboard: true
        },
        acceptReportText: {
            inline_keyboard: [
                [{ text: "Да, сохранить", callback_data: "accept_send_report_to_server" }],
                [{ text: "Нет, отменить", callback_data: "decline_send_report_to_server" }]
            ]
        },
        chooseTagForReport: {
            inline_keyboard: [
                ...tags.map(tag => [
                    { text: tag.selected ? `✅ ${tag.tag_name}` : tag.tag_name, callback_data: `tag_to_send_${tag.tag_name}` }
                ]),
                [{ text: "Подтвердить", callback_data: "acceptChosenTags" }]]
        }
    }

}

module.exports = createButtons;
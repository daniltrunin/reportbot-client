const createButtons = () => {
    return {
        startBtn: {
            keyboard: [
                [{ text: "Отправить отчёт", callback_data: "send_report" }]
            ],
            resize_keyboard: true
        }
    }
}

module.exports = createButtons;
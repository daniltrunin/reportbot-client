const createButtonsForAdmin = () => {
    return {
        startBtn: {
            inline_keyboard: [
                [{ text: "Весь отчёт за сегодня", callback_data: "get_full_report_admin" }]
            ]
        },
    }
}

module.exports = { createButtonsForAdmin }
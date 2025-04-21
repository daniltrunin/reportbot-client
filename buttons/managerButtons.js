const createButtons = (managers = []) => {
    return {
        startBtn: {
            inline_keyboard: [
                [{ text: "Весь отчёт", callback_data: "get_full_report" }],
                ...managers.map(manager => [
                    { text: `${manager.name}`, callback_data: `get_${manager}` }
                ])
            ],
        },
    }

}

module.exports = createButtons;
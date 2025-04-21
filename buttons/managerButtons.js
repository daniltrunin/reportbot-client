const createButtons = (managers = []) => {
    return {
        startBtn: {
            inline_keyboard: [
                [{ text: "Весь отчёт", callback_data: "get_full_report" }],
                ...managers.map(manager => [
                    { text: `${manager.username}`, callback_data: `get_data_of_manager_${manager.username}` }
                ])
            ],
        },
    }

}

module.exports = createButtons;
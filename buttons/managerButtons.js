const createButtonsForManagers = (managers = []) => {
    return {
        startBtn: {
            inline_keyboard: [
                [{ text: "Весь отчёт", callback_data: "get_full_report" }],
                ...managers.map(manager => [
                    { text: `${manager.teams[0]}`, callback_data: `get_data_of_manager_${manager.teams[0]}` }
                ])
            ]
        },
    }
}

const createButtonsForTags = (tags = [], teamName) => {
    return {
        teamLeadBtn: {
            inline_keyboard: [
                ...tags.map((tag) => [
                    { text: `${tag.tag_name}`, callback_data: `get_buyers_by_tag_${tag.tag_name}` }
                ]),
                [{ text: `Весь отчёт команды ${teamName}`, callback_data: `get_full_report_by_team_${teamName}` }]
            ]
        }
    }
}

module.exports = { createButtonsForManagers, createButtonsForTags };
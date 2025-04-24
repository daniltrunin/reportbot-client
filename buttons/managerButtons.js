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
                [{ text: `Весь отчёт команды ${teamName}`, callback_data: `get_full_report_by_team_${teamName}` }],
                [{ text: "Вернутся на главную", callback_data: "on_start" }]
            ]
        }
    }
}

const createButtonsOfBuyersList = (buyers = []) => {
    return {
        buyersListByTeamAndName: {
            inline_keyboard: [
                ...buyers.map((b) => [
                    { text: `${b}`, callback_data: `get_buyer_list_reports_by_team_and_tag_by_${b}` }
                ]),
                [{ text: "Вернутся на главную", callback_data: "on_start" }]
            ]
        }
    }
}

const createButtonsOfBuyerDates = (reports = [], buyer) => {
    return {
        buyerDatesOfReports: {
            inline_keyboard: [
                ...reports.map((r) => [
                    { text: `${r}`, callback_data: `get_report_from_buyer_on_day_${r}_${buyer}` }
                ]),
                [{ text: "Вернутся на главную", callback_data: "on_start" }]
            ]
        }
    }
}

const createButtonOfBuyerDm = (buyer) => {
    return {
        buyerDm: {
            inline_keyboard: [
                [{ text: "Написать байеру", url: `t.me/${buyer.user_id.username}` }]
            ]
        }
    }
}

module.exports = { createButtonsForManagers, createButtonsForTags, createButtonsOfBuyersList, createButtonsOfBuyerDates, createButtonOfBuyerDm };